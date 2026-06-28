import type { ReactNode } from "react";

export type FeatureCard = {
  title: string;
  description: string;
  gradient: string;
  hoverBorder: string;
  glow: string;
  iconBg: string;
  icon: ReactNode;
};

function IconOnline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.2 2.4-3.4 5.4-3.4 9s1.2 6.6 3.4 9c2.2-2.4 3.4-5.4 3.4-9S14.2 5.4 12 3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconQuick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path
        d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDocs() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path
        d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M14 2v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="m9.5 12 2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTransparent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8.5 12h7M12 8.5v7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M7 7l10 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "100% Online Process",
    description:
      "Apply for your loan online anytime, anywhere. No branch visits or lengthy procedures.",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    hoverBorder: "group-hover:from-sky-500 group-hover:via-blue-500 group-hover:to-indigo-600",
    glow: "group-hover:shadow-sky-500/30",
    iconBg: "bg-gradient-to-br from-sky-400 to-blue-600",
    icon: <IconOnline />,
  },
  {
    title: "Quick Approval",
    description:
      "Get fast approval and receive your loan amount in your bank account within 24 hours.",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    hoverBorder: "group-hover:from-amber-400 group-hover:via-orange-500 group-hover:to-rose-500",
    glow: "group-hover:shadow-orange-500/30",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-600",
    icon: <IconQuick />,
  },
  {
    title: "Minimal Documentation",
    description:
      "Only a few essential documents are required for a smooth and hassle-free application.",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    hoverBorder: "group-hover:from-emerald-400 group-hover:via-green-500 group-hover:to-teal-600",
    glow: "group-hover:shadow-emerald-500/30",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
    icon: <IconDocs />,
  },
  {
    title: "Secure & Trusted Partners",
    description:
      "We work with trusted banks and NBFCs to provide safe and reliable loan solutions.",
    gradient: "from-[#1e40af] via-[#2563eb] to-[#2f73f2]",
    hoverBorder: "group-hover:from-[#1e40af] group-hover:via-[#2563eb] group-hover:to-[#2f73f2]",
    glow: "group-hover:shadow-[#2563eb]/30",
    iconBg: "bg-gradient-to-br from-[#3b82f6] to-[#1e40af]",
    icon: <IconShield />,
  },
  {
    title: "No Hidden Charges",
    description:
      "Transparent loan process with all applicable charges disclosed before you apply.",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    hoverBorder: "group-hover:from-violet-500 group-hover:via-purple-500 group-hover:to-fuchsia-600",
    glow: "group-hover:shadow-violet-500/30",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    icon: <IconTransparent />,
  },
];
