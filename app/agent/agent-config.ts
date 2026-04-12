import { CONTACT } from "@/app/config/constants";

/** /agent — edit advisor details here. */
export const AGENT_PROFILE = {
  displayName: "Ananya Sharma",
  role: "Personal loan & Insurance Advisor",
  avatarInitials: "AS",
  /** Optional photo URL (add domain in next.config if remote) */
  photoUrl: "" as string,
  phone: CONTACT.PHONE || "+91 98765 43210",
  email: CONTACT.EMAIL || "advisor@apnizaroorat.com",
  /** Full address as you want it shown */
  address: "Andheri East, Mumbai — 400059\n(Pan-India consultations online)",
  /** Service names shown as capsule tags under Contact */
  services: ["Personal loan", "Insurance"],
} as const;

export function buildWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return "#";
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}`;
}
