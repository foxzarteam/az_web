"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FEATURE_CARDS } from "./feature-cards-data";

const AUTO_MS = 2000;
const COUNT = FEATURE_CARDS.length;

function getPerView(width: number): number {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
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
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-midnight_text shadow-sm transition hover:border-primary hover:text-primary active:scale-95 dark:border-dark_border dark:bg-darklight dark:text-white dark:hover:border-primary ${className}`}
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

function FeatureCard({ card }: { card: (typeof FEATURE_CARDS)[number] }) {
  const isOrange = card.accent === "orange";

  return (
    <article className="flex h-full min-h-[200px] flex-col rounded-2xl bg-white p-4 shadow-[0_4px_24px_rgba(16,45,71,0.07)] dark:bg-darklight sm:min-h-[220px] sm:p-6">
      <div
        className={`mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-[60px] sm:w-[60px] ${
          isOrange ? "bg-[#FFF0E6]" : "bg-[#EEF0FF]"
        }`}
      >
        {card.icon}
      </div>
      <h3 className="mb-2 text-base font-bold leading-snug text-midnight_text dark:text-white sm:text-lg">
        {card.title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed text-gray dark:text-gray-400">{card.description}</p>
    </article>
  );
}

export default function PartnersMarquee() {
  const [perView, setPerView] = useState(4);
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
    transition: animating ? "transform 500ms ease-out" : "none",
  } as React.CSSProperties;

  return (
    <section
      role="region"
      className="overflow-hidden bg-[#F5F7FB] py-14 sm:py-16 md:py-20 lg:py-24 dark:bg-semidark"
      aria-labelledby="why-choose-us-heading"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto mb-8 max-w-full px-4 sm:mb-10 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <h2
          id="why-choose-us-heading"
          className="text-center text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl lg:text-[2rem]"
          data-aos="fade-up"
        >
          Why Choose <span className="theme-gradient-text">Apni Zaroorat?</span>
        </h2>
      </div>

      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="relative">
          {maxActive > 0 && (
            <>
              <CarouselArrow
                direction="prev"
                onClick={goPrev}
                className="absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex xl:-left-4"
              />
              <CarouselArrow
                direction="next"
                onClick={goNext}
                className="absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex xl:-right-4"
              />
            </>
          )}

          <div
            className="partners-carousel-viewport overflow-hidden lg:mx-10 xl:mx-12"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="partners-carousel-track" style={trackStyle} onTransitionEnd={handleTransitionEnd}>
              {loopSlides.map((card, index) => (
                <div key={`${card.title}-${index}`} className="partners-carousel-slide">
                  <FeatureCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {maxActive > 0 && (
          <>
            <div className="mt-5 flex items-center justify-center gap-4 lg:hidden">
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
              className="mt-6 hidden items-center justify-center gap-2 lg:mt-8 lg:flex"
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
