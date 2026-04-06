"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import FeaturedCard from "./featured-card";
import { useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
import { useRemoteServiceCards } from "@/app/lib/services/useRemoteServiceCards";
import type { ServicesFetchStatus } from "@/app/lib/services/types";

function emptySliderCopy(status: ServicesFetchStatus): string {
  if (status === "error") {
    return "Could not load services. Check NEXT_PUBLIC_API_URL and GET /api/services on your backend.";
  }
  return "No active services to show right now.";
}

const AUTO_ADVANCE_MS = 4000;
const SLIDE_DURATION_MS = 520;

function gapPxForViewport(): number {
  if (typeof window === "undefined") return 12;
  if (window.matchMedia("(min-width: 1024px)").matches) return 32;
  if (window.matchMedia("(min-width: 640px)").matches) return 24;
  return 12;
}

/** Tailwind md — mobile / small: one card; md+: two */
function isTwoCardsPerView(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

export default function Listing() {
  const fromLayout = useServiceCards();
  const { cards, status, isLoading } = useRemoteServiceCards(fromLayout);

  const baseCards = isLoading ? [] : cards;
  const fetchStatus = isLoading ? null : status;
  const n = baseCards.length;

  const deckKey = useMemo(() => baseCards.map((c) => c.href).join("|"), [baseCards]);

  const trackCards = useMemo((): ServiceSliderCard[] => {
    if (n <= 1) return baseCards;
    return [...baseCards, ...baseCards];
  }, [baseCards, n]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardWidthPx, setCardWidthPx] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState<1 | 2>(1);
  const [gapPx, setGapPx] = useState(12);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideTransition, setSlideTransition] = useState(true);
  const slideIndexRef = useRef(0);

  const stepPx = n <= 1 ? 0 : cardWidthPx > 0 ? cardWidthPx + gapPx : 0;

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const twoUp = isTwoCardsPerView();
    // Mobile one-up: no gap so each slide is full viewport width (no peek of next card)
    const g =
      n <= 1 ? 0 : twoUp ? gapPxForViewport() : 0;
    setGapPx(g);
    setSlidesPerView(twoUp ? 2 : 1);
    if (n <= 1) {
      setCardWidthPx(w);
      return;
    }
    if (twoUp) {
      const half = (w - g) / 2;
      setCardWidthPx(Math.max(0, half));
    } else {
      setCardWidthPx(Math.max(0, w));
    }
  }, [n]);

  useLayoutEffect(() => {
    measure();
    const el = viewportRef.current;
    const ro = new ResizeObserver(() => measure());
    if (el) ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, deckKey]);

  useEffect(() => {
    setSlideIndex(0);
    slideIndexRef.current = 0;
    setSlideTransition(true);
  }, [deckKey]);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  const snapToStartAfterLoop = useCallback(() => {
    setSlideTransition(false);
    setSlideIndex(0);
    slideIndexRef.current = 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideTransition(true));
    });
  }, []);

  const onTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;
      if (slideIndexRef.current === n && n >= 2) {
        snapToStartAfterLoop();
      }
    },
    [n, snapToStartAfterLoop]
  );

  const goNext = useCallback(() => {
    if (n < 2) return;
    if (slideIndexRef.current >= n) return;
    setSlideTransition(true);
    setSlideIndex((i) => {
      if (i === n - 1) return n;
      return i + 1;
    });
  }, [n]);

  const goPrev = useCallback(() => {
    if (n < 2) return;
    const i = slideIndexRef.current;
    if (i > 0) {
      setSlideTransition(true);
      setSlideIndex(i - 1);
      return;
    }
    setSlideTransition(false);
    setSlideIndex(n);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlideTransition(true);
        setSlideIndex(n - 1);
      });
    });
  }, [n]);

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  useEffect(() => {
    if (n < 2 || stepPx <= 0) return;
    const id = setInterval(() => goNextRef.current(), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [n, stepPx, deckKey]);

  const translateX =
    n < 2 || stepPx <= 0 ? 0 : -(slideIndex * stepPx);

  const trackStyle: CSSProperties =
    n < 2
      ? {}
      : {
          gap: gapPx,
          transform: `translate3d(${translateX}px,0,0)`,
          transition: slideTransition
            ? `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
            : "none",
          willChange: "transform",
        };

  return (
    <section id="featured" className="bg-light dark:bg-semidark flex justify-center items-center overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <h1
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 md:mb-12 text-midnight_text dark:text-white text-center"
          data-aos="fade-up"
        >
          Our Services
        </h1>
        <div className="relative -mx-4 sm:mx-0 px-3 xs:px-4 sm:px-11 md:px-14 lg:px-16 xl:px-[4.5rem]">
          <div
            className="min-h-[1px] overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28"
            ref={viewportRef}
          >
            {isLoading ? (
              <div
                className="flex justify-center items-center min-h-[340px] sm:min-h-[400px] text-midnight_text/70 dark:text-white/70"
                role="status"
                aria-live="polite"
              >
                Loading services…
              </div>
            ) : n === 0 ? (
              <div
                className="flex justify-center items-center min-h-[200px] sm:min-h-[240px] text-midnight_text/80 dark:text-white/80 text-center px-4 text-sm sm:text-base max-w-lg mx-auto"
                role="status"
              >
                {emptySliderCopy(fetchStatus ?? "ok")}
              </div>
            ) : (
              <>
                <div
                  className={n === 1 ? "flex w-full" : "flex w-max"}
                  style={
                    n === 1
                      ? { gap: 0 }
                      : trackStyle
                  }
                  onTransitionEnd={n >= 2 ? onTrackTransitionEnd : undefined}
                >
                  {trackCards.map((card, index) => (
                    <div
                      key={`${card.href}-${index}`}
                      className={
                        n === 1
                          ? "shrink-0 w-full min-w-0 max-w-full"
                          : "shrink-0 box-border min-w-0 max-w-full md:max-w-none"
                      }
                      style={
                        n === 1
                          ? undefined
                          : cardWidthPx > 0
                            ? { width: cardWidthPx }
                            : slidesPerView === 2
                              ? {
                                  minWidth: "max(11rem, calc(50vw - 3.75rem))",
                                }
                              : {
                                  minWidth:
                                    "max(11rem, calc(100vw - 2rem))",
                                }
                      }
                    >
                      <FeaturedCard
                        image={card.image}
                        title={card.title}
                        description={card.description}
                        href={card.href}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {n >= 2 && !isLoading ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous"
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-colors shadow-md hover:shadow-lg group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next"
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-colors shadow-md hover:shadow-lg group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
          ) : null}
        </div>

        {!isLoading && n >= 2 ? (
          <div className="flex justify-center items-center gap-3 mt-6 sm:mt-8 md:hidden">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-colors shadow-sm hover:shadow-md group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-colors shadow-sm hover:shadow-md group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
