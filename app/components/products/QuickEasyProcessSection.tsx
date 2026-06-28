import type { ReactNode } from "react";

export type ProcessStepData = {
  num: string;
  title: string;
  description: string;
  gradient: string;
  ring: string;
  titleColor: string;
  lineColor: string;
  badgeColor: string;
  connector: string;
  dot: string;
  icon: ReactNode;
};

function ProcessStep({ step, showConnector }: { step: ProcessStepData; showConnector: boolean }) {
  return (
    <div className="relative flex flex-1 flex-col items-center text-center">
      {showConnector && (
        <div
          className={`pointer-events-none absolute left-[calc(50%+3.5rem)] top-[3.25rem] hidden h-[3px] w-[calc(100%-7rem)] bg-gradient-to-r sm:top-[3.5rem] lg:block ${step.connector}`}
          aria-hidden
        >
          <span className={`absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${step.dot}`} />
        </div>
      )}

      <div className="relative mb-5 sm:mb-6">
        <div
          className={`relative flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-gradient-to-br text-white sm:h-24 sm:w-24 ${step.gradient} ${step.ring}`}
        >
          {step.icon}
        </div>
        <span
          className={`absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold shadow-md sm:h-10 sm:w-10 sm:text-sm ${step.badgeColor}`}
        >
          {step.num}
        </span>
      </div>

      <h3 className={`text-base font-bold sm:text-lg ${step.titleColor}`}>{step.title}</h3>
      <div className={`mx-auto mt-2 mb-3 h-1 w-10 rounded-full sm:w-12 ${step.lineColor}`} aria-hidden />
      <p className="max-w-[220px] text-sm leading-relaxed text-gray dark:text-gray-400">{step.description}</p>
    </div>
  );
}

type Props = {
  subtitle: string;
  steps: ProcessStepData[];
};

export default function QuickEasyProcessSection({ subtitle, steps }: Props) {
  return (
    <section className="bg-[#f4f6f8] py-14 sm:py-16 md:py-20 dark:bg-darkmode">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 md:mb-14" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-midnight_text dark:text-white sm:text-3xl md:text-4xl">
            Quick &amp; Easy Process
          </h2>
          <p className="mt-3 text-sm text-gray dark:text-gray-400 sm:text-base">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:flex lg:gap-0" data-aos="fade-up">
          {steps.map((step, index) => (
            <ProcessStep key={step.num} step={step} showConnector={index < steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
