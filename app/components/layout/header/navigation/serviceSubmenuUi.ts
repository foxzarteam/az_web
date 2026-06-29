import type { SubmenuItem } from "@/app/types/layout/menu";

const GRADIENT_BY_SLUG: Record<string, string> = {
  "personal-loan": "from-[#4236FB] to-[#6B62FC]",
  "business-loan": "from-[#4236FB] to-[#5A4DFC]",
  "home-loan": "from-[#5A4DFC] to-[#6B62FC]",
  "credit-card": "from-[#5A4DFC] to-[#FF7E29]",
  insurance: "from-[#4236FB] to-[#FF7E29]",
  "vehicle-loan": "from-[#4236FB] to-[#5A4DFC]",
};

const FALLBACK_GRADIENTS = [
  "from-[#4236FB] to-[#6B62FC]",
  "from-[#4236FB] to-[#5A4DFC]",
  "from-[#5A4DFC] to-[#FF7E29]",
  "from-[#4236FB] to-[#FF7E29]",
  "from-[#6B62FC] to-[#FF7E29]",
  "from-[#4236FB] to-[#5A4DFC]",
] as const;

export function serviceSubmenuGradient(item: SubmenuItem, index: number): string {
  const s = item.slug;
  if (s && GRADIENT_BY_SLUG[s]) return GRADIENT_BY_SLUG[s];
  return FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
}

/** @deprecated Use ServiceSubmenuIcon component instead */
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
