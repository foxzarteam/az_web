import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

export type AdminPartnerRow = Record<string, unknown>;

export type PartnerServiceOption = {
  sortOrder: number;
  title: string;
};

/** Active services for partner multi-select (sort_order + title). */
export async function fetchActiveServiceOptions(): Promise<PartnerServiceOption[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return [];

  try {
    const res = await fetch(`${base}/api/services`, { cache: "no-store" });
    if (!res.ok) return [];

    const body = (await res.json()) as { success?: boolean; data?: Record<string, unknown>[] };
    if (!body.success || !Array.isArray(body.data)) return [];

    return body.data
      .map((row) => {
        const sortOrder = Number(row.sortOrder ?? row.sort_order);
        const title = String(row.title ?? "").trim();
        const isActive = row.isActive !== false && row.is_active !== false;
        if (!isActive || !Number.isFinite(sortOrder) || !title) return null;
        return { sortOrder, title };
      })
      .filter((o): o is PartnerServiceOption => o != null)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}

export async function fetchAdminPartners(): Promise<AdminPartnerRow[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return [];

  const url = `${base}/api/partners/admin/all`;

  try {
    const res = await fetch(url, {
      headers: adminInternalHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return [];

    const body = (await res.json()) as { success?: boolean; data?: AdminPartnerRow[] };
    if (!body.success || !Array.isArray(body.data)) return [];
    return body.data;
  } catch {
    return [];
  }
}
