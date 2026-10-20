/**
 * Shared validation + sanitizers for lead forms (hero modal, service pages).
 * Keeps API payload rules in one place.
 */

export const LOAN_AMOUNT_OPTIONS = [
  { value: "25000_100000", label: "₹25,000 - ₹1,00,000" },
  { value: "100000_200000", label: "₹1,00,000 - ₹2,00,000" },
  { value: "200000_300000", label: "₹2,00,000 - ₹3,00,000" },
  { value: "300000_400000", label: "₹3,00,000 - ₹4,00,000" },
  { value: "400000_500000", label: "₹4,00,000 - ₹5,00,000" },
  { value: "500000_600000", label: "₹5,00,000 - ₹6,00,000" },
  { value: "600000_700000", label: "₹6,00,000 - ₹7,00,000" },
  { value: "700000_800000", label: "₹7,00,000 - ₹8,00,000" },
  { value: "800000_900000", label: "₹8,00,000 - ₹9,00,000" },
  { value: "900000_1000000", label: "₹9,00,000 - ₹10,00,000" },
] as const;

export const INSURANCE_TYPE_OPTIONS = [
  { value: "health_insurance", label: "Health Insurance", image: "health.svg" },
  { value: "health_renewal", label: "Health Renewal", image: "health_renewal.svg" },
  { value: "bike_insurance", label: "Bike Insurance", image: "bike.svg" },
  { value: "vehicle_insurance", label: "Vehicle Insurance", image: "car.svg" },
  { value: "pcv_insurance", label: "PCV Insurance", image: "pcv.svg" },
  { value: "gcv_insurance", label: "GCV Insurance", image: "gcv.svg" },
  { value: "travel_insurance", label: "Travel Insurance", image: "travel.svg" },
  { value: "life_insurance", label: "Life Insurance", image: "life.svg" },
  { value: "personal_accident_insurance", label: "Personal Accident Insurance", image: "pa.svg" },
  { value: "miscd_insurance", label: "MISC-D Insurance", image: "miscd.svg" },
  { value: "third_party_bike_insurance", label: "Third Party Bike Insurance", image: "third-party-bike-insurance.svg" },
  { value: "third_party_pvt_vehicle_insurance", label: "Third Party Pvt Vehicle Insurance", image: "third-party-pvt-car-insurance.svg" },
  { value: "third_party_pcv_insurance", label: "Third Party PCV Insurance", image: "third-party-pcv-insurance.svg" },
  { value: "third_party_gcv_insurance", label: "Third Party GCV Insurance", image: "third-party-gcv-insurance.svg" },
  { value: "third_party_miscd_insurance", label: "Third Party MISC-D Insurance", image: "third-party-miscd-insurance.svg" },
  { value: "marine_insurance", label: "Marine Insurance", image: "home_marine_icon.svg" },
  { value: "pet_insurance", label: "Pet Insurance", image: "pet-insurance.svg" },
  { value: "cyber_insurance", label: "Cyber Insurance", image: "cyber-insurance.svg" },
] as const;

/** DB stores the file name. A path or URL is used as-is. */
export function insuranceTypeImageSrc(image?: string | null): string {
  const name = String(image ?? "").trim();
  if (!name) return "";
  if (/^https?:\/\//i.test(name) || name.startsWith("/")) return name;
  return `/images/insurance/${name}`;
}

export function loanAmountLabel(value: string): string {
  return LOAN_AMOUNT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function insuranceTypeLabel(value: string): string {
  const key = value.trim().toLowerCase();
  if (key === "car_insurance" || key === "vehicle_insurance") return "Vehicle Insurance";
  if (key === "third_party_pvt_car_insurance" || key === "third_party_pvt_vehicle_insurance") {
    return "Third Party Pvt Vehicle Insurance";
  }
  const found = INSURANCE_TYPE_OPTIONS.find((o) => o.value === value)?.label;
  if (found) return found;
  const v = value.trim();
  if (!v) return value;
  return v.replace(/[_-]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export const LEAD_PAN_PATTERN = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
export const LEAD_NAME_PATTERN = /^[a-zA-Z\s.]+$/;
/** India PIN: 6 digits, first digit 1–9 (not 000000 / starting with 0). */
export const LEAD_PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function sanitizeLeadPanInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
}

export function sanitizeLeadNameInput(raw: string): string {
  return raw.replace(/[^a-zA-Z\s.]/g, "");
}

export function sanitizeLeadPincodeInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 6);
}

function isLoanCategory(category: unknown): boolean {
  return String(category ?? "").trim().toLowerCase().endsWith("_loan");
}

/** Old loan rows have a null employment column. Show and edit them as Salaried. */
export function employmentTypeLabel(value: unknown, category?: unknown): string {
  if (value === "salaried_bank") return "Salaried (Bank Account Transfer)";
  if (value === "salaried_cash") return "Salaried (Cash / Cheque)";
  if (value === "self_employed") return "Self-Employed / Business";
  if (value === "salaried" || (isLoanCategory(category) && !String(value ?? "").trim())) {
    return "Salaried";
  }
  return "—";
}

export function cibilBandLabel(value: unknown): string {
  if (value === "above_680") return "Above 680";
  if (value === "below_680") return "Below 680";
  if (value === "unknown") return "I do not know";
  return "—";
}

/** Form value for a stored lead. Blank only when this is not a loan. */
export function employmentTypeForForm(value: unknown, category?: unknown): string {
  if (
    value === "self_employed" ||
    value === "salaried" ||
    value === "salaried_bank" ||
    value === "salaried_cash"
  ) {
    return value;
  }
  if (isLoanCategory(category)) return "salaried";
  return "";
}

export type LeadFieldErrors = Partial<{
  pan: string;
  mobile: string;
  fullName: string;
  service: string;
  loanAmt: string;
  insType: string;
  netMonthlyIncome: string;
  employmentType: string;
  cibilBand: string;
  hasExistingEmi: string;
  totalMonthlyEmi: string;
  pincode: string;
}>;

export function validateLeadPincode(pincode: string): string | undefined {
  const pin = pincode.replace(/\D/g, "");
  if (!pin) return "Pincode is required";
  if (pin.length !== 6) return "Pincode must be 6 digits";
  if (!LEAD_PINCODE_PATTERN.test(pin)) {
    return "Enter a valid Indian pincode (e.g. 302002)";
  }
  return undefined;
}

/** Loan apply: income must be at least ₹18,000. */
export const MIN_NET_MONTHLY_INCOME = 18000;

export function netMonthlyIncomeError(value: string): string | undefined {
  const raw = String(value).replace(/,/g, "").trim();
  if (!raw) return "Net monthly income must be at least ₹18,000";
  const incomeNum = Number(raw);
  if (!Number.isFinite(incomeNum) || incomeNum < MIN_NET_MONTHLY_INCOME) {
    return "Net monthly income must be at least ₹18,000";
  }
  return undefined;
}

/** CIBIL below 680, or existing EMI at least half of net income. */
export function loanNotEligibleMessage(values: {
  netMonthlyIncome: string;
  cibilBand: string;
  hasExistingEmi: string;
  totalMonthlyEmi: string;
}): string | null {
  const income = Number(String(values.netMonthlyIncome).replace(/,/g, "").trim());
  if (!Number.isFinite(income) || income <= 0) return null;
  if (values.cibilBand === "below_680") {
    return "Sorry, you are not eligible for this loan. A CIBIL score below 680 does not meet the current criteria.";
  }
  const emi =
    values.hasExistingEmi === "yes"
      ? Number(String(values.totalMonthlyEmi).replace(/,/g, "").trim())
      : 0;
  if (values.hasExistingEmi === "yes" && Number.isFinite(emi) && emi * 2 >= income) {
    return "Sorry, you are not eligible for this loan. Your existing EMI is half or more of your net monthly income.";
  }
  return null;
}

export function validatePersonalLoanEmployment(
  netMonthlyIncome: string,
  employmentType = "",
): Pick<LeadFieldErrors, "netMonthlyIncome" | "employmentType"> {
  const errors: Pick<LeadFieldErrors, "netMonthlyIncome" | "employmentType"> = {};
  const incomeErr = netMonthlyIncomeError(netMonthlyIncome);
  if (incomeErr) errors.netMonthlyIncome = incomeErr;
  if (employmentType !== "salaried_bank" && employmentType !== "salaried_cash" && employmentType !== "self_employed") {
    errors.employmentType = "Select employment type";
  }

  return errors;
}

/** Finish step of the loan form. CIBIL report is optional and checked separately. */
export function validateLoanFinishStep(values: {
  netMonthlyIncome: string;
  employmentType: string;
  cibilBand: string;
  hasExistingEmi: string;
  totalMonthlyEmi: string;
}): Pick<
  LeadFieldErrors,
  "netMonthlyIncome" | "employmentType" | "cibilBand" | "hasExistingEmi" | "totalMonthlyEmi"
> {
  const errors: Pick<
    LeadFieldErrors,
    "netMonthlyIncome" | "employmentType" | "cibilBand" | "hasExistingEmi" | "totalMonthlyEmi"
  > = {
    ...validatePersonalLoanEmployment(values.netMonthlyIncome, values.employmentType),
  };
  if (values.cibilBand !== "above_680" && values.cibilBand !== "below_680" && values.cibilBand !== "unknown") {
    errors.cibilBand = "Select your CIBIL score";
  }
  if (values.hasExistingEmi !== "yes" && values.hasExistingEmi !== "no") {
    errors.hasExistingEmi = "Select yes or no";
  } else if (values.hasExistingEmi === "yes") {
    const emi = Number(String(values.totalMonthlyEmi).replace(/,/g, "").trim());
    if (!String(values.totalMonthlyEmi).trim() || !Number.isFinite(emi) || emi < 1) {
      errors.totalMonthlyEmi = "Enter the total monthly EMI you pay";
    }
  }
  return errors;
}

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
