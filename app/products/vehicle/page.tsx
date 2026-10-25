import type { Metadata } from "next";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, faqPageJsonLd } from "@/app/lib/seo";
import VehicleLanding from "./VehicleLanding";
import { VEHICLE_FAQ } from "./copy";

const PAGE_TITLE = "Vehicle Loan & Vehicle Insurance | Apni Zaroorat";
const PAGE_DESC =
  "Apply for a vehicle loan or vehicle insurance for a car, taxi, tractor, or commercial vehicle. Start online with Apni Zaroorat.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/products/vehicle",
  absoluteTitle: true,
  noIndex: true,
  image: "/images/og-default.jpg",
  imageAlt: "Vehicle loan and vehicle insurance with Apni Zaroorat",
});

export default function VehicleAdsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...faqPageJsonLd(VEHICLE_FAQ, "/products/vehicle"),
        }}
      />
      <VehicleLanding />
    </>
  );
}
