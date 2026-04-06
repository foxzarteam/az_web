import "server-only";

import { cache } from "react";
import { getPublicServicesListUrl } from "@/app/lib/services/serviceListUrl";
import { parseServicesFetchResult } from "@/app/lib/services/parseServicesFetchResult";
import type { ServiceSliderCard } from "@/app/lib/services/types";

/**
 * One cached fetch per request/build (React `cache`). Used only in root layout.
 */
export const getActiveServices = cache(async (): Promise<ServiceSliderCard[]> => {
  try {
    const res = await fetch(getPublicServicesListUrl(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
    });

    const text = await res.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        return [];
      }
    }

    const { cards, status } = parseServicesFetchResult(parsed, res.ok);
    return status === "ok" ? cards : [];
  } catch {
    return [];
  }
});
