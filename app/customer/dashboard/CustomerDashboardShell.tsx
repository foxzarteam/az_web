"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { customerLogout } from "@/app/utils/customerAuthApi";
import { useBodyScrollLock } from "@/app/utils/useBodyScrollLock";
import CustomerProfileMenu from "./CustomerProfileMenu";

const CUSTOMER_NAV = [
  { href: "/", label: "Home" },
  { href: "/products/personal-loan/", label: "Personal Loan" },
  { href: "/products/insurance/", label: "Insurance" },
] as const;

type CustomerDashboardShellProps = {
  name: string;
  mobile: string;
  children: React.ReactNode;
};

export default function CustomerDashboardShell({
  name,
  mobile,
  children,
}: CustomerDashboardShellProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useBodyScrollLock(sidebarOpen);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setSidebarOpen(false);
    try {
      await customerLogout();
      router.replace("/customer/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f0] text-midnight_text">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 0% 0%, rgba(66,54,251,0.08), transparent), radial-gradient(ellipse 50% 35% at 100% 0%, rgba(255,126,41,0.08), transparent)",
        }}
        aria-hidden
      />

      <header className="relative sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-midnight_text lg:hidden"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            </button>
            <Link href="/" className="inline-flex shrink-0" aria-label="Apni Zaroorat home">
              <Image
                src="/images/logo/logo.webp"
                alt="Apni Zaroorat"
                width={200}
                height={52}
                className="h-10 w-auto object-contain sm:h-11"
                priority
                unoptimized
              />
            </Link>
          </div>

          <nav
            className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex"
            aria-label="Customer"
          >
            <ul className="pointer-events-auto flex items-center gap-8">
              {CUSTOMER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-midnight_text transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex min-w-0 items-center gap-3 sm:gap-4">
            <CustomerProfileMenu name={name} mobile={mobile} />
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-midnight_text transition hover:bg-gray-50 disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {loggingOut ? "…" : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col bg-white shadow-lg transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/5 px-4">
          <p className="text-sm font-bold text-midnight_text">Menu</p>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-midnight_text"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="Customer mobile">
          {CUSTOMER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-midnight_text transition hover:bg-primary/5 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
