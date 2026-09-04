"use client";

import { formatAdminDateTime } from "@/app/utils/format";
import { ADMIN_CARD } from "@/app/admin/dashboard/adminUi";
import AffiliateShareKit from "@/app/components/affiliate/AffiliateShareKit";
import type { AgentSession } from "@/app/lib/agent/types";
import type { AgentClientRow } from "@/app/lib/agent/fetchClients";

function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    personal_loan: "Personal loan",
    insurance: "Insurance",
    home_loan: "Home loan",
    business_loan: "Business loan",
    credit_card: "Credit card",
    vehicle_loan: "Vehicle loan",
  };
  return map[category] || category.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const s = status.toLowerCase();
  if (s === "approved") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (s === "rejected") return "bg-red-50 text-red-700 ring-red-100";
  return "bg-amber-50 text-amber-800 ring-amber-100";
}

export default function AgentPortal({
  session,
  clients,
}: {
  session: AgentSession;
  clients: AgentClientRow[];
}) {
  const loans = clients.filter((c) => String(c.category ?? "") === "personal_loan").length;
  const insurance = clients.filter((c) => String(c.category ?? "") === "insurance").length;

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${ADMIN_CARD} p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total clients</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{clients.length}</p>
        </div>
        <div className={`${ADMIN_CARD} p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Personal loan</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{loans}</p>
        </div>
        <div className={`${ADMIN_CARD} p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Insurance</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{insurance}</p>
        </div>
      </div>

      <section className={`${ADMIN_CARD} overflow-hidden`}>
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Your unique share kit</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Anyone who applies for a personal loan or insurance via this link is attributed to you.
          </p>
        </div>
        <div className="p-6">
          <AffiliateShareKit code={session.code} />
        </div>
      </section>

      <section className={`${ADMIN_CARD} overflow-hidden`}>
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Your clients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-slate-500">
                    No clients yet. Share your link or QR to start receiving applications.
                  </td>
                </tr>
              ) : (
                clients.map((row, i) => (
                  <tr key={String(row.id ?? i)} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{String(row.full_name ?? "—")}</td>
                    <td className="px-5 py-3.5 text-slate-700">{String(row.mobile_number ?? "—")}</td>
                    <td className="px-5 py-3.5 text-slate-700">{categoryLabel(String(row.category ?? ""))}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusBadge(String(row.status ?? ""))}`}
                      >
                        {String(row.status ?? "pending").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{formatAdminDateTime(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
