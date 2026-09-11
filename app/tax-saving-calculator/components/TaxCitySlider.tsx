"use client";

import Image from "next/image";
import { TAX_CALC_CITIES } from "../lib/cities";

function CityCard({ city, file }: { city: string; file: string }) {
  return (
    <div className="w-[86px] shrink-0 xs:w-[92px] sm:w-[100px] md:w-[215px] md:min-w-[215px] md:max-w-[215px]">
      <div className="flex flex-col items-center rounded-xl">
        <div className="flex h-[96px] w-full max-w-[92px] items-end justify-center rounded-xl border-2 border-primary bg-white p-2 shadow-md dark:border-primary dark:bg-darklight sm:h-[104px] sm:max-w-[100px] sm:p-2.5 md:h-[183px] md:max-w-[210px] md:rounded-2xl md:p-4">
          <Image
            src={`/city/${file}`}
            alt={`${city} tax saving calculator`}
            width={120}
            height={120}
            className="h-[48px] w-[48px] max-h-full max-w-full object-contain sm:h-[54px] sm:w-[54px] md:h-[120px] md:w-[120px]"
            unoptimized
          />
        </div>
        <div className="mt-2 text-center md:mt-4">
          <div className="text-center text-xs font-bold leading-tight tracking-normal text-[#1F1F1F] sm:text-sm md:text-xl dark:text-white">
            {city}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Visual “available in your city” strip — all point to the same calculator page. */
export default function TaxCitySlider() {
  const loop = [...TAX_CALC_CITIES, ...TAX_CALC_CITIES];

  return (
    <section className="bg-white py-12 dark:bg-darkmode md:py-16">
      <div className="mx-auto w-full max-w-[1260px] px-4">
        <h2 className="mb-3 text-center text-[22px] font-bold leading-[1.25] tracking-normal text-[#1F1F1F] sm:text-[24px] md:mb-4 md:text-[30px] md:leading-snug dark:text-white">
          Tax Saving Calculator{" "}
          <span className="text-primary">Used Across India</span>
        </h2>
        <p className="mx-auto mb-4 max-w-2xl text-center text-sm text-slate-500 dark:text-gray-400 md:mb-5">
          One free tool for every city — tax rules are pan-India.
        </p>
        <div className="mx-auto mb-5 flex flex-col items-center gap-2 md:mb-7" aria-hidden>
          <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-primary to-transparent dark:via-primary" />
          <div className="h-1 w-24 rounded-full bg-primary sm:w-28 md:w-32" />
        </div>
      </div>

      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-white to-transparent sm:w-12 md:w-16 dark:from-darkmode"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-white to-transparent sm:w-12 md:w-16 dark:from-darkmode"
          aria-hidden
        />

        <div className="overflow-hidden py-4">
          <div className="city-marquee-track flex w-max gap-2 sm:gap-2.5 md:gap-4">
            {loop.map(({ slug, city, file }, i) => (
              <CityCard key={`${slug}-${i}`} city={city} file={file} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
