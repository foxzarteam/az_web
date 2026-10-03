import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeadersFromSession } from "@/app/lib/admin/adminInternalKey";

/** Logged-in admin read from Nest. Null when the API, session, or payload is missing. */
export async function adminNestGet<T>(path: string): Promise<T | null> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return null;
  const headers = await adminInternalHeadersFromSession();
  if (!headers) return null;
  try {
    const res = await fetch(`${base}${path}`, { headers, cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; data?: T };
    if (!body.success || body.data == null) return null;
    return body.data;
  } catch {
    return null;
  }
}
