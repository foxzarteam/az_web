import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[72vh] items-center justify-center overflow-hidden bg-[#F3F5FB] px-4 py-20 dark:bg-darkmode sm:min-h-[78vh] sm:py-28">
      {/* Soft ambient orbs */}
      <div
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#4236FB]/15 blur-3xl notfound-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-[#FF7E29]/20 blur-3xl notfound-float-delayed"
        aria-hidden
      />

      <div className="relative z-[1] mx-auto w-full max-w-xl text-center">
        <div className="notfound-enter mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#4236FB]/20 bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#4236FB] shadow-sm backdrop-blur dark:border-primary/30 dark:bg-darklight dark:text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Error 404
        </div>

        <div className="notfound-bounce relative mx-auto mb-2 select-none" aria-hidden>
          <p className="theme-gradient-text text-[7rem] font-bold leading-none tracking-tight sm:text-[9rem]">
            404
          </p>
          <span className="notfound-ring pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#4236FB]/25 sm:h-36 sm:w-36" />
          <span className="notfound-ring-delayed pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF7E29]/30 sm:h-48 sm:w-48" />
        </div>

        <h1 className="notfound-enter-delayed text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Page not found
        </h1>
        <p className="notfound-enter-delayed mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-gray-400 sm:text-base">
          This link looks broken or the page was moved. Head home and continue with loans,
          insurance, or our free calculators.
        </p>

        <div className="notfound-enter-late mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-gradient inline-flex min-h-12 min-w-[160px] items-center justify-center rounded-xl px-6 text-sm font-bold text-white shadow-md transition hover:opacity-95"
          >
            Go to Home
          </Link>
          <Link
            href="/products/personal-loan/"
            className="inline-flex min-h-12 min-w-[160px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 shadow-sm transition hover:border-[#4236FB]/40 hover:text-[#4236FB] dark:border-dark_border dark:bg-darklight dark:text-white"
          >
            Personal Loan
          </Link>
        </div>

        <div className="notfound-enter-late mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 dark:text-gray-400">
          <Link href="/emi-calculator/" className="hover:text-[#4236FB] hover:underline">
            EMI Calculator
          </Link>
          <span className="text-slate-300 dark:text-gray-600" aria-hidden>
            ·
          </span>
          <Link href="/tax-saving-calculator/" className="hover:text-[#4236FB] hover:underline">
            Tax Calculator
          </Link>
          <span className="text-slate-300 dark:text-gray-600" aria-hidden>
            ·
          </span>
          <Link href="/contact/" className="hover:text-[#4236FB] hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
