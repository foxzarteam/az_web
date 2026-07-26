import { redirect } from "next/navigation";
import { getCustomerSession } from "@/app/lib/customer/session";
import CustomerDashboardShell from "./CustomerDashboardShell";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  // Session only here — applications load once in page.tsx (was double-fetched before).
  return (
    <CustomerDashboardShell name={session.name || "Customer"} mobile={session.sub}>
      {children}
    </CustomerDashboardShell>
  );
}
