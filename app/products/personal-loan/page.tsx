import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import HowItWorks from "@/app/components/products/personal-loan/HowItWorks";
import FaqSection from "@/app/components/home/faq";
import { PERSONAL_LOAN_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import CtaBanner from "@/app/about/components/cta-banner";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
  personalLoanProductJsonLd,
} from "@/app/lib/seo";

const PAGE_NAME = "Personal Loan Online up to Rs 10 Lakh";
const PAGE_DESC =
  "Apply for a personal loan online from Rs 25,000 to Rs 10 lakh with Apni Zaroorat. Minimal documentation, digital process, EMI tools, and fast guided applications.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_NAME,
  description: PAGE_DESC,
  path: "/products/personal-loan",
  image: "/images/service/personal.webp",
  imageAlt: "Apply for a personal loan online with Apni Zaroorat",
  keywords: [
    "personal loan online",
    "instant personal loan",
    "personal loan India",
    "personal loan eligibility",
    "low interest personal loan",
    "Apni Zaroorat personal loan",
    "personal loan Jaipur",
  ],
});

const structuredData = pageSeoGlue({
  name: PAGE_NAME,
  description: PAGE_DESC,
  path: "/products/personal-loan",
  image: "/images/service/personal.webp",
  includeServiceCatalog: true,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products/personal-loan" },
    { name: "Personal Loan", path: "/products/personal-loan" },
  ],
  extra: [
    financialServiceJsonLd({
      name: "Personal Loan",
      description:
        "Quick personal loans from Rs 25,000 to Rs 10 lakh with digital application and competitive rates.",
      path: "/products/personal-loan",
      serviceType: "Personal loan",
    }),
    personalLoanProductJsonLd(),
    faqPageJsonLd(PERSONAL_LOAN_FAQ_ITEMS, "/products/personal-loan"),
  ],
});

export default function PersonalLoanPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 text-white theme-gradient-bg">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md max-w-full">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 mb-3 sm:mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Money for every need
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">
              Personal Loan
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
              Get a quick personal loan at the lowest interest rate.
            </p>
          </div>
        </div>
      </section>

      <ServicePage
        title="Personal Loan"
        subtitle="Get a quick personal loan at the lowest interest rate."
        imageSrc="/images/service/personal.webp"
        badge="Instant personal loan assistance"
        hideHeader
      />

      <HowItWorks />
      <FaqSection items={PERSONAL_LOAN_FAQ_ITEMS} />

      <CtaBanner
        title="Your Personal Loan Is One Step Away"
        description="Share a few details and we’ll help you move forward — a quick, simple, and secure process."
        primaryHref="#apply"
        primaryLabel="Apply Now"
        secondaryHref="/#eligibility-calculator"
        secondaryLabel="Check Eligibility"
      />
    </>
  );
}
