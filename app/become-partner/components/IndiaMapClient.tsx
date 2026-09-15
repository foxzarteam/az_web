"use client";

import { useIsMounted } from "@/app/hooks/useIsMounted";
import IndiaMap from "./india-map";

export default function IndiaMapClient() {
  const ready = useIsMounted();

  if (!ready) {
    return (
      <section
        className="partner-hero-shine relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 px-4 py-12 sm:px-6 sm:py-16 md:py-20"
        aria-hidden
      >
        <div className="mx-auto h-[28rem] max-w-5xl rounded-3xl bg-white/10" />
      </section>
    );
  }

  return <IndiaMap />;
}
