/**
 * Keep in sync with app/lib/admin/leadPatchGate.ts
 */
function leadPatchRequiresAdmin(body) {
  if (body == null || typeof body !== "object") return false;
  const status = String(body.status ?? "").trim().toLowerCase();
  return status === "approved";
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(leadPatchRequiresAdmin({ status: "approved" }) === true, "approve requires admin");
assert(leadPatchRequiresAdmin({ status: "Approved" }) === true, "approve case-insensitive");
assert(leadPatchRequiresAdmin({ status: "pending" }) === false, "pending is staff-ok");
assert(leadPatchRequiresAdmin({ notes: "x" }) === false, "notes-only is staff-ok");
assert(leadPatchRequiresAdmin(null) === false, "null body");

console.log("test-lead-patch-gate: ok");
