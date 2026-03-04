import Link from "next/link";

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-lg font-bold text-white">
              A
            </div>
            <span className="text-lg font-semibold tracking-tight">Apni Zaroorat</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Start earning with 3 easy steps - same design as homepage 3-step */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16 az-fade-up">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Start earning with 3 easy steps
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              { step: 1, title: "Install Apni Zaroorat app and register" },
              { step: 2, title: "Attend trainings and share financial product links" },
              { step: 3, title: "Start earning money more than ₹1 Lakh every month" },
            ].map((item) => (
              <div
                key={item.step}
                className={
                  "flex flex-col items-center gap-4 text-slate-800 az-fade-up " +
                  (item.step === 1 ? "az-step-float-1" : item.step === 2 ? "az-step-float-2" : "az-step-float-3")
                }
              >
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-200/80">
                  <div className="flex h-28 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-[11px] text-slate-500">
                    Phone image
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                  {item.step}
                </div>
                <p className="max-w-xs text-sm font-medium leading-snug">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
