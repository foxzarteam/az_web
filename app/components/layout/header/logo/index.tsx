"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3">
      <Image
        src="/images/logo/app_icon.png"
        alt="Apni Zaroorat"
        width={48}
        height={48}
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
        quality={100}
      />
      <span className="text-base sm:text-lg md:text-xl font-bold text-midnight_text dark:text-white">
        Apni Zaroorat
      </span>
    </Link>
  );
}
