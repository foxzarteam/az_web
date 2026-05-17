import { fetchActiveServiceOptions, fetchAdminPartners } from "@/app/lib/admin/fetchPartners";
import PartnersTable from "./PartnersTable";

export default async function AdminPartnersPage() {
  const [{ partners, error: partnersError }, serviceOptions] = await Promise.all([
    fetchAdminPartners(),
    fetchActiveServiceOptions(),
  ]);

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold text-midnight_text dark:text-white md:text-3xl">Partners</h1>
      {partnersError ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          {partnersError}
        </p>
      ) : (
        <p className="mt-2 text-gray dark:text-gray-400">
          {partners.length === 0
            ? "No partners found in the database."
            : `${partners.length} partner${partners.length === 1 ? "" : "s"} from the partner table.`}
        </p>
      )}
      <PartnersTable initialPartners={partners} serviceOptions={serviceOptions} />
    </main>
  );
}
