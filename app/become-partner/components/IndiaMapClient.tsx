"use client";

import { useIsMounted } from "@/app/hooks/useIsMounted";
import IndiaMap from "./india-map";

export default function IndiaMapClient({ children }: { children?: React.ReactNode }) {
  const ready = useIsMounted();

  if (!ready) {
    return (
      <>
        <section
          className="relative overflow-hidden bg-gray-100 px-4 py-12 sm:px-6 sm:py-16 md:py-20"
          aria-hidden
        >
          <div className="mx-auto h-[28rem] max-w-5xl rounded-3xl bg-white/10" />
        </section>
        {children}
      </>
    );
  }

  return <IndiaMap>{children}</IndiaMap>;
}
