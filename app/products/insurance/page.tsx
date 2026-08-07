import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import HowItWorks from "@/app/components/products/insurance/HowItWorks";
import FaqSection from "@/app/components/home/faq";
import { INSURANCE_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

const PAGE_NAME = "Insurance Online — Life, Health & Motor Plans";
const PAGE_DESC =
  "Compare and apply for life, health and motor insurance online with Apni Zaroorat. Guided digital applications to protect family, health, and vehicles.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_NAME,
  description: PAGE_DESC,
  path: "/products/insurance",
  image: "/images/service/insurance.webp",
  imageAlt: "Insurance plans with Apni Zaroorat",
  keywords: [
    "insurance online",
    "life insurance",
    "health insurance",
    "motor insurance",
    "insurance plans India",
    "Apni Zaroorat insurance",
  ],
});

const structuredData = pageSeoGlue({
  name: PAGE_NAME,
  description: PAGE_DESC,
  path: "/products/insurance",
  image: "/images/service/insurance.webp",
  includeServiceCatalog: true,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products/insurance" },
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
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 text-white px-4 sm:px-6 theme-gradient-bg">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md max-w-full">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 mb-3 sm:mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Protect what matters most
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">
              Insurance
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
              Get the right insurance cover at the lowest premium.
            </p>
          </div>
        </div>
      </section>

      <ServicePage
        title="Insurance"
        subtitle="Get the right insurance cover at the lowest premium."
        imageSrc="/images/service/insurance.webp"
        badge="Protect what matters most"
        hideHeader
      />

      <HowItWorks />
      <FaqSection items={INSURANCE_FAQ_ITEMS} />
    </>
  );
}
