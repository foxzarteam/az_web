"use client";

import { useEffect, useRef, useState } from "react";

/** Start the file only when the block is near the screen, so the first paint stays light. */
export default function ServiceVideo({ src, label }: { src: string; label: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { rootMargin: "240px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-light shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900/40">
      <div ref={frameRef} className="relative aspect-video w-full overflow-hidden">
        {active ? (
          <video
            className="pointer-events-none absolute left-1/2 top-1/2 block min-w-full select-none object-cover object-center"
            style={{
              height: "calc(100% + 10px)",
              width: "100%",
              transform: "translate(-50%, -50%) scale(1.07)",
              transformOrigin: "center center",
            }}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            preload="metadata"
            aria-label={label}
            tabIndex={-1}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : null}
      </div>
    </div>
  );
}
