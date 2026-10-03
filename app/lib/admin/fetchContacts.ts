import "server-only";
import { adminNestGet } from "@/app/lib/admin/adminNestGet";

export type AdminContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

/** Nest: GET /api/contact/admin/all */
export async function fetchAdminContacts(): Promise<AdminContactRow[]> {
  const data = await adminNestGet<AdminContactRow[]>("/api/contact/admin/all");
  return Array.isArray(data) ? data : [];
}
