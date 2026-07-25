import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/app/config/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contact",
    "/products/personal-loan",
    "/products/insurance",
    "/become-partner",
    "/agent",
    "/terms-and-conditions",
  ];

  return routes.map((route) => ({
    url: `${PUBLIC_SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/products/") ? 0.9 : 0.7,
  }));
}
