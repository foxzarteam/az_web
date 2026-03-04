import Link from "next/link";
import HeroPhoneImages from "./HeroPhoneImages";
import SellMoreTabsAndCard from "./SellMoreTabsAndCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Apni Zaroorat
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {/* Products dropdown */}
            <div className="relative group">
              <button className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors">
                <span>Products</span>
                <span className="text-xs">▾</span>
              </button>
              <div className="invisible absolute left-0 top-full mt-3 w-80 rounded-2xl border border-slate-100 bg-white py-4 shadow-xl shadow-slate-200 group-hover:visible group-hover:opacity-100 opacity-0 transition-opacity">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-6 text-sm text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-lg">
                      💳
                    </div>
                    <span>Credit Card</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg">
                      💰
                    </div>
                    <span>Personal Loan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      💼
                    </div>
                    <span>Business Loan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-lg">
                      🏦
                    </div>
                    <span>Savings A/c</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="hover:text-orange-500 transition-colors">
              Check Credit Score
            </button>
            <Link href="/partner" className="hover:text-orange-500 transition-colors">
              Partner with Us
            </Link>
            <button className="hover:text-orange-500 transition-colors">
              About Us
            </button>
            <button className="hover:text-orange-500 transition-colors">
              Contact Us
            </button>
          </nav>
        </div>
      </header>

      {/* Hero + phone section */}
      <section className="bg-gradient-to-b from-orange-50/80 via-white to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:py-16 az-fade-up">
          {/* Left hero text */}
          <div className="flex-1 space-y-6 az-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold text-orange-700">
              <span className="inline-flex h-4 w-6 items-center justify-center rounded-full bg-white text-[10px]">
                🇮🇳
              </span>
              Made for India, Made in India
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[40px] lg:leading-tight">
              Sell financial products and earn real money online!
            </h1>
            <div className="mt-2 rounded-2xl border border-slate-100 bg-white/70 p-4 text-xs text-slate-700 sm:text-sm">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Start earning with 3 easy steps
              </p>
              <ol className="space-y-1 list-decimal pl-4">
                <li>Install Apni Zaroorat app and register</li>
                <li>Attend trainings and share financial product links</li>
                <li>Start earning more than ₹1 Lakh every month</li>
              </ol>
            </div>
          </div>

          {/* Right phone mockup - box size matches image area */}
          <div className="flex-1 az-fade-up-delayed flex justify-center">
            <div className="relative w-[460px]">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-orange-100" />
              <div className="absolute -right-4 bottom-16 h-20 w-20 rounded-full bg-emerald-100" />
              <div className="relative overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-orange-100">
                <div className="border-b border-slate-100 bg-slate-900 px-4 py-3 text-center text-xs font-medium text-white">
                  Apni Zaroorat
                </div>
                <div className="relative h-[300px] w-full">
                  <HeroPhoneImages />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Application Process */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16 az-fade-up">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Quick Application Process
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              { step: 1, title: "Select Service" },
              { step: 2, title: "Submit Details" },
              { step: 3, title: "Get Instant Approval" },
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

      {/* Select service and get benefits now */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 az-fade-up">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Choose a Service and Get Started
              </h2>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                Submit your details and get the best offers from trusted banks.
              </p>
            </div>
          </div>

          <SellMoreTabsAndCard />
        </div>
      </section>

      {/* Why do thousands trust us? */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 az-fade-up">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Why do thousands trust us?
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-violet-500" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "0↗",
                title: "No Investment, Only Earnings",
                desc: "You just need passion and basic skills— we'll help you earn!",
              },
              {
                icon: "⊞",
                title: "All Financial Services on One Platform",
                desc: "From insurance to mutual funds to credit cards— everything you need to grow your business is here.",
              },
              {
                icon: "💡",
                title: "Ready-to-Use Marketing Creatives",
                desc: "We provide you with easy-to-share creatives, allowing you to promote, pitch, and earn quickly.",
              },
              {
                icon: "🕐",
                title: "Timely Payouts, Always!",
                desc: "You earn commissions on time, every time.",
              },
              {
                icon: "🌐",
                title: "Work anytime, from anywhere",
                desc: "Work from home, a cafe, or even while traveling. Total freedom!",
              },
              {
                icon: "📚",
                title: "Guided learning & support",
                desc: "Structured video lessons, FAQs and a support team to help you at every step.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-800 p-5 text-white shadow-lg az-card-hover"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl font-bold text-white">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold md:text-base">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-200 md:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA + footer */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400">
        <div className="mx-auto max-w-6xl px-4 py-10 text-white md:py-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Sell more to earn more with zero investment
              </h2>
              <p className="max-w-xl text-sm text-orange-100 md:text-base">
                Download the Apni Zaroorat app today and start your job from
                home. Build your own financial products business and unlock
                extra income.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-black/40 hover:bg-slate-900 transition-colors">
                Get it on Play Store
              </button>
              <button className="rounded-full border border-white/80 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                Download for iOS
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs md:flex-row md:text-sm">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Apni Zaroorat
            </span>
          </div>
          <nav className="flex items-center gap-5 text-slate-300">
            <button className="hover:text-white transition-colors">Home</button>
            <button className="hover:text-white transition-colors">
              About us
            </button>
            <button className="hover:text-white transition-colors">
              Contact
            </button>
          </nav>
          <p className="text-[11px] text-slate-500">
            © 2024 Apni Zaroorat. Layout inspired by{" "}
            <a
              href="https://gromo.in/"
              className="text-orange-400 underline-offset-2 hover:underline"
            >
              gromo.in
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
