"use client";

import { useEffect, useState } from "react";
import FeaturedCard from "./featured-card";
import { FEATURED_SERVICES } from "@/app/config/constants";
import { fetchData } from "@/app/utils/api";

const MAX_IMAGES = 4;

function loadPropertyImages(): Promise<string[]> {
  return fetchData<{ property_img: string }[]>("/api/propertydata", []).then(
    (data) => data.slice(0, MAX_IMAGES).map((p) => p.property_img)
  );
}

export default function Listing() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPropertyImages().then((loadedImages) => {
      setImages(loadedImages);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || images.length === 0) {
    return null;
  }

  const cards = FEATURED_SERVICES.map((item, i) => ({
    ...item,
    image: images[i] || "",
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
