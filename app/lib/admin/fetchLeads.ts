import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

export type AdminLeadRow = Record<string, unknown>;

export async function fetchAdminLeads(): Promise<AdminLeadRow[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return [];

  const url = `${base}/api/leads/admin/all`;

  try {
    const res = await fetch(url, {
      headers: adminInternalHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return [];

    const body = (await res.json()) as { success?: boolean; data?: AdminLeadRow[] };
    if (!body.success || !Array.isArray(body.data)) return [];
    return body.data;
  } catch {
    return [];
  }
}
