import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

/**
 * Open marketing crawl. Private app surfaces blocked.
 * Host + sitemap use canonical PUBLIC_SITE_URL (apex in production).
 */
export default function robots(): MetadataRoute.Robots {
  const base = PUBLIC_SITE_URL.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin",
          "/api/",
          "/customer/",
          "/customer",
        ],
      },
      {
        // Google still receives full public page access
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/customer/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
