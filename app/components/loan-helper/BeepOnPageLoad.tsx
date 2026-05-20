"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { playLoanHelperBeepOnPageLoad, primeLoanHelperBeep } from "@/app/utils/loanHelperBeep";

/** Plays WhatsApp beep as early as possible on each page refresh */
export default function BeepOnPageLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    primeLoanHelperBeep();

    const delays = [0, 100, 300, 600, 1200];
    const timers = delays.map((ms) =>
      window.setTimeout(() => void playLoanHelperBeepOnPageLoad(), ms)
    );

    const onReady = () => void playLoanHelperBeepOnPageLoad();
    if (document.readyState === "complete") {
      void playLoanHelperBeepOnPageLoad();
    } else {
      window.addEventListener("load", onReady);
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", onReady);
    };
  }, [pathname]);

  return null;
}
