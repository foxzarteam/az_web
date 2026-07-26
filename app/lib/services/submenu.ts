import type { ServiceSliderCard } from "@/app/lib/services/types";
import type { SubmenuItem } from "@/app/types/layout/menu";

/** Shown in nav/footer when the services API is unreachable. */
export const FALLBACK_PRODUCT_SUBMENU: SubmenuItem[] = [
  { label: "Personal Loan", href: "/products/personal-loan/", slug: "personal-loan" },
  { label: "Insurance", href: "/products/insurance/", slug: "insurance" },
];

export function serviceCardsToSubmenu(cards: ServiceSliderCard[]): SubmenuItem[] {
  const mapped = cards.map((c) => {
    const slug =
      c.href.replace(/^\/products\//, "").replace(/\/$/, "") || undefined;
    const href = c.href.endsWith("/") || c.href.includes("#") ? c.href : `${c.href}/`;
    return { label: c.title, href, slug };
  });
  return mapped.length > 0 ? mapped : FALLBACK_PRODUCT_SUBMENU;
}
