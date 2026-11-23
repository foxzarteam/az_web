import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import AdminDashboardShell from "@/app/admin/dashboard/AdminDashboardShell";
import { partnerPathForKyc } from "@/app/lib/partner/kyc";
import { fetchPartnerKycStatus } from "@/app/lib/partner/partnerHome";

export default async function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/partner/login");
  if (!isAgentRole(session.role)) redirect("/admin/dashboard");
  const kycPath = partnerPathForKyc(await fetchPartnerKycStatus());
  if (kycPath && kycPath !== "/partner/dashboard") redirect(kycPath);

  return (
    <AdminDashboardShell role={session.role} basePath="/partner" partnerCode={session.code ?? ""}>
      {children}
    </AdminDashboardShell>
  );
}
