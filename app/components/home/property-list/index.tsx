"use client";

import FeaturedCard from "./featured-card";
import { FEATURED_SERVICES } from "@/app/config/constants";

// Image files should exist in public/images/service
// Order must match FEATURED_SERVICES:
// [Home Loan, Personal Loan, Business Loan, Credit Card]
const SERVICE_IMAGES: string[] = [
  "/images/service/home.png",      // Home Loan
  "/images/service/personal.png",  // Personal Loan
  "/images/service/business.png",  // Business Loan
  "/images/service/credit.png",    // Credit Card
];

const SERVICE_LINKS: string[] = [
  "/services/home-loan",
  "/services/personal-loan",
  "/services/business-loan",
  "/services/credit-card",
];

export default function Listing() {
  const cards = FEATURED_SERVICES.map((item, i) => ({
    ...item,
    image: SERVICE_IMAGES[i] || "",
    href: SERVICE_LINKS[i] || "/#featured",
  }));
  const duplicated = [...cards, ...cards];

  return (
    <section id="featured" className="bg-light dark:bg-semidark flex justify-center items-center overflow-hidden">
      <div className="w-full mx-auto px-4 max-w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-midnight_text dark:text-white text-center" data-aos="fade-up">
          Our Services
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
                    href={card.href}
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
