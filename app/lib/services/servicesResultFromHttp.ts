import {
  fallbackInsuranceTypes,
  fallbackVehicleCategories,
  parseInsuranceTypesPayload,
  parseLoanProducts,
  parseServicesApiPayload,
  parseVehicleCategoriesPayload,
} from "@/app/lib/services/parseApiResponse";
import type { FetchActiveServicesResult } from "@/app/lib/services/types";

export function catalogFetchError(): FetchActiveServicesResult {
  return {
    cards: [],
    insuranceTypes: fallbackInsuranceTypes(),
    vehicleCategories: fallbackVehicleCategories(),
    loanProducts: [],
    status: "error",
  };
}

/**
 * Single response → cards path used by SSR (`getActiveServices`) and browser fetch.
 */
export function servicesResultFromHttp(
  ok: boolean,
  rawBody: string,
): FetchActiveServicesResult {
  let parsed: unknown = null;
  if (rawBody) {
    try {
      parsed = JSON.parse(rawBody) as unknown;
    } catch {
      return catalogFetchError();
    }
  }
  if (!ok) return catalogFetchError();
  if (
    parsed &&
    typeof parsed === "object" &&
    "success" in parsed &&
    (parsed as { success?: boolean }).success === false
  ) {
    return catalogFetchError();
  }
  return {
    cards: parseServicesApiPayload(parsed),
    insuranceTypes: parseInsuranceTypesPayload(parsed),
    vehicleCategories: parseVehicleCategoriesPayload(parsed),
    loanProducts: parseLoanProducts(parsed),
    status: "ok",
  };
}
