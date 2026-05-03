"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import {
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
} from "@/app/config/constants";

interface Pin {
  id: number;
  state: string;
  x: number;
  y: number;
  label: string;
  delay: number;
}

/**
 * x,y = % on the **drawn map bitmap** (0–100 left→right, top→bottom), i.e. inside the
 * letterboxed `object-contain` area — tuned for typical India political / outline SVGs.
 */
const pins: Pin[] = [
  { id: 1, state: "Delhi", x: 48, y: 18, label: "Agent joined", delay: 0 },
  { id: 2, state: "Maharashtra", x: 23, y: 54, label: "Lead submitted", delay: 0.8 },
  { id: 3, state: "Karnataka", x: 37, y: 68, label: "Commission earned", delay: 1.6 },
  { id: 4, state: "Tamil Nadu", x: 44, y: 83, label: "Agent joined", delay: 2.4 },
  { id: 5, state: "Gujarat", x: 17, y: 41, label: "Lead submitted", delay: 3.2 },
  { id: 6, state: "West Bengal", x: 65, y: 39, label: "Commission earned", delay: 4.0 },
  { id: 7, state: "Uttar Pradesh", x: 45, y: 29, label: "Agent joined", delay: 4.8 },
  { id: 8, state: "Rajasthan", x: 27, y: 26, label: "Lead submitted", delay: 5.6 },
  { id: 9, state: "Telangana", x: 40, y: 58, label: "Commission earned", delay: 6.4 },
  { id: 10, state: "Punjab", x: 42, y: 11, label: "Agent joined", delay: 7.2 },
  { id: 11, state: "Haryana", x: 44, y: 16, label: "Lead submitted", delay: 8.0 },
  { id: 12, state: "Kerala", x: 31, y: 85, label: "Commission earned", delay: 8.8 },
  { id: 13, state: "Madhya Pradesh", x: 38, y: 43, label: "Agent joined", delay: 9.6 },
  { id: 14, state: "Bihar", x: 56, y: 34, label: "Lead submitted", delay: 10.4 },
  { id: 15, state: "Odisha", x: 54, y: 49, label: "Commission earned", delay: 11.2 },
];

type MapInset = { left: number; top: number; w: number; h: number };

export default function IndiaMap() {
  const [visiblePins, setVisiblePins] = useState<Set<number>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobile, setMobile] = useState("");
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const mapImgRef = useRef<HTMLImageElement>(null);
  const [mapInset, setMapInset] = useState<MapInset | null>(null);

  const mapSrc = PUBLIC_INDIA_MAP_SVG_URL || PUBLIC_INDIA_MAP_FALLBACK_SVG_URL;

  /**
   * With `object-contain`, the <img> layout box fills the wrapper but the **picture** is
   * letterboxed inside it. Pin % must map to the drawn bitmap, not the full element rect.
   */
  const updateMapInset = useCallback(() => {
    const wrap = mapWrapRef.current;
    const img = mapImgRef.current;
    if (!wrap || !img || !img.complete || img.naturalWidth === 0) return;
    const cw = img.clientWidth;
    const ch = img.clientHeight;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const ww = wrap.clientWidth;
    const wh = wrap.clientHeight;
    if (cw <= 0 || ch <= 0 || nw <= 0 || nh <= 0 || ww <= 0 || wh <= 0) return;

    const scale = Math.min(cw / nw, ch / nh);
    const drawnW = nw * scale;
    const drawnH = nh * scale;
    const offsetX = (cw - drawnW) / 2;
    const offsetY = (ch - drawnH) / 2;

    setMapInset({
      left: (offsetX / ww) * 100,
      top: (offsetY / wh) * 100,
      w: (drawnW / ww) * 100,
      h: (drawnH / wh) * 100,
    });
  }, []);

  useLayoutEffect(() => {
    if (!mapSrc) return;
    const wrap = mapWrapRef.current;
    const img = mapImgRef.current;
    if (!wrap || !img) return;

    const schedule = () => requestAnimationFrame(() => requestAnimationFrame(updateMapInset));

    const onLoad = () => {
      if (typeof img.decode === "function") {
        void img.decode().then(schedule).catch(schedule);
      } else {
        schedule();
      }
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);
    img.addEventListener("load", onLoad);
    if (img.complete) onLoad();
    else schedule();

    return () => {
      ro.disconnect();
      img.removeEventListener("load", onLoad);
    };
  }, [mapSrc, updateMapInset]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  useEffect(() => {
    const showPin = (pinId: number) => {
      setVisiblePins((prev) => new Set(prev).add(pinId));
    };

    const hidePin = (pinId: number) => {
      setVisiblePins((prev) => {
        const newSet = new Set(prev);
        newSet.delete(pinId);
        return newSet;
      });
    };

    pins.forEach((pin) => {
      setTimeout(() => showPin(pin.id), pin.delay * 1000);
      setTimeout(() => hidePin(pin.id), (pin.delay + 5) * 1000);
    });

    const interval = setInterval(() => {
      pins.forEach((pin) => {
        setTimeout(() => showPin(pin.id), pin.delay * 1000);
        setTimeout(() => hidePin(pin.id), (pin.delay + 5) * 1000);
      });
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="partner-hero-shine bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-blue-900/50 to-blue-800/50" />
        
        <div className="container relative z-[1] mx-auto max-w-full md:max-w-screen-lg lg:max-w-screen-2xl">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3 sm:mb-4">
            Agents Across India Are Earning Daily
          </h2>

          <p className="text-white/90 text-center text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed">
            Multiple agents are working with us every day and earning real money.
            <br className="hidden sm:block" />
            <span className="sm:inline">Join India&apos;s fast-growing financial partner platform.</span>
          </p>

          <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 px-0">
            {showSuccess && (
              <SuccessPopup
                message="Thank you! Our team will contact you shortly to get you started as a partner."
                onClose={() => setShowSuccess(false)}
                autoCloseMs={3000}
              />
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuccess(true);
              }}
              className="flex w-full max-w-md items-stretch rounded-full bg-white/95 shadow-lg overflow-hidden border border-blue-100 min-h-[44px]"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-2 sm:pr-3 bg-blue-50 shrink-0">
                <IndiaFlag />
                <span className="text-xs sm:text-sm font-semibold text-blue-700 border-l border-blue-200 pl-1.5 sm:pl-2">
                  +91
                </span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                name="mobile"
                placeholder="Enter mobile number"
                required
                value={mobile}
                onChange={handleMobileChange}
                className="flex-1 min-w-0 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-midnight_text placeholder:text-gray-400 focus:outline-none"
                maxLength={10}
                pattern="[0-9]*"
              />
              <button
                type="submit"
                className="btn-shine relative z-0 px-4 sm:px-5 md:px-8 py-2 sm:py-2.5 text-sm sm:text-base font-semibold bg-[#ff7a1a] text-white hover:bg-[#ff6700] transition-colors whitespace-nowrap shrink-0"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="relative bg-blue-950/30 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 lg:p-6 border border-blue-700/30 shadow-2xl backdrop-blur-sm">
            <div
              ref={mapWrapRef}
              className="relative mx-auto w-full min-h-[400px] h-[min(82vh,560px)] xs:h-[min(84vh,620px)] sm:h-[min(85vh,700px)] md:h-[min(86vh,780px)] lg:h-[min(88vh,900px)] xl:h-[min(88vh,960px)] overflow-visible bg-blue-900/20"
            >
              {mapSrc ? (
                // External SVG URLs from env + runtime onError fallback
                // eslint-disable-next-line @next/next/no-img-element -- remote SVG, dynamic src swap
                <img
                  ref={mapImgRef}
                  src={mapSrc}
                  alt="India Map"
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-center"
                  style={{
                    filter: "brightness(0.95) contrast(1.2) saturate(1.3) hue-rotate(80deg)",
                    opacity: 0.9,
                  }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    if (
                      PUBLIC_INDIA_MAP_FALLBACK_SVG_URL &&
                      el.src !== PUBLIC_INDIA_MAP_FALLBACK_SVG_URL
                    ) {
                      el.src = PUBLIC_INDIA_MAP_FALLBACK_SVG_URL;
                    }
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/70">
                  Set NEXT_PUBLIC_INDIA_MAP_SVG_URL (and optional fallback) in .env.local for the map image.
                </div>
              )}

              {pins.map((pin) => {
                const inset = mapInset ?? { left: 0, top: 0, w: 100, h: 100 };
                const left = inset.left + (pin.x / 100) * inset.w;
                const top = inset.top + (pin.y / 100) * inset.h;
                return (
                <div
                  key={pin.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transform"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                >
                  <div
                    className={`pin-container ${visiblePins.has(pin.id) ? "pin-visible" : "pin-hidden"}`}
                  >
                    <svg
                      width="24"
                      height="32"
                      viewBox="0 0 24 32"
                      className="pin-icon"
                    >
                      <path
                        d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.373 18.627 0 12 0zm0 17c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"
                        fill="#ef4444"
                        className="pin-glow"
                      />
                    </svg>
                  </div>

                  {visiblePins.has(pin.id) && (
                    <div className="pin-label absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 sm:mb-2 z-20 max-w-[120px] xs:max-w-none">
                      <div className="bg-white text-blue-900 text-[10px] xs:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg border border-blue-200 whitespace-nowrap">
                        <div className="font-bold">{pin.state}</div>
                        <div className="text-[9px] xs:text-[10px] mt-0.5">{pin.label}</div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center px-2">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-800/50 rounded-lg border border-blue-600/50 backdrop-blur-sm">
              India&apos;s Trusted Loan & Insurance Partner Platform
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .pin-container {
          transition: all 0.3s ease;
        }

        .pin-hidden {
          opacity: 0;
          transform: scale(0);
        }

        .pin-visible {
          opacity: 1;
          transform: scale(1);
          animation: pinPop 0.8s ease-out;
        }

        @keyframes pinPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .pin-icon {
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
          animation: pinGlow 2s ease-in-out infinite;
        }

        @keyframes pinGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.9));
          }
        }

        .pin-label {
          animation: labelFadeIn 0.6s ease-out;
        }

        @keyframes labelFadeIn {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
}
