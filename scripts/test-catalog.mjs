/**
 * Catalog rules — keep in sync with app/lib/services/allowedProducts.ts
 * and app/lib/services/parseApiResponse.ts
 */
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const REDIRECTED = new Set(["home-loan", "credit-card", "business-loan"]);
const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPublicProductSlug(slug) {
  const s = String(slug ?? "")
    .trim()
    .toLowerCase();
  return PRODUCT_SLUG_PATTERN.test(s) && !REDIRECTED.has(s);
}

function slugToLeadCategory(slug) {
  const s = String(slug ?? "")
    .trim()
    .toLowerCase();
  if (!s) return "personal_loan";
  return s.replace(/-/g, "_");
}

assert(isPublicProductSlug("gold-loan") === true, "new service slug allowed");
assert(isPublicProductSlug("insurance") === true, "insurance allowed");
assert(isPublicProductSlug("personal-loan") === true, "personal-loan allowed");
assert(isPublicProductSlug("home-loan") === false, "redirected slug hidden");
assert(isPublicProductSlug("credit-card") === false, "redirected slug hidden");
assert(isPublicProductSlug("Gold Loan") === false, "spaces rejected");

assert(slugToLeadCategory("gold-loan") === "gold_loan", "hyphen to underscore");
assert(slugToLeadCategory("insurance") === "insurance", "insurance category");
assert(slugToLeadCategory("") === "personal_loan", "empty fallback");

function parseInsuranceTypes(raw) {
  const fallback = [
    "life_insurance",
    "health_insurance",
    "motor_insurance",
    "cyber_insurance",
  ];
  if (!raw || typeof raw !== "object") return fallback;
  const list = raw.insuranceTypes;
  if (!Array.isArray(list) || list.length === 0) return fallback;
  const out = [];
  for (const row of list) {
    const value = String(row?.value ?? row?.slug ?? "")
      .trim()
      .toLowerCase();
    const label = String(row?.label ?? "").trim();
    if (/^[a-z][a-z0-9_]{0,63}$/.test(value) && label) out.push(value);
  }
  return out.length > 0 ? out : fallback;
}

assert(parseInsuranceTypes(null).includes("cyber_insurance"), "fallback includes cyber");
assert(
  parseInsuranceTypes({
    insuranceTypes: [{ value: "travel_insurance", label: "Travel Insurance" }],
  }).includes("travel_insurance"),
  "DB type accepted",
);

console.log("test-catalog: ok");
