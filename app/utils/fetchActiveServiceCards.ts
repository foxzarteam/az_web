import { catalogFetchError, servicesResultFromHttp } from "@/app/lib/services/servicesResultFromHttp";
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

let okCache: { at: number; value: FetchActiveServicesResult } | null = null;
let inflight: Promise<FetchActiveServicesResult> | null = null;

/** Browser catalog TTL — new DB services show without a new tab. */
const CATALOG_CLIENT_TTL_MS = 60_000;

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
    return catalogFetchError();
  }
}

function cacheGet(): FetchActiveServicesResult | null {
  if (!okCache) return null;
  if (Date.now() - okCache.at > CATALOG_CLIENT_TTL_MS) {
    okCache = null;
    return null;
  }
  return okCache.value;
}

function cacheSet(value: FetchActiveServicesResult) {
  okCache = { at: Date.now(), value };
}

/** Browser: OK responses cached briefly (dedupes parallel callers). */
export async function fetchActiveServiceCards(): Promise<FetchActiveServicesResult> {
  const hit = cacheGet();
  if (hit) return hit;
  if (!inflight) {
    inflight = fetchFromApi().then((r) => {
      inflight = null;
      if (r.status === "ok") cacheSet(r);
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
  cacheSet({
    cards,
    insuranceTypes: insuranceTypes ?? [],
    status: "ok",
  });
}
