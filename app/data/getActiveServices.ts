import "server-only";

import { cache } from "react";
import { getPublicServicesListUrl } from "@/app/lib/services/serviceListUrl";
import { servicesResultFromHttp } from "@/app/lib/services/servicesResultFromHttp";
import type { FetchActiveServicesResult, ServiceSliderCard } from "@/app/lib/services/types";

/**
 * One cached fetch per request/build (React `cache`). Used only in root layout.
 * Same URL + parser as browser `fetchActiveServiceCards`.
 */
export const getActiveCatalog = cache(async (): Promise<FetchActiveServicesResult> => {
  try {
    const res = await fetch(getPublicServicesListUrl(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
    });
    return servicesResultFromHttp(res.ok, await res.text());
  } catch {
    return { cards: [], insuranceTypes: [], status: "error" };
  }
});

export const getActiveServices = cache(async (): Promise<ServiceSliderCard[]> => {
  const catalog = await getActiveCatalog();
  return catalog.status === "ok" ? catalog.cards : [];
});
