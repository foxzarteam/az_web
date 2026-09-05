import { fetchAdminServices } from "@/app/lib/admin/fetchServices";
import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import ServicesTable from "./ServicesTable";

export default async function AdminServicesPage() {
  await assertCrmAdminPage();
  const services = await fetchAdminServices();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {services.length === 0
          ? "No products yet."
          : `${services.length} product${services.length === 1 ? "" : "s"} found.`}
      </p>
      <ServicesTable initialServices={services} />
    </main>
  );
}
