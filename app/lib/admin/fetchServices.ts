import "server-only";
import { adminNestGet } from "@/app/lib/admin/adminNestGet";

export type AdminServiceRow = Record<string, unknown>;

export async function fetchAdminServices(): Promise<AdminServiceRow[]> {
  const data = await adminNestGet<AdminServiceRow[]>("/api/services/admin/all");
  return Array.isArray(data) ? data : [];
}
