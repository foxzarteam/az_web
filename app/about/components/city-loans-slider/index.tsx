"use client";

import Image from "next/image";
import Link from "next/link";

/** Files in `public/city/` */
const CITY_FILES = {
  chennai: "imgi_48_chennai.svg",
  delhi: "imgi_49_delhi.svg",
  mumbai: "imgi_50_mumbai.svg",
  bangalore: "imgi_51_bangalore.svg",
  pune: "imgi_53_pune.svg",
  patna: "imgi_54_patna.svg",
  ahmedabad: "imgi_55_ahemdabad.svg",
  jaipur: "imgi_56_jaipur.svg",
  lucknow: "imgi_57_lucknow.svg",
} as const;

type CitySlug = keyof typeof CITY_FILES;

const CITIES: { slug: CitySlug; city: string }[] = [
  { slug: "chennai", city: "Chennai" },
  { slug: "delhi", city: "Delhi" },
  { slug: "mumbai", city: "Mumbai" },
  { slug: "bangalore", city: "Bangalore" },
  { slug: "pune", city: "Pune" },
  { slug: "patna", city: "Patna" },
  { slug: "ahmedabad", city: "Ahmedabad" },
  { slug: "jaipur", city: "Jaipur" },
  { slug: "lucknow", city: "Lucknow" },
];

function CityCard({ slug, city }: { slug: CitySlug; city: string }) {
  return (
    <div className="shrink-0 w-[calc((100vw-1.25rem)/3)] max-w-[118px] min-w-[86px] md:w-[215px] md:min-w-[215px] md:max-w-[215px]">
      <Link
        href="/services/personal-loan"
        className="flex flex-col items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="flex h-[96px] w-full max-w-[92px] cursor-pointer items-end justify-center rounded-xl border-2 border-primary bg-white p-2 shadow-md dark:border-primary dark:bg-darklight sm:h-[104px] sm:max-w-[100px] sm:p-2.5 md:h-[183px] md:max-w-[210px] md:rounded-2xl md:p-4">
          <Image
            src={`/city/${CITY_FILES[slug]}`}
            alt={city}
            width={120}
            height={120}
            className="h-[48px] w-[48px] max-h-full max-w-full object-contain sm:h-[54px] sm:w-[54px] md:h-[120px] md:w-[120px]"
            unoptimized
          />
        </div>
        <div className="mt-2 cursor-pointer text-center md:mt-4">
          <div className="text-center text-xs font-bold leading-tight tracking-normal text-[#1F1F1F] sm:text-sm md:text-xl dark:text-white">
            {city}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CityLoansSlider() {
  const loop = [...CITIES, ...CITIES];

  return (
    <section className="bg-white py-12 dark:bg-darkmode md:py-16">
      <div className="mx-auto w-full max-w-[1260px] px-4">
        <h2 className="mb-3 text-center text-[22px] font-bold leading-[1.25] tracking-normal text-[#1F1F1F] sm:text-[24px] md:mb-4 md:text-[30px] md:leading-snug dark:text-white">
          Instant Loans and{" "}
          <span className="text-primary">insurance</span>, Now in Your City
        </h2>
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
            {loop.map(({ slug, city }, i) => (
              <CityCard key={`${slug}-${i}`} slug={slug} city={city} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
