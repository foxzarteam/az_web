import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  buildPageMetadata,
  breadcrumbJsonLd,
  faqPageJsonLd,
  graphJsonLd,
  jsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from "@/app/lib/seo";
import Hero from "./components/home/hero";
import LoanPurposes from "./components/home/loan-purposes";
import EligibilityCalculator from "./components/home/eligibility-calculator";
import Listing from "./components/home/property-list";
import PartnersMarquee from "./components/home/partners-marquee";
import FaqSection from "./components/home/faq";
import { FAQ_ITEMS } from "./components/home/faq/faq-data";

const Calculator = dynamic(() => import("./components/home/calculator"));

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Personal Loan & Insurance Online",
    description:
      "Apply online for personal loans from ₹25,000 to ₹10 lakh and explore insurance options. Use our EMI calculator and indicative eligibility check before applying.",
    path: "/",
    keywords: [
      "personal loan online",
      "personal loan India",
      "EMI calculator",
      "loan eligibility check",
      "insurance online",
      "Apni Zaroorat",
    ],
  }),
};

const structuredData = graphJsonLd(
  organizationJsonLd(),
  websiteJsonLd(),
  faqPageJsonLd(FAQ_ITEMS),
  breadcrumbJsonLd([{ name: "Home", path: "/" }]),
);

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }}
      />
      <Hero />
      <Calculator />
      <LoanPurposes />
      <EligibilityCalculator />
      <Listing />
      <PartnersMarquee />
      <FaqSection />
    </main>
  );
}
