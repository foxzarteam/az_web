import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${PUBLIC_SITE_URL}/sitemap.xml`,
    host: PUBLIC_SITE_URL,
  };
}
