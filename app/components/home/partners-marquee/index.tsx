"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FEATURE_CARDS } from "./feature-cards-data";

const AUTO_MS = 4000;
const COUNT = FEATURE_CARDS.length;

function getPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function CarouselArrow({
  direction,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-midnight_text shadow-md transition hover:border-primary hover:text-primary active:scale-95 dark:border-dark_border dark:bg-darklight dark:text-white dark:hover:border-primary ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        {direction === "prev" ? (
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function FeatureCard({
  card,
  highlighted,
}: {
  card: (typeof FEATURE_CARDS)[number];
  highlighted: boolean;
}) {
  return (
    <div
      className={`group h-full rounded-2xl bg-gradient-to-br p-[2px] transition-all duration-500 md:rounded-3xl ${
        highlighted
          ? card.gradient
          : "from-gray-200/80 via-gray-200/40 to-gray-200/80 dark:from-white/10 dark:via-white/5 dark:to-white/10"
      } ${card.hoverBorder} hover:shadow-2xl ${card.glow}`}
    >
      <article className="relative flex h-full min-h-[220px] flex-col rounded-[14px] bg-white p-5 shadow-lg transition-all duration-500 group-hover:-translate-y-0.5 dark:bg-darklight sm:min-h-[240px] sm:p-6 md:min-h-[260px] md:rounded-[22px] md:p-7">
        <div
          className={`pointer-events-none absolute inset-0 rounded-[14px] bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-[0.06] md:rounded-[22px] ${card.gradient}`}
          aria-hidden
        />

        <div
          className={`relative mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2 sm:h-16 sm:w-16 ${card.iconBg}`}
        >
          {card.icon}
        </div>

        <h3 className="relative mb-2 text-lg font-bold leading-snug text-midnight_text dark:text-white sm:text-xl">
          {card.title}
        </h3>
        <p className="relative flex-1 text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-[15px]">
          {card.description}
        </p>

        <div
          className={`relative mt-4 h-1 w-12 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-24 ${card.gradient}`}
          aria-hidden
        />
      </article>
    </div>
  );
}

export default function PartnersMarquee() {
  const [perView, setPerView] = useState(3);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const maxActive = Math.max(0, COUNT - perView);
  const resetIndex = COUNT;
  const loopSlides = [...FEATURE_CARDS, ...FEATURE_CARDS.slice(0, perView)];

  useLayoutEffect(() => {
    const sync = () => setPerView(getPerView(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    setActive(0);
    setAnimating(true);
  }, [perView]);

  const goNext = useCallback(() => {
    if (maxActive === 0) return;
    setAnimating(true);
    setActive((i) => Math.min(i + 1, resetIndex));
  }, [maxActive, resetIndex]);

  const goPrev = useCallback(() => {
    if (maxActive === 0) return;
    if (active === 0) {
      setAnimating(false);
      setActive(resetIndex);
      requestAnimationFrame(() => {
        setActive(resetIndex - 1);
        requestAnimationFrame(() => setAnimating(true));
      });
      return;
    }
    setAnimating(true);
    setActive((i) => i - 1);
  }, [maxActive, active, resetIndex]);

  const handleTransitionEnd = useCallback(() => {
    if (active === resetIndex) {
      setAnimating(false);
      setActive(0);
    }
  }, [active, resetIndex]);

  useEffect(() => {
    if (!animating && active === 0) {
      const id = requestAnimationFrame(() => setAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animating, active]);

  useEffect(() => {
    if (paused || maxActive === 0) return;
    const id = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, maxActive, goNext]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  }

  const dotIndex = maxActive > 0 ? active % (maxActive + 1) : 0;

  const trackStyle = {
    "--offset": active,
    transform: "translateX(calc(var(--offset) * -1 * (var(--partners-slide) + var(--partners-gap))))",
    transition: animating ? "transform 700ms ease-out" : "none",
  } as React.CSSProperties;

  return (
    <section
      role="region"
      className="overflow-hidden bg-white py-14 sm:py-16 md:py-20 lg:py-24 dark:bg-semidark"
      aria-labelledby="why-choose-us-heading"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto mb-8 max-w-full px-4 sm:mb-10 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <h2
          id="why-choose-us-heading"
          className="text-center text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
          data-aos="fade-up"
        >
          Why Choose Us
        </h2>
        <p
          className="mx-auto mt-2 max-w-2xl text-center text-xs text-gray dark:text-gray-400 sm:text-sm"
          data-aos="fade-up"
        >
          Trusted banks and NBFCs, quick approval, and a fully online process to get you the right offer.
        </p>
      </div>

      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="relative">
          {maxActive > 0 && (
            <>
              <CarouselArrow
                direction="prev"
                onClick={goPrev}
                className="absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex md:-left-4"
              />
              <CarouselArrow
                direction="next"
                onClick={goNext}
                className="absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 sm:inline-flex md:-right-4"
              />
            </>
          )}

          <div
            className="partners-carousel-viewport overflow-hidden sm:mx-10 md:mx-12"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="partners-carousel-track" style={trackStyle} onTransitionEnd={handleTransitionEnd}>
              {loopSlides.map((card, index) => {
                const highlighted = index >= active && index < active + perView;
                return (
                  <div key={`${card.title}-${index}`} className="partners-carousel-slide">
                    <FeatureCard card={card} highlighted={highlighted} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {maxActive > 0 && (
          <>
            <div className="mt-5 flex items-center justify-center gap-4 sm:hidden">
              <CarouselArrow direction="prev" onClick={goPrev} />
              <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Feature slides">
                {Array.from({ length: maxActive + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={index === dotIndex}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => {
                      setAnimating(true);
                      setActive(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === dotIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
              <CarouselArrow direction="next" onClick={goNext} />
            </div>

            <div
              className="mt-6 hidden items-center justify-center gap-2 sm:mt-8 sm:flex"
              role="tablist"
              aria-label="Feature slides"
            >
              {Array.from({ length: maxActive + 1 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === dotIndex}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => {
                    setAnimating(true);
                    setActive(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === dotIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
