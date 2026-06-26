/**
 * Shared validation + sanitizers for lead forms (hero modal, service pages).
 * Keeps API payload rules in one place.
 */

export const LEAD_PAN_PATTERN = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
export const LEAD_NAME_PATTERN = /^[a-zA-Z\s.]+$/;

export function sanitizeLeadPanInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
}

export function sanitizeLeadNameInput(raw: string): string {
  return raw.replace(/[^a-zA-Z\s.]/g, "");
}

export function sanitizeLeadAadhaarInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 12);
}

export type LeadFieldErrors = Partial<{
  pan: string;
  mobile: string;
  fullName: string;
  aadhaar: string;
  service: string;
}>;

export function validateLeadPanNameMobile(params: {
  pan: string;
  mobileDigits: string;
  fullName: string;
}): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  const panTrim = params.pan.trim().toUpperCase();
  if (!panTrim) errors.pan = "PAN is required";
  else if (!LEAD_PAN_PATTERN.test(panTrim)) {
    errors.pan = "Invalid PAN (e.g. ABCDE1234F – 5 letters, 4 digits, 1 letter)";
  }

  const m = params.mobileDigits.replace(/\D/g, "");
  if (!m) errors.mobile = "Mobile number is required";
  else if (m.length !== 10) errors.mobile = "Enter a valid 10-digit mobile number";
  else if (!/^[6-9]/.test(m)) {
    errors.mobile = "Mobile number must start with 6, 7, 8, or 9";
  }

  const n = params.fullName.trim();
  if (!n) errors.fullName = "Full name is required";
  else if (!LEAD_NAME_PATTERN.test(n)) {
    errors.fullName = "Name should not contain special characters or numbers";
  }

  return errors;
}

export function validateLeadApplicantDetails(params: {
  pan: string;
  mobileDigits: string;
  fullName: string;
  aadhaar: string;
  service: string;
}): LeadFieldErrors {
  const errors = validateLeadPanNameMobile(params);

  const a = params.aadhaar.replace(/\D/g, "");
  if (!a) errors.aadhaar = "Aadhaar is required";
  else if (a.length !== 12) errors.aadhaar = "Enter valid 12-digit Aadhaar number";

  if (!params.service.trim()) errors.service = "Please select a service";

  return errors;
}
