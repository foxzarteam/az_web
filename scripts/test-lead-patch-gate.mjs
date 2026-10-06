/**
 * Keep in sync with app/lib/admin/leadPatchGate.ts
 */
function leadPatchRequiresAdmin(body) {
  if (body == null || typeof body !== "object") return false;
  const rec = body;
  const status = String(rec.status ?? "").trim().toLowerCase();
  if (status === "approved") return true;
  if (rec.commissionType != null && String(rec.commissionType).trim() !== "") return true;
  if (rec.commissionValue != null && String(rec.commissionValue).trim() !== "") return true;
  return false;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(leadPatchRequiresAdmin({ status: "approved" }) === true, "approve requires admin");
assert(leadPatchRequiresAdmin({ status: "Approved" }) === true, "approve case-insensitive");
assert(leadPatchRequiresAdmin({ status: "pending" }) === false, "pending is staff-ok");
assert(leadPatchRequiresAdmin({ notes: "x" }) === false, "notes-only is staff-ok");
assert(leadPatchRequiresAdmin({ commissionType: "percentage" }) === true, "commission type requires admin");
assert(leadPatchRequiresAdmin({ commissionValue: "500" }) === true, "commission value requires admin");
assert(leadPatchRequiresAdmin(null) === false, "null body");

console.log("test-lead-patch-gate: ok");
