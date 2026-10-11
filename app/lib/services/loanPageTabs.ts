import type { LoanProductTab } from "@/app/lib/services/types";

/** Tab labels. Amount range comes only from products.limit_start / limit_end. */
const LOAN_PAGE_TABS: LoanProductTab[] = [
  { slug: "personal-loan", title: "Personal Loan", limitStart: null, limitEnd: null },
  { slug: "home-loan", title: "Home Loan", limitStart: null, limitEnd: null },
  { slug: "car-loan", title: "Car Loan", limitStart: null, limitEnd: null },
  { slug: "business-loan", title: "Business Loan", limitStart: null, limitEnd: null },
];

function hasRange(tab: LoanProductTab): boolean {
  return tab.limitStart != null && tab.limitEnd != null && tab.limitEnd >= tab.limitStart;
}

/** Keep the four loan tabs. Database title and limit replace the defaults when present. */
export function mergeLoanPageTabs(fromApi: LoanProductTab[]): LoanProductTab[] {
  const bySlug = new Map(fromApi.map((tab) => [tab.slug, tab]));
  const base = LOAN_PAGE_TABS.map((tab) => {
    const live = bySlug.get(tab.slug);
    if (!live) return tab;
    return {
      slug: tab.slug,
      title: live.title.trim() || tab.title,
      limitStart: hasRange(live) ? live.limitStart : null,
      limitEnd: hasRange(live) ? live.limitEnd : null,
    };
  });
  const extras = fromApi.filter((tab) => !LOAN_PAGE_TABS.some((item) => item.slug === tab.slug));
  return [...base, ...extras];
}
