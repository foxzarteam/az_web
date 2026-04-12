"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { ServiceSliderCard } from "@/app/lib/services/types";
import {
  fetchActiveServiceCards,
  primeServicesClientCache,
} from "@/app/utils/fetchActiveServiceCards";

const ServiceCardsContext = createContext<ServiceSliderCard[] | null>(null);

export function ServiceCardsProvider({
  cards,
  children,
}: {
  cards: ServiceSliderCard[];
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    if (cards.length > 0) {
      primeServicesClientCache(cards);
      return;
    }
    // Warm the client cache as early as possible when the server had no cards.
    void fetchActiveServiceCards();
  }, [cards]);

  return (
    <ServiceCardsContext.Provider value={cards}>
      {children}
    </ServiceCardsContext.Provider>
  );
}

/** Services from root layout (empty if API failed at build/request). */
export function useServiceCards(): ServiceSliderCard[] {
  return useContext(ServiceCardsContext) ?? [];
}
