"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

/** Lazy-load AOS runtime after paint (CSS above is small); animate once per element. */
export default function Aoscompo({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    void import("aos").then((mod) => {
      if (cancelled) return;
      mod.default.init({
        duration: 700,
        once: true,
        offset: 48,
        easing: "ease-out-cubic",
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
