import { fetchAdminLeads } from "@/app/lib/admin/fetchLeads";
import LeadsTable from "./LeadsTable";

export default async function AdminLeadsPage() {
  const leads = await fetchAdminLeads();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {leads.length === 0
          ? "No leads found in the database."
          : `${leads.length} lead${leads.length === 1 ? "" : "s"} from the leads table.`}
      </p>
      <LeadsTable initialLeads={leads} />
    </main>
  );
}
