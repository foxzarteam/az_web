import type { ReactNode } from "react";

export type FeatureCard = {
  title: string;
  description: string;
  icon: ReactNode;
};

const iconClass = "h-7 w-7 sm:h-8 sm:w-8";

function IconPercent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.12" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.5 8.5h.01M15.5 15.5h.01M9 15l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 3c3 2.5 5 6 5 10.5 0 .8-.1 1.6-.3 2.3L12 22l-4.7-6.2C7.1 15.1 7 14.3 7 13.5 7 9 9 5.5 12 3Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 3c3 2.5 5 6 5 10.5 0 .8-.1 1.6-.3 2.3L12 22l-4.7-6.2C7.1 15.1 7 14.3 7 13.5 7 9 9 5.5 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

function IconDocsCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-6-5Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-6-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v5h5M9 13l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShieldLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="10" y="11" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11v-1a1 1 0 0 1 2 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconOnline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.12" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.2 2.4-3.4 5.4-3.4 9s1.2 6.6 3.4 9c2.2-2.4 3.4-5.4 3.4-9S14.2 5.4 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Quick Apply",
    description: "Fill a short form in a few minutes\nand send your request online.",
    icon: <IconRocket />,
  },
  {
    title: "Few Documents",
    description: "Share only a few basic details\nfor your loan or insurance request.",
    icon: <IconDocsCheck />,
  },
  {
    title: "Safe & Secure",
    description: "Your details stay private with us\nand are used only for your request.",
    icon: <IconShieldLock />,
  },
  {
    title: "No Hidden Fees",
    description: "The application form is free to fill.\nWe do not charge you to apply.",
    icon: <IconPercent />,
  },
  {
    title: "Fully Online",
    description: "Start on your phone or laptop and\nsend your request when you are ready.",
    icon: <IconOnline />,
  },
];
