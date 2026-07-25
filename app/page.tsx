import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CONTACT, PUBLIC_SITE_URL } from "./config/constants";
import Hero from "./components/home/hero";
import LoanPurposes from "./components/home/loan-purposes";
import EligibilityCalculator from "./components/home/eligibility-calculator";
import Listing from "./components/home/property-list";
import PartnersMarquee from "./components/home/partners-marquee";
import FaqSection from "./components/home/faq";
import { FAQ_ITEMS } from "./components/home/faq/faq-data";

const Calculator = dynamic(() => import("./components/home/calculator"));

export const metadata: Metadata = {
  title: "Personal Loan & Insurance Online",
  description:
    "Apply online for personal loans from ₹25,000 to ₹10 lakh and explore insurance options. Use our EMI calculator and indicative eligibility check before applying.",
  alternates: {
    canonical: "/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${PUBLIC_SITE_URL}/#organization`,
      name: "Apni Zaroorat",
      url: PUBLIC_SITE_URL,
      email: CONTACT.EMAIL,
      telephone: CONTACT.PHONE,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.ADDRESS,
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${PUBLIC_SITE_URL}/#website`,
      url: PUBLIC_SITE_URL,
      name: "Apni Zaroorat",
      publisher: { "@id": `${PUBLIC_SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
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
