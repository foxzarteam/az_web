import Link from "next/link";

/** Short, useful SEO/UX cards under the calculator */
export default function TaxSeoContent() {
  return (
    <section className="bg-[#F3F5FB] py-8 dark:bg-darkmode sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
        <div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          <article className="theme-gradient-bg rounded-2xl p-5 text-white shadow-[0_12px_40px_rgba(66,54,251,0.22)] sm:p-6 lg:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
              How to use
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Free tax saving calculator
            </h2>
            <ol className="mt-4 space-y-2.5 text-sm text-white/95 sm:text-[15px]">
              <li className="flex gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  1
                </span>
                <span>Pick FY, age &amp; New / Old / Compare</span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  2
                </span>
                <span>Enter salary, other income &amp; deductions</span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  3
                </span>
                <span>See live tax estimate &amp; which regime wins</span>
              </li>
            </ol>
          </article>

          <article className="theme-gradient-bg rounded-2xl p-5 text-white shadow-[0_12px_40px_rgba(66,54,251,0.22)] sm:p-6 lg:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
              What you get
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Clear tax comparison
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/95 sm:text-[15px]">
              <li className="flex gap-2.5">
                <span className="mt-0.5 text-white/90">•</span>
                <span>Old vs New regime tax side by side</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 text-white/90">•</span>
                <span>Estimated annual &amp; monthly tax</span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 text-white/90">•</span>
                <span>Tax saving insight for FY 2025-26</span>
              </li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-white/85">
              Estimates only — confirm with a CA. Try{" "}
              <Link href="/emi-calculator/" className="font-semibold underline underline-offset-2">
                EMI calculator
              </Link>{" "}
              too.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
