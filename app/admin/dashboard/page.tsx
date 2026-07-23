import Link from "next/link";
import { fetchDashboardStats } from "@/app/lib/admin/fetchDashboardStats";
import DashboardStatCard from "./DashboardStatCard";
import { ADMIN_BTN_PRIMARY, ADMIN_UI } from "./adminUi";

function LeadsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AgentsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PartnersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

const quickLinks = [
  {
    href: "/admin/dashboard/leads",
    title: "Manage Leads",
    desc: "Review applications & follow-ups",
  },
  {
    href: "/admin/dashboard/users",
    title: "Agents",
    desc: "Add or update agent access",
  },
  {
    href: "/admin/dashboard/products",
    title: "Products",
    desc: "Loan & insurance catalogue",
  },
  {
    href: "/admin/dashboard/partners",
    title: "Partners",
    desc: "Bank & insurer partners",
  },
];

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <div className="space-y-3">
        <section
          className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-dark_border dark:bg-darklight"
          style={{ borderColor: ADMIN_UI.border }}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Overview</p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Welcome to Apni Zaroorat Admin
            </h2>
            <p className="mt-0.5 max-w-xl text-sm text-slate-500 dark:text-gray-400">
              Monitor leads, agents and partners from one place.
            </p>
          </div>
          <Link
            href="/admin/dashboard/leads"
            className={ADMIN_BTN_PRIMARY}
          >
            Open Leads
          </Link>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Key metrics</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DashboardStatCard
              label="Total Leads"
              value={stats.totalLeads}
              description="All leads captured across products"
              href="/admin/dashboard/leads"
              icon={<LeadsIcon />}
            />
            <DashboardStatCard
              label="Total Agents"
              value={stats.totalAgents}
              description="Active agent accounts in the system"
              href="/admin/dashboard/users"
              icon={<AgentsIcon />}
            />
            <DashboardStatCard
              label="Total Partners"
              value={stats.totalPartners}
              description="Registered lending & insurance partners"
              href="/admin/dashboard/partners"
              icon={<PartnersIcon />}
            />
          </div>
        </section>

        <section
          className="rounded-xl border bg-white p-4 dark:border-dark_border dark:bg-darklight"
          style={{ borderColor: ADMIN_UI.border }}
        >
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Quick actions</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Jump into daily workflows</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border p-3 transition hover:border-slate-300 hover:bg-slate-50 dark:border-dark_border dark:hover:bg-white/5"
                style={{ borderColor: ADMIN_UI.border }}
              >
                <span className="block text-sm font-semibold text-slate-800 dark:text-white">{item.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-gray-400">{item.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
