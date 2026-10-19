import type { Metadata } from "next";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, faqPageJsonLd } from "@/app/lib/seo";
import VehicleLanding from "./VehicleLanding";
import { VEHICLE_FAQ } from "./copy";

const PAGE_TITLE = "Vehicle Loan & Vehicle Insurance | Apni Zaroorat";
const PAGE_DESC =
  "Apply for a Vehicle Loan for a new or used car or bike, or choose Vehicle Insurance. Start online with Apni Zaroorat.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/vehicle",
  absoluteTitle: true,
  noIndex: true,
  image: "/images/loans/car-loan.gif?v=10",
  imageAlt: "Vehicle loan and vehicle insurance with Apni Zaroorat",
});

export default function VehicleAdsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...faqPageJsonLd(VEHICLE_FAQ, "/vehicle"),
        }}
      />
      <VehicleLanding />
    </>
  );
}
