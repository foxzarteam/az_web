import { fetchDashboardStats } from "@/app/lib/admin/fetchDashboardStats";
import DashboardStatCard from "./DashboardStatCard";

function LeadsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AgentsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PartnersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <main className="p-5 md:p-6">
      <div className="max-w-4xl">
        <h1 className="text-xl font-bold text-midnight_text dark:text-white md:text-2xl">Dashboard</h1>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardStatCard
            label="Total Leads"
            value={stats.totalLeads}
            description="All leads in database"
            href="/admin/dashboard/leads"
            accent="primary"
            icon={<LeadsIcon />}
          />
          <DashboardStatCard
            label="Total Agents"
            value={stats.totalAgents}
            description="Users table count"
            href="/admin/dashboard/users"
            accent="sky"
            icon={<AgentsIcon />}
          />
          <DashboardStatCard
            label="Total Partners"
            value={stats.totalPartners}
            description="Partner table count"
            href="/admin/dashboard/partners"
            accent="violet"
            icon={<PartnersIcon />}
          />
        </div>
      </div>
    </main>
  );
}
