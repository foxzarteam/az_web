import { parseServicesApiPayload } from "@/app/lib/services/parseApiResponse";
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
  if (!ok) return { cards: [], status: "error" };
  if (
    parsed &&
    typeof parsed === "object" &&
    "success" in parsed &&
    (parsed as { success?: boolean }).success === false
  ) {
    return { cards: [], status: "error" };
  }
  return { cards: parseServicesApiPayload(parsed), status: "ok" };
}
