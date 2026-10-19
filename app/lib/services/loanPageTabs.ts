import type { LoanProductTab } from "@/app/lib/services/types";

/** Tab labels. Amount range comes only from products.limit_start / limit_end. */
const LOAN_PAGE_TABS: LoanProductTab[] = [
  { slug: "personal-loan", title: "Personal Loan", limitStart: null, limitEnd: null },
  { slug: "home-loan", title: "Home Loan", limitStart: null, limitEnd: null },
  { slug: "vehicle-loan", title: "Vehicle Loan", limitStart: null, limitEnd: null },
  { slug: "business-loan", title: "Business Loan", limitStart: null, limitEnd: null },
];

function hasRange(tab: LoanProductTab): boolean {
  return tab.limitStart != null && tab.limitEnd != null && tab.limitEnd >= tab.limitStart;
}

function canonicalLoanSlug(slug: string): string {
  return slug === "car-loan" ? "vehicle-loan" : slug;
}

function liveLoanTab(fromApi: LoanProductTab[], slug: string): LoanProductTab | undefined {
  const matches = fromApi.filter((tab) => canonicalLoanSlug(tab.slug) === slug);
  return matches.find((tab) => hasRange(tab)) ?? matches[0];
}

/** Keep the four loan tabs. Database limits replace the defaults when present. */
export function mergeLoanPageTabs(fromApi: LoanProductTab[]): LoanProductTab[] {
  const base = LOAN_PAGE_TABS.map((tab) => {
    const live = liveLoanTab(fromApi, tab.slug);
    if (!live) return tab;
    return {
      slug: tab.slug,
      title: tab.slug === "vehicle-loan" ? "Vehicle Loan" : live.title.trim() || tab.title,
      limitStart: hasRange(live) ? live.limitStart : null,
      limitEnd: hasRange(live) ? live.limitEnd : null,
    };
  });
  const extras = fromApi.filter((tab) => !LOAN_PAGE_TABS.some((item) => item.slug === canonicalLoanSlug(tab.slug)));
  return [...base, ...extras];
}
