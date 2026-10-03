import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import { fetchWhatsappEnquiries } from "@/app/lib/admin/fetchWhatsapp";
import WhatsappQueriesTable from "./WhatsappQueriesTable";

export default async function AdminWhatsappQueriesPage() {
  await assertCrmAdminPage();
  const rows = await fetchWhatsappEnquiries();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {rows.length === 0
          ? "No WhatsApp chats yet."
          : `${rows.length} chat${rows.length === 1 ? "" : "s"}. One row per phone number.`}
      </p>
      <WhatsappQueriesTable initialRows={rows} />
    </main>
  );
}
