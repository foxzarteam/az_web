"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/" className="inline-block h-[50px] w-[160px] relative">
      {!mounted ? (
        <Image
          src="/images/logo/logo.svg"
          alt="logo"
          width={160}
          height={50}
          style={{ width: "auto", height: "auto" }}
          quality={100}
        />
      ) : (
        <>
          <Image
            src="/images/logo/logo.svg"
            alt="logo"
            width={160}
            height={50}
            style={{ width: "auto", height: "auto" }}
            quality={100}
            className="dark:hidden"
          />
          <Image
            src="/images/logo/logo-white.svg"
            alt="logo"
            width={160}
            height={50}
            style={{ width: "auto", height: "auto" }}
            quality={100}
            className="hidden dark:block"
          />
        </>
      )}
    </Link>
  );
}
