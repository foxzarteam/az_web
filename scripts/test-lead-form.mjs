/**
 * Keep in sync with app/lib/leads/leadForm.ts
 */
const LEAD_PAN_PATTERN = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
const LEAD_NAME_PATTERN = /^[a-zA-Z\s.]+$/;
const LEAD_PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function validatePincode(pincode) {
  const pin = String(pincode).replace(/\D/g, "");
  if (!pin) return "Pincode is required";
  if (pin.length !== 6) return "Pincode must be 6 digits";
  if (!LEAD_PINCODE_PATTERN.test(pin)) return "Enter a valid Indian pincode (e.g. 302002)";
  return undefined;
}

function validatePanNameMobile(pan, mobileDigits, fullName) {
  const errors = {};
  const panTrim = String(pan).trim().toUpperCase();
  if (!panTrim) errors.pan = "PAN is required";
  else if (!LEAD_PAN_PATTERN.test(panTrim)) errors.pan = "Invalid PAN";
  const m = String(mobileDigits).replace(/\D/g, "");
  if (!m) errors.mobile = "Mobile number is required";
  else if (m.length !== 10) errors.mobile = "Enter a valid 10-digit mobile number";
  else if (!/^[6-9]/.test(m)) errors.mobile = "Mobile number must start with 6, 7, 8, or 9";
  const n = String(fullName).trim();
  if (!n) errors.fullName = "Full name is required";
  else if (!LEAD_NAME_PATTERN.test(n)) errors.fullName = "Name should not contain special characters or numbers";
  return errors;
}

assert(LEAD_PAN_PATTERN.test("ABCDE1234F") === true, "valid PAN");
assert(LEAD_PAN_PATTERN.test("ABCDE12345") === false, "invalid PAN");
assert(validatePincode("302002") === undefined, "valid pin");
assert(Boolean(validatePincode("000001")), "pin cannot start with 0");
assert(Boolean(validatePincode("12")), "short pin");
const ok = validatePanNameMobile("ABCDE1234F", "9876543210", "Raju Patel");
assert(Object.keys(ok).length === 0, "valid applicant");
const bad = validatePanNameMobile("ABCDE1234F", "1876543210", "Raju");
assert(Boolean(bad.mobile), "mobile must start 6-9");
const name = validatePanNameMobile("ABCDE1234F", "9876543210", "Raju123");
assert(Boolean(name.fullName), "name rejects digits");

console.log("test-lead-form: ok");
