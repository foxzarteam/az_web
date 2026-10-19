import type { SubmenuItem } from "@/app/types/layout/menu";

const MENU_GIFS: Record<string, string> = {
  "personal-loan": "/images/loans/personal-loan-white.gif",
  "home-loan": "/images/loans/home-loan-white.gif",
  "car-loan": "/images/loans/car-loan-white.gif?v=12",
  "vehicle-loan": "/images/loans/car-loan-white.gif?v=12",
  "business-loan": "/images/loans/business-loan-white.gif",
  insurance: "/images/loans/insurance-white.gif",
};

export function submenuGifSrc(item: SubmenuItem): string {
  const slug = (item.slug ?? "").toLowerCase();
  if (MENU_GIFS[slug]) return MENU_GIFS[slug];
  const label = item.label.toLowerCase();
  if (label.includes("personal")) return MENU_GIFS["personal-loan"];
  if (label.includes("home")) return MENU_GIFS["home-loan"];
  if (label.includes("vehicle loan") || label.includes("car loan")) return MENU_GIFS["vehicle-loan"];
  if (label.includes("business")) return MENU_GIFS["business-loan"];
  if (label.includes("insurance")) return MENU_GIFS.insurance;
  return MENU_GIFS["personal-loan"];
}

export default function ServiceSubmenuIcon({ item }: { item: SubmenuItem }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={submenuGifSrc(item)} alt="" width={40} height={40} className="h-9 w-9 object-contain" />
  );
}
