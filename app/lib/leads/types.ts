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
  referralCode?: string;
}

export interface CreateLeadResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  code?: string;
}

export type LeadRecord = {
  id?: string;
  mobile_number?: string;
  full_name?: string;
  pan?: string;
  category?: string;
};

/** Same-origin BFF — browser never calls Nest directly. */
export function getLeadsApiBase(): string {
  return "/api/leads";
}
