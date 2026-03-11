"use client";

import { useEffect, useState } from "react";

interface Pin {
  id: number;
  state: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  label: string;
  delay: number;
}

const pins: Pin[] = [
  { id: 1, state: "Delhi", x: 45, y: 25, label: "Agent joined", delay: 0 },
  { id: 2, state: "Maharashtra", x: 30, y: 55, label: "Lead submitted", delay: 0.5 },
  { id: 3, state: "Rajasthan", x: 35, y: 35, label: "Commission earned", delay: 1 },
  { id: 4, state: "UP", x: 42, y: 30, label: "Agent joined", delay: 1.5 },
  { id: 5, state: "Bihar", x: 48, y: 40, label: "Lead submitted", delay: 2 },
  { id: 6, state: "Karnataka", x: 35, y: 70, label: "Commission earned", delay: 2.5 },
  { id: 7, state: "Tamil Nadu", x: 38, y: 85, label: "Agent joined", delay: 3 },
  { id: 8, state: "Gujarat", x: 25, y: 45, label: "Lead submitted", delay: 3.5 },
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

    // Show pins one by one
    pins.forEach((pin) => {
      setTimeout(() => showPin(pin.id), pin.delay * 1000);
      setTimeout(() => hidePin(pin.id), (pin.delay + 2) * 1000);
    });

    // Loop animation
    const interval = setInterval(() => {
      pins.forEach((pin) => {
        setTimeout(() => showPin(pin.id), pin.delay * 1000);
        setTimeout(() => hidePin(pin.id), (pin.delay + 2) * 1000);
      });
    }, 8000); // Total cycle time

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 py-20 px-4 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-800/50"></div>
        
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Agents Across India Are Earning Daily
          </h2>

          {/* Subtitle */}
          <p className="text-white/90 text-center text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            Multiple agents are working with us every day and earning real money.
            <br />
            Join India&apos;s fast-growing financial partner platform.
          </p>

          {/* Map Container */}
          <div className="relative bg-blue-950/30 rounded-2xl p-6 sm:p-8 md:p-12 border border-blue-700/30 shadow-2xl backdrop-blur-sm">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
              {/* Simplified India Map SVG */}
              <svg
                viewBox="0 0 1000 1200"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* India outline - simplified shape */}
                <path
                  d="M 300 200 L 400 180 L 500 200 L 600 220 L 650 250 L 680 300 L 700 400 L 680 500 L 650 600 L 600 700 L 550 800 L 500 900 L 450 1000 L 400 1100 L 350 1150 L 300 1100 L 250 1000 L 200 900 L 180 800 L 200 700 L 250 600 L 280 500 L 300 400 L 320 300 L 300 200 Z"
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="rgba(59, 130, 246, 0.5)"
                  strokeWidth="3"
                />
              </svg>

              {/* Location Pins */}
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                  }}
                >
                  {/* Pin */}
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

                  {/* Floating Label */}
                  {visiblePins.has(pin.id) && (
                    <div className="pin-label absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                      <div className="bg-white text-blue-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-blue-200">
                        {pin.label}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Line */}
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
          animation: pinPop 0.5s ease-out;
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
          animation: labelFadeIn 0.4s ease-out;
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
