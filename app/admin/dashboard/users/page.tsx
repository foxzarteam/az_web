import { fetchAdminUsers } from "@/app/lib/admin/fetchUsers";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage() {
  const users = await fetchAdminUsers();

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold text-midnight_text dark:text-white md:text-3xl">Users</h1>
      <p className="mt-2 text-gray dark:text-gray-400">
        {users.length === 0
          ? "No users found in the database."
          : `${users.length} user${users.length === 1 ? "" : "s"} (agents) from the users table.`}
      </p>
      <UsersTable initialUsers={users} />
    </main>
  );
}
