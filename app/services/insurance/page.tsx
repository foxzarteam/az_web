import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import { COLORS } from "@/app/config/constants";

export const metadata: Metadata = {
  title: "Insurance | Apni Zaroorat",
  description: "Protect your life, health and assets with the right insurance plans. Compare and apply with Apni Zaroorat.",
};

export default function InsurancePage() {
  return (
    <>
      <section
        className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 text-white px-4 sm:px-6"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md max-w-full">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 mb-3 sm:mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Protect what matters most
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">
              Insurance
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
              Secure your family and future with carefully selected life, health and general insurance plans from trusted partners.
            </p>
          </div>
        </div>
      </section>

      <ServicePage
        title="Insurance"
        subtitle="Secure your family and future with carefully selected life, health and general insurance plans from trusted partners."
        imageSrc="/images/service/insurance.png"
        badge="Protect what matters most"
        hideHeader
      />
    </>
  );
}

