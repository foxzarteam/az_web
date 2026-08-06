/** Brand blue held longer, then orange (same two hex only). */
const BRAND_ICON_GRADIENT =
  "from-[#4236FB] from-0% via-[#4236FB] via-[42%] to-[#FF7E29] to-100%";

export const SERVICE_ICON_GRADIENTS: Record<string, string> = {
  "personal-loan": BRAND_ICON_GRADIENT,
  "business-loan": BRAND_ICON_GRADIENT,
  "home-loan": BRAND_ICON_GRADIENT,
  "credit-card": BRAND_ICON_GRADIENT,
  insurance: BRAND_ICON_GRADIENT,
  "vehicle-loan": BRAND_ICON_GRADIENT,
};

export function serviceSubmenuGradient(
  item: { href?: string },
  _index = 0,
): string {
  const slug = String(item.href ?? "")
    .replace(/^\//, "")
    .split("/")[0] || "";
  return SERVICE_ICON_GRADIENTS[slug] ?? BRAND_ICON_GRADIENT;
}
