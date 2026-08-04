import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { SITELINK_PAGES, seoPath } from "@/app/lib/seo";

type SitemapEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/**
 * Important ranking pages first (home + product + about + contact).
 * Priorities guide crawlers; content + links still decide SERP placement.
 */
const ROUTES: SitemapEntry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/products/personal-loan", changeFrequency: "daily", priority: 0.98 },
  { path: "/products/insurance", changeFrequency: "daily", priority: 0.97 },
  { path: "/about", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "weekly", priority: 0.9 },
  { path: "/become-partner", changeFrequency: "weekly", priority: 0.85 },
  { path: "/agent", changeFrequency: "weekly", priority: 0.7 },
  { path: "/customer/login", changeFrequency: "monthly", priority: 0.45 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.25 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.25 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.25 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.25 },
  // Any extra sitelink path not already listed
  ...SITELINK_PAGES.map((p) => ({
    path: p.path,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  })),
];

function dedupeRoutes(routes: SitemapEntry[]): SitemapEntry[] {
  const seen = new Set<string>();
  const out: SitemapEntry[] = [];
  for (const r of routes) {
    const key = seoPath(r.path);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const base = PUBLIC_SITE_URL.replace(/\/+$/, "");

  return dedupeRoutes(ROUTES).map((route) => ({
    url: `${base}${seoPath(route.path)}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
