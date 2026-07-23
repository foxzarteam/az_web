import { fetchAdminServices } from "@/app/lib/admin/fetchServices";
import ServicesTable from "./ServicesTable";

export default async function AdminServicesPage() {
  const services = await fetchAdminServices();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {services.length === 0
          ? "No products found in the database."
          : `${services.length} product${services.length === 1 ? "" : "s"} from the products table.`}
      </p>
      <ServicesTable initialServices={services} />
    </main>
  );
}
