"use client";

import Image from "next/image";
import Link from "next/link";
import type { propertyData } from "@/app/types/property/propertyData";

interface PropertyCardProps {
  property: propertyData;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden">
      <Link href="/#featured" className="group block">
        <div className="relative">
          <div className="imageContainer h-[250px] w-full">
            <Image
              src={property.property_img}
              alt={property.property_title}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary font-medium">
            {property.tag}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[10px] right-[10px] bg-white p-2 rounded-lg"
            viewBox="0 0 24 24"
            width={38}
            height={38}
            fill="#2F73F2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="p-5 sm:p-8 dark:text-white">
          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            <p className="text-base text-gray">{property.property_title}</p>
            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl group-hover:text-primary text-midnight_text dark:text-white">
                {property.property_price}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {property.location}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-between">
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <Image src="/images/svgs/icon-bed.svg" alt="Beds" height={18} width={18} />
                {property.beds}
              </p>
              <p className="text-sm text-gray">Bedrooms</p>
            </div>
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <Image src="/images/svgs/icon-tub.svg" alt="Baths" height={18} width={18} />
                {property.bathrooms}
              </p>
              <p className="text-sm text-gray">Bathroom</p>
            </div>
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <Image src="/images/svgs/icon-layout.svg" alt="Area" height={18} width={18} />
                {property.livingArea}
              </p>
              <p className="text-sm text-gray">Living Area</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
