import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/admin/session";
import { fetchAdminPartners } from "@/app/lib/admin/fetchPartners";
import AllProductsGrid from "./AllProductsGrid";

export default async function AllProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { partners, error } = await fetchAdminPartners();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      {error ? (
        <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </p>
      ) : (
        <p className="mb-4 text-sm text-slate-500">
          {partners.length === 0
            ? "No aggregators added yet."
            : `${partners.length} aggregator${partners.length === 1 ? "" : "s"} from the catalog.`}
        </p>
      )}
      <AllProductsGrid partners={partners} />
    </main>
  );
}
