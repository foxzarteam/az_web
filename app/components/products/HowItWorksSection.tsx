import type { ReactNode } from "react";

export type HowItWorksStep = {
  num: number;
  title: string;
  description: string;
  iconWrapClass: string;
  icon: ReactNode;
};

function ArrowConnector() {
  return (
    <span
      className="pointer-events-none absolute -right-[42px] top-1/2 hidden -translate-y-1/2 text-[#F97316] lg:block"
      aria-hidden
    >
      <svg viewBox="0 0 44 14" fill="none" className="h-3.5 w-11">
        <path
          d="M1 7h34"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 7"
          className="arrow-flow"
        />
        <path d="m35 2 7 5-7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type Props = {
  headingPrefix: string;
  headingHighlight: string;
  steps: HowItWorksStep[];
};

export default function HowItWorksSection({ headingPrefix, headingHighlight, steps }: Props) {
  return (
    <section className="bg-[#F5F7FB] dark:bg-darkmode" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mb-8 text-center sm:mb-10" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
            How It Works
          </span>
          <h2
            id="how-it-works-heading"
            className="mt-2 text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
          >
            {headingPrefix} <span className="theme-gradient-text">{headingHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-10" data-aos="fade-up">
          {steps.map((step, index) => (
            <article
              key={step.num}
              className="relative flex h-full flex-col items-center rounded-2xl border border-[#E8ECF2] bg-white p-5 text-center shadow-[0_4px_24px_rgba(16,45,71,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_40px_rgba(16,45,71,0.14)] dark:border-dark_border dark:bg-darklight sm:p-6"
            >
              <div className="theme-gradient-bg mb-4 rounded-full p-[2px]">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16 ${step.iconWrapClass}`}
                >
                  {step.icon}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5">
                <span className="btn-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-[0_4px_14px_rgba(66,54,251,0.35)] sm:h-8 sm:w-8 sm:text-sm">
                  {step.num}
                </span>
                <h3 className="!text-sm font-bold !text-midnight_text dark:!text-white sm:!text-base">
                  {step.title}
                </h3>
              </div>

              <p className="mt-2.5 max-w-[230px] text-xs leading-relaxed text-gray dark:text-gray-400 sm:text-sm">
                {step.description}
              </p>

              {index < steps.length - 1 && <ArrowConnector />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
