import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import AdminDashboardShell from "@/app/admin/dashboard/AdminDashboardShell";

export default async function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/partner/login");
  if (!isAgentRole(session.role)) redirect("/admin/dashboard");

  return (
    <AdminDashboardShell role={session.role} basePath="/partner">
      {children}
    </AdminDashboardShell>
  );
}
