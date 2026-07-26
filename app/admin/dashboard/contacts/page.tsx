import { fetchAdminContacts } from "@/app/lib/admin/fetchContacts";
import ContactsTable from "./ContactsTable";

export default async function AdminContactsPage() {
  const contacts = await fetchAdminContacts();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {contacts.length === 0
          ? "No contact messages found in the database."
          : `${contacts.length} message${contacts.length === 1 ? "" : "s"} from the contact table.`}
      </p>
      <ContactsTable initialContacts={contacts} />
    </main>
  );
}
