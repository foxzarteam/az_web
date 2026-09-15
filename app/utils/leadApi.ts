import {
  getLeadsApiBase,
  type CreateLeadRequest,
  type CreateLeadResponse,
  type LeadRecord,
} from "@/app/lib/leads/types";
import { parseLeadApiResponse } from "@/app/lib/leads/parseLeadApiResponse";
import { readAffiliateCode } from "@/app/lib/affiliate/refCookie";

export type { CreateLeadRequest, CreateLeadResponse, LeadRecord } from "@/app/lib/leads/types";

export function leadIdFromResponse(data: unknown): string | null {
  if (data == null || typeof data !== "object") return null;
  const id = (data as LeadRecord).id;
  return id != null ? String(id) : null;
}

/** Cookie wins over client body (anti referral-fraud). Cookie set on `/r/:code` / `?ref=`. */
function withReferralCode<T extends object>(data: T): T {
  const fromCookie = readAffiliateCode().trim();
  const fromBody =
    "referralCode" in data && typeof (data as { referralCode?: unknown }).referralCode === "string"
      ? String((data as { referralCode: string }).referralCode).trim()
      : "";
  const referralCode = fromCookie || fromBody;
  return referralCode ? { ...data, referralCode } : data;
}

/**
 * Pre-OTP gate: same phone/PAN + same category blocked unless prior lead is approved.
 */
export async function checkLeadApplication(input: {
  mobileNumber: string;
  pan: string;
  category: CreateLeadRequest["category"];
  insType?: string;
}): Promise<{
  success: boolean;
  allowed: boolean;
  message?: string;
  status?: string;
  statusLabel?: string;
  category?: string;
  categoryLabel?: string;
  insType?: string | null;
}> {
  try {
    const response = await fetch(`${getLeadsApiBase()}/check-application`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobileNumber: input.mobileNumber.replace(/\D/g, "").slice(-10),
        pan: input.pan.trim().toUpperCase(),
        category: input.category,
        ...(input.category === "insurance" && input.insType
          ? { insType: input.insType }
          : {}),
      }),
      mode: "cors",
      credentials: "omit",
    });
    const raw = await response.text();
    let data: {
      success?: boolean;
      allowed?: boolean;
      message?: string;
      status?: string;
      statusLabel?: string;
      category?: string;
      categoryLabel?: string;
      insType?: string | null;
    } = {};
    if (raw) {
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        /* ignore */
      }
    }
    if (!response.ok) {
      return {
        success: false,
        allowed: false,
        message: data.message || "Could not verify existing application. Please try again.",
      };
    }
    return {
      success: true,
      allowed: data.allowed !== false,
      message: data.message,
      status: data.status,
      statusLabel: data.statusLabel,
      category: data.category,
      categoryLabel: data.categoryLabel,
      insType: data.insType,
    };
  } catch (error) {
    console.error("Error checking lead application:", error);
    return {
      success: false,
      allowed: false,
      message: "Network error. Please try again later.",
    };
  }
}

/**
 * Save full lead after phone OTP (idToken or recent Nest OTP session required server-side).
 * Same mobile/PAN can apply once per category unless prior lead is approved.
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
      mode: "cors",
      credentials: "omit",
    });
    return parseLeadApiResponse(response, await response.text());
  } catch (error) {
    console.error("Error applying lead:", error);
    return { success: false, message: "Network error. Please try again later." };
  }
}

/**
 * After OTP: create (or reuse) a draft lead row for this mobile.
 */
export async function startLead(
  mobileNumber: string,
  category: CreateLeadRequest["category"] = "personal_loan",
): Promise<CreateLeadResponse & { isDraft?: boolean }> {
  try {
    const response = await fetch(`${getLeadsApiBase()}/start`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(withReferralCode({ mobileNumber, category })),
      mode: "cors",
      credentials: "omit",
    });
    const raw = await response.text();
    const parsed = parseLeadApiResponse(response, raw);
    let isDraft: boolean | undefined;
    if (raw) {
      try {
        const data = JSON.parse(raw) as { isDraft?: boolean };
        if (typeof data.isDraft === "boolean") isDraft = data.isDraft;
      } catch {
        /* ignore */
      }
    }
    return { ...parsed, isDraft };
  } catch (error) {
    console.error("Error starting lead:", error);
    return { success: false, message: "Network error. Please try again later." };
  }
}

/** Fill remaining details on an existing draft/pending lead. */
export async function completeLead(
  leadId: string,
  body: {
    pan: string;
    fullName: string;
    category?: CreateLeadRequest["category"];
    pincode?: string;
    requiredAmount?: number;
    insType?: string;
    employmentType?: "salaried" | "self_employed";
    netMonthlyIncome?: number;
  },
  idToken?: string | null,
): Promise<CreateLeadResponse> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (idToken) headers.Authorization = `Bearer ${idToken}`;

    const response = await fetch(
      `${getLeadsApiBase()}/${encodeURIComponent(leadId)}/complete`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(withReferralCode(body)),
        mode: "cors",
        credentials: "omit",
      },
    );
    return parseLeadApiResponse(response, await response.text());
  } catch (error) {
    console.error("Error completing lead:", error);
    return { success: false, message: "Network error. Please try again later." };
  }
}

export function mapServiceToCategory(
  service: string,
): CreateLeadRequest["category"] {
  const mapping: Record<string, CreateLeadRequest["category"]> = {
    "personal-loan": "personal_loan",
    "home-loan": "home_loan",
    "business-loan": "business_loan",
    "credit-card": "credit_card",
    insurance: "insurance",
  };
  return mapping[service] || "personal_loan";
}
