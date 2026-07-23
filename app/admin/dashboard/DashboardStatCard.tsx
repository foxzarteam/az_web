import Link from "next/link";
import { ADMIN_UI } from "./adminUi";

type Props = {
  label: string;
  value: number;
  description: string;
  href?: string;
  icon: React.ReactNode;
};

export default function DashboardStatCard({ label, value, description, href, icon }: Props) {
  const inner = (
    <div
      className="group rounded-xl border bg-white p-4 shadow-sm transition hover:border-[#4236FB]/35 hover:shadow-md dark:border-dark_border dark:bg-darklight"
      style={{ borderColor: ADMIN_UI.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: ADMIN_UI.primarySoft, color: ADMIN_UI.primary }}
        >
          {icon}
        </div>
        {href && (
          <span className="text-[11px] font-semibold text-slate-400 transition group-hover:text-[#4236FB]">
            View →
          </span>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
        {value.toLocaleString("en-IN")}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-400 dark:text-gray-500">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4236FB]/35"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
