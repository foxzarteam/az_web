import {
  getLeadsApiBase,
  type CreateLeadRequest,
  type CreateLeadResponse,
  type LeadRecord,
} from "@/app/lib/leads/types";
import { parseLeadApiResponse } from "@/app/lib/leads/parseLeadApiResponse";
import { readAffiliateCode } from "@/app/lib/affiliate/refCookie";

export type { CreateLeadRequest, CreateLeadResponse, LeadRecord } from "@/app/lib/leads/types";

export function isExistingApplicationError(res: {
  success: boolean;
  message?: string;
  code?: string;
}): boolean {
  if (res.success) return false;
  const code = (res.code ?? "").toUpperCase();
  if (code.includes("MOBILE_PAN") || code.includes("ALREADY")) return true;
  const msg = (res.message ?? "").toLowerCase();
  return (
    msg.includes("already") ||
    msg.includes("open application") ||
    msg.includes("4 unique pan")
  );
}

export function leadIdFromResponse(data: unknown): string | null {
  if (data == null || typeof data !== "object") return null;
  const id = (data as LeadRecord).id;
  return id != null ? String(id) : null;
}

/**
 * Partner attribution only from current URL (`/r/CODE` or `?ref=`).
 * Cookie / client-supplied referralCode are ignored so leaving the partner URL
 * and applying elsewhere does not credit the partner.
 */
function withReferralCode<T extends object>(data: T): T {
  const fromUrl = readAffiliateCode().trim();
  const next = { ...data } as T & { referralCode?: string };
  delete next.referralCode;
  if (fromUrl) next.referralCode = fromUrl;
  return next;
}

/**
 * Save full lead on form submit (no OTP required). Verified stays No until OTP.
 * Backend enforces max 4 unique PANs per mobile, then same PAN + product rules.
 */
export async function applyLead(
  leadData: CreateLeadRequest,
  idToken?: string | null,
): Promise<CreateLeadResponse> {
  const body = withReferralCode(leadData);
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (idToken?.trim()) headers.Authorization = `Bearer ${idToken.trim()}`;

    const response = await fetch(`${getLeadsApiBase()}/apply`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
    return parseLeadApiResponse(response, await response.text());
  } catch (error) {
    console.error("Error applying lead:", error);
    return { success: false, message: "Network error. Please try again later." };
  }
}

export function mapServiceToCategory(service: string): string {
  const slug = service.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  if (!slug) return "personal_loan";
  return slug.replace(/-/g, "_");
}
