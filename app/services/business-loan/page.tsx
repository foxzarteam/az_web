import type { Metadata } from "next";
import ServicePage from "@/app/components/services/ServicePage";
import { COLORS } from "@/app/config/constants";

export const metadata: Metadata = {
  title: "Business Loan | Apni Zaroorat",
  description: "Grow your business with Apni Zaroorat business loans. Compare offers and get the right funding for your company.",
};

export default function BusinessLoanPage() {
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
              Power your business growth
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
              Business Loan
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              Manage working capital, expansion and equipment purchase with flexible business loans from leading banks and NBFCs.
            </p>
          </div>
        </div>
      </section>

      <ServicePage
        title="Business Loan"
        subtitle="Manage working capital, expansion and equipment purchase with flexible business loans from leading banks and NBFCs."
        imageSrc="/images/service/business.png"
        badge="Fuel your business growth"
        hideHeader
      />
    </>
  );
}

