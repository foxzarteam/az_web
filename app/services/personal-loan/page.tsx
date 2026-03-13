import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import { COLORS } from "@/app/config/constants";

export const metadata: Metadata = {
  title: "Personal Loan | Apni Zaroorat",
  description: "Apply for quick personal loans with Apni Zaroorat. 100% digital, fast approval and best rates from top lenders.",
};

export default function PersonalLoanPage() {
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
              Money for every need
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
              Personal Loan
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              Handle travel, medical, education and all personal expenses with a fast, paper-light personal loan.
            </p>
          </div>
        </div>
      </section>

      <ServicePage
        title="Personal Loan"
        subtitle="Handle every personal expense – from travel to medical emergencies – with a quick and paper-light personal loan."
        imageSrc="/images/service/personal.png"
        badge="Instant personal loan assistance"
        hideHeader
      />
    </>
  );
}

