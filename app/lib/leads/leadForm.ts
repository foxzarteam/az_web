/**
 * Shared validation + sanitizers for lead forms (hero modal, service pages).
 * Eligibility limits live in ./loan-rules.ts so the website deploy does not need the API repo.
 */
export {
  MIN_NET_MONTHLY_INCOME,
  MIN_VEHICLE_NET_MONTHLY_INCOME,
  MSG_CIBIL_BELOW,
  MSG_CIBIL_BELOW_600,
  MSG_EMI_HALF,
  MSG_NET_INCOME_MIN,
  MSG_VEHICLE_NET_INCOME_MIN,
  SELECTABLE_CIBIL_BANDS,
  SELECTABLE_VEHICLE_CIBIL_BANDS,
  isVehicleLoanCategory,
  loanNotEligibleMessage,
  selectableCibilBands,
} from "./loan-rules.ts";

import {
  MIN_NET_MONTHLY_INCOME,
  MIN_VEHICLE_NET_MONTHLY_INCOME,
  MSG_NET_INCOME_MIN,
  MSG_VEHICLE_NET_INCOME_MIN,
  selectableCibilBands,
} from "./loan-rules.ts";

export const FALLBACK_VEHICLE_CATEGORIES = [
  { value: "new_car", label: "New Car", image: "car.webp" },
  { value: "used_car", label: "Used Car", image: "used_car.webp" },
  { value: "taxi", label: "Taxi", image: "taxi.webp" },
  { value: "tractor", label: "Tractor", image: "tractor.webp" },
  { value: "commercial_vehicle", label: "Commercial Vehicle", image: "commercial.webp" },
  { value: "construction_equipment", label: "Construction Equipment", image: "construction.webp" },
] as const;

export function vehicleCategoryImageSrc(image?: string | null): string {
  const name = String(image ?? "").trim();
  if (!name) return "";
  if (/^https?:\/\//i.test(name) || name.startsWith("/")) return name;
  return `/images/vehicle/${name}`;
}

export function vehicleCategoryLabel(value: unknown): string {
  const key = String(value ?? "").trim().toLowerCase();
  const found = FALLBACK_VEHICLE_CATEGORIES.find((item) => item.value === key);
  if (found) return found.label;
  if (!key) return "—";
  return key.replace(/[_-]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

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
  if (value === "above_650") return "Above 650";
  if (value === "below_650") return "Below 650";
  if (value === "above_600") return "Above 600";
  if (value === "below_600") return "Below 600";
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
  vehicleCategory: string;
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

function formMoney(raw: string): number {
  return Number(String(raw).replace(/,/g, "").trim());
}

export function netMonthlyIncomeError(value: string, min = MIN_NET_MONTHLY_INCOME): string | undefined {
  const raw = String(value).replace(/,/g, "").trim();
  const incomeNum = formMoney(raw);
  const message =
    min === MIN_VEHICLE_NET_MONTHLY_INCOME ? MSG_VEHICLE_NET_INCOME_MIN : MSG_NET_INCOME_MIN;
  if (!raw || !Number.isFinite(incomeNum) || incomeNum < min) {
    return message;
  }
  return undefined;
}

export function validatePersonalLoanEmployment(
  netMonthlyIncome: string,
  employmentType = "",
  minIncome = MIN_NET_MONTHLY_INCOME,
): Pick<LeadFieldErrors, "netMonthlyIncome" | "employmentType"> {
  const errors: Pick<LeadFieldErrors, "netMonthlyIncome" | "employmentType"> = {};
  const incomeErr = netMonthlyIncomeError(netMonthlyIncome, minIncome);
  if (incomeErr) errors.netMonthlyIncome = incomeErr;
  if (
    employmentType &&
    employmentType !== "salaried" &&
    employmentType !== "salaried_bank" &&
    employmentType !== "salaried_cash" &&
    employmentType !== "self_employed"
  ) {
    errors.employmentType = "Select employment type";
  }

  return errors;
}

/** Loan profile on the single apply form. Vehicle loans skip EMI and still ask employment. */
export function validateLoanFinishStep(values: {
  netMonthlyIncome: string;
  employmentType?: string;
  cibilBand: string;
  hasExistingEmi: string;
  totalMonthlyEmi: string;
  vehicle?: boolean;
}): Pick<
  LeadFieldErrors,
  "netMonthlyIncome" | "employmentType" | "cibilBand" | "hasExistingEmi" | "totalMonthlyEmi"
> {
  const errors: Pick<
    LeadFieldErrors,
    "netMonthlyIncome" | "employmentType" | "cibilBand" | "hasExistingEmi" | "totalMonthlyEmi"
  > = {
    ...validatePersonalLoanEmployment(
      values.netMonthlyIncome,
      values.employmentType ?? "",
      values.vehicle ? MIN_VEHICLE_NET_MONTHLY_INCOME : MIN_NET_MONTHLY_INCOME,
    ),
  };
  const bands = selectableCibilBands(values.vehicle ? "vehicle_loan" : "personal_loan");
  if (!(bands as readonly string[]).includes(values.cibilBand)) {
    errors.cibilBand = "Select your CIBIL score";
  }
  const employment = values.employmentType ?? "";
  if (
    employment !== "salaried" &&
    employment !== "salaried_bank" &&
    employment !== "salaried_cash" &&
    employment !== "self_employed"
  ) {
    errors.employmentType = "Select employment type";
  }
  if (values.vehicle) return errors;
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
    errors.mobile = "Enter a valid phone number";
  }

  const n = params.fullName.trim();
  if (!n) errors.fullName = "Full name is required";
  else if (!LEAD_NAME_PATTERN.test(n)) {
    errors.fullName = "Name should not contain special characters or numbers";
  }

  return errors;
}
