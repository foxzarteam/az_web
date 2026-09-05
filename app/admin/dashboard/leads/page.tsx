import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { fetchAdminLeads, fetchLeadsByAgent } from "@/app/lib/admin/fetchLeads";
import { redirect } from "next/navigation";
import LeadsTable from "./LeadsTable";

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
            ? "No leads yet. Share your link to get started."
            : "No leads yet."
          : agent
            ? `${leads.length} lead${leads.length === 1 ? "" : "s"} from your link.`
            : `${leads.length} lead${leads.length === 1 ? "" : "s"} found.`}
      </p>
      <LeadsTable initialLeads={leads} readOnly={agent} />
    </main>
  );
}
