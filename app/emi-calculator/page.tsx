import type { Metadata } from "next";
import CtaBanner from "@/app/about/components/cta-banner";
import EmiCalculator from "@/app/components/home/calculator";
import FaqSection from "@/app/components/home/faq";
import { EMI_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  EMI_KEYWORDS,
  faqPageJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

const PATH = "/emi-calculator";
const PAGE_TITLE =
  "Personal Loan EMI Calculator Online | Free EMI Tool | Apni Zaroorat";
const PAGE_DESC =
  "Calculate your personal loan EMI online for free. Adjust loan amount, interest rate, and tenure to see monthly EMI, total interest, and repayment before you apply.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PATH,
  absoluteTitle: true,
  keywords: [...EMI_KEYWORDS],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: PATH,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "EMI Calculator", path: PATH },
  ],
  extra: [faqPageJsonLd(EMI_FAQ_ITEMS, PATH)],
});

export default function EmiCalculatorPage() {
  return (
    <>
      <JsonLd data={structuredData} />

      <section className="theme-gradient-bg px-4 pb-6 pt-24 text-white sm:px-6 sm:pb-8 sm:pt-28 md:pt-32">
        <div className="container mx-auto md:max-w-screen-md lg:max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold sm:mb-4 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free · Instant EMI estimate
            </span>
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              EMI Calculator
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
              Know your monthly EMI before you apply.
            </p>
          </div>
        </div>
      </section>

      <EmiCalculator />

      <FaqSection items={EMI_FAQ_ITEMS} />

      <CtaBanner
        title="Your Personal Loan Is One Step Away"
        description="Share a few details and we’ll help you move forward — a quick, simple, and secure process."
        primaryHref="/products/personal-loan/"
        primaryLabel="Apply Now"
        secondaryHref="#emi-calculator"
        secondaryLabel="Calculate EMI"
      />
    </>
  );
}
