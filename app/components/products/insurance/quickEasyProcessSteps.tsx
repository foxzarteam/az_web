import type { ProcessStepData } from "@/app/components/products/QuickEasyProcessSection";

export const INSURANCE_PROCESS_STEPS: ProcessStepData[] = [
  {
    num: "01",
    title: "Choose Plan",
    description: "Select the insurance plan that suits your needs.",
    gradient: "from-[#4facfe] via-[#3b9cf5] to-[#2f73f2]",
    ring: "shadow-[0_0_0_6px_rgba(47,115,242,0.15)]",
    titleColor: "text-[#2f73f2]",
    lineColor: "bg-[#2f73f2]",
    badgeColor: "text-[#2f73f2]",
    connector: "from-[#2f73f2] to-[#059669]",
    dot: "bg-[#2f73f2]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <rect x="12" y="8" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 16h12M18 22h12M18 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m30 30 4 4M32 32l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Enter Details",
    description: "Enter basic details to find the right cover and premium.",
    gradient: "from-[#22c55e] via-[#16a34a] to-[#047857]",
    ring: "shadow-[0_0_0_6px_rgba(4,120,87,0.18)]",
    titleColor: "text-[#047857]",
    lineColor: "bg-[#047857]",
    badgeColor: "text-[#047857]",
    connector: "from-[#059669] to-[#fb923c]",
    dot: "bg-[#047857]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M12 40c0-6.6 5.4-12 12-12s12 5.4 12 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Verify Documents",
    description: "Upload documents and complete verification.",
    gradient: "from-[#fbbf24] via-[#fb923c] to-[#f97316]",
    ring: "shadow-[0_0_0_6px_rgba(249,115,22,0.15)]",
    titleColor: "text-[#ea580c]",
    lineColor: "bg-[#ea580c]",
    badgeColor: "text-[#ea580c]",
    connector: "from-[#fb923c] to-[#2f73f2]",
    dot: "bg-[#ea580c]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <rect x="12" y="10" width="20" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 18h10M18 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M28 30l8-8M30 22h6v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "You're Covered",
    description: "Your policy is active and you're fully covered.",
    gradient: "from-[#5a9bff] via-[#2f73f2] to-[#2563d4]",
    ring: "shadow-[0_0_0_6px_rgba(47,115,242,0.15)]",
    titleColor: "text-[#2f73f2]",
    lineColor: "bg-[#2f73f2]",
    badgeColor: "text-[#2f73f2]",
    connector: "",
    dot: "bg-[#2f73f2]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <path
          d="M24 6 10 12v10c0 9 6.5 17.4 14 19 7.5-1.6 14-10 14-19V12L24 6Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="m17 24 5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];
