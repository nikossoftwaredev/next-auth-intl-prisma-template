/**
 * Resolves the site's public origin used to build absolute URLs
 * (sitemap.xml, robots.txt, canonical links, OG tags).
 *
 * Resolution order, every source optional so the build never fails:
 *   1. NEXT_PUBLIC_BASE_URL   set this to the real origin once the domain is live.
 *   2. VERCEL_PROJECT_PRODUCTION_URL   the stable production domain Vercel injects,
 *      so production emits a real origin instead of localhost before the domain
 *      is configured. This is the project's canonical production URL, not the
 *      per-deployment *.vercel.app preview URL.
 *   3. http://localhost:3000   local development fallback.
 *
 * When the domain is ready, set NEXT_PUBLIC_BASE_URL to the exact public origin
 * (e.g. https://example.com) in the Vercel project env vars and in .env.local.
 * Do not paste a per-deployment *.vercel.app URL, since a wrong canonical origin
 * leaks into sitemap.xml, robots.txt, canonical links and OG tags.
 */
export const getSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${stripTrailingSlash(vercelProduction)}`;

  return "http://localhost:3000";
};

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, "");
