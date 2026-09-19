import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";

/** Nest origin used only from Next server (RSC / BFF). Never expose to browser fetches. */
export function nestApiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}
