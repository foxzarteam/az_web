import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

/** Shape of admin lead rows returned by GET /api/leads/admin/all */
export type AdminLeadRow = {
  id?: string | null;
  user_id?: string | null;
  pan?: string | null;
  mobile_number?: string | null;
  full_name?: string | null;
  email?: string | null;
  pincode?: string | null;
  required_amount?: number | string | null;
  category?: string | null;
  status?: string | null;
  notes?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  loan_amt?: string | null;
  ins_type?: string | null;
  employment_type?: string | null;
  net_monthly_income?: number | string | null;
  otp_verified?: boolean | number | string | null;
  ip?: string | null;
  ip_location?: string | null;
  /** Allow extra Supabase columns without loose `any` on known fields. */
  [key: string]: unknown;
};

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
