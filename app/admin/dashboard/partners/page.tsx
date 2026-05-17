import { fetchActiveServiceOptions, fetchAdminPartners } from "@/app/lib/admin/fetchPartners";
import PartnersTable from "./PartnersTable";

export default async function AdminPartnersPage() {
  const [partners, serviceOptions] = await Promise.all([fetchAdminPartners(), fetchActiveServiceOptions()]);

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold text-midnight_text dark:text-white md:text-3xl">Partners</h1>
      <p className="mt-2 text-gray dark:text-gray-400">
        {partners.length === 0
          ? "No partners found in the database."
          : `${partners.length} partner${partners.length === 1 ? "" : "s"} from the partner table.`}
      </p>
      <PartnersTable initialPartners={partners} serviceOptions={serviceOptions} />
    </main>
  );
}
