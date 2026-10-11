"use client";

import { useInsuranceTypeOptions } from "@/app/lib/services/useInsuranceTypeOptions";
import { insuranceTypeImageSrc, INSURANCE_TYPE_OPTIONS } from "@/app/lib/leads/leadForm";
import { useInsuranceSelection } from "@/app/components/products/insurance/insuranceSelection";

function cardImage(value: string, image?: string): string {
  const fromDb = insuranceTypeImageSrc(image);
  if (fromDb) return fromDb;
  const known = INSURANCE_TYPE_OPTIONS.find((item) => item.value === value);
  return insuranceTypeImageSrc(known?.image);
}

export default function InsuranceCategories() {
  const selection = useInsuranceSelection();
  const selectedValue = selection?.value ?? "health_insurance";
  const types = useInsuranceTypeOptions();
  const cards = types
    .map((item) => ({ ...item, src: cardImage(item.value, item.image) }))
    .filter((item) => item.src);

  if (cards.length === 0) return null;

  return (
    <section className="bg-white !py-10 dark:bg-darkmode lg:!py-14" aria-labelledby="insurance-categories-heading">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mb-8 text-center sm:mb-10" data-aos="fade-up">
          <h2
            id="insurance-categories-heading"
            className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
          >
            Best Protection Starts With <span className="theme-gradient-text">Smart Insurance</span>
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6" data-aos="fade-up">
          {cards.map((item) => {
            const selected = item.value === selectedValue;
            return (
              <li key={item.value} className="h-full">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selection?.setValue(item.value)}
                  className={`flex h-full w-full flex-col items-center rounded-2xl p-[2px] text-center transition duration-300 ${
                    selected
                      ? "-translate-y-1 bg-[linear-gradient(90deg,#4236FB_0%,#4236FB_42%,#FF7E29_100%)] shadow-[0_16px_34px_rgba(66,54,251,0.22)]"
                      : "bg-transparent hover:-translate-y-0.5"
                  }`}
                >
                  <span className="relative flex h-full w-full flex-col items-center rounded-[14px] bg-[#EEF0FF] px-3 py-4 sm:px-4 sm:py-5">
                    {selected ? (
                      <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(90deg,#4236FB,#FF7E29)] text-white shadow-[0_4px_10px_rgba(66,54,251,0.35)]">
                        <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                          <path d="M3.5 8.2 6.4 11l6.1-6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt=""
                      width={64}
                      height={64}
                      decoding="async"
                      className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                    />
                    <p className="mt-3 text-xs font-semibold leading-snug text-midnight_text sm:text-sm">
                      {item.label}
                    </p>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
