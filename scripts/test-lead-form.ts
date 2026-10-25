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
  netMonthlyIncomeError,
  validateLeadPanNameMobile,
  validateLeadPincode,
  validateLoanFinishStep,
} from "../app/lib/leads/leadForm.ts";

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

assert.equal(MIN_NET_MONTHLY_INCOME, 18000);
assert.equal(netMonthlyIncomeError("17999"), "Net monthly income must be at least ₹18,000");
assert.equal(netMonthlyIncomeError("18000"), undefined);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 50000, cibilBand: "below_680", hasExistingEmi: false, totalMonthlyEmi: 0 }),
  MSG_CIBIL_BELOW,
);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 40000, cibilBand: "above_680", hasExistingEmi: true, totalMonthlyEmi: 20000 }),
  MSG_EMI_HALF,
);
assert.equal(
  loanNotEligibleMessage({ netMonthlyIncome: 40000, cibilBand: "unknown", hasExistingEmi: true, totalMonthlyEmi: 19999 }),
  null,
);
assert.equal(MIN_VEHICLE_NET_MONTHLY_INCOME, 10000);
assert.equal(netMonthlyIncomeError("9999", 10000), "Net monthly income must be at least ₹10,000");
assert.equal(netMonthlyIncomeError("10000", 10000), undefined);
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
  cibilBand: "above_650",
  hasExistingEmi: "",
  totalMonthlyEmi: "",
  vehicle: true,
});
assert.equal(Object.keys(vehicleFinish).length, 0);

const finish = validateLoanFinishStep({
  netMonthlyIncome: "20000",
  employmentType: "salaried_bank",
  cibilBand: "above_680",
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

console.log("test-lead-form: ok");
