"use client";

import { useCatalogInsuranceTypes } from "@/app/components/providers/ServiceCardsProvider";
import { INSURANCE_TYPE_OPTIONS } from "@/app/utils/leadForm";
import type { InsuranceTypeOption } from "@/app/lib/services/types";

export function useInsuranceTypeOptions(): InsuranceTypeOption[] {
  const fromCatalog = useCatalogInsuranceTypes();
  if (fromCatalog.length > 0) return fromCatalog;
  return INSURANCE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
}
