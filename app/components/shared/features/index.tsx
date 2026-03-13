"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { propertyData } from "@/app/types/property/propertyData";
import { COLORS } from "@/app/config/constants";
import { fetchData } from "@/app/utils/api";

const FEATURES = [
  { id: 1, imgSrc: "/images/features/rating.svg", title: "Best Rates", description: "Compare interest rates from multiple banks and NBFCs. Get the best deal on loans, insurance, and credit cards." },
  { id: 2, imgSrc: "/images/features/Give-Women's-Rights.svg", title: "Trusted Partners", description: "We work with leading banks and insurers. Safe, transparent process with no hidden charges." },
  { id: 3, imgSrc: "/images/features/live-chat.svg", title: "24/7 Support", description: "Apply anytime, anywhere. Our team is here to help you with applications and queries round the clock." },
];

function loadUncheckedProperty(): Promise<propertyData | null> {
  return fetchData<propertyData[]>("/api/propertydata", []).then(
    (data) => data.find((item) => !item.check) || null
  );
}

export default function Features() {
  const [uncheckedProperty, setUncheckedProperty] = useState<propertyData | null>(null);

  useEffect(() => {
    loadUncheckedProperty().then(setUncheckedProperty);
  }, []);

  return (
    <section className="dark:bg-darkmode">
      <div className="container px-4 lg:max-w-screen-xl md:max-w-screen-md mx-auto flex flex-col md:flex-row justify-between items-center max-w-full">
        <div className="flex lg:flex-row flex-col lg:gap-0 gap-8 justify-between w-full min-w-0">
          <div className="mb-8 md:mb-0 flex-1 min-w-0">
            <div className="relative" data-aos="fade-right">
              <Image
                src="/images/features/features_iimage.jpg"
                alt="property"
                width={640}
                height={615}
                className="w-full h-auto"
                style={{ maxWidth: "100%" }}
              />
              {uncheckedProperty && (
                <div className="lg:max-w-96 max-w-[85%] sm:max-w-37.5 absolute bottom-0 mx-auto left-0 right-0 lg:mr-3.75">
                  <div className="bg-white shadow-lg rounded-t-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                    <div className="relative">
                      <Image
                        src={uncheckedProperty.property_img}
                        alt={uncheckedProperty.property_title}
                        height={235}
                        width={370}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <svg className="absolute top-[10px] right-[10px] bg-white p-2 rounded-lg" viewBox="0 0 24 24" width={38} height={38} fill={COLORS.PRIMARY}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <div className="p-4 dark:bg-[#111929]">
                      <div className="flex flex-col gap-1 dark:text-gray">
                        <p className="text-sm font-semibold text-primary">Apni Zaroorat</p>
                        <p className="font-bold text-base text-midnight_text dark:text-white">
                          Fulfilling all your financial needs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="lg:pl-20 flex flex-col justify-center h-full">
              <p className="mb-8 md:mb-3.75 text-2xl sm:text-3xl md:text-4xl font-bold text-midnight_text dark:text-white" data-aos="fade-left">Why People Choose Apni Zaroorat</p>
              {FEATURES.map((feature) => (
                <div key={feature.id} className="flex mb-8 md:mb-3.75 items-center gap-8" data-aos="fade-left" data-aos-delay="100">
                  <div className="bg-primary/20 p-4 rounded-full flex justify-center items-center shrink-0">
                    <Image src={feature.imgSrc} alt={feature.title} height={78} width={78} />
                  </div>
                  <div>
                    <p className="text-2xl mb-2 font-bold text-midnight_text dark:text-white">{feature.title}</p>
                    <p className="text-gray text-base">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
