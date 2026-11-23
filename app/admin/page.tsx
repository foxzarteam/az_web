import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { partnerHomePath } from "@/app/lib/partner/partnerHome";

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  if (session) {
    redirect(isAgentRole(session.role) ? await partnerHomePath() : "/admin/dashboard");
  }
  redirect("/admin/login");
}
