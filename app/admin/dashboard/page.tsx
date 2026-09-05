import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { fetchDashboardStats } from "@/app/lib/admin/fetchDashboardStats";
import { fetchLeadsByAgent } from "@/app/lib/admin/fetchLeads";
import Link from "next/link";
import DashboardStatCard from "./DashboardStatCard";
import AffiliateShareKit from "@/app/components/affiliate/AffiliateShareKit";
import { ADMIN_BTN_PRIMARY, ADMIN_CARD, ADMIN_UI } from "./adminUi";

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
  { href: "/admin/dashboard/leads", title: "Manage Leads", desc: "Review applications & follow-ups" },
  { href: "/admin/dashboard/users", title: "Partners", desc: "Add or update partner access" },
  { href: "/admin/dashboard/products", title: "Products", desc: "Loan & insurance catalogue" },
  { href: "/admin/dashboard/partners", title: "Aggregators", desc: "Bank & insurer aggregators" },
];

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const agent = session && isAgentRole(session.role);

  if (agent && session) {
    const leads = await fetchLeadsByAgent(session.sub);
    const loans = leads.filter((l) => String(l.category ?? "") === "personal_loan").length;
    const insurance = leads.filter((l) => String(l.category ?? "") === "insurance").length;

    return (
      <main className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-3 lg:px-6 lg:pb-6 lg:pt-4">
        <div className="space-y-3">
          <div
            className="flex flex-col gap-2.5 rounded-xl border bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-dark_border dark:bg-darklight"
            style={{ borderColor: ADMIN_UI.border }}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Overview</p>
              <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Welcome{session.name ? `, ${session.name}` : ""}
              </h2>
              <p className="mt-0.5 max-w-xl text-sm text-slate-500 dark:text-gray-400">
                Your referred leads and share kit.
              </p>
            </div>
            <Link href="/partner/dashboard/leads" className={ADMIN_BTN_PRIMARY}>
              Open Leads
            </Link>
          </div>

          {session.code ? (
            <div className={`${ADMIN_CARD} overflow-hidden`}>
              <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-2.5">
                <h2 className="text-sm font-semibold text-slate-900">Your unique share kit</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Anyone who applies via this link is attributed to you.
                </p>
              </div>
              <div className="px-6 py-3">
                <AffiliateShareKit code={session.code} />
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <DashboardStatCard
              label="Your leads"
              value={leads.length}
              description="Applications attributed to you"
              href="/partner/dashboard/leads"
              icon={<LeadsIcon />}
            />
            <DashboardStatCard
              label="Personal loan"
              value={loans}
              description="Loan applications"
              href="/partner/dashboard/leads"
              icon={<LeadsIcon />}
            />
            <DashboardStatCard
              label="Insurance"
              value={insurance}
              description="Insurance applications"
              href="/partner/dashboard/leads"
              icon={<LeadsIcon />}
            />
          </div>
        </div>
      </main>
    );
  }

  const stats = await fetchDashboardStats();

  return (
    <main className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-3 lg:px-6 lg:pb-6 lg:pt-4">
      <div className="space-y-3">
        <div
          className="flex flex-col gap-2.5 rounded-xl border bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-dark_border dark:bg-darklight"
          style={{ borderColor: ADMIN_UI.border }}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Overview</p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Welcome to Apni Zaroorat Admin
            </h2>
            <p className="mt-0.5 max-w-xl text-sm text-slate-500 dark:text-gray-400">
              Monitor leads, partners and aggregators from one place.
            </p>
          </div>
          <Link href="/admin/dashboard/leads" className={ADMIN_BTN_PRIMARY}>
            Open Leads
          </Link>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
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
              label="Total Partners"
              value={stats.totalAgents}
              description="Active partner accounts in the system"
              href="/admin/dashboard/users"
              icon={<AgentsIcon />}
            />
            <DashboardStatCard
              label="Total Aggregators"
              value={stats.totalPartners}
              description="Registered lending & insurance aggregators"
              href="/admin/dashboard/partners"
              icon={<PartnersIcon />}
            />
          </div>
        </div>

        <div
          className="rounded-xl border bg-white p-3.5 sm:p-4 dark:border-dark_border dark:bg-darklight"
          style={{ borderColor: ADMIN_UI.border }}
        >
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Quick actions</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Jump into daily workflows</p>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </div>
    </main>
  );
}
