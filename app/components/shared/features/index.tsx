"use client";

import Image from "next/image";
import { COLORS } from "@/app/config/constants";
import { PROPERTY_DATA } from "@/app/data/propertyData";

const FEATURES = [
  { id: 1, imgSrc: "/images/features/rating.svg", title: "Best Rates", description: "Compare interest rates from multiple banks and NBFCs. Get the best deal on loans and insurance." },
  { id: 2, imgSrc: "/images/features/Give-Women's-Rights.svg", title: "Trusted Partners", description: "We work with leading banks and insurers. Safe, transparent process with no hidden charges." },
  { id: 3, imgSrc: "/images/features/live-chat.svg", title: "24/7 Support", description: "Apply anytime, anywhere. Our team is here to help you with applications and queries round the clock." },
] as const;

const UNCHECKED_PROPERTY = PROPERTY_DATA.find((item) => !item.check) ?? null;

export default function Features() {

  return (
    <section className="dark:bg-darkmode !pt-6 sm:!pt-8 md:!pt-9 lg:!pt-10 !pb-10 sm:!pb-12 md:!pb-14 lg:!pb-16">
      <div className="container px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md mx-auto flex flex-col md:flex-row justify-between items-center max-w-full">
        <div className="flex lg:flex-row flex-col lg:gap-0 gap-5 sm:gap-6 justify-between w-full min-w-0">
          <div className="mb-4 sm:mb-5 md:mb-0 shrink-0 w-full max-w-full md:max-w-[min(100%,26rem)] lg:max-w-[min(100%,30rem)] xl:max-w-[min(100%,34rem)]">
            <div className="relative max-w-full" data-aos="fade-right">
              <Image
                src="/images/features/features_iimage.jpg"
                alt="property"
                width={640}
                height={615}
                className="w-full h-auto object-cover rounded-lg"
                style={{ maxWidth: "100%" }}
              />
              {UNCHECKED_PROPERTY && (
                <div className="absolute bottom-0 left-1/2 w-[min(94%,20rem)] xs:w-[min(92%,22rem)] sm:w-[20rem] md:w-[22rem] lg:w-[26rem] xl:w-[28rem] -translate-x-1/2">
                  <div className="bg-white shadow-lg rounded-t-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                    <div className="relative">
                      <Image
                        src={UNCHECKED_PROPERTY.property_img}
                        alt={UNCHECKED_PROPERTY.property_title}
                        height={280}
                        width={448}
                        className="w-full h-auto object-cover"
                      />
                      <svg className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-[10px] md:right-[10px] bg-white p-1.5 sm:p-2 rounded-lg w-8 h-8 sm:w-9 md:w-[38px] md:h-[38px]" viewBox="0 0 24 24" fill={COLORS.PRIMARY}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <div className="p-3.5 sm:p-5 dark:bg-[#111929]">
                      <div className="flex flex-col gap-0.5 sm:gap-1 dark:text-gray">
                        <p className="text-xs sm:text-sm font-semibold text-primary">Apni Zaroorat</p>
                        <p className="font-bold text-sm sm:text-base md:text-lg text-midnight_text dark:text-white">
                          Fulfilling all your financial needs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="lg:pl-12 xl:pl-20 flex flex-col justify-center h-full">
              <p className="mb-6 sm:mb-8 md:mb-8 lg:mb-10 text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-midnight_text dark:text-white" data-aos="fade-left">Why People Choose Apni Zaroorat</p>
              <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="flex items-start sm:items-center gap-4 sm:gap-5 md:gap-6" data-aos="fade-left" data-aos-delay="100">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 md:h-[78px] md:w-[78px] shrink-0 items-center justify-center rounded-full p-[2px] btn-gradient">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-2.5 sm:p-3 dark:bg-darklight">
                      <Image src={feature.imgSrc} alt={feature.title} height={78} width={78} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg md:text-2xl mb-1 sm:mb-2 font-bold text-midnight_text dark:text-white">{feature.title}</p>
                    <p className="text-gray text-sm sm:text-base leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
