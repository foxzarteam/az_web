"use client";

import { useEffect, useState } from "react";

const STEP_MS = 2400;
const SLIDE_MS = 700;

export type BankLogo = { src: string; alt: string };

function LogoRow({
  logos,
  direction,
  paused,
  reduced,
}: {
  logos: BankLogo[];
  direction: "left" | "right";
  paused: boolean;
  reduced: boolean;
}) {
  const count = logos.length;
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(true);

  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const timer = window.setInterval(() => setIndex((current) => current + 1), STEP_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reduced]);

  useEffect(() => {
    if (index < count) return;
    const timer = window.setTimeout(() => {
      setSlide(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, count]);

  useEffect(() => {
    if (slide || index !== 0) return;
    const frame = window.requestAnimationFrame(() => setSlide(true));
    return () => window.cancelAnimationFrame(frame);
  }, [slide, index]);

  if (count === 0) return null;

  const track = reduced ? logos : [...logos, ...logos];
  const offset = direction === "left" ? -index : index - count;

  return (
    <div
      className={reduced ? "flex flex-wrap justify-center gap-3" : "flex w-max gap-3"}
      style={
        reduced
          ? undefined
          : {
              transform: `translateX(calc(${offset} * (var(--logo-card) + 0.75rem)))`,
              transition: slide ? `transform ${SLIDE_MS}ms ease` : "none",
            }
      }
    >
      {track.map((logo, itemIndex) => (
        <div
          key={`${logo.src}-${itemIndex}`}
          className="flex h-[5.25rem] w-[var(--logo-card)] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-darklight"
          aria-hidden={!reduced && itemIndex >= count}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- local svg and webp logos, already optimized */}
          <img
            src={logo.src}
            alt={itemIndex >= count ? "" : logo.alt}
            width={160}
            height={64}
            loading={itemIndex < 8 ? "eager" : "lazy"}
            decoding="async"
            className="h-10 w-auto max-w-[7.25rem] object-contain sm:h-12"
          />
        </div>
      ))}
    </div>
  );
}

export default function BankLogoCarousel({ logos, rows = 2 }: { logos: BankLogo[]; rows?: 1 | 2 }) {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const mid = rows === 1 ? logos.length : Math.ceil(logos.length / 2);
  const top = logos.slice(0, mid);
  const bottom = rows === 1 ? [] : logos.slice(mid);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (logos.length === 0) return null;

  return (
    <div
      className="bank-logo-viewport relative flex flex-col gap-3 overflow-hidden"
      aria-label="Partner banks and lenders"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <LogoRow logos={top} direction="left" paused={paused} reduced={reduced} />
      {bottom.length > 0 ? <LogoRow logos={bottom} direction="right" paused={paused} reduced={reduced} /> : null}
    </div>
  );
}
