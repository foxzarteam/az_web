import type { Metadata } from "next";
import JsonLd from "@/app/components/seo/JsonLd";
import {
  buildPageMetadata,
  faqPageJsonLd,
  financialServiceJsonLd,
  pageSeoGlue,
} from "@/app/lib/seo";
import VehicleLanding from "@/app/products/vehicle/VehicleLanding";
import { USED_CAR_FAQ } from "@/app/products/vehicle/copy";

const PAGE_TITLE = "Used Car Loan Apply Online India | Up to 150% | Apni Zaroorat";
const PAGE_DESC =
  "Apply used car loan online in India. Check eligibility in minutes, keep your car, and get up to 150% of vehicle value on old / pre-owned cars from Apni Zaroorat partner lenders.";

const PAGE_KEYWORDS = [
  "used car loan apply online",
  "used car loan India",
  "second hand car loan",
  "pre owned car loan",
  "old car loan",
  "used car loan eligibility",
  "used car loan interest rate",
  "loan against used car",
  "used car refinance",
  "car loan on existing car",
  "used car loan up to 150%",
  "apply used car loan online India",
  "Apni Zaroorat used car loan",
];

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/used-car-loan",
  absoluteTitle: true,
  image: "/images/features/old.webp",
  imageAlt: "Apply used car loan online in India — up to 150% of old car value | Apni Zaroorat",
  keywords: PAGE_KEYWORDS,
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/used-car-loan",
  image: "/images/features/old.webp",
  includeServiceCatalog: true,
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Used Car Loan", path: "/used-car-loan" },
  ],
  extra: [
    financialServiceJsonLd({
      name: "Used Car Loan",
      description:
        "Used car loan online in India — finance a pre-owned or old car, check eligibility instantly, and get offers up to 150% of vehicle value. Keep using your car while you repay.",
      path: "/used-car-loan",
      serviceType: "Used Car Loan",
    }),
    faqPageJsonLd(USED_CAR_FAQ, "/used-car-loan"),
  ],
});

export default function UsedCarLoanPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <VehicleLanding
        heading="Used Car Loan Apply Online in India — Up to 150% of Old Car Value"
        loanTitle="Used Car Loan"
        loanSubtitle="Apply used car loan online. Check eligibility, keep your car, and get up to 150% of your old car’s value from partner lenders."
        imageSrc="/images/features/old.webp"
        imageClassName="block h-auto w-full max-w-[300px] object-contain sm:max-w-[360px] lg:max-w-[420px]"
        loanBadge="Used car loan"
        initialVehicleCategory="used_car"
        lockVehicleCategory
        needSection="used-car-offer"
        formHeading={
          <>
            Get the Best Loan Offer for Your{" "}
            <span className="theme-gradient-text font-extrabold">Old Car</span>
          </>
        }
        faqItems={USED_CAR_FAQ}
        ctaTitle="Ready to apply for a used car loan online?"
        ctaDescription="Share a few details, check used car loan eligibility, and get offers up to 150% of your car’s value. The process is short and secure."
      />
    </>
  );
}
