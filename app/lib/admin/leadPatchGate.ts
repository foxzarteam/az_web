/**
 * BFF defense-in-depth: staff may PATCH leads, but commission approval
 * must be admin. Nest still enforces requiresAdminCommissionGate.
 */
export function leadPatchRequiresAdmin(body: unknown): boolean {
  if (body == null || typeof body !== "object") return false;
  const rec = body as Record<string, unknown>;
  const status = String(rec.status ?? "").trim().toLowerCase();
  if (status === "approved") return true;
  if (rec.commissionType != null && String(rec.commissionType).trim() !== "") return true;
  if (rec.commissionValue != null && String(rec.commissionValue).trim() !== "") return true;
  return false;
}
