import { PUBLIC_API_BASE_URL } from "@/app/config/constants";

export interface CreateLeadRequest {
  pan: string;
  mobileNumber: string;
  fullName: string;
  category: 'personal_loan' | 'home_loan' | 'business_loan' | 'credit_card' | 'insurance' | 'vehicle_loan';
  userId?: string;
  email?: string;
  pincode?: string;
  requiredAmount?: number;
}

export interface CreateLeadResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export async function createLead(leadData: CreateLeadRequest): Promise<CreateLeadResponse> {
  const endpoint = `${PUBLIC_API_BASE_URL}/api/leads`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
      mode: "cors",
      credentials: "omit",
    });

    const raw = await response.text();
    let data: {
      success?: boolean | string | number;
      message?: string | string[];
      data?: unknown;
      error?: string | string[];
      statusCode?: number;
    } = {};
    if (raw) {
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        const looksLikeHtml = /^\s*</.test(raw);
        return {
          success: false,
          message: looksLikeHtml
            ? `Lead API returned a web page (HTTP ${response.status}), not JSON. Usually NEXT_PUBLIC_API_URL is wrong or missing at build time — set it to your backend (e.g. https://your-api.vercel.app) and rebuild.`
            : `Server returned an invalid response (HTTP ${response.status}). Check NEXT_PUBLIC_API_URL.`,
        };
      }
    }

    const pickMsg = (m: unknown): string | undefined => {
      if (typeof m === "string" && m.trim()) return m;
      if (Array.isArray(m)) {
        const s = m.filter((x) => typeof x === "string").join(". ");
        return s || undefined;
      }
      return undefined;
    };

    if (!response.ok) {
      const msg =
        pickMsg(data.message) ||
        pickMsg(data.error) ||
        `Request failed (HTTP ${response.status}).`;
      return { success: false, message: msg };
    }

    const successFlag = data.success;
    const explicitFailure = successFlag === false || successFlag === "false";
    const explicitSuccess =
      successFlag === true || successFlag === "true" || successFlag === 1;
    /** Some APIs return 201 + body without a `success` field */
    const implicitSuccess =
      (response.status === 201 || response.status === 200) &&
      data.data != null &&
      typeof data.data === "object";

    if (explicitFailure) {
      return {
        success: false,
        message: pickMsg(data.message) || pickMsg(data.error) || "Could not save your details.",
      };
    }

    if (explicitSuccess || implicitSuccess) {
      return {
        success: true,
        data: data.data,
      };
    }

    return {
      success: false,
      message:
        pickMsg(data.message) ||
        pickMsg(data.error) ||
        "Unexpected response from server. Please try again.",
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
}

// Map service value to API category
export function mapServiceToCategory(service: string): CreateLeadRequest['category'] {
  const mapping: Record<string, CreateLeadRequest['category']> = {
    'personal-loan': 'personal_loan',
    'home-loan': 'home_loan',
    'business-loan': 'business_loan',
    'credit-card': 'credit_card',
    'insurance': 'insurance',
  };
  
  return mapping[service] || 'personal_loan';
}
