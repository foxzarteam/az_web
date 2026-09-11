import type { Metadata } from "next";
import JsonLd from "@/app/components/seo/JsonLd";
import { TAX_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import {
  absoluteSeoUrl,
  buildPageMetadata,
  faqPageJsonLd,
  pageSeoGlue,
  TAX_KEYWORDS,
} from "@/app/lib/seo";
import TaxSavingCalculatorView from "./components/TaxSavingCalculatorView";
import { TAX_CALC_CITIES, TAX_CALC_PATH } from "./lib/cities";

const PATH = TAX_CALC_PATH;
const PAGE_TITLE = "Free Tax Saving Calculator | Online Compare New vs Old Regime";
const PAGE_DESC =
  "Free tax saving calculator for India — compare New vs Old tax regime for FY 2025-26. Estimate tax with 80C, 80D, home loan & standard deduction. Instant online result.";

const CITY_KEYWORDS = TAX_CALC_CITIES.flatMap((c) => [
  `${c.city} tax saving calculator`,
  `tax saving calculator ${c.city}`,
]);

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PATH,
  absoluteTitle: true,
  keywords: [...TAX_KEYWORDS, ...CITY_KEYWORDS],
});

const howToJsonLd = {
  "@type": "HowTo",
  "@id": `${absoluteSeoUrl(PATH)}#howto`,
  name: "How to use the free tax saving calculator",
  description:
    "Compare New vs Old tax regime online for FY 2025-26 using income, deductions and age group.",
  totalTime: "PT2M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select financial year and age",
      text: "Choose FY 2025-26 and your age group (below 60, 60–79, or 80+).",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Pick tax regime",
      text: "Select New Tax Regime, Old Tax Regime, or Compare Both.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Enter income and deductions",
      text: "Add annual salary, other income, Section 80C, 80D, home loan interest and other deductions.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "See estimated tax saving",
      text: "Review taxable income, tax under both regimes, annual and monthly estimate, and which regime looks better.",
    },
  ],
};

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: PATH,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Tax Saving Calculator", path: PATH },
  ],
  extra: [
    {
      "@type": "WebApplication",
      "@id": `${absoluteSeoUrl(PATH)}#calculator`,
      name: "Free Tax Saving Calculator India",
      alternateName: [
        "Income Tax Calculator",
        "New vs Old Tax Regime Calculator",
        "80C Tax Saving Calculator",
      ],
      description: PAGE_DESC,
      url: absoluteSeoUrl(PATH),
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      inLanguage: "en-IN",
      isAccessibleForFree: true,
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      featureList: [
        "New vs Old tax regime comparison",
        "Section 80C and 80D deductions",
        "Home loan interest Section 24(b)",
        "Standard deduction FY 2025-26",
        "Estimated annual and monthly tax",
      ],
    },
    howToJsonLd,
    faqPageJsonLd(TAX_FAQ_ITEMS, PATH),
  ],
});

export default function TaxSavingCalculatorPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <TaxSavingCalculatorView
        title="Free Tax Saving Calculator"
        subtitle="Compare New vs Old regime by using free tax saving calculator"
      />
    </>
  );
}
