"use client";

import { useEffect, useRef, useState } from "react";
import VehicleNeedSection from "@/app/components/products/vehicle/VehicleNeedSection";
import ServicePage from "@/app/components/services/ServicePage";
import HowItWorksSection, { type HowItWorksStep } from "@/app/components/products/HowItWorksSection";
import { LoanSelectionProvider } from "@/app/components/products/loans/loanSelection";
import FaqSection from "@/app/components/home/faq";
import CtaBanner from "@/app/about/components/cta-banner";
import { VEHICLE_FAQ } from "./copy";

type Offer = "loan" | "insurance";

const OFFERS: {
  id: Offer;
  title: string;
  text: string;
  image: string;
}[] = [
  {
    id: "loan",
    title: "Vehicle Loan",
    text: "Finance your vehicle and repay in monthly instalments.",
    image: "/images/loans/car-loan-white.gif?v=12",
  },
  {
    id: "insurance",
    title: "Vehicle Insurance",
    text: "Get the Right Insurance Cover for Your Vehicle and Stay Safe",
    image: "/images/loans/insurance-white.gif",
  },
];

function OfferCheck({ selected }: { selected: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        selected ? "bg-[linear-gradient(90deg,#4236FB,#FF7E29)] text-white" : "border border-[#D5DBE6] text-transparent"
      }`}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
        <path d="M3.5 8.2 6.4 11l6.1-6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function OfferPicker({
  offer,
  onChange,
  compact = false,
}: {
  offer: Offer;
  onChange: (next: Offer) => void;
  compact?: boolean;
}) {
  return (
    <ul data-offer-picker className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-4 lg:grid-cols-2"}>
      {OFFERS.map((item) => {
        const selected = item.id === offer;
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.id)}
              className={`flex h-full w-full rounded-[22px] p-[2px] transition duration-300 ${
                compact ? "text-center" : "text-left"
              } ${
                selected
                  ? "bg-[linear-gradient(90deg,#4236FB_0%,#4236FB_42%,#FF7E29_100%)] shadow-[0_18px_40px_rgba(66,54,251,0.18)]"
                  : "bg-[#E8ECF2] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,45,71,0.08)]"
              }`}
            >
              {compact ? (
                <span className="relative flex aspect-square h-full w-full flex-col items-center justify-center rounded-[20px] bg-white px-3 py-3 dark:bg-darklight">
                  <span className="absolute right-2 top-2">
                    <OfferCheck selected={selected} />
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" width={80} height={80} className="h-16 w-16 object-contain" />
                  <span className="mt-2 text-xs font-semibold leading-snug text-midnight_text dark:text-white">
                    {item.title}
                  </span>
                </span>
              ) : (
                <span className="relative flex h-full w-full flex-col rounded-[20px] bg-white p-4 dark:bg-darklight sm:p-5">
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-[#F5F7FB] dark:bg-darkmode sm:h-20 sm:w-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="" width={80} height={80} className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-base font-bold text-midnight_text dark:text-white sm:text-lg">{item.title}</span>
                        <OfferCheck selected={selected} />
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-gray dark:text-gray-300">{item.text}</span>
                    </span>
                  </span>
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";

const STEPS: HowItWorksStep[] = [
  {
    num: 1,
    title: "Choose Loan or Insurance",
    description: "Select the loan or insurance that matches your need.",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z" fill="currentColor" opacity="0.12" />
        <path d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path
          d="M12 13.8c-1.6-1.3-3.2-2.5-3.2-4a1.9 1.9 0 0 1 3.2-1.3 1.9 1.9 0 0 1 3.2 1.3c0 1.5-1.6 2.7-3.2 4Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Fill Basic Details",
    description: "Provide your basic information in simple steps.",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8.5h6M9 12h4.5M9 15.5h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Verify & Submit",
    description: "Verify your details and submit your loan or insurance application.",
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m9 12.5 2.2 2.2 4.3-4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Get Your Loan or Insurance",
    description: "Once approved, your loan is disbursed or insurance coverage begins.",
    iconWrapClass: "bg-[#F3EEFF] text-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
        <path d="M4 9.5 12 4l8 5.5V20H4V9.5Z" fill="currentColor" opacity="0.12" />
        <path d="M4 9.5 12 4l8 5.5V20H4V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.5 12h5M12 12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function scrollToApplyForm() {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function VehicleLanding() {
  const [offer, setOffer] = useState<Offer>("loan");
  const scrollAfterOffer = useRef(false);

  useEffect(() => {
    if (!scrollAfterOffer.current) return;
    scrollAfterOffer.current = false;
    scrollToApplyForm();
  }, [offer]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href="#offers"]');
      if (!link) return;
      const picker = [...document.querySelectorAll<HTMLElement>("[data-offer-picker]")].find((node) => node.getClientRects().length > 0);
      if (!picker) return;
      event.preventDefault();
      picker.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function selectOffer(next: Offer) {
    if (next === offer) {
      scrollToApplyForm();
      return;
    }
    scrollAfterOffer.current = true;
    setOffer(next);
  }

  const mobileOffers = <OfferPicker offer={offer} onChange={selectOffer} compact />;

  return (
    <>
      <h1 className="sr-only">Vehicle Loan and Vehicle Insurance</h1>
      <div className="h-16 bg-white dark:bg-darkmode sm:h-20" aria-hidden />

      {offer === "loan" ? (
        <LoanSelectionProvider initialSlug="vehicle-loan">
          <ServicePage
            key="vehicle-loan"
            title="Vehicle Loan"
            subtitle="Check vehicle loan options for a new car, used car, taxi, tractor, or commercial vehicle."
            imageSrc="/images/service/personal.webp"
            badge="Vehicle loan"
            hideHeader
            loanTabs
            compactTop
            aboveForm={mobileOffers}
          />
        </LoanSelectionProvider>
      ) : (
        <ServicePage
          key="vehicle-insurance"
          title="Vehicle Insurance"
          subtitle="Apply for cover for your car, taxi, tractor, or commercial vehicle."
          imageSrc="/images/service/personal.webp"
          badge="Vehicle insurance"
          hideHeader
          navBorder
          serviceSlug="insurance"
          initialInsType="vehicle_insurance"
          compactTop
          aboveForm={mobileOffers}
        />
      )}

      <section id="offers" className="hidden bg-white !pt-0 pb-10 dark:bg-darkmode lg:block">
        <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
          <OfferPicker offer={offer} onChange={selectOffer} />
        </div>
      </section>

      <VehicleNeedSection />

      <HowItWorksSection headingPrefix="Get Your Loan or Insurance in" headingHighlight="4 Simple Steps" steps={STEPS} />
      <FaqSection items={VEHICLE_FAQ} />
      <CtaBanner
        title="Ready to apply for your vehicle?"
        description="Choose Vehicle Loan or Vehicle Insurance, then share a few details. The process is short and secure."
        primaryHref="#apply"
        primaryLabel="Apply Now"
        secondaryHref="#offers"
        secondaryLabel="See Both Options"
      />
    </>
  );
}
