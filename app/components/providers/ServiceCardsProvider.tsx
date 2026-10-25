"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";
import type { InsuranceTypeOption, LoanProductTab, ServiceSliderCard } from "@/app/lib/services/types";
import {
  fetchActiveServiceCards,
  primeServicesClientCache,
} from "@/app/lib/services/fetchActiveServiceCards";

const ServiceCardsContext = createContext<ServiceSliderCard[] | null>(null);
const InsuranceTypesContext = createContext<InsuranceTypeOption[] | null>(null);
const LoanProductsContext = createContext<LoanProductTab[] | null>(null);
const VehicleCategoriesContext = createContext<InsuranceTypeOption[] | null>(null);

export function ServiceCardsProvider({
  cards,
  insuranceTypes = [],
  vehicleCategories = [],
  loanProducts = [],
  children,
}: {
  cards: ServiceSliderCard[];
  insuranceTypes?: InsuranceTypeOption[];
  vehicleCategories?: InsuranceTypeOption[];
  loanProducts?: LoanProductTab[];
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    if (cards.length > 0 || insuranceTypes.length > 0 || loanProducts.length > 0 || vehicleCategories.length > 0) {
      primeServicesClientCache(cards, insuranceTypes, loanProducts, vehicleCategories);
      return;
    }
    // Warm the client cache as early as possible when the server had no cards.
    void fetchActiveServiceCards();
  }, [cards, insuranceTypes, loanProducts, vehicleCategories]);

  return (
    <ServiceCardsContext.Provider value={cards}>
      <InsuranceTypesContext.Provider value={insuranceTypes}>
        <VehicleCategoriesContext.Provider value={vehicleCategories}>
          <LoanProductsContext.Provider value={loanProducts}>
            {children}
          </LoanProductsContext.Provider>
        </VehicleCategoriesContext.Provider>
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

/** Active loan products (slug ending in -loan), personal loan first. */
export function useLoanProducts(): LoanProductTab[] {
  return useContext(LoanProductsContext) ?? [];
}

/** Vehicle categories from GET /api/services. Empty means use the built-in list. */
export function useCatalogVehicleCategories(): InsuranceTypeOption[] {
  return useContext(VehicleCategoriesContext) ?? [];
}
