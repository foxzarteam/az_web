import { servicesResultFromHttp } from "@/app/lib/services/servicesResultFromHttp";
import type {
  FetchActiveServicesResult,
  InsuranceTypeOption,
  ServiceSliderCard,
} from "@/app/lib/services/types";

export type {
  FetchActiveServicesResult,
  ServiceSliderCard,
  ServicesFetchStatus,
} from "@/app/lib/services/types";

let okCache: FetchActiveServicesResult | null = null;
let inflight: Promise<FetchActiveServicesResult> | null = null;

async function fetchFromApi(): Promise<FetchActiveServicesResult> {
  try {
    const response = await fetch("/api/services", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });
    return servicesResultFromHttp(response.ok, await response.text());
  } catch (e) {
    console.warn("[services] fetch failed:", e);
    return { cards: [], insuranceTypes: [], status: "error" };
  }
}

/** Browser: first OK response cached for the session (dedupes parallel callers). */
export async function fetchActiveServiceCards(): Promise<FetchActiveServicesResult> {
  if (okCache) return okCache;
  if (!inflight) {
    inflight = fetchFromApi().then((r) => {
      inflight = null;
      if (r.status === "ok") okCache = r;
      return r;
    });
  }
  return inflight;
}

export function primeServicesClientCache(
  cards: ServiceSliderCard[],
  insuranceTypes?: InsuranceTypeOption[],
) {
  if (cards.length === 0 && !(insuranceTypes && insuranceTypes.length > 0)) return;
  okCache = {
    cards,
    insuranceTypes: insuranceTypes ?? [],
    status: "ok",
  };
}
