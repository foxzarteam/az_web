import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCustomerSession } from "@/app/lib/customer/session";
import CustomerDashboardShell from "./CustomerDashboardShell";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

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
