"use client";

import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/app/config/constants";
import { scrollToElement } from "@/app/utils/scroll";

interface FeaturedCardProps {
  image?: string;
  title: string;
  description: string;
  href?: string;
}

/** Ring + conic chunk: theme primary family only */
const SEGMENT = {
  light: "#5a9bff",
  primary: COLORS.PRIMARY,
  deep: "#2563d4",
  outerRing: "#5a9bff",
} as const;

/** Space under half-overlap circle: half-diameter + extra gap before title */
const CONTENT_TOP_PAD =
  "pt-[4.85rem] xs:pt-[5.35rem] sm:pt-[5.85rem] md:pt-[6.35rem] lg:pt-[6.85rem]";

export default function FeaturedCard({ image, title, description, href }: FeaturedCardProps) {
  const handleApply = () => {
    scrollToElement("featured");
  };

  return (
    <div
      className="group relative flex w-full max-w-full min-w-0 flex-col items-stretch overflow-visible border border-slate-200/95 bg-white transition-all duration-300 min-h-[232px] sm:min-h-[256px] md:min-h-[276px] lg:min-h-[296px] dark:border-slate-700/80 dark:bg-[#1a1f2e]"
      style={{
        boxShadow:
          "0 10px 30px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-2 left-0 w-1 rounded-full opacity-90 dark:opacity-70"
        style={{
          background: `linear-gradient(180deg, #5a9bff 0%, ${COLORS.PRIMARY} 52%, #0369a1 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(47,115,242,0.12), 0 18px 40px -12px rgba(47,115,242,0.2)",
        }}
      />

      {/* Half inside / half above the card — centered on top edge */}
      <div className="absolute left-1/2 top-0 z-[3] w-[128px] -translate-x-1/2 -translate-y-1/2 xs:w-[140px] sm:w-[152px] md:w-[164px] lg:w-[176px]">
        <div className="relative aspect-square w-full">
          <svg
            className="featured-card-ring-dashed absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={SEGMENT.outerRing}
              strokeWidth="1.5"
              strokeDasharray="44 18 32 22"
              strokeLinecap="round"
              className="dark:opacity-80"
              opacity="0.95"
              transform="rotate(-12 50 50)"
            />
          </svg>

          <div
            className="featured-card-ring-conic pointer-events-none absolute inset-[5px] z-[1] rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)] xs:inset-[6px] sm:inset-[7px]"
            style={{
              background: `conic-gradient(from 180deg at 50% 50%, ${SEGMENT.light} 0deg 180deg, ${SEGMENT.primary} 180deg 270deg, ${SEGMENT.deep} 270deg 360deg)`,
              WebkitMaskImage:
                "radial-gradient(farthest-side, transparent calc(100% - 12px), black 100%)",
              maskImage:
                "radial-gradient(farthest-side, transparent calc(100% - 12px), black 100%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          />

          <div className="absolute inset-[9px] z-[2] flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-white to-primary/30 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] xs:inset-[10px] xs:p-1.5 sm:inset-[11px] sm:p-1.5 md:inset-[12px] md:p-2 dark:from-primary/25 dark:via-slate-900 dark:to-primary/20 dark:shadow-none">
            <div className="relative flex h-full w-full min-w-0 items-center justify-center">
              <div
                className="relative aspect-square h-full max-h-full w-full min-w-0 overflow-hidden rounded-full border border-slate-200/90 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-100 dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              >
                {image ? (
                  <div className="absolute inset-0">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 128px, 176px"
                      className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary/55 xs:text-xl sm:text-2xl md:text-[1.65rem]">
                    {title.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative z-[1] flex min-w-0 flex-col items-center gap-1.5 px-3 pb-0 text-center xs:gap-2 xs:px-4 xs:pb-0.5 sm:gap-2 sm:px-5 sm:pb-0.5 md:px-6 md:pb-0.5 lg:px-7 lg:pb-1 ${CONTENT_TOP_PAD}`}
      >
        <div className="w-full min-w-0">
          <Link
            href={href ?? "/#featured"}
            className="block w-full rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <h3
              className="text-[0.95rem] font-bold uppercase leading-snug tracking-[0.04em] xs:text-base xs:tracking-[0.05em] sm:text-lg md:text-xl md:tracking-[0.055em] lg:text-2xl lg:tracking-[0.06em] xl:text-[1.65rem]"
              style={{ color: COLORS.PRIMARY }}
            >
              {title}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-600 xs:mt-2 xs:text-[0.8125rem] sm:mt-2 sm:text-sm md:text-base md:leading-relaxed lg:text-[1.05rem] xl:text-lg dark:text-slate-400 line-clamp-2 sm:line-clamp-3">
            {description}
          </p>
        </div>

        <Link
          href={href ?? "/#featured"}
          onClick={href ? undefined : handleApply}
          className="relative inline-flex w-full max-w-md shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 xs:gap-2 xs:px-3.5 xs:py-2 xs:text-[0.75rem] xs:tracking-[0.09em] sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-[0.1em] md:px-5 md:py-3 md:text-sm md:tracking-[0.11em] lg:text-[0.9375rem] lg:tracking-[0.12em]"
          style={{
            background: `linear-gradient(180deg, #5a9bff 0%, ${COLORS.PRIMARY} 42%, #2563d4 100%)`,
            boxShadow:
              "0 4px 14px rgba(47,115,242,0.45), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",
          }}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0 -ml-0.5 xs:h-4 xs:w-4 sm:h-[1.05rem] sm:w-[1.05rem] md:h-5 md:w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4.037 4.688a.53.53 0 0 1 .78-.581l14.7 8.5a.53.53 0 0 1 0 .918l-14.7 8.5a.53.53 0 0 1-.78-.581V4.688z" />
          </svg>
          Apply now
        </Link>
      </div>
    </div>
  );
}
