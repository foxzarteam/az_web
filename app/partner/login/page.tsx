import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import LoginForm from "@/app/admin/login/LoginForm";

export default async function PartnerLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect(isAgentRole(session.role) ? "/partner/dashboard" : "/admin/dashboard");
  }
  return <LoginForm mode="partner" />;
}
