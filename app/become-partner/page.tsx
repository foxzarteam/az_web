import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PartnerBenefits from "./components/partner-benefits";
import ThreeSteps from "./components/three-steps";
import {
  absoluteSeoUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  graphJsonLd,
  jsonLdScript,
  organizationJsonLd,
} from "@/app/lib/seo";

const IndiaMap = dynamic(() => import("./components/india-map"));

export const metadata: Metadata = buildPageMetadata({
  title: "Become a Partner",
  description:
    "Join Apni Zaroorat as a partner and help customers find the best personal loans and insurance. Earn by sharing financial products.",
  path: "/become-partner",
  keywords: [
    "loan partner",
    "insurance partner",
    "become DSA partner",
    "Apni Zaroorat partner",
    "earn with loans",
  ],
});

const structuredData = graphJsonLd(
  organizationJsonLd(),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Become a Partner", path: "/become-partner" },
  ]),
  {
    "@type": "WebPage",
    name: "Become a Partner | Apni Zaroorat",
    description:
      "Partner with Apni Zaroorat to sell personal loans and insurance and grow your earnings.",
    url: absoluteSeoUrl("/become-partner"),
  },
);

export default function BecomePartnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }}
      />
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
      <ThreeSteps />
      <IndiaMap />
      <PartnerBenefits />
    </>
  );
}
