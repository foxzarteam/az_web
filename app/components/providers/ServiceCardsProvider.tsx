"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { ServiceSliderCard } from "@/app/lib/services/types";
import { primeServicesClientCache } from "@/app/utils/fetchActiveServiceCards";

const ServiceCardsContext = createContext<ServiceSliderCard[] | null>(null);

export function ServiceCardsProvider({
  cards,
  children,
}: {
  cards: ServiceSliderCard[];
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    if (cards.length > 0) primeServicesClientCache(cards);
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
