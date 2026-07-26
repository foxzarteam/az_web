import { redirect } from "next/navigation";
import { getCustomerSession } from "@/app/lib/customer/session";
import { fetchLeadsByMobile } from "@/app/lib/customer/leadsByMobile";
import CustomerApplicationsTable from "./CustomerApplicationsTable";

export default async function CustomerDashboardPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  const applications = await fetchLeadsByMobile(session.sub);
  const name = session.name || applications[0]?.full_name || "Customer";

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl border border-black/5 bg-gradient-to-r from-primary/[0.08] via-white to-[#ff7a1a]/[0.08] px-5 py-5 shadow-sm sm:px-7 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          My application
        </p>
        <h1 className="mt-1 text-2xl font-bold text-midnight_text sm:text-3xl">
          Hello, {name.split(" ")[0] || name}
        </h1>
      </div>

      <CustomerApplicationsTable initialApplications={applications} />
    </div>
  );
}
