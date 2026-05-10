import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/admin/session";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  return <LoginForm />;
}
