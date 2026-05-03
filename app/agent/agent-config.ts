import { CONTACT } from "@/app/config/constants";

/** /agent — edit advisor & portfolio copy here. */
export const AGENT_PROFILE = {
  displayName: "Ananya Sharma",
  role: "Certified financial advisor",
  /** Hero one-liner under the name */
  headline:
    "I help you understand personal loans and insurance in simple words. We compare options, check what papers you need, and plan clear next steps.",
  avatarInitials: "AS",
  /** Optional photo URL (add domain in next.config if remote) */
  photoUrl: "" as string,
  phone: CONTACT.PHONE || "+91 98765 43210",
  email: CONTACT.EMAIL || "advisor@apnizaroorat.com",
  /** Full address as you want it shown */
  address: "Andheri East, Mumbai 400059\n(Online calls for customers anywhere in India)",
  /** Three info cards above the contact form (same page, bottom section) */
  contactBoxes: [
    {
      title: "All India",
      text: "Online support on phone and video — for customers anywhere in India.",
    },
    {
      title: "Under 24 hours",
      text: "Most first replies within one working day.",
    },
    {
      title: "Full process",
      text: "Help from start to finish on your loan or insurance case.",
    },
  ] as const,
} as const;

export function buildWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return "#";
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}`;
}
