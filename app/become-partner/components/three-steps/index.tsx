"use client";

import Image from "next/image";

export default function ThreeSteps() {
  const steps = [
    {
      number: "1",
      title: "Install Apni Zaroorat app and register",
      description: "Download the app and create your account to get started.",
    },
    {
      number: "2",
      title: "Share financial product links and add customer",
      description: "Learn about products and share links with your network.",
    },
    {
      number: "3",
      title: "Start earning money more than ₹1 Lakh every month",
      description: "Earn commissions on every successful application.",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-white to-gray-50 dark:from-darkmode dark:to-semidark py-20 px-4">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight_text dark:text-white text-center mb-16">
            Start earning with 3 easy steps
          </h2>
          
          <div className="relative">
            {/* Steps Container */}
            <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center w-full md:w-1/3 z-10"
                >
                  {/* Circle with Number */}
                  <div className={`relative flex items-center justify-center ${index === 2 ? 'mb-10 md:mb-12' : 'mb-6'}`}>
                    {/* Small Circle */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg relative z-20 border-2 border-white dark:border-darkmode">
                      <span className="text-2xl sm:text-3xl md:text-3xl font-bold text-white">{step.number}</span>
                      
                      {/* Amplifier Animation - Sound Waves */}
                      <div className="absolute inset-0 rounded-full pointer-events-none overflow-visible">
                        <div className={`amplifier-wave amplifier-wave-1 step-${index + 1}`}></div>
                        <div className={`amplifier-wave amplifier-wave-2 step-${index + 1}`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="text-center max-w-xs mx-auto">
                    <h3 className="text-lg sm:text-xl md:text-xl font-bold text-midnight_text dark:text-white mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-12" data-aos="fade-up">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-xl bg-black px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg border border-white/10"
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <Image
                  src="/images/plays.png"
                  alt="Google Play"
                  width={28}
                  height={28}
                  className="h-7 w-7"
                />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Get it on
                </span>
                <span className="text-sm sm:text-base font-semibold text-white">
                  Google Play
                </span>
              </div>
            </a>
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
