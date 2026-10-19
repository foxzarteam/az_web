import type { ServiceSliderCard } from "@/app/lib/services/types";
import { isIndividualLoanSlug } from "@/app/lib/services/allowedProducts";
import type { SubmenuItem } from "@/app/types/layout/menu";

/** Same loan page, separate URLs so each loan can be indexed. */
const LOAN_ALIAS_MENU: SubmenuItem[] = [
  { label: "Personal Loan", href: "/products/personal-loan/", slug: "personal-loan" },
  { label: "Home Loan", href: "/products/home-loan/", slug: "home-loan" },
  { label: "Vehicle Loan", href: "/products/vehicle-loan/", slug: "vehicle-loan" },
  { label: "Business Loan", href: "/products/business-loan/", slug: "business-loan" },
];

/** Shown in nav/footer when the services API is unreachable. */
const LOAN_MENU_ITEM: SubmenuItem = { label: "Loan", href: "/products/loans/", slug: "loans" };
const INSURANCE_MENU_ITEM: SubmenuItem = { label: "Insurance", href: "/products/insurance/", slug: "insurance" };

export const FALLBACK_PRODUCT_SUBMENU: SubmenuItem[] = [
  ...LOAN_ALIAS_MENU,
  INSURANCE_MENU_ITEM,
];

export function serviceCardsToSubmenu(cards: ServiceSliderCard[], includeLoanHub = false): SubmenuItem[] {
  const mapped = cards.flatMap((c) => {
    const slug =
      c.href.replace(/^\/products\//, "").replace(/\/$/, "") || undefined;
    if (slug && (isIndividualLoanSlug(slug) || slug === "loans" || slug === "insurance")) return [];
    const href = c.href.endsWith("/") || c.href.includes("#") ? c.href : `${c.href}/`;
    return [{ label: c.title, href, slug }];
  });
  const insuranceFromApi = cards.find((c) => c.href.replace(/\/+$/, "").endsWith("/insurance"));
  const insurance = insuranceFromApi
    ? {
        label: insuranceFromApi.title || INSURANCE_MENU_ITEM.label,
        href: "/products/insurance/",
        slug: "insurance",
      }
    : INSURANCE_MENU_ITEM;
  const loans = includeLoanHub ? [...LOAN_ALIAS_MENU, LOAN_MENU_ITEM] : LOAN_ALIAS_MENU;
  return [...loans, insurance, ...mapped];
}
