import "server-only";

import { cache } from "react";
import { PUBLIC_API_FALLBACK_ORIGIN } from "@/app/config/publicEnv";
import { getPublicServicesListUrl } from "@/app/lib/services/serviceListUrl";
import { catalogFetchError, servicesResultFromHttp } from "@/app/lib/services/servicesResultFromHttp";
import type { FetchActiveServicesResult, ServiceSliderCard } from "@/app/lib/services/types";

function catalogHasAmountRange(result: FetchActiveServicesResult): boolean {
  return result.loanProducts.some((item) => item.limitStart != null && item.limitEnd != null);
}

async function fetchCatalog(url: string): Promise<FetchActiveServicesResult> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    return servicesResultFromHttp(res.ok, await res.text());
  } catch {
    return catalogFetchError();
  }
}

/** One cached fetch per request. If the local API is down, ranges still come from the public catalog. */
export const getActiveCatalog = cache(async (): Promise<FetchActiveServicesResult> => {
  const primary = getPublicServicesListUrl();
  const first = await fetchCatalog(primary);
  if (first.status === "ok" && catalogHasAmountRange(first)) return first;

  const fallback = `${PUBLIC_API_FALLBACK_ORIGIN.replace(/\/+$/, "")}/api/services`;
  if (fallback !== primary) {
    const second = await fetchCatalog(fallback);
    if (second.status === "ok" && (catalogHasAmountRange(second) || first.status !== "ok")) return second;
  }
  return first.status === "ok" ? first : catalogFetchError();
});

export const getActiveServices = cache(async (): Promise<ServiceSliderCard[]> => {
  const catalog = await getActiveCatalog();
  return catalog.status === "ok" ? catalog.cards : [];
});
