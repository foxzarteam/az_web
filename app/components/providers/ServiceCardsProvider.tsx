"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { InsuranceTypeOption, ServiceSliderCard } from "@/app/lib/services/types";
import {
  fetchActiveServiceCards,
  primeServicesClientCache,
} from "@/app/utils/fetchActiveServiceCards";

const ServiceCardsContext = createContext<ServiceSliderCard[] | null>(null);
const InsuranceTypesContext = createContext<InsuranceTypeOption[] | null>(null);

export function ServiceCardsProvider({
  cards,
  insuranceTypes = [],
  children,
}: {
  cards: ServiceSliderCard[];
  insuranceTypes?: InsuranceTypeOption[];
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    if (cards.length > 0 || insuranceTypes.length > 0) {
      primeServicesClientCache(cards, insuranceTypes);
      return;
    }
    // Warm the client cache as early as possible when the server had no cards.
    void fetchActiveServiceCards();
  }, [cards, insuranceTypes]);

  return (
    <ServiceCardsContext.Provider value={cards}>
      <InsuranceTypesContext.Provider value={insuranceTypes}>
        {children}
      </InsuranceTypesContext.Provider>
    </ServiceCardsContext.Provider>
  );
}

/** Services from root layout (empty if API failed at build/request). */
export function useServiceCards(): ServiceSliderCard[] {
  return useContext(ServiceCardsContext) ?? [];
}

/** Insurance subtypes from GET /api/services. Empty means use hardcoded fallback. */
export function useCatalogInsuranceTypes(): InsuranceTypeOption[] {
  return useContext(InsuranceTypesContext) ?? [];
}
