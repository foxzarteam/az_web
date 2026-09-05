import { fetchActiveServiceOptions, fetchAdminPartners } from "@/app/lib/admin/fetchPartners";
import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import PartnersTable from "./PartnersTable";

export default async function AdminPartnersPage() {
  await assertCrmAdminPage();
  const [{ partners, error: partnersError }, serviceOptions] = await Promise.all([
    fetchAdminPartners(),
    fetchActiveServiceOptions(),
  ]);

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      {partnersError ? (
        <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          {partnersError}
        </p>
      ) : (
        <p className="mb-1 text-sm text-gray dark:text-gray-400">
          {partners.length === 0
            ? "No aggregators found."
            : `${partners.length} aggregator${partners.length === 1 ? "" : "s"} in the system.`}
        </p>
      )}
      <PartnersTable initialPartners={partners} serviceOptions={serviceOptions} />
    </main>
  );
}
