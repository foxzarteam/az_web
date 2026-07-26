import type { MetadataRoute } from "next";
import { SEO_INDEXING_ENABLED } from "@/app/lib/seo";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

/**
 * Keep Disallow: / until launch. When ready, set SEO_INDEXING_ENABLED = true
 * in app/lib/seo.ts — robots will allow public pages and block /admin.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SEO_INDEXING_ENABLED) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${PUBLIC_SITE_URL}/sitemap.xml`,
    host: PUBLIC_SITE_URL,
  };
}
