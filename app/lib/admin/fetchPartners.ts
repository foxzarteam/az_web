import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { isAllowedProductSlug } from "@/app/lib/services/allowedProducts";
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
        const slug = String(row.slug ?? "").trim().toLowerCase();
        const sortOrder = Number(row.sortOrder ?? row.sort_order);
        const title = String(row.title ?? "").trim();
        const isActive = row.isActive !== false && row.is_active !== false;
        if (!isActive || !Number.isFinite(sortOrder) || !title || !isAllowedProductSlug(slug)) return null;
        return { sortOrder, title };
      })
      .filter((o): o is PartnerServiceOption => o != null)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}

export type FetchAdminPartnersResult = {
  partners: AdminPartnerRow[];
  error: string | null;
};

export async function fetchAdminPartners(): Promise<FetchAdminPartnersResult> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) {
    return {
      partners: [],
      error: "NEXT_PUBLIC_API_URL is missing on the host. Set it to your Nest API URL (not localhost).",
    };
  }

  const url = `${base}/api/partners/admin/all`;

  try {
    const res = await fetch(url, {
      headers: adminInternalHeaders(),
      cache: "no-store",
    });

    const body = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      data?: AdminPartnerRow[];
      message?: string;
      error?: string;
    };

    if (!res.ok) {
      const detail = body.message ?? body.error ?? res.statusText;
      if (res.status === 401) {
        return {
          partners: [],
          error:
            "API returned 401 Unauthorized. Set the same ADMIN_INTERNAL_KEY on az_web and the Nest server (production requires it).",
        };
      }
      return { partners: [], error: `API error ${res.status}: ${detail || url}` };
    }

    if (!body.success || !Array.isArray(body.data)) {
      return { partners: [], error: "API response invalid. Check Nest server logs and Supabase partner table." };
    }

    return { partners: body.data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return {
      partners: [],
      error: `Cannot reach API at ${url}. ${msg}. Check NEXT_PUBLIC_API_URL and that the server is running.`,
    };
  }
}
