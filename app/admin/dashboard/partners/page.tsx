import { redirect } from "next/navigation";
import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";

export default async function AdminPartnersPage() {
  await assertCrmAdminPage();
  redirect("/admin/dashboard/all-products");
}
