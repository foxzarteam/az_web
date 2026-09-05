import { fetchAdminContacts } from "@/app/lib/admin/fetchContacts";
import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import ContactsTable from "./ContactsTable";

export default async function AdminContactsPage() {
  await assertCrmAdminPage();
  const contacts = await fetchAdminContacts();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {contacts.length === 0
          ? "No contact messages yet."
          : `${contacts.length} message${contacts.length === 1 ? "" : "s"} found.`}
      </p>
      <ContactsTable initialContacts={contacts} />
    </main>
  );
}
