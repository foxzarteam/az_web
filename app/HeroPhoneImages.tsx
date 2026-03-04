"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const IMAGES = ["/images/home.png", "/images/card.png", "/images/loan.png"];

export default function HeroPhoneImages() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-b-[28px] bg-slate-100">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className={`object-contain ${i === index ? "az-hero-zoom" : ""}`}
            sizes="460px"
          />
        </div>
      ))}
    </div>
  );
}
