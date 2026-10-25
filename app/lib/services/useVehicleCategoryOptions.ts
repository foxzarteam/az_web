"use client";

import { useCatalogVehicleCategories } from "@/app/components/providers/ServiceCardsProvider";
import { FALLBACK_VEHICLE_CATEGORIES } from "@/app/lib/leads/leadForm";
import type { InsuranceTypeOption } from "@/app/lib/services/types";

export function useVehicleCategoryOptions(): InsuranceTypeOption[] {
  const fromCatalog = useCatalogVehicleCategories();
  if (fromCatalog.length > 0) return fromCatalog;
  return FALLBACK_VEHICLE_CATEGORIES.map((item) => ({ value: item.value, label: item.label, image: item.image }));
}
