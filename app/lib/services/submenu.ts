import type { ServiceSliderCard } from "@/app/lib/services/types";
import type { SubmenuItem } from "@/app/types/layout/menu";

export function serviceCardsToSubmenu(cards: ServiceSliderCard[]): SubmenuItem[] {
  return cards.map((c) => {
    const slug =
      c.href.replace(/^\/services\//, "").replace(/\/$/, "") || undefined;
    return { label: c.title, href: c.href, slug };
  });
}
