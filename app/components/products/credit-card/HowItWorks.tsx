import HowItWorksSection, { type HowItWorksStep } from "@/app/components/products/HowItWorksSection";

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";

const STEPS: HowItWorksStep[] = [
  {
    num: 1,
    title: "Fill Basic Details",
    description: "Share your name, PAN, mobile and pincode in a short form.",
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
    description: "Confirm your details and submit your credit card application.",
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="m9 12.5 2.2 2.2 4.3-4.9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Get Your Card",
    description: "We’ll verify your details and guide you through partner bank next steps.",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="3.5" y="6.5" width="17" height="11" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="3.5" y="6.5" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 10.5h17" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <HowItWorksSection
      headingPrefix="Apply for a Credit Card in"
      headingHighlight="3 Simple Steps"
      steps={STEPS}
    />
  );
}
