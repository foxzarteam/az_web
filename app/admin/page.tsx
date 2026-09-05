import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  if (session) {
    redirect(isAgentRole(session.role) ? "/partner/dashboard" : "/admin/dashboard");
  }
  redirect("/admin/login");
}
