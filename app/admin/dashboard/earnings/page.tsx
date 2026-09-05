import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { fetchAgentWallet } from "@/app/lib/admin/fetchAgentWallet";
import { redirect } from "next/navigation";
import { ADMIN_CARD, ADMIN_UI } from "../adminUi";
import EarningsTable, { type EarningLedgerRow } from "./EarningsTable";

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

export default async function EarningsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!isAgentRole(session.role)) redirect("/admin/dashboard");

  const wallet = await fetchAgentWallet(session.sub);
  const earning = wallet?.earning ?? 0;
  const redeem = wallet?.redeem ?? 0;
  const balance = wallet?.balance ?? 0;
  const ledgerRows: EarningLedgerRow[] = [];

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

      <p className="mb-1 text-sm text-gray dark:text-gray-400">No earning records yet.</p>
      <EarningsTable rows={ledgerRows} />
    </main>
  );
}
