/** Slugs that next.config permanently redirects — never show even if the DB row is active. */
export const REDIRECTED_PRODUCT_SLUGS = new Set([
  "home-loan",
  "credit-card",
  "business-loan",
]);

export const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Shown when GET /api/services is empty. Not a whitelist of live products. */
export const FALLBACK_PRODUCT_SLUGS = ["personal-loan", "insurance"] as const;

export function isPublicProductSlug(slug: string): boolean {
  const s = slug.trim().toLowerCase();
  return PRODUCT_SLUG_PATTERN.test(s) && !REDIRECTED_PRODUCT_SLUGS.has(s);
}

export function productHrefToSlug(href: string): string {
  return href.replace(/^\/products\//, "").replace(/\/+$/, "").split("/")[0] ?? "";
}

export function slugToLeadCategory(slug: string): string {
  const s = slug.trim().toLowerCase();
  if (!s) return "personal_loan";
  return s.replace(/-/g, "_");
}
