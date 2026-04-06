import { parseServicesApiPayload } from "@/app/lib/services/parseApiResponse";
import type { FetchActiveServicesResult } from "@/app/lib/services/types";

/** Shared: HTTP OK + JSON body → cards + status (server + client). */
export function parseServicesFetchResult(
  parsed: unknown,
  httpOk: boolean
): FetchActiveServicesResult {
  if (!httpOk) {
    return { cards: [], status: "error" };
  }
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
