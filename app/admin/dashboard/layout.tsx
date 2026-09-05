import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import AdminDashboardShell from "./AdminDashboardShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (isAgentRole(session.role)) redirect("/partner/dashboard");

  return (
    <AdminDashboardShell role={session.role} basePath="/admin">
      {children}
    </AdminDashboardShell>
  );
}
