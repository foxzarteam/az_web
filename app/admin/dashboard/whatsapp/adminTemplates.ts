export const ADMIN_TEMPLATES = [
  { id: "application_kyc", label: "Application KYC", dot: "#027a69" },
  { id: "vehicle_refinance_kyc", label: "Vehicle KYC (RC Wala)", dot: "#2563eb" },
  { id: "vehicle_purchase_kyc", label: "Vehicle Purchase KYC (Quotation Wala)", dot: "#ea580c" },
  { id: "personal_loan_kyc", label: "Personal Loan KYC", dot: "#128C7E" },
  { id: "document_pending_reminder", label: "Document Pending Reminder", dot: "#d97706" },
  { id: "call_not_answered_followup", label: "Call Not Answered", dot: "#7c3aed" },
] as const;

export function isAdminTemplateId(value: string): boolean {
  return ADMIN_TEMPLATES.some((item) => item.id === value);
}
