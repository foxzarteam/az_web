import { getPublicServicesListUrl } from "@/app/lib/services/serviceListUrl";
import { parseServicesFetchResult } from "@/app/lib/services/parseServicesFetchResult";
import type {
  FetchActiveServicesResult,
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
    const response = await fetch(getPublicServicesListUrl(), {
      method: "GET",
      headers: { Accept: "application/json" },
      mode: "cors",
      credentials: "omit",
    });

    const raw = await response.text();
    let parsed: unknown = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        console.warn("[services] API returned non-JSON");
        return { cards: [], status: "error" };
      }
    }

    return parseServicesFetchResult(parsed, response.ok);
  } catch (e) {
    console.warn("[services] fetch failed:", e);
    return { cards: [], status: "error" };
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

export function primeServicesClientCache(cards: ServiceSliderCard[]) {
  if (cards.length === 0) return;
  okCache = { cards, status: "ok" };
}
