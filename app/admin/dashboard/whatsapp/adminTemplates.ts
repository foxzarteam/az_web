export const ADMIN_TEMPLATES = [
  { id: "vehicle_refinance_kyc", label: "Loan on Existing Car (Refinance)", dot: "#2563eb" },
  { id: "vehicle_purchase_kyc", label: "New / Used Car Loan (Purchase)", dot: "#ea580c" },
  { id: "personal_loan_kyc", label: "Personal Loan (PL KYC)", dot: "#128C7E" },
  { id: "document_pending_reminder", label: "Reminder: Documents Pending", dot: "#d97706" },
  { id: "call_not_answered_followup", label: "Reminder: Call Not Answered", dot: "#7c3aed" },
  { id: "reject_template", label: "Reject Application", dot: "#dc2626" },
] as const;

export function isAdminTemplateId(value: string): boolean {
  return ADMIN_TEMPLATES.some((item) => item.id === value);
}
