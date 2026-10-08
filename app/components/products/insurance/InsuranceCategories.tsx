"use client";

import { useInsuranceTypeOptions } from "@/app/lib/services/useInsuranceTypeOptions";
import { insuranceTypeImageSrc, INSURANCE_TYPE_OPTIONS } from "@/app/lib/leads/leadForm";

function cardImage(value: string, image?: string): string {
  const fromDb = insuranceTypeImageSrc(image);
  if (fromDb) return fromDb;
  const known = INSURANCE_TYPE_OPTIONS.find((item) => item.value === value);
  return insuranceTypeImageSrc(known?.image);
}

export default function InsuranceCategories() {
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
          {cards.map((item) => (
            <li key={item.value} className="h-full">
              <article className="flex h-full flex-col items-center rounded-2xl bg-[#EEF0FF] px-3 py-4 text-center transition duration-300 hover:-translate-y-1 hover:bg-[#E4E0FF] hover:shadow-[0_10px_28px_rgba(66,54,251,0.12)] dark:bg-primary/15 dark:hover:bg-primary/25 sm:px-4 sm:py-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  width={64}
                  height={64}
                  decoding="async"
                  loading="lazy"
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                />
                <p className="mt-3 text-xs font-semibold leading-snug text-midnight_text dark:text-white sm:text-sm">
                  {item.label}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
