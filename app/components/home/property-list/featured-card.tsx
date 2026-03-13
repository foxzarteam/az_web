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
    <div className="bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden flex flex-col h-[420px]">
      {image && (
        <Link href={href ?? "/#featured"}>
          <div className="relative shrink-0 cursor-pointer">
            <div className="imageContainer h-[200px] w-full relative shrink-0">
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
              className="absolute top-[10px] right-[10px] bg-white p-2 rounded-lg"
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
        <div className="p-5 sm:p-6 flex flex-col flex-1 min-h-0">
        <p className="text-lg sm:text-xl font-semibold text-midnight_text dark:text-white mb-1">{title}</p>
        <p className="text-midnight_text dark:text-white font-normal text-sm mb-4 flex-1">
          {description}
        </p>
        <div className="border-t border-border dark:border-dark_border pt-4 mt-auto">
          <Link
            href={href ?? "/#featured"}
            onClick={href ? undefined : handleApply}
            className="w-full py-2.5 px-4 text-white font-semibold rounded-lg bg-primary hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1"
          >
            Apply Now <span>&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
