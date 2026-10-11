import type { Metadata } from "next";
import AffiliateLanding from "@/app/components/affiliate/AffiliateLanding";
import JsonLd from "@/app/components/seo/JsonLd";
import { PRODUCTS_HUB_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

const PAGE_TITLE = "Loans & Insurance Products | Apni Zaroorat";
const PAGE_DESC =
  "Discover personal loans, home loans, car loans, business loans and insurance in one place. Compare available options and check eligibility online with Apni Zaroorat.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products",
  absoluteTitle: true,
  image: "/images/og-default.jpg",
  imageAlt: "Apply for personal loan or insurance online with Apni Zaroorat",
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products",
  image: "/images/og-default.jpg",
  includeServiceCatalog: true,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ],
  extra: [
    financialServiceJsonLd({
      name: "Personal Loan",
      description:
        "Quick personal loans from Rs 25,000 to Rs 50 lakh with digital application and competitive rates.",
      path: "/products/loans",
      serviceType: "Personal loan",
    }),
    financialServiceJsonLd({
      name: "Insurance",
      description:
        "Compare and apply for life, health and motor insurance covers with Apni Zaroorat.",
      path: "/products/insurance",
      serviceType: "Insurance",
    }),
    faqPageJsonLd(PRODUCTS_HUB_FAQ_ITEMS, "/products"),
  ],
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <AffiliateLanding />
    </>
  );
}
