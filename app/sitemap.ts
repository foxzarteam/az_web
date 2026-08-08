import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import {
  INDEXABLE_ROUTES,
  SEO_CONTENT_VERSION,
  seoPath,
} from "@/app/lib/seo";

/**
 * Indexable marketing URLs only.
 * lastmod uses content version (bump SEO_CONTENT_VERSION on public SEO deploys)
 * so Google re-crawls after meta/title updates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const [y, m, d] = SEO_CONTENT_VERSION.split("-").map(Number);
  const lastModified = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
  const base = PUBLIC_SITE_URL.replace(/\/+$/, "");

  return INDEXABLE_ROUTES.map((route) => ({
    url: `${base}${seoPath(route.path)}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
