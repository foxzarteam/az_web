import { redirect } from "next/navigation";
import { getAdminSession, isAdminRole, isCrmAdminRole } from "@/app/lib/admin/session";
import { fetchActiveServiceOptions, fetchAdminPartners } from "@/app/lib/admin/fetchPartners";
import AllProductsGrid from "./AllProductsGrid";
import ProductCatalog from "./ProductCatalog";

export default async function AllProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const canManage = isCrmAdminRole(session.role);
  const [{ partners, error }, serviceOptions] = await Promise.all([
    fetchAdminPartners(),
    canManage ? fetchActiveServiceOptions() : Promise.resolve([]),
  ]);

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      {error ? (
        <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </p>
      ) : (
        <p className="mb-4 text-sm text-slate-500">
          {partners.length === 0
            ? "No products added yet."
            : `${partners.length} product${partners.length === 1 ? "" : "s"} from the catalog.`}
        </p>
      )}
      {canManage ? (
        <ProductCatalog
          initialPartners={partners}
          serviceOptions={serviceOptions}
          canDelete={isAdminRole(session.role)}
        />
      ) : (
        <AllProductsGrid partners={partners} />
      )}
    </main>
  );
}
