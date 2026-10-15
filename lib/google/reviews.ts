import "server-only";

import { unstable_cache } from "next/cache";

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlaceReviewsResponse {
  reviews: GoogleReview[];
  rating?: number;
  user_ratings_total?: number;
  url?: string;
}

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const CACHE_TAG = "google-reviews";

// Google reports errors as HTTP 200 with a non-OK `status`, so throw instead of
// returning: unstable_cache never stores a thrown result and keeps serving the
// last good value while it retries.
const fetchPlaceDetailsWeekly = unstable_cache(
  async (placeId: string): Promise<PlaceReviewsResponse> => {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "reviews,rating,user_ratings_total,url");
    url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY ?? "");

    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (data.status !== "OK")
      throw new Error(`Google Places API error: ${data.status} ${data.error_message ?? ""}`);

    return {
      reviews: data.result.reviews ?? [],
      rating: data.result.rating,
      user_ratings_total: data.result.user_ratings_total,
      url: data.result.url,
    };
  },
  [CACHE_TAG],
  { revalidate: ONE_WEEK_IN_SECONDS, tags: [CACHE_TAG] }
);

/**
 * Returns Google Place reviews, hitting the Places API at most once a week.
 *
 * Must never be exposed as a Server Action or a route handler that accepts a
 * caller-supplied placeId. Doing so publishes an unauthenticated proxy to the
 * paid Places API backed by GOOGLE_MAPS_API_KEY, and a varying placeId would
 * bypass the cache on every call. The "server-only" import above makes any
 * client import fail at build time.
 */
export const getGoogleReviews = async (
  placeId: string
): Promise<PlaceReviewsResponse | null> => {
  if (!placeId) return null;

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error("GOOGLE_MAPS_API_KEY is not configured");
    return null;
  }

  try {
    return await fetchPlaceDetailsWeekly(placeId);
  } catch (error) {
    console.error("getGoogleReviews error:", error);
    return null;
  }
};
