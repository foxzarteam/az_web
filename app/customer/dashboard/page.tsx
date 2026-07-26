import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/app/lib/customer/session";
import { fetchLeadsByMobile, type CustomerLead } from "@/app/lib/customer/leadsByMobile";

function formatInr(amount: number | null): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    personal_loan: "Personal Loan",
    home_loan: "Home Loan",
    business_loan: "Business Loan",
    credit_card: "Credit Card",
    insurance: "Insurance",
    vehicle_loan: "Vehicle Loan",
  };
  return map[category] || category.replace(/_/g, " ");
}

function statusMeta(status: string): {
  label: string;
  badge: string;
  step: number;
} {
  const s = status.toLowerCase();
  if (s === "approved") {
    return {
      label: "Approved",
      badge: "bg-emerald-100 text-emerald-800",
      step: 3,
    };
  }
  if (s === "rejected") {
    return {
      label: "Not Approved",
      badge: "bg-red-100 text-red-800",
      step: 3,
    };
  }
  return {
    label: "Under Review",
    badge: "bg-amber-100 text-amber-900",
    step: 2,
  };
}

function Timeline({ lead }: { lead: CustomerLead }) {
  const meta = statusMeta(lead.status);
  const steps = [
    { key: "submitted", label: "Submitted", done: true },
    { key: "review", label: "Under Review", done: meta.step >= 2 },
    {
      key: "decision",
      label: lead.status === "rejected" ? "Not Approved" : lead.status === "approved" ? "Approved" : "Decision",
      done: meta.step >= 3,
    },
  ];

  return (
    <ol className="mt-5 space-y-0">
      {steps.map((step, i) => {
        const active = step.done && (i === steps.length - 1 ? meta.step >= 3 : true);
        const current =
          (meta.step === 2 && i === 1) || (meta.step === 3 && i === 2);
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step.done
                    ? lead.status === "rejected" && i === 2
                      ? "bg-red-500 text-white"
                      : lead.status === "approved" && i === 2
                        ? "bg-emerald-500 text-white"
                        : "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={`my-1 w-0.5 flex-1 min-h-[1.25rem] ${
                    steps[i + 1]?.done ? "bg-primary/40" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <div className={`pb-4 ${current ? "font-semibold" : ""}`}>
              <p
                className={`text-sm ${
                  active || current ? "text-midnight_text" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {i === 0 && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {formatDate(lead.created_at)}
                </p>
              )}
              {i === 2 && meta.step >= 3 && (
                <p className="mt-0.5 text-xs text-gray-500">
                  Updated {formatDate(lead.updated_at || lead.created_at)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default async function CustomerDashboardPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  const applications = await fetchLeadsByMobile(session.sub);
  const name = session.name || applications[0]?.full_name || "Customer";
  const primary = applications[0] ?? null;

  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending" || !a.status).length;
  const approved = applications.filter((a) => a.status === "approved").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          My application
        </p>
        <h1 className="mt-1 text-2xl font-bold text-midnight_text sm:text-3xl">
          Hello, {name.split(" ")[0] || name}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-gray-600">
          Track your loan application status here. We&apos;ll update this panel as your
          request moves forward.
        </p>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Applications", value: total },
          { label: "Under review", value: pending },
          { label: "Approved", value: approved },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-black/5 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-bold text-midnight_text sm:text-2xl">{stat.value}</p>
          </div>
        ))}
      </section>

      {!primary ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white/80 px-5 py-10 text-center">
          <p className="text-base font-semibold text-midnight_text">No applications yet</p>
          <p className="mt-1 text-sm text-gray-600">
            Submit a Personal Loan application to track it here.
          </p>
          <Link
            href="/products/personal-loan"
            className="btn-gradient mt-5 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          >
            Apply now
          </Link>
        </section>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="border-b border-black/5 bg-gradient-to-r from-primary/[0.06] to-[#ff7a1a]/[0.06] px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Application number</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-midnight_text">
                    {primary.applicationNumber}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta(primary.status).badge}`}
                >
                  {statusMeta(primary.status).label}
                </span>
              </div>
            </div>
            <div className="grid gap-6 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Product</span>
                  <span className="font-medium text-right">{categoryLabel(primary.category)}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Requested amount</span>
                  <span className="font-medium">{formatInr(primary.required_amount)}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Submitted</span>
                  <span className="font-medium">{formatDate(primary.created_at)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium">+91 {primary.mobile_number}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight_text">Status timeline</p>
                <Timeline lead={primary} />
              </div>
            </div>
          </section>

          {applications.length > 1 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                All applications
              </h2>
              <ul className="space-y-3">
                {applications.map((app) => {
                  const meta = statusMeta(app.status);
                  return (
                    <li
                      key={app.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold text-midnight_text">
                          {app.applicationNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {categoryLabel(app.category)} · {formatInr(app.required_amount)} ·{" "}
                          {formatDate(app.created_at)}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}

      <section className="rounded-xl border border-black/5 bg-white/90 px-5 py-4 text-sm text-gray-600 sm:px-6">
        Our team may contact you on your registered mobile for the next steps. Need help?{" "}
        <Link href="/contact" className="font-semibold text-primary hover:underline">
          Contact us
        </Link>
        .
      </section>
    </div>
  );
}
