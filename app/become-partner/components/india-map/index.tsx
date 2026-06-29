"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import {
  PUBLIC_FORM_SUBMIT_AJAX_URL,
  PUBLIC_INDIA_MAP_FALLBACK_SVG_URL,
  PUBLIC_INDIA_MAP_SVG_URL,
} from "@/app/config/constants";
import { sanitizeMobileInput, validateMobileNumber } from "@/app/utils/validation";

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

type HeroFieldErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  submit?: string;
};

const inputBaseClass =
  "w-full rounded-xl border-2 bg-white px-4 py-3 sm:py-3.5 text-sm sm:text-base text-midnight_text placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2";
const inputOkClass = `${inputBaseClass} border-blue-200 focus:border-blue-500 focus:ring-blue-300/50`;
const inputErrClass = `${inputBaseClass} border-red-500 focus:border-red-500 focus:ring-red-300/50`;

export default function IndiaMap() {
  const [visiblePins, setVisiblePins] = useState<Set<number>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<HeroFieldErrors>({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
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

    setMapInset((prev) => {
      const next = {
        left: (offsetX / ww) * 100,
        top: (offsetY / wh) * 100,
        w: (drawnW / ww) * 100,
        h: (drawnH / wh) * 100,
      };
      if (
        prev &&
        Math.abs(prev.left - next.left) < 0.05 &&
        Math.abs(prev.top - next.top) < 0.05 &&
        Math.abs(prev.w - next.w) < 0.05 &&
        Math.abs(prev.h - next.h) < 0.05
      ) {
        return prev;
      }
      return next;
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

  const clearFieldError = (key: keyof HeroFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError("phone");
    setMobile(sanitizeMobileInput(e.target.value));
  };

  const handleHeroJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const errors: HeroFieldErrors = {};

    if (!trimmedName) {
      errors.fullName = "Please enter your full name.";
    }
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    const mobileCheck = validateMobileNumber(mobile);
    if (!mobileCheck.isValid) {
      errors.phone = mobileCheck.error ?? "Please enter a valid mobile number.";
    }

    if (errors.fullName || errors.email || errors.phone) {
      setFieldErrors(errors);
      return;
    }

    if (!PUBLIC_FORM_SUBMIT_AJAX_URL) {
      setShowSuccess(true);
      setFullName("");
      setEmail("");
      setMobile("");
      setTermsAccepted(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(PUBLIC_FORM_SUBMIT_AJAX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          ...(trimmedEmail ? { email: trimmedEmail } : {}),
          phone: mobile,
          subject: "Become a Partner — Hero Join Request",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFullName("");
        setEmail("");
        setMobile("");
        setTermsAccepted(false);
        setShowSuccess(true);
      } else {
        setFieldErrors({ submit: "Something went wrong. Please try again." });
      }
    } catch {
      setFieldErrors({ submit: "Unable to submit right now. Please try again." });
    } finally {
      setLoading(false);
    }
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
              onSubmit={handleHeroJoinSubmit}
              className="w-full max-w-2xl"
              noValidate
            >
              <div className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-5 sm:p-6 md:p-8 space-y-4">
                <div>
                  <label htmlFor="hero-full-name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="hero-full-name"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Full Name"
                    required
                    value={fullName}
                    onChange={(e) => {
                      clearFieldError("fullName");
                      setFullName(e.target.value);
                    }}
                    aria-invalid={!!fieldErrors.fullName}
                    aria-describedby={fieldErrors.fullName ? "hero-full-name-error" : undefined}
                    className={fieldErrors.fullName ? inputErrClass : inputOkClass}
                  />
                  {fieldErrors.fullName ? (
                    <p id="hero-full-name-error" className="mt-1.5 text-sm text-red-600" role="alert">
                      {fieldErrors.fullName}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="hero-email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email Address (optional)"
                    value={email}
                    onChange={(e) => {
                      clearFieldError("email");
                      setEmail(e.target.value);
                    }}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "hero-email-error" : undefined}
                    className={fieldErrors.email ? inputErrClass : inputOkClass}
                  />
                  {fieldErrors.email ? (
                    <p id="hero-email-error" className="mt-1.5 text-sm text-red-600" role="alert">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="hero-phone" className="sr-only">
                    Phone Number
                  </label>
                  <div
                    className={`flex items-stretch overflow-hidden rounded-xl border-2 bg-white transition-all focus-within:ring-2 ${
                      fieldErrors.phone
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-300/50"
                        : "border-primary/30 focus-within:border-primary focus-within:ring-primary/30"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 sm:gap-2 pl-3 sm:pl-4 pr-2 sm:pr-3 bg-[#EEF0FF] shrink-0 border-r-2 ${
                        fieldErrors.phone ? "border-red-500" : "border-primary/30"
                      }`}
                    >
                      <IndiaFlag />
                      <span className="text-xs sm:text-sm font-semibold text-primary">+91</span>
                    </div>
                    <input
                      id="hero-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      value={mobile}
                      onChange={handleMobileChange}
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? "hero-phone-error" : undefined}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base text-midnight_text placeholder:text-gray-400 focus:outline-none bg-white"
                      maxLength={10}
                    />
                  </div>
                  {fieldErrors.phone ? (
                    <p id="hero-phone-error" className="mt-1.5 text-sm text-red-600" role="alert">
                      {fieldErrors.phone}
                    </p>
                  ) : null}
                </div>
                <TermsAgreementCheckbox
                  id="partner-hero-terms"
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shine relative z-0 w-full rounded-xl btn-gradient py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Joining…" : "Join Now"}
                </button>
                {fieldErrors.submit ? (
                  <p className="text-sm text-red-600 text-center" role="alert">
                    {fieldErrors.submit}
                  </p>
                ) : null}
              </div>
            </form>
          </div>

          <div className="relative bg-purple-950/30 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-5 lg:p-6 border border-purple-700/30 shadow-2xl backdrop-blur-sm">
            <div
              ref={mapWrapRef}
              className="relative mx-auto w-full min-h-[280px] h-[min(68vh,480px)] xs:h-[min(72vh,540px)] sm:h-[min(78vh,620px)] md:h-[min(82vh,700px)] lg:h-[min(85vh,820px)] xl:h-[min(86vh,900px)] overflow-hidden bg-purple-900/20"
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

              {mapInset &&
                pins.map((pin) => {
                const left = mapInset.left + (pin.x / 100) * mapInset.w;
                const top = mapInset.top + (pin.y / 100) * mapInset.h;
                const isActive = visiblePins.has(pin.id);
                return (
                <div
                  key={pin.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                >
                  <div className={`pin-container ${isActive ? "pin-visible" : "pin-hidden"}`}>
                    <svg
                      width="24"
                      height="32"
                      viewBox="0 0 24 32"
                      className="pin-icon"
                      aria-hidden
                    >
                      <path
                        d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.373 18.627 0 12 0zm0 17c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"
                        fill="#ef4444"
                        className="pin-glow"
                      />
                    </svg>
                  </div>

                  <div
                    className={`pin-label absolute bottom-full left-1/2 z-20 mb-1 w-max max-w-none -translate-x-1/2 transition-opacity duration-300 sm:mb-2 ${
                      isActive ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={!isActive}
                  >
                    <div className="pin-label__box rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-center text-[10px] font-semibold text-purple-900 shadow-lg xs:text-xs sm:px-3 sm:py-1.5">
                      <div className="font-bold whitespace-nowrap">{pin.state}</div>
                      <div className="mt-0.5 text-[9px] whitespace-nowrap xs:text-[10px]">{pin.label}</div>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" aria-hidden />
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center px-2">
            <p className="max-w-full text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white inline-block px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 theme-gradient-bg rounded-lg border border-purple-600/50 backdrop-blur-sm leading-snug">
              India&apos;s Trusted Loan & Insurance Partner Platform
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .pin-container {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .pin-hidden {
          opacity: 0;
          transform: scale(0.85);
        }

        .pin-visible {
          opacity: 1;
          transform: scale(1);
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

        .pin-label__box {
          overflow-wrap: normal;
          word-break: normal;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
