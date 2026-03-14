import type { Metadata } from "next";
import History from "../components/home/history";
import Features from "../components/shared/features";
import Testimonials from "../components/home/testimonial";
import CompanyInfo from "../components/home/info";

export const metadata: Metadata = {
  title: "About Us | Apni Zaroorat",
  description: "Learn about Apni Zaroorat - Your trusted partner for loans, insurance, and credit cards. We help you make informed financial decisions.",
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 bg-primary px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4">
            About Us
          </h1>
          <p className="text-white/90 text-center text-base sm:text-lg max-w-2xl mx-auto">
            Your trusted partner for loans, insurance, and credit cards.
          </p>
        </div>
      </div>
      <History />
      <Features />
      <Testimonials />
      <CompanyInfo />
    </>
  );
}
