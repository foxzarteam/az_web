import "server-only";
import { adminNestGet } from "@/app/lib/admin/adminNestGet";

export type AdminUserRow = Record<string, unknown>;

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const data = await adminNestGet<AdminUserRow[]>("/api/users/admin/all");
  return Array.isArray(data) ? data : [];
}
