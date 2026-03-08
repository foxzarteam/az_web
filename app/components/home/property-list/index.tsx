"use client";

import { useEffect, useState } from "react";
import FeaturedCard from "./featured-card";

const FEATURED = [
  { title: "Home Loan", description: "Instant approval at lowest interest rates", badge: "Quick Sanction" },
  { title: "Personal Loan", description: "Paperless process at low rate", badge: "Quick Disbursal" },
  { title: "Business Loan", description: "Fund your business with flexible tenure", badge: "Flexible Repayment" },
  { title: "Credit Card", description: "Choose cards from all top banks", badge: "Rewards Unlimited" },
];

const DEFAULT_IMAGE = "/images/hero/hero.png";

export default function Listing() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/propertydata")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: { property_img: string }[]) => {
        setImages(data.slice(0, 4).map((p) => p.property_img));
      })
      .catch(() => {});
  }, []);

  const cards = FEATURED.map((item, i) => ({
    ...item,
    image: images[i] || DEFAULT_IMAGE,
  }));
  const duplicated = [...cards, ...cards];

  return (
    <section id="featured" className="bg-light dark:bg-semidark flex justify-center items-center overflow-hidden">
      <div className="w-full mx-auto px-4 max-w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-midnight_text dark:text-white text-center" data-aos="fade-up">
          Featured Products & Offers
        </h1>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex gap-4 sm:gap-6 md:gap-8 animate-infinite-scroll w-max">
              {duplicated.map((card, index) => (
                <div
                  key={index}
                  className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px]"
                >
                  <FeaturedCard
                    image={card.image}
                    title={card.title}
                    description={card.description}
                    badge={card.badge}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
