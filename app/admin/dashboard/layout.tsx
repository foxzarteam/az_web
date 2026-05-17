import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/admin/session";
import AdminDashboardShell from "./AdminDashboardShell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <AdminDashboardShell email={session.email}>{children}</AdminDashboardShell>;
}
