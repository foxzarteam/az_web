import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAgentRole } from "@/app/lib/admin/session";
import { fetchPartnerKycStatus } from "@/app/lib/partner/partnerHome";
import CheckKycStatusButton from "./CheckKycStatusButton";

export default async function PartnerWaitingPage() {
  const session = await getAdminSession();
  if (!session) redirect("/partner/login");
  if (!isAgentRole(session.role)) redirect("/admin/dashboard");
  const status = await fetchPartnerKycStatus();
  if (status === "approved") redirect("/partner/dashboard");
  if (status === "pending") redirect("/partner/kyc");

  const rejected = status === "rejected";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          Partner onboarding
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          {rejected ? "KYC not approved" : "KYC under review"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {rejected
            ? "Admin rejected the documents. Upload a clear set again to continue."
            : "Your documents were submitted. You will get portal access after admin approval."}
        </p>
        {rejected ? (
          <Link
            href="/partner/kyc"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Update documents
          </Link>
        ) : (
          <div>
            <CheckKycStatusButton />
            <p className="mt-3 text-xs text-slate-400">You can close this page and log in later.</p>
          </div>
        )}
      </div>
    </main>
  );
}
