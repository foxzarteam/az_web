import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/admin/session";
import AdminSidebar from "./AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-[100dvh] bg-slate-50 dark:bg-darkmode">
      <AdminSidebar email={session.email} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
