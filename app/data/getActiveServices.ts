import "server-only";

import { cache } from "react";
import { getPublicServicesListUrl } from "@/app/lib/services/serviceListUrl";
import { servicesResultFromHttp } from "@/app/lib/services/servicesResultFromHttp";
import type { ServiceSliderCard } from "@/app/lib/services/types";

/**
 * One cached fetch per request/build (React `cache`). Used only in root layout.
 * Same URL + parser as browser `fetchActiveServiceCards`.
 */
export const getActiveServices = cache(async (): Promise<ServiceSliderCard[]> => {
  try {
    const res = await fetch(getPublicServicesListUrl(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
    });
    const { cards, status } = servicesResultFromHttp(res.ok, await res.text());
    return status === "ok" ? cards : [];
  } catch {
    return [];
  }
});
