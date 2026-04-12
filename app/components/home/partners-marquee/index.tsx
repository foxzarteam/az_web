import Image from "next/image";
import { PARTNERS, type PartnerEntry } from "./partners-data";

function PartnerTile({
  partner,
  priority,
}: {
  partner: PartnerEntry;
  priority?: boolean;
}) {
  if ("src" in partner) {
    return (
      <div className="flex h-[52px] w-[160px] shrink-0 items-center justify-center rounded-xl border border-gray-200/90 bg-white px-2 py-1.5 shadow-sm dark:border-gray-700/80 dark:bg-darklight sm:h-[56px] sm:w-[176px]">
        <Image
          src={partner.src}
          alt={partner.name}
          width={152}
          height={48}
          unoptimized
          priority={priority}
          className="h-9 max-h-full w-auto max-w-[140px] object-contain object-center sm:h-10 sm:max-w-[152px]"
        />
      </div>
    );
  }
  const Fallback = partner.Fallback;
  return (
    <div className="flex h-[52px] w-[160px] shrink-0 items-center justify-center rounded-xl border border-gray-200/90 bg-white px-2 py-1.5 shadow-sm dark:border-gray-700/80 dark:bg-darklight sm:h-[56px] sm:w-[176px]">
      <Fallback className="h-9 w-[140px] max-w-full sm:h-10 sm:w-[152px]" />
    </div>
  );
}

export default function PartnersMarquee() {
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <div
      role="region"
      className="overflow-hidden bg-white pt-5 pb-14 sm:pt-6 sm:pb-16 md:pt-7 md:pb-20 lg:pb-24 dark:bg-semidark"
      aria-labelledby="our-partners-heading"
    >
      <div className="container mx-auto mb-6 sm:mb-8 max-w-full px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md">
        <h2
          id="our-partners-heading"
          className="text-center text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
          data-aos="fade-up"
        >
          Our Partners
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-gray dark:text-gray-400 sm:text-sm" data-aos="fade-up">
          Trusted banks and NBFCs we work with to get you the right offer.
        </p>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-12 bg-gradient-to-r from-white to-transparent sm:w-20 dark:from-semidark"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-12 bg-gradient-to-l from-white to-transparent sm:w-20 dark:from-semidark"
          aria-hidden
        />

        <div className="overflow-hidden">
          <div className="partners-marquee-track flex w-max gap-5 sm:gap-7 md:gap-8">
            {track.map((partner, index) => (
              <PartnerTile
                key={`partner-logo-${partner.name}-${index}`}
                partner={partner}
                priority={
                  index < 8 ||
                  (index >= PARTNERS.length && index < PARTNERS.length + 8)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
