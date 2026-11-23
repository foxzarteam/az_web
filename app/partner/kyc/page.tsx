import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { fetchPartnerKycStatus } from "@/app/lib/partner/partnerHome";
import KycForm from "./KycForm";

export default async function PartnerKycPage() {
  const session = await getAdminSession();
  if (!session) redirect("/partner/login");
  if (!isAgentRole(session.role)) redirect("/admin/dashboard");
  const status = await fetchPartnerKycStatus();
  if (status === "approved") redirect("/partner/dashboard");
  if (status === "submitted") redirect("/partner/waiting");
  return (
    <main className="min-h-screen bg-slate-50">
      <KycForm rejected={status === "rejected"} />
    </main>
  );
}
