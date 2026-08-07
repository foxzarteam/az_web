import type { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/app/components/seo/JsonLd";
import { ABOUT_KEYWORDS, buildPageMetadata, pageSeoGlue } from "@/app/lib/seo";

import CityLoansSlider from "./components/city-loans-slider";
import AboutIntro from "./components/about-intro";
import MissionVision from "./components/mission-vision";
import CtaBanner from "./components/cta-banner";

const Features = dynamic(() => import("../components/shared/features"));

const PAGE_TITLE = "About Apni Zaroorat | Personal Loans & Insurance";
const PAGE_DESC =
  "About Apni Zaroorat — a trusted platform helping customers across India apply for personal loans and insurance with a secure, transparent digital process.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/about",
  absoluteTitle: true,
  image: "/images/hero/about.webp",
  imageAlt: "About Apni Zaroorat — simplifying your loan journey",
  keywords: [...ABOUT_KEYWORDS],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/about",
  pageType: "AboutPage",
  image: "/images/hero/about.webp",
  includeServiceCatalog: true,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 mb-3 sm:mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Your trusted financial partner
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              About Company
            </h1>
            <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
              Trusted partner for personal loans and insurance across India.
            </p>
          </div>
        </div>
      </div>
      <AboutIntro />
      <MissionVision />
      <Features />
      <CityLoansSlider />
      <CtaBanner />
    </>
  );
}
