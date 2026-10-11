import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import HowItWorks from "@/app/components/products/insurance/HowItWorks";
import InsuranceCategories from "@/app/components/products/insurance/InsuranceCategories";
import { InsuranceSelectionProvider } from "@/app/components/products/insurance/insuranceSelection";
import FaqSection from "@/app/components/home/faq";
import { INSURANCE_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

const PAGE_TITLE = "Secure Insurance Plans & Coverage Options | Apni Zaroorat";
const PAGE_DESC =
  "Find life, health and motor insurance options with Apni Zaroorat. Review available coverage options and get started with a guided online application.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products/insurance",
  absoluteTitle: true,
  image: "/images/service/insurance.webp",
  imageAlt: "Insurance plans with Apni Zaroorat",
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products/insurance",
  image: "/images/service/insurance.webp",
  includeServiceCatalog: true,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Insurance", path: "/products/insurance" },
  ],
  extra: [
    financialServiceJsonLd({
      name: "Insurance",
      description:
        "Compare and apply for life, health and other insurance covers with Apni Zaroorat.",
      path: "/products/insurance",
      serviceType: "Insurance",
    }),
    faqPageJsonLd(INSURANCE_FAQ_ITEMS, "/products/insurance"),
  ],
});

export default function InsurancePage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <h1 className="sr-only">Insurance</h1>
      <InsuranceSelectionProvider>
        <ServicePage
          title="Insurance"
          subtitle="Get the right insurance cover with competitive premiums from partner insurers."
          imageSrc="/images/service/insurance.webp"
          badge="Protect what matters most"
          hideHeader
          navBorder
        />
        <InsuranceCategories />
      </InsuranceSelectionProvider>
      <HowItWorks />
      <FaqSection items={INSURANCE_FAQ_ITEMS} />
    </>
  );
}
