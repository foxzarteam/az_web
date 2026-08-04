import { PUBLIC_API_BASE_URL } from "@/app/config/constants";

export interface CreateLeadRequest {
  pan: string;
  mobileNumber: string;
  fullName: string;
  category:
    | "personal_loan"
    | "home_loan"
    | "business_loan"
    | "credit_card"
    | "insurance"
    | "vehicle_loan";
  userId?: string;
  email?: string;
  pincode?: string;
  requiredAmount?: number;
  loanAmt?: string;
  insType?: string;
  employmentType?: "salaried" | "self_employed";
  netMonthlyIncome?: number;
}

export interface CreateLeadResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export type LeadRecord = {
  id?: string;
  mobile_number?: string;
  full_name?: string;
  pan?: string;
  category?: string;
};

export function getLeadsApiBase(): string {
  return `${PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api/leads`;
}
