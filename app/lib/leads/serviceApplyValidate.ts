import {
  validateLeadEmail,
  validateLeadPanNameMobile,
  validateLeadPincode,
  validateUsedCarExtras,
  type LeadFieldErrors,
} from "./leadForm.ts";
import { validatePersonalLoanApplyForm } from "./personalLoanApply.ts";

export type AmountBounds = { min: number; max: number };

export function loanAmountRangeError(
  amount: number,
  bounds: AmountBounds | undefined,
  opts?: { missingRange?: boolean },
): string {
  if (opts?.missingRange) return "Amount range is not available for this loan.";
  if (!bounds || !(amount > 0)) return "";
  if (amount < bounds.min) return `Enter at least ₹${bounds.min.toLocaleString("en-IN")}`;
  if (amount > bounds.max) return `Enter up to ₹${bounds.max.toLocaleString("en-IN")}`;
  return "";
}

export function reportTermsIfUnchecked(accepted: boolean, id = "service-terms"): boolean {
  if (accepted) return true;
  const termsEl = typeof document === "undefined" ? null : document.getElementById(id);
  if (termsEl instanceof HTMLInputElement) {
    termsEl.setCustomValidity("Please tick the checkbox to continue.");
    termsEl.reportValidity();
  }
  return false;
}

export function collectServiceApplyErrors(input: {
  pan: string;
  mobile: string;
  fullName: string;
  pincode: string;
  email: string;
  service: string;
  showLoanAmount: boolean;
  loanTabs: boolean;
  loanProductsCount: number;
  loanBounds?: AmountBounds;
  loanAmount: number;
  netMonthlyIncome: string;
  cibilBand: string;
  employmentType: string;
  hasExistingEmi: "" | "yes" | "no";
  monthlyEmiAmount: number;
  vehicleLoan: boolean;
  skipCibil?: boolean;
  carDetails?: string;
  vehicleRc?: string;
  existingCarLoan?: "" | "yes" | "no";
  vehicleCategory: string;
  showInsuranceType: boolean;
  insType: string;
  selectedCategory: string;
}): LeadFieldErrors {
  const errors: LeadFieldErrors = validateLeadPanNameMobile({
    pan: input.pan,
    mobileDigits: input.mobile.replace(/\D/g, ""),
    fullName: input.fullName,
  });
  if (!input.service.trim()) errors.service = "Product could not be detected for this page";
  const pinDigits = input.pincode.replace(/\D/g, "");
  const pinErr = pinDigits ? validateLeadPincode(input.pincode) : undefined;
  if (pinErr) errors.pincode = pinErr;
  if (input.showLoanAmount && input.loanTabs && input.loanProductsCount > 0 && !input.loanBounds) {
    errors.loanAmt = "Amount range is not available for this loan.";
  } else if (input.showLoanAmount) {
    Object.assign(
      errors,
      validatePersonalLoanApplyForm(
        {
          pan: input.pan,
          mobile: input.mobile,
          fullName: input.fullName,
          pincode: input.pincode,
          loanAmount: input.loanAmount,
          netMonthlyIncome: input.netMonthlyIncome,
          cibilBand: input.cibilBand,
          employmentType: input.employmentType,
          hasExistingEmi: input.hasExistingEmi,
          totalMonthlyEmi:
            input.vehicleLoan || input.hasExistingEmi === "no" ? "0" : String(input.monthlyEmiAmount),
        },
        input.loanBounds,
        input.vehicleLoan,
        input.skipCibil,
      ),
    );
    if (input.vehicleLoan && !input.vehicleCategory.trim()) {
      errors.vehicleCategory = "Select vehicle category";
    }
    if (input.skipCibil) {
      Object.assign(
        errors,
        validateUsedCarExtras({
          carDetails: input.carDetails,
          vehicleRc: input.vehicleRc,
          existingCarLoan: input.existingCarLoan,
        }),
      );
    }
  }
  if (input.showInsuranceType && !input.insType.trim()) errors.insType = "Please select insurance type";
  if (input.selectedCategory === "credit_card") {
    const emailErr = validateLeadEmail(input.email);
    if (emailErr) errors.email = emailErr;
  }
  return errors;
}

export function serviceApplyHasFieldError(
  errors: LeadFieldErrors,
  loanAmtError: string,
): boolean {
  return Boolean(
    errors.fullName ||
      errors.pan ||
      errors.mobile ||
      errors.pincode ||
      loanAmtError ||
      errors.loanAmt ||
      errors.netMonthlyIncome ||
      errors.employmentType ||
      errors.hasExistingEmi ||
      errors.totalMonthlyEmi ||
      errors.cibilBand ||
      errors.carDetails ||
      errors.vehicleRc ||
      errors.existingCarLoan ||
      errors.vehicleCategory ||
      errors.insType ||
      errors.email,
  );
}
