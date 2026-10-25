"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FALLBACK_VEHICLE_CATEGORIES, vehicleCategoryImageSrc } from "@/app/lib/leads/leadForm";
import { getVehicleCategoryPick, setVehicleCategoryPick, subscribeVehicleCategoryPick } from "@/app/lib/leads/vehicleCategoryPick";

function scrollToApplyForm() {
  window.setTimeout(() => {
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}

export default function VehicleNeedSection() {
  const [selected, setSelected] = useState(getVehicleCategoryPick);

  useEffect(() => subscribeVehicleCategoryPick(setSelected), []);

  return (
    <section className="bg-[#F5F7FB] !py-10 dark:bg-darkmode lg:!py-14" aria-labelledby="vehicle-choices-heading">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="vehicle-choices-heading" className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl">
            Need a <span className="theme-gradient-text">loan or insurance?</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray dark:text-gray-300 sm:text-base">
            Get the Best Vehicle Loan &amp; Insurance Services in One Place
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FALLBACK_VEHICLE_CATEGORIES.map((item) => {
            const active = selected === item.value;
            return (
            <li key={item.value}>
              <button
                type="button"
                onClick={() => {
                  setVehicleCategoryPick(item.value);
                  scrollToApplyForm();
                }}
                aria-pressed={active}
                className={`flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-center shadow-[0_4px_24px_rgba(16,45,71,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(16,45,71,0.12)] dark:bg-darklight ${active ? "ring-2 ring-primary" : ""}`}
              >
                <span className="relative aspect-[16/9] w-full bg-white">
                  <Image
                    src={vehicleCategoryImageSrc(item.image)}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    quality={75}
                    className="object-contain object-center p-3"
                  />
                </span>
                <span className="flex flex-1 items-center justify-center px-3 py-4 sm:px-4 sm:py-5">
                  <span className="text-sm font-bold leading-snug text-midnight_text dark:text-white sm:text-base">{item.label}</span>
                </span>
              </button>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
