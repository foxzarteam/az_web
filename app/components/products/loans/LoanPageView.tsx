import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import HowItWorks from "@/app/components/products/loans/HowItWorks";
import LoanPurposes from "@/app/components/home/loan-purposes";
import VehicleNeedSection from "@/app/components/products/vehicle/VehicleNeedSection";
import LoanCategories from "@/app/components/products/loans/LoanCategories";
import { LoanSelectionProvider } from "@/app/components/products/loans/loanSelection";
import FaqSection from "@/app/components/home/faq";
import { PERSONAL_LOAN_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import CtaBanner from "@/app/about/components/cta-banner";
import BankPartners from "@/app/components/home/bank-partners";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";

export type LoanPageKey = "loans" | "personal-loan" | "home-loan" | "vehicle-loan" | "business-loan";

type LoanPageCopy = {
  slug: string;
  path: string;
  title: string;
  description: string;
  crumb: string;
  h1: string;
  serviceName: string;
  serviceDescription: string;
  image?: string;
};

const LOAN_PAGES: Record<LoanPageKey, LoanPageCopy> = {
  loans: {
    slug: "personal-loan",
    path: "/products/loans",
    title: "Personal, Home, Vehicle & Business Loans | Apni Zaroorat",
    description:
      "Find loan options for personal expenses, buying a home or vehicle, and growing your business. Check eligibility and review available loan options with Apni Zaroorat.",
    crumb: "Loan",
    h1: "Loan",
    serviceName: "Loan",
    serviceDescription:
      "Quick loans from Rs 25,000 to Rs 50 lakh with digital application and competitive rates.",
  },
  "personal-loan": {
    slug: "personal-loan",
    path: "/products/personal-loan",
    title: "Personal Loan Online up to ₹50 Lakh | Apni Zaroorat",
    description:
      "Apply for a personal loan online up to ₹50 lakh with Apni Zaroorat. Check eligibility, review available options and complete your application digitally.",
    crumb: "Personal Loan",
    h1: "Personal Loan",
    serviceName: "Personal Loan",
    serviceDescription:
      "Personal loans from Rs 25,000 to Rs 50 lakh with a digital application and competitive rates.",
  },
  "home-loan": {
    slug: "home-loan",
    path: "/products/home-loan",
    title: "Home Loan Options & Eligibility in India | Apni Zaroorat",
    description:
      "Planning to buy or build a home? Check home loan eligibility, review available lender options and get started with Apni Zaroorat.",
    crumb: "Home Loan",
    h1: "Home Loan",
    serviceName: "Home Loan",
    serviceDescription: "Home loans from partner banks and NBFCs with a guided digital application.",
  },
  "vehicle-loan": {
    slug: "vehicle-loan",
    path: "/products/vehicle-loan",
    title: "Apply for a Vehicle Loan Online in India | Apni Zaroorat",
    description:
      "Apply for a vehicle loan for a new or used car, taxi, tractor, commercial vehicle, or construction equipment. Check eligibility with Apni Zaroorat.",
    image: "/images/og-default.jpg",
    crumb: "Vehicle Loan",
    h1: "Vehicle Loan",
    serviceName: "Vehicle Loan",
    serviceDescription: "Vehicle loans from partner lenders with a simple online application.",
  },
  "business-loan": {
    slug: "business-loan",
    path: "/products/business-loan",
    title: "Business Loan Options & Eligibility | Apni Zaroorat",
    description:
      "Need funds for your business? Check eligibility, review available business financing options and find a suitable lender through Apni Zaroorat.",
    crumb: "Business Loan",
    h1: "Business Loan",
    serviceName: "Business Loan",
    serviceDescription: "Business loans from partner banks and NBFCs with a digital application.",
  },
};

export function loanPageMetadata(pageKey: LoanPageKey): Metadata {
  const page = LOAN_PAGES[pageKey];
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    absoluteTitle: true,
    image: page.image ?? "/images/service/personal.webp",
    imageAlt: `${page.h1} with Apni Zaroorat`,
  });
}

export default function LoanPageView({ pageKey }: { pageKey: LoanPageKey }) {
  const page = LOAN_PAGES[pageKey];
  const structuredData = pageSeoGlue({
    name: page.title,
    description: page.description,
    path: page.path,
    image: page.image ?? "/images/service/personal.webp",
    includeServiceCatalog: pageKey === "loans",
    crumbs: [
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: page.crumb, path: page.path },
    ],
    extra: [
      financialServiceJsonLd({
        name: page.serviceName,
        description: page.serviceDescription,
        path: page.path,
        serviceType: page.serviceName,
      }),
      faqPageJsonLd(PERSONAL_LOAN_FAQ_ITEMS, page.path),
    ],
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <h1 className="sr-only">{page.h1}</h1>
      <LoanSelectionProvider initialSlug={page.slug}>
        <ServicePage
          title="Loan"
          subtitle="Get a quick personal loan with competitive rates from partner lenders."
          imageSrc="/images/service/personal.webp"
          badge="Instant personal loan assistance"
          hideHeader
          loanTabs
          aboveForm={<LoanCategories embedded hideHeading whiteIcons className="!py-0" />}
        />
        <section className="hidden bg-white pt-12 pb-10 dark:bg-darkmode sm:pb-12 lg:block">
          <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
            <LoanCategories embedded hideHeading whiteIcons className="!py-0" />
          </div>
        </section>
      </LoanSelectionProvider>
      <LoanPurposes />
      {pageKey === "vehicle-loan" ? <VehicleNeedSection /> : null}
      <BankPartners />
      <HowItWorks />
      <FaqSection items={PERSONAL_LOAN_FAQ_ITEMS} />
      <CtaBanner
        title="Your Loan Is One Step Away"
        description="Share a few details and we’ll help you move forward — a quick, simple, and secure process."
        primaryHref="#apply"
        primaryLabel="Apply Now"
        secondaryHref="/check-eligibility/"
        secondaryLabel="Check Eligibility"
      />
    </>
  );
}
