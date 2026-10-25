export interface CreateLeadRequest {
  pan: string;
  mobileNumber: string;
  fullName: string;
  /** Service slug with underscores (personal-loan → personal_loan). */
  category: string;
  userId?: string;
  email?: string;
  pincode?: string;
  requiredAmount?: number;
  loanAmt?: string;
  insType?: string;
  netMonthlyIncome?: number;
  employmentType?: string;
  referralCode?: string;
  cibilBand?: string;
  vehicleCategory?: string;
  hasExistingEmi?: boolean;
  totalMonthlyEmi?: number;
  /** True only when the applicant checked the lead-form consent box. */
  consentAccepted: boolean;
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
