import HowItWorksSection, { type HowItWorksStep } from "@/app/components/products/HowItWorksSection";

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";

const STEPS: HowItWorksStep[] = [
  {
    num: 1,
    title: "Fill Basic Details",
    description: "Provide your basic information in simple steps.",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8.5h6M9 12h4.5M9 15.5h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Choose Insurance Type",
    description: "Select life, health or motor insurance as per your need.",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z" fill="currentColor" opacity="0.12" />
        <path d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path
          d="M12 13.8c-1.6-1.3-3.2-2.5-3.2-4a1.9 1.9 0 0 1 3.2-1.3 1.9 1.9 0 0 1 3.2 1.3c0 1.5-1.6 2.7-3.2 4Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Verify & Submit",
    description: "Verify your details and submit your application.",
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m9 12.5 2.2 2.2 4.3-4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Get Your Policy",
    description: "Our partners will help you get the best policy issued.",
    iconWrapClass: "bg-[#F3EEFF] text-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path d="M12 4c4 3 8 3.5 8 8 0 .5 0 1-.1 1.5H4.1C4 12.9 4 12.5 4 12c0-4.5 4-5 8-8Z" fill="currentColor" opacity="0.12" />
        <path
          d="M3.5 13.5C3.5 8 8 5.5 12 3.5c4 2 8.5 4.5 8.5 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M3.5 13.5h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 13.5V18a2.5 2.5 0 0 1-5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <HowItWorksSection
      headingPrefix="Get Insured in"
      headingHighlight="4 Simple Steps"
      steps={STEPS}
    />
  );
}
