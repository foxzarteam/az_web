import { getAdminSession } from "@/app/lib/admin/session";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold text-midnight_text dark:text-white md:text-3xl">Dashboard</h1>
      <p className="mt-2 text-gray dark:text-gray-400">
        Signed in as <span className="font-medium text-midnight_text dark:text-white">{session?.email}</span>
        {session?.role ? (
          <>
            {" "}
            · Role: <span className="font-medium capitalize">{session.role}</span>
          </>
        ) : null}
      </p>
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-dark_border dark:bg-darklight">
        <p className="text-sm text-gray dark:text-gray-400">
          Yahan baad mein financial products, leads, aur doosre admin modules add ho sakte hain.
        </p>
      </div>
    </main>
  );
}
