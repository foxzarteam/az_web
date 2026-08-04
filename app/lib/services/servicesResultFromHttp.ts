import { parseServicesFetchResult } from "@/app/lib/services/parseServicesFetchResult";
import type { FetchActiveServicesResult } from "@/app/lib/services/types";

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
      return { cards: [], status: "error" };
    }
  }
  return parseServicesFetchResult(parsed, ok);
}
