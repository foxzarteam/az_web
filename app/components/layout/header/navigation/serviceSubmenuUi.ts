import type { SubmenuItem } from "@/app/types/layout/menu";

const GRADIENT_BY_SLUG: Record<string, string> = {
  "personal-loan": "from-[#ff9a9e] to-[#fad0c4]",
  "business-loan": "from-[#a18cd1] to-[#fbc2eb]",
  "home-loan": "from-[#84fab0] to-[#8fd3f4]",
  "credit-card": "from-[#f6d365] to-[#fda085]",
  insurance: "from-[#cfd9df] to-[#e2ebf0]",
  "vehicle-loan": "from-primary/20 to-primary/40",
};

const FALLBACK_GRADIENTS = [
  "from-[#ff9a9e] to-[#fad0c4]",
  "from-[#a18cd1] to-[#fbc2eb]",
  "from-[#84fab0] to-[#8fd3f4]",
  "from-[#f6d365] to-[#fda085]",
  "from-[#cfd9df] to-[#e2ebf0]",
  "from-primary/15 to-primary/35",
] as const;

export function serviceSubmenuGradient(item: SubmenuItem, index: number): string {
  const s = item.slug;
  if (s && GRADIENT_BY_SLUG[s]) return GRADIENT_BY_SLUG[s];
  return FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
}

/** Small label for gradient tile — works for DB-driven titles too */
export function serviceSubmenuIcon(item: SubmenuItem): string {
  const slug = (item.slug ?? "").toLowerCase();
  const label = item.label.toLowerCase();
  if (slug.includes("personal") || label.includes("personal")) return "₹";
  if (slug.includes("business") || label.includes("business")) return "🏢";
  if (slug.includes("home") || (label.includes("home") && label.includes("loan"))) return "🏠";
  if (slug.includes("credit") || label.includes("credit")) return "💳";
  if (slug.includes("insurance") || label.includes("insurance")) return "🛡️";
  if (slug.includes("vehicle") || label.includes("vehicle")) return "🚗";
  return "📋";
}
