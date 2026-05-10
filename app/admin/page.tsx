import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/admin/session";

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  redirect("/admin/login");
}
