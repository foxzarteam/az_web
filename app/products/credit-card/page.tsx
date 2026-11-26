import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import CibilBoostSection from "@/app/components/products/credit-card/CibilBoostSection";
import CreditCardOffers from "@/app/components/products/credit-card/CreditCardOffers";
import HowItWorks from "@/app/components/products/credit-card/HowItWorks";
import FaqSection from "@/app/components/home/faq";
import { CREDIT_CARD_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

const PAGE_TITLE = "Apply FD Credit Card Online in India | Lifetime Free | Apni Zaroorat";
const PAGE_DESC =
  "Apply FD credit card online in India — no eligibility stress, improve CIBIL with regular use, shopping & payment offers, and earn interest on your FD. Also apply lifetime-free cards from HDFC, SBI, Axis & more with Apni Zaroorat.";

const PAGE_KEYWORDS = [
  "apply FD credit card online",
  "FD credit card India",
  "credit card against FD",
  "secured credit card India",
  "credit card for low CIBIL",
  "apply credit card online India",
  "lifetime free credit card",
  "zero joining fee credit card",
  "HDFC credit card apply online",
  "SBI credit card apply",
  "Axis credit card apply",
  "IDFC credit card apply",
  "best credit card India 2026",
  "Apni Zaroorat credit card",
];

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products/credit-card",
  absoluteTitle: true,
  image: "/images/service/card.webp",
  imageAlt: "Apply FD credit card and lifetime-free credit cards online in India — Apni Zaroorat",
  keywords: PAGE_KEYWORDS,
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products/credit-card",
  image: "/images/service/card.webp",
  includeServiceCatalog: true,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Credit Card", path: "/products/credit-card" },
  ],
  extra: [
    financialServiceJsonLd({
      name: "Credit Card Application",
      description:
        "Apply for FD credit cards and lifetime-free credit cards online in India through Apni Zaroorat. Improve CIBIL, get shopping offers, and earn interest on your FD. Partner banks include HDFC, IDFC FIRST, SBI, Axis, and more.",
      path: "/products/credit-card",
      serviceType: "Credit Card",
    }),
    faqPageJsonLd(CREDIT_CARD_FAQ_ITEMS, "/products/credit-card"),
  ],
});

export default function CreditCardPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <h1 className="sr-only">
        Apply FD Credit Card Online in India — Lifetime Free Cards, Improve CIBIL, Earn Interest on FD
      </h1>
      <ServicePage
        title="Credit Card"
        subtitle="Apply FD credit card or lifetime-free cards online. Improve CIBIL, get shopping offers, and earn interest on your FD."
        imageSrc="/images/service/card.webp"
        badge="Cards from partner banks"
        hideHeader
        navBorder
        serviceSlug="credit-card"
      />
      <CibilBoostSection />
      <CreditCardOffers />
      <HowItWorks />
      <FaqSection items={CREDIT_CARD_FAQ_ITEMS} />
    </>
  );
}
