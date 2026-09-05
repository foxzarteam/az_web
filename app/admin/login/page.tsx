import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect(isAgentRole(session.role) ? "/partner/dashboard" : "/admin/dashboard");
  }
  return <LoginForm />;
}
