import { parseInsuranceTypesPayload, parseServicesApiPayload } from "@/app/lib/services/parseApiResponse";
import type { FetchActiveServicesResult } from "@/app/lib/services/types";
import { INSURANCE_TYPE_OPTIONS } from "@/app/utils/leadForm";

const FALLBACK_INSURANCE_TYPES = INSURANCE_TYPE_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

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
      return { cards: [], insuranceTypes: FALLBACK_INSURANCE_TYPES, status: "error" };
    }
  }
  if (!ok) return { cards: [], insuranceTypes: FALLBACK_INSURANCE_TYPES, status: "error" };
  if (
    parsed &&
    typeof parsed === "object" &&
    "success" in parsed &&
    (parsed as { success?: boolean }).success === false
  ) {
    return { cards: [], insuranceTypes: FALLBACK_INSURANCE_TYPES, status: "error" };
  }
  return {
    cards: parseServicesApiPayload(parsed),
    insuranceTypes: parseInsuranceTypesPayload(parsed),
    status: "ok",
  };
}
