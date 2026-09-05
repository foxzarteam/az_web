import { fetchAdminUsers } from "@/app/lib/admin/fetchUsers";
import { assertCrmAdminPage } from "@/app/lib/admin/assertCrmAdminPage";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage() {
  await assertCrmAdminPage();
  const users = await fetchAdminUsers();

  return (
    <main className="p-4 sm:p-5 lg:p-6">
      <p className="mb-1 text-sm text-gray dark:text-gray-400">
        {users.length === 0
          ? "No partners found."
          : `${users.length} partner${users.length === 1 ? "" : "s"} in the system.`}
      </p>
      <UsersTable initialUsers={users} />
    </main>
  );
}
