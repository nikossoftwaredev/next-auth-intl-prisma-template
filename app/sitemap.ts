import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = getSiteUrl();
  const routes = ["", "/admin"];

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
};

export default sitemap;
