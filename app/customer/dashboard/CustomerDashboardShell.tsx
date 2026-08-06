"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { customerLogout } from "@/app/utils/customerAuthApi";
import CustomerProfileMenu from "./CustomerProfileMenu";

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

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
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
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
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
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
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

      <main className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
