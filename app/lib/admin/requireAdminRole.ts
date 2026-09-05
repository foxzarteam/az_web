import "server-only";
import { getAdminSession, isCrmAdminRole, type AdminSession } from "./session";

/** Session must exist and role must be in `roles` (default: admin|staff). */
export async function requireAdminSession(opts?: {
  roles?: readonly string[];
}): Promise<AdminSession | null> {
  const session = await getAdminSession();
  if (!session) return null;
  const allowed = opts?.roles ?? ["admin", "staff"];
  const role = String(session.role ?? "")
    .trim()
    .toLowerCase();
  if (!allowed.map((r) => r.toLowerCase()).includes(role)) return null;
  return session;
}

export async function requireCrmAdminSession(): Promise<AdminSession | null> {
  const session = await getAdminSession();
  if (!session || !isCrmAdminRole(session.role)) return null;
  return session;
}
