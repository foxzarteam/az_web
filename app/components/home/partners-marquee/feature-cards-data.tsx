import type { ReactNode } from "react";

export type FeatureCard = {
  title: string;
  description: string;
  icon: ReactNode;
  accent?: "primary" | "orange";
};

const iconClass = "h-7 w-7 sm:h-8 sm:w-8";

function IconPercent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#4236FB" strokeWidth="1.5" />
      <path
        d="M8.5 8.5h.01M15.5 15.5h.01M9 15l6-6"
        stroke="#4236FB"
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
        fill="#4236FB"
        opacity="0.15"
      />
      <path
        d="M12 3c3 2.5 5 6 5 10.5 0 .8-.1 1.6-.3 2.3L12 22l-4.7-6.2C7.1 15.1 7 14.3 7 13.5 7 9 9 5.5 12 3Z"
        stroke="#4236FB"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="#4236FB" />
    </svg>
  );
}

function IconDocsCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-6-5Z"
        fill="#4236FB"
        opacity="0.12"
      />
      <path
        d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-6-5Z"
        stroke="#4236FB"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v5h5M9 13l2 2 4-4" stroke="#4236FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShieldLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        fill="#4236FB"
        opacity="0.12"
      />
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        stroke="#4236FB"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="10" y="11" width="4" height="5" rx="1" stroke="#4236FB" strokeWidth="1.5" />
      <path d="M11 11v-1a1 1 0 0 1 2 0v1" stroke="#4236FB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconShieldHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        fill="#FF7E29"
        opacity="0.15"
      />
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        stroke="#FF7E29"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.5c-1.5-1.2-3-2.4-3-3.8a1.8 1.8 0 0 1 3-1.2 1.8 1.8 0 0 1 3 1.2c0 1.4-1.5 2.6-3 3.8Z"
        fill="#FF7E29"
      />
    </svg>
  );
}

function IconOnline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="#4236FB" opacity="0.12" />
      <circle cx="12" cy="12" r="9" stroke="#4236FB" strokeWidth="1.5" />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.2 2.4-3.4 5.4-3.4 9s1.2 6.6 3.4 9c2.2-2.4 3.4-5.4 3.4-9S14.2 5.4 12 3Z"
        stroke="#4236FB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Lowest Interest",
    description: "Interest rates start from 10.49%* p.a. onwards.",
    icon: <IconPercent />,
  },
  {
    title: "Quick Approval",
    description: "Get approval in minutes and get funds in 24 hours*.",
    icon: <IconRocket />,
  },
  {
    title: "Minimal Documents",
    description: "Paperless process with minimal documentation.",
    icon: <IconDocsCheck />,
  },
  {
    title: "Safe & Secure",
    description: "Your personal information stays safe and private with us.",
    icon: <IconShieldLock />,
  },
  {
    title: "No Hidden Charges",
    description: "Transparent process with no hidden charges.",
    icon: <IconShieldHeart />,
    accent: "orange",
  },
  {
    title: "100% Online",
    description: "Apply anytime, anywhere with zero paperwork.",
    icon: <IconOnline />,
  },
];
