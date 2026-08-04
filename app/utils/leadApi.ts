import {
  getLeadsApiBase,
  type CreateLeadRequest,
  type CreateLeadResponse,
  type LeadRecord,
} from "@/app/lib/leads/types";
import { parseLeadApiResponse } from "@/app/lib/leads/parseLeadApiResponse";

export type { CreateLeadRequest, CreateLeadResponse, LeadRecord } from "@/app/lib/leads/types";

export function leadIdFromResponse(data: unknown): string | null {
  if (data == null || typeof data !== "object") return null;
  const id = (data as LeadRecord).id;
  return id != null ? String(id) : null;
}

/**
 * Save full lead BEFORE OTP.
 * Same mobile/PAN can apply once per category (e.g. personal_loan and insurance).
 */
export async function applyLead(
  leadData: CreateLeadRequest,
): Promise<CreateLeadResponse> {
  try {
    const response = await fetch(`${getLeadsApiBase()}/apply`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
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
      body: JSON.stringify({ mobileNumber, category }),
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
        body: JSON.stringify(body),
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
