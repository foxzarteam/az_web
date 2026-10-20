/**
 * Imports the real form rules. Run with Node's type stripper.
 */
import assert from "node:assert/strict";
import {
  LEAD_PAN_PATTERN,
  MIN_NET_MONTHLY_INCOME,
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
assert.ok(low.employmentType);

console.log("test-lead-form: ok");
