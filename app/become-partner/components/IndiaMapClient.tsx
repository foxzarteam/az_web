"use client";

import { useEffect, useState } from "react";
import IndiaMap from "./india-map";

export default function IndiaMapClient() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

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
