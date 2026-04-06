import { PUBLIC_API_BASE_URL } from "@/app/config/constants";

/** GET list for `public.services` (active rows) — same path server + browser. */
export function getPublicServicesListUrl(): string {
  return `${PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api/services`;
}
