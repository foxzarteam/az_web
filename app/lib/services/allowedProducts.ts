/** Public site only shows these product slugs. */
export const ALLOWED_PRODUCT_SLUGS = ["personal-loan", "insurance"] as const;

export type AllowedProductSlug = (typeof ALLOWED_PRODUCT_SLUGS)[number];

const ALLOWED_SET = new Set<string>(ALLOWED_PRODUCT_SLUGS);

export function isAllowedProductSlug(slug: string): boolean {
  return ALLOWED_SET.has(slug.trim().toLowerCase());
}

export function filterAllowedProductCards<T extends { href: string }>(cards: T[]): T[] {
  return cards.filter((card) => {
    const slug = card.href.replace(/^\/products\//, "").replace(/\/$/, "").trim().toLowerCase();
    return isAllowedProductSlug(slug);
  });
}
