import type { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  pageSeoGlue,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DEFAULT_DESCRIPTION,
} from "@/app/lib/seo";
import Hero from "./components/home/hero";
import HomeDisclaimerBanner from "./components/home/HomeDisclaimerBanner";
import LoanPurposes from "./components/home/loan-purposes";
import EligibilityCalculator from "./components/home/eligibility-calculator";
import Listing from "./components/home/property-list";
import PartnersMarquee from "./components/home/partners-marquee";
import FaqSection from "./components/home/faq";
import { FAQ_ITEMS } from "./components/home/faq/faq-data";

const Calculator = dynamic(() => import("./components/home/calculator"));

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DEFAULT_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
    keywords: [
      "personal loan online",
      "personal loan India",
      "EMI calculator",
      "loan eligibility check",
      "insurance online",
      "Apni Zaroorat",
      "instant personal loan",
      "Jaipur personal loan",
    ],
  }),
};

const structuredData = pageSeoGlue({
  name: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DEFAULT_DESCRIPTION,
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
      <Calculator />
      <LoanPurposes />
      <EligibilityCalculator />
      <Listing />
      <PartnersMarquee />
      <FaqSection />
      <HomeDisclaimerBanner />
    </main>
  );
}
