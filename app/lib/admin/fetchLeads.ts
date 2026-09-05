import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeadersFromSession } from "@/app/lib/admin/adminInternalKey";

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

function maskPanForAgent(pan: unknown): string | null {
  if (pan == null) return null;
  const p = String(pan).trim().toUpperCase();
  if (!p) return null;
  if (p.includes("*") || p.includes("X")) return p;
  if (p.length === 10) return `${p.slice(0, 5)}****${p.slice(-1)}`;
  if (p.length >= 6) return `${p.slice(0, 5)}****${p.slice(-1)}`;
  return "XXXXX****X";
}

function stripPanForAgent(rows: AdminLeadRow[]): AdminLeadRow[] {
  return rows.map((row) => {
    if (!("pan" in row) || row.pan == null) return row;
    return { ...row, pan: maskPanForAgent(row.pan) };
  });
}

export async function fetchAdminLeads(): Promise<AdminLeadRow[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base) return [];

  const headers = await adminInternalHeadersFromSession();
  if (!headers) return [];

  const url = `${base}/api/leads/admin/all`;

  try {
    const res = await fetch(url, {
      headers,
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

/** Leads attributed to one agent (referral). PAN masked client-side. */
export async function fetchLeadsByAgent(agentId: string): Promise<AdminLeadRow[]> {
  const base = PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
  if (!base || !agentId) return [];
  const headers = await adminInternalHeadersFromSession();
  if (!headers) return [];
  try {
    const res = await fetch(
      `${base}/api/leads/admin/by-agent/${encodeURIComponent(agentId)}`,
      { headers, cache: "no-store" },
    );
    const body = (await res.json()) as { success?: boolean; data?: AdminLeadRow[] };
    if (!res.ok || !Array.isArray(body.data)) return [];
    return stripPanForAgent(body.data);
  } catch {
    return [];
  }
}
