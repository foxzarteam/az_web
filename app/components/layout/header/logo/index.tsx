"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 shrink-0">
      <Image
        src="/images/logo/app_icon.png"
        alt="Apni Zaroorat"
        width={48}
        height={48}
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shrink-0"
        quality={100}
      />
      <span className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-midnight_text dark:text-white truncate">
        Apni Zaroorat
      </span>
    </Link>
  );
}
