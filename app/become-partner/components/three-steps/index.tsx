"use client";

import { useState } from "react";
import Image from "next/image";
import SuccessPopup from "@/app/components/shared/SuccessPopup";

const STEP_IMAGES = ["/images/mobile/m1.png", "/images/mobile/m2.png", "/images/mobile/m3.png"];

export default function ThreeSteps() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [showAppPopup, setShowAppPopup] = useState(false);

  const steps = [
    { title: "Install Apni Zaroorat app and register" },
    { title: "Share financial product links and add customer" },
    { title: "Start earning money more than ₹1 Lakh every month" },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-darkmode dark:to-semidark py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-midnight_text dark:text-white text-center mb-10 sm:mb-12 md:mb-16">
            Start earning with 3 easy steps
          </h2>
          
          <div className="relative">
            {/* Steps Container */}
            <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 sm:gap-8 md:gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center w-full md:w-1/3 z-10 min-w-0"
                >
                  {/* Circle with Image or fallback number */}
                  <div className="relative flex items-center justify-center">
                    <div className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-40 md:h-40 rounded-full bg-primary flex items-center justify-center shadow-lg border-2 border-white dark:border-darkmode overflow-hidden">
                      {imageErrors[index] ? (
                        <span className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white relative z-10">{index + 1}</span>
                      ) : (
                        <Image
                          src={STEP_IMAGES[index]}
                          alt=""
                          fill
                          className="object-contain p-1.5 relative z-10"
                          sizes="(max-width: 480px) 128px, (max-width: 640px) 144px, 160px"
                          onError={() => setImageErrors((prev) => ({ ...prev, [index]: true }))}
                        />
                      )}
                      {/* Amplifier Animation - Sound Waves */}
                      <div className="absolute inset-0 rounded-full pointer-events-none overflow-visible">
                        <div className={`amplifier-wave amplifier-wave-1 step-${index + 1}`}></div>
                        <div className={`amplifier-wave amplifier-wave-2 step-${index + 1}`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical space between circle and text */}
                  <div className="h-4 sm:h-5 md:h-6 shrink-0" />

                  {/* Step Content */}
                  <div className="text-center max-w-[280px] xs:max-w-xs mx-auto px-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-midnight_text dark:text-white leading-tight">
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 sm:mt-12" data-aos="fade-up">
            {showAppPopup && (
              <SuccessPopup
                variant="warning"
                message="Mobile application is under construction. We will launch soon. Please wait."
                onClose={() => setShowAppPopup(false)}
                autoCloseMs={4000}
              />
            )}
            <button
              type="button"
              onClick={() => setShowAppPopup(true)}
              className="btn-shine relative inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black px-3 py-2 shadow-lg transition-opacity hover:opacity-90 sm:gap-3 sm:px-4 sm:py-2.5 md:px-5"
            >
              <span className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center shrink-0">
                <Image
                  src="/images/plays.png"
                  alt="Google Play"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </span>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Get it on
                </span>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white">
                  Google Play
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`

        /* Amplifier wave animations */
        @keyframes amplifierPulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }

        .amplifier-wave {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(47, 115, 242, 0.5);
          border-radius: 50%;
          animation: amplifierPulse 2.5s ease-out infinite;
        }

        /* Stagger amplifier animations for each step */
        .step-1 .amplifier-wave-1 {
          animation-delay: 0s;
        }
        .step-1 .amplifier-wave-2 {
          animation-delay: 1s;
        }

        .step-2 .amplifier-wave-1 {
          animation-delay: 0.5s;
        }
        .step-2 .amplifier-wave-2 {
          animation-delay: 1.5s;
        }

        .step-3 .amplifier-wave-1 {
          animation-delay: 1s;
        }
        .step-3 .amplifier-wave-2 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}
