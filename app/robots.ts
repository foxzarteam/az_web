import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

/**
 * Open for Google crawl — public site fully allowed.
 * Only private app areas are blocked (not useful for rankings + shouldn't be indexed).
 * Sitemap is the ranking discovery signal Search Console needs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / thin UI only — do not waste crawl budget here
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${PUBLIC_SITE_URL.replace(/\/+$/, "")}/sitemap.xml`,
    host: PUBLIC_SITE_URL.replace(/\/+$/, ""),
  };
}
