import type { ProcessStepData } from "@/app/components/products/QuickEasyProcessSection";

export const PERSONAL_LOAN_PROCESS_STEPS: ProcessStepData[] = [
  {
    num: "01",
    title: "Apply Online",
    description: "Fill out a simple online form in just a few minutes.",
    gradient: "from-[#4236FB] via-[#5A4DFC] to-[#FF7E29]",
    ring: "shadow-[0_0_0_6px_rgba(66,54,251,0.15)]",
    titleColor: "text-[#4236FB]",
    lineColor: "bg-[#4236FB]",
    badgeColor: "text-[#4236FB]",
    connector: "from-[#4236FB] to-[#059669]",
    dot: "bg-[#4236FB]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <rect x="10" y="8" width="24" height="30" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 16h16M16 22h12M16 28h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m30 32 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m32 30 4 2-2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Instant Eligibility",
    description: "Check your eligibility and explore personalized offers instantly.",
    gradient: "from-[#22c55e] via-[#16a34a] to-[#047857]",
    ring: "shadow-[0_0_0_6px_rgba(4,120,87,0.18)]",
    titleColor: "text-[#047857]",
    lineColor: "bg-[#047857]",
    badgeColor: "text-[#047857]",
    connector: "from-[#059669] to-[#fb923c]",
    dot: "bg-[#047857]",
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
  {
    num: "03",
    title: "Verify & Submit",
    description: "Upload required documents and complete quick verification.",
    gradient: "from-[#fbbf24] via-[#fb923c] to-[#f97316]",
    ring: "shadow-[0_0_0_6px_rgba(249,115,22,0.15)]",
    titleColor: "text-[#ea580c]",
    lineColor: "bg-[#ea580c]",
    badgeColor: "text-[#ea580c]",
    connector: "from-[#fb923c] to-[#4236FB]",
    dot: "bg-[#ea580c]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <rect x="10" y="8" width="22" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 16h12M16 22h10M16 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="32" r="7" stroke="currentColor" strokeWidth="2.5" />
        <path d="m39 37 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Receive Funds",
    description: "Funds transferred directly to your bank account easily.",
    gradient: "from-[#4236FB] via-[#5A4DFC] to-[#FF7E29]",
    ring: "shadow-[0_0_0_6px_rgba(66,54,251,0.15)]",
    titleColor: "text-[#4236FB]",
    lineColor: "bg-[#4236FB]",
    badgeColor: "text-[#4236FB]",
    connector: "",
    dot: "bg-[#4236FB]",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden>
        <path d="M8 38V18l16-8 16 8v20H8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 38V26h8v12" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M8 22h32" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="36" cy="34" r="7" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        <text x="36" y="37" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700">
          ₹
        </text>
      </svg>
    ),
  },
];
