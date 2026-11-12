import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
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

const PAGE_TITLE = "Apply Credit Card Online in India | Free Lifetime Fees | Apni Zaroorat";
const PAGE_DESC =
  "Apply for a credit card online in India with Apni Zaroorat. Compare HDFC, IDFC, SBI, Axis and more partner cards — zero joining fee, zero annual fee options, quick guided application.";

const PAGE_KEYWORDS = [
  "apply credit card online",
  "credit card apply India",
  "best credit card India",
  "HDFC credit card apply",
  "IDFC credit card",
  "SBI credit card apply online",
  "lifetime free credit card",
  "zero joining fee credit card",
  "credit card without annual fees",
  "Apni Zaroorat credit card",
];

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products/credit-card",
  absoluteTitle: true,
  image: "/images/service/card.webp",
  imageAlt: "Apply for credit cards online with Apni Zaroorat — partner bank cards",
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
        "Apply for lifetime-free and low-fee credit cards online in India through Apni Zaroorat. Partner banks include HDFC, IDFC FIRST, SBI, Axis, and more.",
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
        Apply Credit Card Online in India — Lifetime Free Joining & Annual Fees Options
      </h1>
      <ServicePage
        title="Credit Card"
        subtitle="Apply for a credit card with a simple form — no loan amount required."
        imageSrc="/images/service/card.webp"
        badge="Cards from partner banks"
        hideHeader
        navBorder
        serviceSlug="credit-card"
      />
      <CreditCardOffers />
      <HowItWorks />
      <FaqSection items={CREDIT_CARD_FAQ_ITEMS} />
    </>
  );
}
