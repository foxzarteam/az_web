import type { Metadata } from "next";
import dynamic from "next/dynamic";

import CityLoansSlider from "./components/city-loans-slider";

const History = dynamic(() => import("../components/home/history"));
const Features = dynamic(() => import("../components/shared/features"));

export const metadata: Metadata = {
  title: "About Us | Apni Zaroorat",
  description: "Learn about Apni Zaroorat - Your trusted partner for loans and insurance. We help you make informed financial decisions.",
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 mb-3 sm:mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Your trusted financial partner
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              About Us
            </h1>
            <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
              Your trusted partner for loans and insurance.
            </p>
          </div>
        </div>
      </div>
      <History />
      <Features />
      <CityLoansSlider />
    </>
  );
}
