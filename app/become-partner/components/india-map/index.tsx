"use client";

import { useEffect, useState } from "react";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";

interface Pin {
  id: number;
  state: string;
  x: number;
  y: number;
  label: string;
  delay: number;
}

const pins: Pin[] = [
  { id: 1, state: "Delhi", x: 47, y: 21, label: "Agent joined", delay: 0 },
  { id: 2, state: "Maharashtra", x: 30, y: 50, label: "Lead submitted", delay: 0.8 },
  { id: 3, state: "Karnataka", x: 33, y: 66, label: "Commission earned", delay: 1.6 },
  { id: 4, state: "Tamil Nadu", x: 38, y: 80, label: "Agent joined", delay: 2.4 },
  { id: 5, state: "Gujarat", x: 28, y: 42, label: "Lead submitted", delay: 3.2 },
  { id: 6, state: "West Bengal", x: 57, y: 36, label: "Commission earned", delay: 4.0 },
  { id: 7, state: "Uttar Pradesh", x: 46, y: 26, label: "Agent joined", delay: 4.8 },
  { id: 8, state: "Rajasthan", x: 34, y: 28, label: "Lead submitted", delay: 5.6 },
  { id: 9, state: "Telangana", x: 37, y: 60, label: "Commission earned", delay: 6.4 },
  { id: 10, state: "Punjab", x: 41, y: 16, label: "Agent joined", delay: 7.2 },
  { id: 11, state: "Haryana", x: 43, y: 19, label: "Lead submitted", delay: 8.0 },
  { id: 12, state: "Kerala", x: 32, y: 76, label: "Commission earned", delay: 8.8 },
  { id: 13, state: "Madhya Pradesh", x: 37, y: 40, label: "Agent joined", delay: 9.6 },
  { id: 14, state: "Bihar", x: 53, y: 33, label: "Lead submitted", delay: 10.4 },
  { id: 15, state: "Odisha", x: 51, y: 50, label: "Commission earned", delay: 11.2 },
];

export default function IndiaMap() {
  const [visiblePins, setVisiblePins] = useState<Set<number>>(new Set());

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
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-800/50"></div>
        
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Agents Across India Are Earning Daily
          </h2>

          <p className="text-white/90 text-center text-base sm:text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
            Multiple agents are working with us every day and earning real money.
            <br />
            Join India&apos;s fast-growing financial partner platform.
          </p>

          <div className="flex justify-center mb-10">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md items-stretch rounded-full bg-white/95 shadow-lg overflow-hidden border border-blue-100"
            >
              <div className="flex items-center gap-2 pl-4 pr-3 bg-blue-50">
                <IndiaFlag />
                <span className="text-xs sm:text-sm font-semibold text-blue-700 border-l border-blue-200 pl-2">
                  +91
                </span>
              </div>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                className="flex-1 px-3 sm:px-4 py-2.5 text-sm sm:text-base text-midnight_text placeholder:text-gray-400 focus:outline-none"
                maxLength={10}
              />
              <button
                type="submit"
                className="px-5 sm:px-8 py-2.5 text-sm sm:text-base font-semibold bg-[#ff7a1a] text-white hover:bg-[#ff6700] transition-colors whitespace-nowrap"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="relative bg-blue-950/30 rounded-2xl p-6 sm:p-8 md:p-12 border border-blue-700/30 shadow-2xl backdrop-blur-sm">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-visible bg-blue-900/20">
              <img
                src="https://simplemaps.com/static/svg/country/in/admin1/in.svg"
                alt="India Map"
                className="w-full h-full object-contain"
                style={{
                  filter: "brightness(0.95) contrast(1.2) saturate(1.3) hue-rotate(80deg)",
                  opacity: 0.9,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/4/41/India_states_and_union_territories_map.svg";
                }}
              />

              {pins.map((pin) => (
                <div
                  key={pin.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
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
                    <div className="pin-label absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap z-20">
                      <div className="bg-white text-blue-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-blue-200">
                        <div className="font-bold">{pin.state}</div>
                        <div className="text-[10px] mt-0.5">{pin.label}</div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl sm:text-2xl font-bold text-white inline-block px-6 py-3 bg-blue-800/50 rounded-lg border border-blue-600/50 backdrop-blur-sm">
              India&apos;s Trusted Loan & Credit Card Partner Platform
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
