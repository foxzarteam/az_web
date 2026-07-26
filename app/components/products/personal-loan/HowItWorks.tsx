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
    title: "Verify & Submit",
    description: "Verify your documents and submit your application.",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m9 12.5 2.2 2.2 4.3-4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Check Eligibility",
    description: "Check if you are eligible for a personal loan.",
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <circle cx="10" cy="9" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="10" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 19c.6-2.8 2.8-4.3 5.5-4.3 1 0 2 .2 2.8.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16.5" cy="15.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m19 18 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Get Your Loan",
    description: "Once approved, amount is disbursed to your account.",
    iconWrapClass: "bg-[#F3EEFF] text-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path d="M4 9.5 12 4l8 5.5V20H4V9.5Z" fill="currentColor" opacity="0.12" />
        <path d="M4 9.5 12 4l8 5.5V20H4V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.5 12h5M12 12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <HowItWorksSection
      headingPrefix="Get Your Loan in"
      headingHighlight="4 Simple Steps"
      steps={STEPS}
    />
  );
}
