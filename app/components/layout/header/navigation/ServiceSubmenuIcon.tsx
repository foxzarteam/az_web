import type { SubmenuItem } from "@/app/types/layout/menu";

const iconClass = "h-5 w-5 text-white";

function IconPersonalLoan() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 15h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="16" cy="15" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconInsurance() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBusinessLoan() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path d="M4 20V10l8-5 8 5v10H4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

function IconHomeLoan() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path d="M4 11 12 4l8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconDefault() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ServiceSubmenuIcon({ item }: { item: SubmenuItem }) {
  const slug = (item.slug ?? "").toLowerCase();
  const label = item.label.toLowerCase();

  if (slug.includes("personal") || label.includes("personal")) return <IconPersonalLoan />;
  if (slug.includes("insurance") || label.includes("insurance")) return <IconInsurance />;
  if (slug.includes("business") || label.includes("business")) return <IconBusinessLoan />;
  if (slug.includes("home") || (label.includes("home") && label.includes("loan"))) return <IconHomeLoan />;
  if (slug.includes("credit") || label.includes("credit")) return <IconCreditCard />;
  return <IconDefault />;
}
