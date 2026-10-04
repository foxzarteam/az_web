import { getAdminSession, isAgentRole, isAdminRole } from "@/app/lib/admin/session";
import { fetchAdminLeads, fetchLeadsByAgent } from "@/app/lib/admin/fetchLeads";
import { redirect } from "next/navigation";
import LeadsTable from "./LeadsTable";

const PARTNER_LEAD_INFO =
  "Info: Please add only genuine customer details. Kindly avoid duplicate leads and incorrect information, so every application stays valid and your earnings stay safe.";

function PartnerLeadInfoStripe() {
  return (
    <div className="mb-3 mt-2 overflow-hidden rounded-lg bg-yellow-300 text-yellow-950">
      <div className="partner-lead-info-track flex w-max">
        <span className="min-w-[100vw] whitespace-nowrap px-8 py-2.5 text-sm font-medium">
          {PARTNER_LEAD_INFO}
        </span>
        <span
          aria-hidden
          className="min-w-[100vw] whitespace-nowrap px-8 py-2.5 text-sm font-medium"
        >
          {PARTNER_LEAD_INFO}
        </span>
      </div>
    </div>
  );
}

export default async function AdminLeadsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const agent = isAgentRole(session.role);
  const leads = agent ? await fetchLeadsByAgent(session.sub) : await fetchAdminLeads();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {leads.length === 0
          ? agent
            ? "No leads yet. Share your link or add a lead."
            : "No leads yet."
          : agent
            ? `${leads.length} lead${leads.length === 1 ? "" : "s"} (your link + manual).`
            : `${leads.length} lead${leads.length === 1 ? "" : "s"} found.`}
      </p>
      {agent ? <PartnerLeadInfoStripe /> : null}
      <LeadsTable
        initialLeads={leads}
        readOnly={agent}
        canApprove={isAdminRole(session.role)}
        canDelete={isAdminRole(session.role)}
      />
    </main>
  );
}
