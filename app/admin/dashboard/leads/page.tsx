import { fetchAdminLeads } from "@/app/lib/admin/fetchLeads";
import LeadsTable from "./LeadsTable";

export default async function AdminLeadsPage() {
  const leads = await fetchAdminLeads();

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold text-midnight_text dark:text-white md:text-3xl">Leads</h1>
      <p className="mt-2 text-gray dark:text-gray-400">
        {leads.length === 0
          ? "No leads found in the database."
          : `${leads.length} lead${leads.length === 1 ? "" : "s"} from the leads table.`}
      </p>
      <LeadsTable initialLeads={leads} />
    </main>
  );
}
