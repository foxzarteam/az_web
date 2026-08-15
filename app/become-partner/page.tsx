import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import JsonLd from "@/app/components/seo/JsonLd";
import PartnerBenefits from "./components/partner-benefits";
import ThreeSteps from "./components/three-steps";
import {
  buildPageMetadata,
  PARTNER_KEYWORDS,
  pageSeoGlue,
} from "@/app/lib/seo";

const IndiaMap = dynamic(() => import("./components/india-map"));

const PAGE_TITLE = "Become a Partner | Loan & Insurance Partner Program";
const PAGE_DESC =
  "Join the Apni Zaroorat partner program. Distribute personal loans and insurance, earn commission, and grow your business with digital tools and India-wide support.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/become-partner",
  absoluteTitle: true,
  keywords: [...PARTNER_KEYWORDS],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/become-partner",
  includeServiceCatalog: true,
});

export default function BecomePartnerPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="partner-hero-shine pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 theme-gradient-bg px-4 sm:px-6">
        <div className="relative z-[1] container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h1
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4"
            data-aos="fade-up"
          >
            Become a Partner
          </h1>
          <p
            className="text-white/90 text-center text-base sm:text-lg max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Earn money by Selling Financial Products
          </p>
        </div>
      </div>
      <section
        className="bg-white px-4 py-8 dark:bg-darkmode sm:px-6 sm:py-10"
        aria-labelledby="partner-program-overview"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <h2
            id="partner-program-overview"
            className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl"
          >
            Join the Apni Zaroorat partner program
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-base">
            The partner program is for people who want to help customers explore
            personal loans and insurance through a digital process. Partners can share
            product information, assist customers with basic application steps, and
            track eligible cases using the Apni Zaroorat platform. Earnings depend on
            successful cases, product terms, and the applicable commission structure;
            joining does not guarantee a fixed income.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-base">
            Review our{" "}
            <Link
              href="/products/personal-loan/"
              className="font-semibold text-primary hover:underline"
            >
              personal loan
            </Link>{" "}
            and{" "}
            <Link
              href="/products/insurance/"
              className="font-semibold text-primary hover:underline"
            >
              insurance
            </Link>{" "}
            services before registering. For questions about eligibility or support,{" "}
            <Link href="/contact/" className="font-semibold text-primary hover:underline">
              contact our team
            </Link>
            .
          </p>
        </div>
      </section>
      <ThreeSteps />
      <IndiaMap />
      <PartnerBenefits />
    </>
  );
}
