import type { Metadata } from "next";
import PartnerBenefits from "./components/partner-benefits";
import ThreeSteps from "./components/three-steps";
import IndiaMap from "./components/india-map";

export const metadata: Metadata = {
  title: "Become a Partner | Apni Zaroorat",
  description: "Join Apni Zaroorat as a partner and help customers find the best loans, insurance, and credit cards. Partner with us today.",
};

export default function BecomePartnerPage() {
  return (
    <>
      <div className="pt-32 pb-12 bg-gradient-to-b from-primary from-10% to-primary/90 to-90%">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4" data-aos="fade-up">
            Become a Partner
          </h1>
          <p className="text-white/90 text-center text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
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
