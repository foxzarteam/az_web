import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import { fetchWhatsappSettings } from "@/app/lib/admin/fetchWhatsapp";
import WhatsappSettingsForm from "./WhatsappSettingsForm";

export default async function AdminWhatsappSettingsPage() {
  await assertCrmAdminPage();
  const settings = await fetchWhatsappSettings();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <WhatsappSettingsForm initial={settings} />
    </main>
  );
}
