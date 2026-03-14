"use client";

import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/app/config/constants";
import { scrollToElement } from "@/app/utils/scroll";

interface FeaturedCardProps {
  image?: string;
  title: string;
  description: string;
  href?: string;
}

export default function FeaturedCard({ image, title, description, href }: FeaturedCardProps) {
  const handleApply = () => {
    scrollToElement("featured");
  };

  return (
    <div className="bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden flex flex-col min-h-[320px] sm:min-h-[380px] md:h-[400px] lg:h-[420px]">
      {image && (
        <Link href={href ?? "/#featured"}>
          <div className="relative shrink-0 cursor-pointer">
            <div className="imageContainer h-[140px] xs:h-[160px] sm:h-[180px] md:h-[200px] w-full relative shrink-0">
              <Image
                src={image}
                alt={title}
                width={400}
                height={250}
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-[10px] md:right-[10px] bg-white p-1.5 sm:p-2 rounded-lg w-8 h-8 sm:w-9 sm:h-9 md:w-[38px] md:h-[38px]"
              viewBox="0 0 24 24"
              width={38}
              height={38}
              aria-hidden
            >
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={COLORS.GRADIENT_START} />
                  <stop offset="100%" stopColor={COLORS.GRADIENT_END} />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGradient)" />
            </svg>
          </div>
        </Link>
      )}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-1 min-h-0">
        <p className="text-base sm:text-lg md:text-xl font-semibold text-midnight_text dark:text-white mb-1 line-clamp-2">{title}</p>
        <p className="text-midnight_text dark:text-white font-normal text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
          {description}
        </p>
        <div className="border-t border-border dark:border-dark_border pt-3 sm:pt-4 mt-auto">
          <Link
            href={href ?? "/#featured"}
            onClick={href ? undefined : handleApply}
            className="w-full py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-white font-semibold rounded-lg bg-primary hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1"
          >
            Apply Now <span>&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
