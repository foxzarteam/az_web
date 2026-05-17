import { fetchAdminServices } from "@/app/lib/admin/fetchServices";
import ServicesTable from "./ServicesTable";

export default async function AdminServicesPage() {
  const services = await fetchAdminServices();

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold text-midnight_text dark:text-white md:text-3xl">Services</h1>
      <p className="mt-2 text-gray dark:text-gray-400">
        {services.length === 0
          ? "No services found in the database."
          : `${services.length} service${services.length === 1 ? "" : "s"} from the services table.`}
      </p>
      <ServicesTable initialServices={services} />
    </main>
  );
}
