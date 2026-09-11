import CtaBanner from "@/app/about/components/cta-banner";
import FaqSection from "@/app/components/home/faq";
import { TAX_FAQ_ITEMS } from "@/app/components/home/faq/faq-data";
import TaxCitySlider from "./TaxCitySlider";
import TaxSavingCalculator from "./TaxSavingCalculator";
import TaxSeoContent from "./TaxSeoContent";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle: string;
};

export default function TaxSavingCalculatorView({
  eyebrow = "Free · FY 2025-26 · New vs Old",
  title,
  subtitle,
}: Props) {
  return (
    <>
      <section className="relative overflow-hidden theme-gradient-bg px-4 pb-10 pt-24 text-white sm:px-6 sm:pb-12 sm:pt-28 md:pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,126,41,0.35), transparent 35%)",
          }}
          aria-hidden
        />
        <div className="container relative z-[1] mx-auto md:max-w-screen-md lg:max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold backdrop-blur-sm sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {eyebrow}
            </span>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white xs:text-4xl sm:text-5xl md:text-[3.25rem] md:leading-[1.1]">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">{subtitle}</p>
          </div>
        </div>
      </section>

      <TaxSavingCalculator />

      <TaxSeoContent />

      <FaqSection items={TAX_FAQ_ITEMS} />

      <TaxCitySlider />

      <CtaBanner
        title="Need a Personal Loan After Tax Planning?"
        description="Plan your taxes, then explore personal loan and insurance options with a simple digital application."
        primaryHref="/products/personal-loan/"
        primaryLabel="Apply for Personal Loan"
        secondaryHref="/emi-calculator/"
        secondaryLabel="EMI Calculator"
      />
    </>
  );
}
