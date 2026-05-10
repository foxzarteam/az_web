import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS } from "@/app/config/constants";

const applyBtnClass =
  "relative inline-flex w-auto shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-5 sm:py-3 sm:text-sm md:text-base";

const applyBtnStyle: CSSProperties = {
  background: `linear-gradient(180deg, #5a9bff 0%, ${COLORS.PRIMARY} 42%, #2563d4 100%)`,
  boxShadow:
    "0 4px 14px rgba(47,115,242,0.45), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",
};

function PlayIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 -ml-0.5 sm:h-5 sm:w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.037 4.688a.53.53 0 0 1 .78-.581l14.7 8.5a.53.53 0 0 1 0 .918l-14.7 8.5a.53.53 0 0 1-.78-.581V4.688z" />
    </svg>
  );
}

function ServiceVideo({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-light shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900/40">
      <div className="relative aspect-video w-full overflow-hidden">
        <video
          className="absolute left-1/2 top-1/2 block min-w-full object-cover object-center"
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
          controls
          preload="auto"
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default function Listing() {
  return (
    <section
      id="featured"
      className="flex justify-center overflow-hidden bg-white py-12 sm:py-16 lg:py-20 dark:bg-semidark"
    >
      <div className="container mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md">
        <h1
          className="mb-10 text-center text-xl font-bold text-midnight_text dark:text-white xs:text-2xl sm:mb-14 sm:text-3xl md:mb-16 md:text-4xl"
          data-aos="fade-up"
        >
          Our Services
        </h1>

        <div className="flex flex-col gap-14 lg:gap-20">
          {/* Personal loan: video left, copy right */}
          <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
            <div className="w-full lg:w-1/2">
              <ServiceVideo src="/vdo/loan.mp4" label="Personal loan promotional video" />
            </div>
            <div className="flex w-full flex-col justify-center gap-4 text-left lg:w-1/2">
              <h2
                className="text-2xl font-bold uppercase tracking-[0.06em] sm:text-3xl md:text-4xl"
                style={{ color: COLORS.PRIMARY }}
              >
                Personal loan
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                Paperless process at low rate. Quick approval and funds disbursed with minimal
                paperwork.
              </p>
              <div className="flex justify-start">
                <Link
                  href="/services/personal-loan"
                  className={applyBtnClass}
                  style={applyBtnStyle}
                >
                  <PlayIcon />
                  Apply now
                </Link>
              </div>
            </div>
          </div>

          {/* Insurance: copy left, video right */}
          <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
            <div className="order-2 flex w-full flex-col justify-center gap-4 text-left lg:order-1 lg:w-1/2">
              <h2
                className="text-2xl font-bold uppercase tracking-[0.06em] sm:text-3xl md:text-4xl"
                style={{ color: COLORS.PRIMARY }}
              >
                Insurance
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                Protect your life, health, and assets with plans tailored to your needs.
              </p>
              <div className="flex justify-start">
                <Link href="/services/insurance" className={applyBtnClass} style={applyBtnStyle}>
                  <PlayIcon />
                  Apply now
                </Link>
              </div>
            </div>
            <div className="order-1 w-full lg:order-2 lg:w-1/2">
              <ServiceVideo src="/vdo/insu.mp4" label="Insurance promotional video" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
