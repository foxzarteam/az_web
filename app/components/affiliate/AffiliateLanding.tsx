import Link from "next/link";
import FaqSection from "@/app/components/home/faq";
import { PRODUCTS_HUB_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import ProductsApplyProvider from "@/app/components/affiliate/ProductsApplyProvider";
import LoanCategories from "@/app/components/products/loans/LoanCategories";
import BankPartners from "@/app/components/home/bank-partners";
import ProductsHubReadyCta from "@/app/components/affiliate/ProductsHubReadyCta";
const toolIconClass = "h-8 w-8 sm:h-9 sm:w-9";

const TOOLS = [
  {
    name: "Check eligibility",
    href: "/check-eligibility/",
    blurb: "Free indicative score for a personal loan. No impact on your credit score.",
    cta: "Check now",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    blobClass: "bg-[#4236FB]/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={toolIconClass} aria-hidden="true">
        <path d="M12 3 5 6.2v5.3c0 4.1 2.8 7.8 7 8.7 4.2-.9 7-4.6 7-8.7V6.2L12 3Z" fill="currentColor" />
        <path d="m8.8 12.1 2.1 2.1 4.4-4.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "EMI calculator",
    href: "/emi-calculator/",
    blurb: "See monthly EMI, interest, and total repayment before you apply.",
    cta: "Calculate EMI",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    blobClass: "bg-[#FF7E29]/25",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={toolIconClass} aria-hidden="true">
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" fill="currentColor" />
        <rect x="7.25" y="5.75" width="9.5" height="3.25" rx="0.8" fill="white" />
        <circle cx="8.6" cy="12.4" r="0.95" fill="white" />
        <circle cx="12" cy="12.4" r="0.95" fill="white" />
        <circle cx="15.4" cy="12.4" r="0.95" fill="white" />
        <circle cx="8.6" cy="16.15" r="0.95" fill="white" />
        <circle cx="12" cy="16.15" r="0.95" fill="white" />
        <circle cx="15.4" cy="16.15" r="0.95" fill="white" />
      </svg>
    ),
  },
] as const;

export default function AffiliateLanding() {
  return (
    <ProductsApplyProvider>
    <div className="bg-white dark:bg-semidark">
      <h1 className="sr-only">Products</h1>
      <div className="bg-white pt-16 dark:bg-darkmode md:pt-20">
        <div className="theme-gradient-bg h-1" aria-hidden />
        <LoanCategories
          className="!pb-8 !pt-8 sm:!pt-10 lg:!pb-10"
          showInsurance
          showApply
          softBg
        />
      </div>

      <BankPartners />

      <section className="!bg-[#F5F7FB] !py-12 dark:!bg-darkmode sm:!py-16">
        <div className="container mx-auto max-w-full px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="!text-xl font-bold !text-midnight_text dark:!text-white xs:!text-2xl sm:!text-3xl">
              Helpful <span className="theme-gradient-text">tools</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl px-1 text-sm text-gray sm:text-base">
              Plan your EMI or check eligibility before you apply — both are free.
            </p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {TOOLS.map((tool) => (
              <article
                key={tool.name}
                className="relative flex min-h-[220px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white p-5 shadow-[0_8px_28px_rgba(16,45,71,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(66,54,251,0.12)] dark:border-dark_border dark:bg-darklight sm:min-h-[240px] sm:p-6"
              >
                <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${tool.blobClass}`} />
                <div className={`pointer-events-none absolute -bottom-10 left-8 h-20 w-20 rounded-full blur-2xl ${tool.blobClass}`} />
                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <div className="theme-gradient-bg shrink-0 rounded-2xl p-[2px]">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-[14px] sm:h-16 sm:w-16 ${tool.iconWrapClass}`}
                      >
                        {tool.icon}
                      </div>
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-base font-bold leading-tight text-midnight_text dark:text-white sm:text-lg lg:text-xl">
                        {tool.name}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {tool.blurb}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-5">
                    <Link
                      href={tool.href}
                      className="btn-gradient btn-shine inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white sm:w-auto sm:px-5"
                    >
                      {tool.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        className="!pt-6 sm:!pt-8 md:!pt-10 lg:!pt-12"
        items={PRODUCTS_HUB_FAQ_ITEMS}
      />

      <ProductsHubReadyCta />
    </div>
    </ProductsApplyProvider>
  );
}
