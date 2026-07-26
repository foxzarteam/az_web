"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="Apni Zaroorat home">
      <Image
        src="/images/logo/logo.webp"
        alt="Apni Zaroorat"
        width={280}
        height={72}
        className="h-11 w-auto max-w-[min(100%,220px)] object-contain object-left xs:h-12 xs:max-w-[min(100%,260px)] sm:h-[3.25rem] sm:max-w-[min(100%,280px)] md:h-16 md:max-w-[min(100%,300px)]"
        sizes="(max-width: 480px) 220px, (max-width: 768px) 280px, 300px"
        quality={85}
        priority
      />
    </Link>
  );
}
