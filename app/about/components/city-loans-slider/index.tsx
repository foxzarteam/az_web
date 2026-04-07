"use client";

import Image from "next/image";
import Link from "next/link";

const SLIDE_W = 215;
const GAP = 16;

/** Files in `public/city/` */
const CITY_FILES = {
  chennai: "imgi_48_chennai.svg",
  delhi: "imgi_49_delhi.svg",
  mumbai: "imgi_50_mumbai.svg",
  bangalore: "imgi_51_bangalore.svg",
  hyderabad: "imgi_52_hyderabad.svg",
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
  { slug: "hyderabad", city: "Hyderabad" },
  { slug: "pune", city: "Pune" },
  { slug: "patna", city: "Patna" },
  { slug: "ahmedabad", city: "Ahmedabad" },
  { slug: "jaipur", city: "Jaipur" },
  { slug: "lucknow", city: "Lucknow" },
];

function CityCard({ slug, city }: { slug: CitySlug; city: string }) {
  return (
    <div
      className="shrink-0"
      style={{ width: SLIDE_W, minWidth: SLIDE_W, maxWidth: SLIDE_W }}
    >
      <Link
        href="/services/personal-loan"
        className="flex flex-col items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="flex h-[120px] w-[130px] cursor-pointer items-end justify-center rounded-2xl border-2 border-primary bg-white p-4 shadow-md dark:border-primary dark:bg-darklight md:h-[183px] md:w-[210px]">
          <Image
            src={`/city/${CITY_FILES[slug]}`}
            alt={city}
            width={120}
            height={120}
            className="h-[70px] w-[70px] max-h-full max-w-full object-contain md:h-[120px] md:w-[120px]"
            unoptimized
          />
        </div>
        <div className="mt-4 cursor-pointer text-center">
          <div className="text-center text-sm font-bold leading-[22px] tracking-normal text-[#1F1F1F] md:text-xl dark:text-white">
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
    <section className="bg-white pt-1 pb-12 dark:bg-darkmode sm:pt-2 md:pb-16">
      <div className="mx-auto w-full max-w-[1260px] px-4">
        <h2 className="mb-3 text-center text-[22px] font-bold leading-[1.25] tracking-normal text-[#1F1F1F] sm:text-[24px] md:mb-4 md:text-[30px] md:leading-snug dark:text-white">
          Instant Personal Loans and{" "}
          <span className="text-primary">insurance</span>, Now in Your City
        </h2>
        <div className="mx-auto mb-5 flex flex-col items-center gap-2 md:mb-7" aria-hidden>
          <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-primary to-transparent dark:via-primary" />
          <div className="h-1 w-24 rounded-full bg-primary sm:w-28 md:w-32" />
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-white to-transparent sm:w-12 dark:from-darkmode"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-white to-transparent sm:w-12 dark:from-darkmode"
            aria-hidden
          />

          <div className="overflow-hidden px-2 py-4 sm:px-3 md:px-4">
            <div
              className="city-marquee-track flex w-max"
              style={{ gap: GAP }}
            >
              {loop.map(({ slug, city }, i) => (
                <CityCard key={`${slug}-${i}`} slug={slug} city={city} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
