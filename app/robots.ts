import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/general/site-url";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/", "/admin/"],
  },
  sitemap: `${getSiteUrl()}/sitemap.xml`,
});

export default robots;
