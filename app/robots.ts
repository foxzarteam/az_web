import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

/**
 * Open marketing crawl. Private / non-index pages blocked.
 * Host + sitemap use canonical PUBLIC_SITE_URL (apex in production).
 */
export default function robots(): MetadataRoute.Robots {
  const base = PUBLIC_SITE_URL.replace(/\/+$/, "");

  const disallow = [
    "/admin/",
    "/admin",
    "/api/",
    "/customer/",
    "/customer",
    "/agent/",
    "/agent",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
