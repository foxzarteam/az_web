import { redirect } from "next/navigation";
import { getCustomerSession } from "@/app/lib/customer/session";
import { fetchLeadsByMobile } from "@/app/lib/customer/leadsByMobile";
import CustomerDashboardShell from "./CustomerDashboardShell";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  const applications = await fetchLeadsByMobile(session.sub);
  const name = session.name || applications[0]?.full_name || "Customer";

  return (
    <CustomerDashboardShell name={name} mobile={session.sub}>
      {children}
    </CustomerDashboardShell>
  );
}
