import type { Metadata } from "next";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, faqPageJsonLd } from "@/app/lib/seo";
import VehicleLanding from "@/app/products/vehicle/VehicleLanding";
import { USED_CAR_FAQ } from "@/app/products/vehicle/copy";

const PAGE_TITLE = "Used Car Loan Online | Apni Zaroorat";
const PAGE_DESC =
  "Apply for a used car loan online with Apni Zaroorat. Check eligibility, share a few details, and get partner lenders for pre-owned cars.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/used-car-loan",
  absoluteTitle: true,
  image: "/images/features/old.webp",
  imageAlt: "Used car loan with Apni Zaroorat",
});

export default function UsedCarLoanPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...faqPageJsonLd(USED_CAR_FAQ, "/used-car-loan"),
        }}
      />
      <VehicleLanding
        heading="Used Car Loan and Vehicle Insurance"
        loanTitle="Used Car Loan"
        loanSubtitle="Finance a pre-owned car with monthly instalments. Check used car loan options and apply online."
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
        ctaTitle="Ready to apply for a used car loan?"
        ctaDescription="Share a few details and check used car loan options. The process is short and secure."
      />
    </>
  );
}
