import "server-only";
import { PUBLIC_API_BASE_URL } from "@/app/config/publicEnv";
import { adminInternalHeaders } from "@/app/lib/admin/adminInternalKey";

export type CustomerLead = {
  id: string;
  applicationNumber: string;
  full_name: string;
  mobile_number: string;
  category: string;
  status: string;
  required_amount: number | null;
  created_at: string | null;
  updated_at: string | null;
  otp_verified: boolean;
};

function digitsOnly(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizeMobile(mobile: string): string {
  const d = digitsOnly(mobile);
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d.slice(-10);
}

function apiBase(): string {
  return PUBLIC_API_BASE_URL.trim().replace(/\/+$/, "");
}

function asCustomerLead(row: unknown): CustomerLead | null {
  if (row == null || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = String(r.id ?? "").trim();
  if (!id) return null;
  const amount =
    typeof r.required_amount === "number" && Number.isFinite(r.required_amount)
      ? r.required_amount
      : null;
  return {
    id,
    applicationNumber: String(r.applicationNumber ?? "").trim() || `AZ-${id.slice(-8).toUpperCase()}`,
    full_name: String(r.full_name ?? "").trim() || "Applicant",
    mobile_number: normalizeMobile(String(r.mobile_number ?? "")),
    category: String(r.category ?? "").trim() || "personal_loan",
    status: String(r.status ?? "").trim().toLowerCase() || "pending",
    required_amount: amount,
    created_at: r.created_at != null ? String(r.created_at) : null,
    updated_at: r.updated_at != null ? String(r.updated_at) : null,
    otp_verified: r.otp_verified === true,
  };
}

/** Nest: POST /api/customer/check-mobile */
export async function mobileHasLead(mobile: string): Promise<boolean> {
  const target = normalizeMobile(mobile);
  if (target.length !== 10) return false;
  const base = apiBase();
  if (!base) return false;

  try {
    const res = await fetch(`${base}/api/customer/check-mobile`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber: target }),
      cache: "no-store",
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { success?: boolean; exists?: boolean };
    return Boolean(body.success && body.exists);
  } catch {
    return false;
  }
}

/** Nest: POST /api/customer/applications (internal key) */
export async function fetchLeadsByMobile(mobile: string): Promise<CustomerLead[]> {
  const target = normalizeMobile(mobile);
  if (target.length !== 10) return [];
  const base = apiBase();
  if (!base) return [];

  try {
    const res = await fetch(`${base}/api/customer/applications`, {
      method: "POST",
      headers: adminInternalHeaders(true),
      body: JSON.stringify({ mobileNumber: target }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as {
      success?: boolean;
      applications?: unknown[];
    };
    if (!body.success || !Array.isArray(body.applications)) return [];
    return body.applications
      .map(asCustomerLead)
      .filter((a): a is CustomerLead => a != null);
  } catch {
    return [];
  }
}

/** Nest: POST /api/customer/login */
export async function customerLoginOnApi(
  mobile: string,
  idToken: string,
): Promise<{
  ok: boolean;
  message?: string;
  customer?: { mobile: string; name: string };
  applications?: CustomerLead[];
}> {
  const target = normalizeMobile(mobile);
  const base = apiBase();
  if (!base) {
    return { ok: false, message: "API is not configured." };
  }
  if (target.length !== 10) {
    return { ok: false, message: "Enter a valid 10-digit mobile number." };
  }

  try {
    const res = await fetch(`${base}/api/customer/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber: target, idToken }),
      cache: "no-store",
    });
    const body = (await res.json()) as {
      success?: boolean;
      message?: string;
      code?: string;
      customer?: { mobile?: string; name?: string };
      applications?: unknown[];
    };

    if (!res.ok || body.success !== true) {
      return {
        ok: false,
        message: body.message || "Login failed. Please try again.",
      };
    }

    const applications = Array.isArray(body.applications)
      ? body.applications.map(asCustomerLead).filter((a): a is CustomerLead => a != null)
      : [];

    return {
      ok: true,
      customer: {
        mobile: String(body.customer?.mobile ?? target),
        name: String(body.customer?.name ?? applications[0]?.full_name ?? "Customer"),
      },
      applications,
    };
  } catch {
    return { ok: false, message: "Could not complete login. Please try again." };
  }
}
