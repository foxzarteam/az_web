import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { buildPageMetadata } from "@/app/lib/seo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Login",
  description: "Sign in to the Apni Zaroorat admin panel.",
  path: "/admin/login",
  noIndex: true,
  absoluteTitle: true,
});

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect(isAgentRole(session.role) ? "/partner/dashboard" : "/admin/dashboard");
  }
  return <LoginForm />;
}
