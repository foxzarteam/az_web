/**
 * Imports the real form rules. Run with Node's type stripper.
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  LEAD_PAN_PATTERN,
  MIN_NET_MONTHLY_INCOME,
  loanNotEligibleMessage,
  MIN_VEHICLE_NET_MONTHLY_INCOME,
  MSG_CIBIL_BELOW,
  MSG_CIBIL_BELOW_650,
  MSG_EMI_HALF,
  MSG_SALARY_CASH,
  SELECTABLE_CIBIL_BANDS,
  netMonthlyIncomeError,
  validateCreditCardExtras,
  validateLeadPanNameMobile,
  validateLeadPincode,
  validateLoanFinishStep,
} from "../app/lib/leads/leadForm.ts";
import {
  collectServiceApplyErrors,
  loanAmountRangeError,
  serviceApplyHasFieldError,
} from "../app/lib/leads/serviceApplyValidate.ts";

assert.equal(LEAD_PAN_PATTERN.test("ABCDE1234F"), true);
assert.equal(LEAD_PAN_PATTERN.test("ABCDE12345"), false);
assert.equal(validateLeadPincode("302002"), undefined);
assert.ok(validateLeadPincode("000001"));
assert.ok(validateLeadPincode("12"));

const ok = validateLeadPanNameMobile({
  pan: "ABCDE1234F",
  mobileDigits: "9876543210",
  fullName: "Raju Patel",
});
assert.equal(Object.keys(ok).length, 0);
const bad = validateLeadPanNameMobile({
  pan: "ABCDE1234F",
  mobileDigits: "1876543210",
  fullName: "Raju",
});
assert.ok(bad.mobile);
const name = validateLeadPanNameMobile({
  pan: "ABCDE1234F",
  mobileDigits: "9876543210",
  fullName: "Raju123",
});
assert.ok(name.fullName);

assert.deepEqual([...SELECTABLE_CIBIL_BANDS], ["above_700", "below_700"]);
assert.equal(MIN_NET_MONTHLY_INCOME, 18000);
assert.equal(netMonthlyIncomeError("17999"), "Net monthly income must be at least ₹18,000");
assert.equal(netMonthlyIncomeError("18000"), undefined);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 50000, cibilBand: "below_700", hasExistingEmi: false, totalMonthlyEmi: 0 }),
  MSG_CIBIL_BELOW,
);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 50000, cibilBand: "below_680", hasExistingEmi: false, totalMonthlyEmi: 0 }),
  MSG_CIBIL_BELOW,
);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 40000, cibilBand: "above_700", hasExistingEmi: true, totalMonthlyEmi: 20000 }),
  MSG_EMI_HALF,
);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 40000, cibilBand: "unknown", hasExistingEmi: true, totalMonthlyEmi: 19999 }),
  MSG_CIBIL_BELOW,
);
assert.equal(
  loanNotEligibleMessage({
    netMonthlyIncome: 50000,
    employmentType: "salaried_cash",
    cibilBand: "above_700",
    hasExistingEmi: false,
    totalMonthlyEmi: 0,
  }),
  MSG_SALARY_CASH,
);
assert.equal(
  loanNotEligibleMessage({
    netMonthlyIncome: 50000,
    employmentType: "salaried_bank",
    cibilBand: "above_700",
    hasExistingEmi: false,
    totalMonthlyEmi: 0,
  }),
  null,
);
assert.equal(
  loanNotEligibleMessage({
    category: "credit_card",
    netMonthlyIncome: 20000,
    cibilBand: "below_700",
    hasExistingEmi: false,
    totalMonthlyEmi: 0,
  }),
  MSG_CIBIL_BELOW,
);
assert.equal(
  loanNotEligibleMessage({
    category: "credit_card",
    netMonthlyIncome: 20000,
    cibilBand: "above_700",
    hasExistingEmi: false,
    totalMonthlyEmi: 0,
  }),
  null,
);
assert.equal(MIN_VEHICLE_NET_MONTHLY_INCOME, 10000);
assert.equal(netMonthlyIncomeError("9999", 10000), "Net monthly income must be at least ₹10,000");
assert.equal(netMonthlyIncomeError("10000", 10000), undefined);
assert.equal(
  validateLoanFinishStep({
    netMonthlyIncome: "10000",
    employmentType: "salaried_bank",
    cibilBand: "above_700",
    hasExistingEmi: "no",
    totalMonthlyEmi: "0",
    skipCibil: true,
    category: "credit_card",
  }).netMonthlyIncome,
  undefined,
);
assert.equal(
  validateLoanFinishStep({
    netMonthlyIncome: "9999",
    employmentType: "salaried_bank",
    cibilBand: "above_700",
    hasExistingEmi: "no",
    totalMonthlyEmi: "0",
    skipCibil: true,
    category: "credit_card",
  }).netMonthlyIncome,
  "Net monthly income must be at least ₹10,000",
);
assert.equal(
  loanNotEligibleMessage({
    category: "vehicle_loan",
    netMonthlyIncome: 20000,
    cibilBand: "below_650",
    hasExistingEmi: false,
    totalMonthlyEmi: 0,
  }),
  MSG_CIBIL_BELOW_650,
);
assert.equal(
  loanNotEligibleMessage({
    category: "vehicle_loan",
    netMonthlyIncome: 20000,
    cibilBand: "above_650",
    hasExistingEmi: true,
    totalMonthlyEmi: 15000,
  }),
  null,
);
const vehicleFinish = validateLoanFinishStep({
  netMonthlyIncome: "10000",
  employmentType: "salaried_bank",
  cibilBand: "above_650",
  hasExistingEmi: "",
  totalMonthlyEmi: "",
  vehicle: true,
});
assert.equal(Object.keys(vehicleFinish).length, 0);
const vehicleMissingJob = validateLoanFinishStep({
  netMonthlyIncome: "10000",
  cibilBand: "above_650",
  hasExistingEmi: "",
  totalMonthlyEmi: "",
  vehicle: true,
});
assert.equal(vehicleMissingJob.employmentType, "Select employment type");

const finish = validateLoanFinishStep({
  netMonthlyIncome: "20000",
  employmentType: "salaried_bank",
  cibilBand: "above_700",
  hasExistingEmi: "no",
  totalMonthlyEmi: "",
});
assert.equal(Object.keys(finish).length, 0);
const low = validateLoanFinishStep({
  netMonthlyIncome: "15000",
  employmentType: "salaried",
  cibilBand: "",
  hasExistingEmi: "",
  totalMonthlyEmi: "",
});
assert.ok(low.netMonthlyIncome);
assert.equal(low.employmentType, undefined);

const serverRulesPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../server/src/leads/loan-rules.ts");
if (existsSync(serverRulesPath)) {
  const api = await import(pathToFileURL(serverRulesPath).href);
  assert.equal(api.MIN_NET_MONTHLY_INCOME, MIN_NET_MONTHLY_INCOME);
  assert.equal(api.MIN_VEHICLE_NET_MONTHLY_INCOME, MIN_VEHICLE_NET_MONTHLY_INCOME);
  assert.equal(api.MSG_CIBIL_BELOW, MSG_CIBIL_BELOW);
  assert.equal(api.MSG_CIBIL_BELOW_650, MSG_CIBIL_BELOW_650);
  assert.equal(api.MSG_EMI_HALF, MSG_EMI_HALF);
  assert.equal(api.MSG_SALARY_CASH, MSG_SALARY_CASH);
  const sample = {
    category: "personal_loan",
    netMonthlyIncome: 20000,
    cibilBand: "below_680",
    hasExistingEmi: false,
    totalMonthlyEmi: 0,
  };
  assert.equal(api.loanNotEligibleMessage(sample), loanNotEligibleMessage(sample));
  const vehicle = { ...sample, category: "vehicle_loan", cibilBand: "below_650" };
  assert.equal(api.loanNotEligibleMessage(vehicle), loanNotEligibleMessage(vehicle));
}

assert.equal(
  loanAmountRangeError(40000, { min: 50000, max: 500000 }),
  "Enter at least ₹50,000",
);
assert.equal(loanAmountRangeError(60000, { min: 50000, max: 500000 }), "");
const applyErrors = collectServiceApplyErrors({
  pan: "ABCDE1234F",
  mobile: "9876543210",
  fullName: "Raju Patel",
  pincode: "302002",
  email: "",
  service: "Personal Loan",
  showLoanAmount: true,
  loanTabs: false,
  loanProductsCount: 0,
  loanBounds: { min: 50000, max: 500000 },
  loanAmount: 10000,
  netMonthlyIncome: "20000",
  cibilBand: "above_700",
  employmentType: "salaried_bank",
  hasExistingEmi: "no",
  monthlyEmiAmount: 0,
  vehicleLoan: false,
  vehicleCategory: "",
  showInsuranceType: false,
  insType: "",
  selectedCategory: "personal_loan",
});
assert.ok(applyErrors.loanAmt);
assert.equal(serviceApplyHasFieldError(applyErrors, applyErrors.loanAmt ?? ""), true);

assert.equal(validateCreditCardExtras({ creditCardKind: "" }).creditCardKind, "Select Fixed Deposit Credit Card or Normal Credit Card");
assert.equal(validateCreditCardExtras({ creditCardKind: "fd", fdAmount: "" }).fdAmount, "Enter FD amount");
assert.equal(validateCreditCardExtras({ creditCardKind: "fd", fdAmount: "4999" }).fdAmount, "FD amount must be at least ₹5,000");
assert.equal(validateCreditCardExtras({ creditCardKind: "fd", fdAmount: "5000" }).fdAmount, undefined);
assert.equal(validateCreditCardExtras({ creditCardKind: "fd", fdAmount: "50000" }).fdAmount, undefined);
assert.equal(validateCreditCardExtras({ creditCardKind: "normal", cibilBand: "" }).cibilBand, "Select your CIBIL score");
assert.equal(validateCreditCardExtras({ creditCardKind: "normal", cibilBand: "unknown" }).cibilBand, "Select your CIBIL score");
assert.equal(Object.keys(validateCreditCardExtras({ creditCardKind: "normal", cibilBand: "above_700" })).length, 0);
assert.equal(Object.keys(validateCreditCardExtras({ creditCardKind: "normal", cibilBand: "below_700" })).length, 0);

console.log("test-lead-form: ok");
