import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { partnerHomePath } from "@/app/lib/partner/partnerHome";

/** Block partners from CRM-only admin pages. */
export async function assertCrmAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (isAgentRole(session.role)) redirect(await partnerHomePath());
  return session;
}
