import Link from "next/link";

type Props = {
  label: string;
  value: number;
  description: string;
  href?: string;
  accent: "primary" | "sky" | "violet";
  icon: React.ReactNode;
};

const accentStyles = {
  primary: {
    bg: "bg-primary/10 text-primary",
    hover: "hover:border-primary/40",
  },
  sky: {
    bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    hover: "hover:border-sky-500/40",
  },
  violet: {
    bg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    hover: "hover:border-violet-500/40",
  },
} as const;

export default function DashboardStatCard({ label, value, description, href, accent, icon }: Props) {
  const accentBg = accentStyles[accent].bg;
  const accentHover = accentStyles[accent].hover;

  const inner = (
    <div
      className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition dark:border-dark_border dark:bg-darklight ${
        href ? `${accentHover} hover:shadow` : ""
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentBg}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-midnight_text dark:text-white">{label}</p>
        <p className="truncate text-xs text-gray dark:text-gray-400">{description}</p>
      </div>
      <p className="shrink-0 text-2xl font-bold tabular-nums text-midnight_text dark:text-white">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
}