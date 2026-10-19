import type { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, faqPageJsonLd, pageSeoGlue } from "@/app/lib/seo";
import Hero from "./components/home/hero";
import LoanCategories from "./components/products/loans/LoanCategories";
import HomeDisclaimerBanner from "./components/home/HomeDisclaimerBanner";
import EligibilityCalculator from "./components/home/eligibility-calculator";
import BankPartners from "./components/home/bank-partners";
import Listing from "./components/home/property-list";
import PartnersMarquee from "./components/home/partners-marquee";
import FaqSection from "./components/home/faq";
import { FAQ_ITEMS } from "./components/home/faq/faq-data";

const Calculator = dynamic(() => import("./components/home/calculator"));

const PAGE_TITLE = "Apply for Loans & Insurance Online in India | Apni Zaroorat";
const PAGE_DESC =
  "Find personal, home, vehicle and business loan options, along with insurance solutions, on Apni Zaroorat. Check eligibility and find suitable financial products for your needs.";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    path: "/",
    absoluteTitle: true,
  }),
};

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/",
  includeServiceCatalog: true,
  includeLocalBusiness: true,
  extra: [faqPageJsonLd(FAQ_ITEMS, "/")],
});

export default function Home() {
  return (
    <main>
      <JsonLd data={structuredData} />
      <Hero />
      <LoanCategories
        className="!py-4 sm:!py-5"
        showInsurance
        showApply
        softBg
        hideHeading
      />
      <Calculator />
      <EligibilityCalculator />
      <BankPartners />
      <div className="h-8 bg-[#F7F8FC] sm:h-12 dark:bg-semidark" aria-hidden />
      <Listing />
      <PartnersMarquee />
      <FaqSection />
      <HomeDisclaimerBanner />
    </main>
  );
}
