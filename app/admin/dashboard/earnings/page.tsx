import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { fetchAgentWallet } from "@/app/lib/admin/fetchAgentWallet";
import { fetchLeadsByAgent, type AdminLeadRow } from "@/app/lib/admin/fetchLeads";
import { redirect } from "next/navigation";
import { ADMIN_CARD, ADMIN_UI } from "../adminUi";
import EarningsTable, { type EarningLedgerRow } from "./EarningsTable";

const LOAN_COMMISSION_RATE = 0.02;
const INSURANCE_COMMISSION_FLAT = 1000;

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₹${n}`;
  }
}

function roundMoney(n: number): number {
  return Math.round(Math.max(0, n) * 100) / 100;
}

/** Same rules as Nest wallet: insurance ₹1000, loan 2% of amount. */
function commissionForLead(lead: AdminLeadRow): number {
  const cat = String(lead.category ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (cat === "insurance") return INSURANCE_COMMISSION_FLAT;
  const amount = Number(lead.required_amount);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return roundMoney(amount * LOAN_COMMISSION_RATE);
}

function formatLeadDate(iso: unknown): string {
  const s = String(iso ?? "").trim();
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function leadNote(lead: AdminLeadRow): string {
  const name = String(lead.full_name ?? "").trim() || "Lead";
  const cat = String(lead.category ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (cat === "insurance") {
    const ins = String(lead.ins_type ?? "").replace(/_/g, " ");
    return ins ? `Insurance — ${name} (${ins})` : `Insurance — ${name}`;
  }
  const amt = Number(lead.required_amount);
  if (Number.isFinite(amt) && amt > 0) {
    return `Personal loan — ${name} (${formatMoney(amt)})`;
  }
  return `Personal loan — ${name}`;
}

function buildCommissionLedger(leads: AdminLeadRow[]): EarningLedgerRow[] {
  const approved = leads
    .filter((l) => String(l.status ?? "").toLowerCase() === "approved")
    .filter((l) => commissionForLead(l) > 0)
    .sort((a, b) => {
      const ta = new Date(String(a.updated_at ?? a.created_at ?? 0)).getTime();
      const tb = new Date(String(b.updated_at ?? b.created_at ?? 0)).getTime();
      return ta - tb;
    });

  let running = 0;
  const rows: EarningLedgerRow[] = [];
  for (const lead of approved) {
    const amount = commissionForLead(lead);
    running = roundMoney(running + amount);
    rows.push({
      id: String(lead.id ?? `${lead.mobile_number}-${lead.updated_at}`),
      date: formatLeadDate(lead.updated_at ?? lead.created_at),
      type: "Commission",
      amount,
      balance: running,
      note: leadNote(lead),
    });
  }
  // Newest first in the table
  return rows.reverse();
}

export default async function EarningsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!isAgentRole(session.role)) redirect("/admin/dashboard");

  const [wallet, leads] = await Promise.all([
    fetchAgentWallet(session.sub),
    fetchLeadsByAgent(session.sub),
  ]);

  const earning = wallet?.earning ?? 0;
  const redeem = wallet?.redeem ?? 0;
  const balance = wallet?.balance ?? 0;
  const ledgerRows = buildCommissionLedger(leads);

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-4 text-sm text-slate-500 dark:text-gray-400">
        Your commission wallet for referred leads.
      </p>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className={`${ADMIN_CARD} p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total earning</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatMoney(earning)}
          </p>
        </div>
        <div className={`${ADMIN_CARD} p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Redeemed</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatMoney(redeem)}
          </p>
        </div>
        <div className={`${ADMIN_CARD} p-5`} style={{ borderColor: ADMIN_UI.primary }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Balance</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatMoney(balance)}
          </p>
        </div>
      </div>

      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {ledgerRows.length === 0
          ? "No earning records yet."
          : `${ledgerRows.length} commission record${ledgerRows.length === 1 ? "" : "s"} from approved leads.`}
      </p>
      <EarningsTable rows={ledgerRows} />
    </main>
  );
}
