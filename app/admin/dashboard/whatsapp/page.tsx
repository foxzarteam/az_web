import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import { fetchWhatsappEnquiries } from "@/app/lib/admin/fetchWhatsapp";
import WhatsappInbox from "./WhatsappInbox";

export default async function AdminWhatsappQueriesPage() {
  await assertCrmAdminPage();
  const rows = await fetchWhatsappEnquiries();

  return (
    <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <WhatsappInbox initialRows={rows} />
    </main>
  );
}
