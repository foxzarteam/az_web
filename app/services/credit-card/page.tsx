import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import { COLORS } from "@/app/config/constants";

export const metadata: Metadata = {
  title: "Credit Card | Apni Zaroorat",
  description: "Find the right credit card for your lifestyle. Rewards, cashback, travel benefits and more at Apni Zaroorat.",
};

export default function CreditCardPage() {
  return (
    <>
      <section
        className="pt-28 pb-12 text-white"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 max-w-full">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-xs font-semibold px-4 py-1 mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Smart cards, smarter rewards
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
              Credit Card
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              Choose from top bank credit cards with rewards, cashback and lifestyle benefits that match the way you spend.
            </p>
          </div>
        </div>
      </section>

      <ServicePage
        title="Credit Card"
        subtitle="Choose from top bank credit cards with rewards, cashback and lifestyle benefits that match the way you spend."
        imageSrc="/images/service/credit.png"
        badge="Smart cards, smarter rewards"
        hideHeader
      />
    </>
  );
}

