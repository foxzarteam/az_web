"use client";

import Image from "next/image";

const STEPS = [
  { src: "/images/cibil/1.webp", alt: "Step 1 — Open an FD. Invest a fixed deposit with us." },
  { src: "/images/cibil/2.webp", alt: "Step 2 — Get your FD credit card and start using it responsibly." },
  { src: "/images/cibil/3.webp", alt: "Step 3 — Improve your CIBIL score in a few months." },
  { src: "/images/cibil/4.webp", alt: "Step 4 — Apply for a bigger loan with better terms." },
] as const;

function scrollToApplyForm() {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function StepArrow() {
  return (
    <span
      className="pointer-events-none absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-[#4236FB] xl:block"
      aria-hidden
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
        <path
          d="M6 4.5 13 10 6 15.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function CibilBoostSection() {
  return (
    <section
      className="relative overflow-hidden bg-white py-10 dark:bg-darkmode lg:py-14"
      aria-labelledby="cibil-boost-heading"
    >
      <div
        className="pointer-events-none absolute -left-24 top-8 h-48 w-48 rounded-full bg-[#4236FB]/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-6 h-52 w-52 rounded-full bg-[#FF7E29]/[0.10] blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mb-8 text-center sm:mb-10" data-aos="fade-up">
          <h2
            id="cibil-boost-heading"
            className="text-xl font-bold leading-snug text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
          >
            Use FD Credit Card to Improve Your{" "}
            <span className="theme-gradient-text">CIBIL Score</span>
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-base">
            No Eligibility Issues! Build your credit history through responsible usage, improve your
            CIBIL score, and earn interest on your FD.
          </p>
        </div>

        <ol
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7"
          data-aos="fade-up"
        >
          {STEPS.map((step, index) => (
            <li key={step.src} className="relative h-full">
              <article className="h-full overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_10px_28px_rgba(66,54,251,0.12),0_6px_18px_rgba(255,126,41,0.10)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(66,54,251,0.18),0_10px_24px_rgba(255,126,41,0.16)] dark:border-dark_border dark:bg-darklight">
                <div className="relative aspect-[3/2] w-full bg-[#F7F9FF] dark:bg-darkmode">
                  <Image
                    src={step.src}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-1.5 sm:p-2"
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={80}
                  />
                </div>
              </article>
              {index < STEPS.length - 1 ? <StepArrow /> : null}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center sm:mt-10" data-aos="fade-up">
          <button
            type="button"
            onClick={scrollToApplyForm}
            className="btn-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(66,54,251,0.28)] transition-opacity hover:opacity-95 sm:min-h-[52px] sm:px-9 sm:text-base"
          >
            Get Started Now
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4 10h12M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
