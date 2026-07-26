import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

export type AdminContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

/** Nest: GET /api/contact/admin/all */
export async function fetchAdminContacts(): Promise<AdminContactRow[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return [];

  try {
    const res = await fetch(`${base}/api/contact/admin/all`, {
      headers: adminInternalHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { success?: boolean; data?: AdminContactRow[] };
    if (!body.success || !Array.isArray(body.data)) return [];
    return body.data;
  } catch {
    return [];
  }
}
