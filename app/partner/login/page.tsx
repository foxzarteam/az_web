import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import LoginForm from "@/app/admin/login/LoginForm";
import { buildPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Partner Login",
  description: "Sign in to the Apni Zaroorat partner dashboard.",
  path: "/partner/login",
  noIndex: true,
  absoluteTitle: true,
});

export default async function PartnerLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect(isAgentRole(session.role) ? "/partner/dashboard" : "/admin/dashboard");
  }
  return <LoginForm mode="partner" />;
}
