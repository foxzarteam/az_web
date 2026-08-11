import type { Metadata } from "next";
import CtaBanner from "@/app/about/components/cta-banner";
import EligibilityCalculator from "@/app/components/home/eligibility-calculator";
import FaqSection from "@/app/components/home/faq";
import { ELIGIBILITY_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  ELIGIBILITY_KEYWORDS,
  faqPageJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

const PATH = "/check-eligibility";
const PAGE_TITLE =
  "Check Personal Loan Eligibility Online | Free Calculator | Apni Zaroorat";
const PAGE_DESC =
  "Check your personal loan eligibility in under a minute. Enter income, employment type, and existing EMI for a free indicative score — no impact on your credit score.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PATH,
  absoluteTitle: true,
  keywords: [...ELIGIBILITY_KEYWORDS],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: PATH,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Check Eligibility", path: PATH },
  ],
  extra: [faqPageJsonLd(ELIGIBILITY_FAQ_ITEMS, PATH)],
});

export default function CheckEligibilityPage() {
  return (
    <>
      <JsonLd data={structuredData} />

      <section className="theme-gradient-bg px-4 pb-6 pt-24 text-white sm:px-6 sm:pb-8 sm:pt-28 md:pt-32">
        <div className="container mx-auto md:max-w-screen-md lg:max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold sm:mb-4 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free · No credit score impact
            </span>
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              Check Eligibility
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
              Know your loan chance in under a minute.
            </p>
          </div>
        </div>
      </section>

      <EligibilityCalculator />

      <FaqSection items={ELIGIBILITY_FAQ_ITEMS} />

      <CtaBanner
        title="Your Personal Loan Is One Step Away"
        description="Share a few details and we’ll help you move forward — a quick, simple, and secure process."
        primaryHref="/products/personal-loan/"
        primaryLabel="Apply Now"
        secondaryHref="#eligibility-calculator"
        secondaryLabel="Check Eligibility"
      />
    </>
  );
}
