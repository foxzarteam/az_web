import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";
import { seoPath } from "@/app/lib/seo";

type SitemapEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products/personal-loan", changeFrequency: "weekly", priority: 0.95 },
  { path: "/products/insurance", changeFrequency: "weekly", priority: 0.95 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/become-partner", changeFrequency: "monthly", priority: 0.75 },
  { path: "/agent", changeFrequency: "monthly", priority: 0.7 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${PUBLIC_SITE_URL}${seoPath(route.path)}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
