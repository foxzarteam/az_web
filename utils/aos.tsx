"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

/** Lazy-load AOS runtime after paint (CSS above is small); animate once per element. */
export default function Aoscompo({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      void import("aos").then((mod) => {
        if (cancelled) return;
        mod.default.init({
          duration: 500,
          once: true,
          offset: 48,
          easing: "ease-out-cubic",
        });
        document.documentElement.setAttribute("data-aos-ready", "true");
      });
    };
    const idle = window.requestIdleCallback?.(start, { timeout: 1200 });
    const timer = idle == null ? window.setTimeout(start, 0) : undefined;
    return () => {
      cancelled = true;
      if (idle != null) window.cancelIdleCallback?.(idle);
      if (timer != null) window.clearTimeout(timer);
    };
  }, []);

  return <>{children}</>;
}
