"use client";

import Link from "next/link";
import Image from "next/image";
import { useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
import { useRemoteServiceCards } from "@/app/lib/services/useRemoteServiceCards";

const CARD_BGS = [
  "bg-blue-50 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-500/20",
  "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-500/20",
  "bg-violet-50 dark:bg-violet-900/20 border-violet-200/60 dark:border-violet-500/20",
  "bg-amber-50 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-500/20",
];

const BADGE_ROTATE = ["Quick apply", "Best rates", "Paperless", "Instant review"] as const;

export default function DiscoverProperties() {
  const fromLayout = useServiceCards();
  const { cards, isLoading } = useRemoteServiceCards(fromLayout);

  return (
    <section className="bg-white dark:bg-darkmode relative overflow-hidden">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-full">
        <h2
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 md:mb-12 text-midnight_text dark:text-white text-center"
          data-aos="fade-up"
        >
          Our Services
        </h2>
        {isLoading ? (
          <div
            className="flex justify-center items-center min-h-[200px] text-midnight_text/70 dark:text-white/70 text-sm"
            role="status"
          >
            Loading services…
          </div>
        ) : cards.length === 0 ? (
          <p className="text-center text-sm sm:text-base text-gray dark:text-gray-400 py-8">
            No services to show right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {cards.map((item, index) => (
              <div
                key={item.href}
                className={`relative rounded-xl border p-4 sm:p-5 md:p-6 flex flex-col min-h-[220px] sm:min-h-[260px] md:min-h-[280px] transition-colors duration-300 hover:shadow-md ${CARD_BGS[index % CARD_BGS.length]}`}
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <span className="absolute top-0 right-0 bg-accent text-midnight_text text-[10px] xs:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-bl-lg rounded-tr-xl">
                  {BADGE_ROTATE[index % BADGE_ROTATE.length]}
                </span>
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 pt-5 sm:pt-6">
                  <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-lg overflow-hidden bg-white/60 dark:bg-white/10 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        width={48}
                        height={48}
                        className="object-contain max-h-full max-w-full"
                      />
                    ) : (
                      <span className="text-primary font-bold text-lg" aria-hidden>
                        ₹
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-midnight_text dark:text-white pt-1">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray dark:text-gray-400 text-xs sm:text-sm mb-3 flex-1">{item.description}</p>
                <Link
                  href={item.href}
                  className={`inline-flex items-center justify-center gap-1 rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors ${
                    index === 0
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "border border-primary text-primary dark:border-white/30 dark:text-white hover:bg-primary/10 dark:hover:bg-white/10"
                  }`}
                >
                  Apply Now <span className="ml-0.5">&gt;</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
