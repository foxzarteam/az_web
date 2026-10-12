import "server-only";

import { cache } from "react";
import { PUBLIC_API_FALLBACK_ORIGIN } from "@/app/config/publicEnv";
import { getPublicServicesListUrl } from "@/app/lib/services/serviceListUrl";
import { catalogFetchError, servicesResultFromHttp } from "@/app/lib/services/servicesResultFromHttp";
import type { FetchActiveServicesResult, ServiceSliderCard } from "@/app/lib/services/types";

/** Reuse a good catalog across page loads so every route does not wait on the API. */
const CATALOG_TTL_MS = 60_000;

let okCache: { at: number; value: FetchActiveServicesResult } | null = null;
let inflight: Promise<FetchActiveServicesResult> | null = null;

function catalogHasAmountRange(result: FetchActiveServicesResult): boolean {
  return result.loanProducts.some((item) => item.limitStart != null && item.limitEnd != null);
}

function timeoutFor(url: string): number {
  try {
    const host = new URL(url).hostname;
    if (host === "localhost" || host === "127.0.0.1") return 900;
  } catch {
    /* keep the remote timeout */
  }
  return 5000;
}

async function fetchCatalog(url: string): Promise<FetchActiveServicesResult> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(timeoutFor(url)),
    });
    return servicesResultFromHttp(res.ok, await res.text());
  } catch {
    return catalogFetchError();
  }
}

async function loadCatalog(): Promise<FetchActiveServicesResult> {
  const primary = getPublicServicesListUrl();
  const first = await fetchCatalog(primary);
  if (first.status === "ok" && catalogHasAmountRange(first)) return first;

  const fallback = `${PUBLIC_API_FALLBACK_ORIGIN.replace(/\/+$/, "")}/api/services`;
  if (fallback !== primary) {
    const second = await fetchCatalog(fallback);
    if (second.status === "ok" && (catalogHasAmountRange(second) || first.status !== "ok")) return second;
  }
  return first.status === "ok" ? first : catalogFetchError();
}

/** One fetch per request, then reused for a minute. Local API down still falls back to the public catalog. */
export const getActiveCatalog = cache(async (): Promise<FetchActiveServicesResult> => {
  if (okCache && Date.now() - okCache.at < CATALOG_TTL_MS) return okCache.value;
  if (!inflight) {
    inflight = loadCatalog().then((value) => {
      inflight = null;
      if (value.status === "ok") okCache = { at: Date.now(), value };
      return value;
    });
  }
  return inflight;
});

export const getActiveServices = cache(async (): Promise<ServiceSliderCard[]> => {
  const catalog = await getActiveCatalog();
  return catalog.status === "ok" ? catalog.cards : [];
});
