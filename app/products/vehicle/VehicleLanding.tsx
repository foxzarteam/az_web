"use client";

import { useState } from "react";
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
    text: "Finance a new or used car or bike, then repay in monthly instalments.",
    image: "/images/loans/car-loan-white.gif?v=12",
  },
  {
    id: "insurance",
    title: "Vehicle Insurance",
    text: "Cover the car or bike you already have.",
    image: "/images/loans/insurance-white.gif",
  },
];

function OfferPicker({ offer, onChange }: { offer: Offer; onChange: (next: Offer) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {OFFERS.map((item) => {
        const selected = item.id === offer;
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.id)}
              className={`flex h-full w-full rounded-[22px] p-[2px] text-left transition duration-300 ${
                selected
                  ? "bg-[linear-gradient(90deg,#4236FB_0%,#4236FB_42%,#FF7E29_100%)] shadow-[0_18px_40px_rgba(66,54,251,0.18)]"
                  : "bg-[#E8ECF2] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,45,71,0.08)]"
              }`}
            >
              <span className="flex h-full w-full flex-col rounded-[20px] bg-white p-4 dark:bg-darklight sm:p-5">
                <span className="flex items-start gap-3">
                  <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-[#F5F7FB] dark:bg-darkmode sm:h-20 sm:w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" width={80} height={80} className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-midnight_text dark:text-white sm:text-lg">{item.title}</span>
                      <span
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          selected ? "bg-[linear-gradient(90deg,#4236FB,#FF7E29)] text-white" : "border border-[#D5DBE6] text-transparent"
                        }`}
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                          <path d="M3.5 8.2 6.4 11l6.1-6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-gray dark:text-gray-300">{item.text}</span>
                  </span>
                </span>
              </span>
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
    description: "Once approved, the loan is disbursed or your insurance moves ahead.",
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

const LOAN_CHOICES: { label: string; title: string; icon: "car" | "used" | "bike" | "superbike" | "truck" | "machine" }[] = [
  { label: "Car", title: "New Car", icon: "car" },
  { label: "Used Car", title: "Used Car", icon: "used" },
  { label: "Two Wheeler", title: "Two Wheeler", icon: "bike" },
  { label: "Super Bike", title: "Super Bike", icon: "superbike" },
  { label: "Commercial Vehicle", title: "Commercial Vehicle", icon: "truck" },
  { label: "Construction Equipment", title: "Construction Equipment", icon: "machine" },
];

function ChoiceIcon({ name }: { name: (typeof LOAN_CHOICES)[number]["icon"] }) {
  const common = "h-7 w-7";
  if (name === "car" || name === "used") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M4 15.5V13l1.6-4.2A2 2 0 0 1 7.5 7.5h9a2 2 0 0 1 1.9 1.3L20 13v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4 15.5h16v2.2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2.2Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="7.2" cy="16.2" r="1.1" fill="currentColor" />
        <circle cx="16.8" cy="16.2" r="1.1" fill="currentColor" />
        {name === "used" ? <path d="M8 11h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /> : null}
      </svg>
    );
  }
  if (name === "bike" || name === "superbike") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <circle cx="6.2" cy="16.2" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="16.2" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.4 16.2 11 10h3.2l2.2 6.2M11 10l1.6-2.4H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {name === "superbike" ? <path d="M14.2 7.6h3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /> : null}
      </svg>
    );
  }
  if (name === "truck") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M3 8.5h10v8H3zM13 11h4l3 3v2.5h-7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="7" cy="17.2" r="1.3" fill="currentColor" />
        <circle cx="17" cy="17.2" r="1.3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
      <path d="M4 17.5h9.5V11H8.5L4 14.2v3.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13.5 13.5h3.2L20 9.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.2 9.2V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7.2" cy="17.8" r="1.3" fill="currentColor" />
      <circle cx="14.2" cy="17.8" r="1.3" fill="currentColor" />
    </svg>
  );
}

export default function VehicleLanding() {
  const [offer, setOffer] = useState<Offer>("loan");

  return (
    <>
      <section id="offers" className="relative overflow-hidden bg-[#F5F7FB] !pb-8 !pt-20 dark:bg-darkmode sm:!pb-10 sm:!pt-24">
        <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#4236FB]/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-10 top-16 h-40 w-40 rounded-full bg-[#FF7E29]/15 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
          <h1 className="sr-only">Vehicle Loan and Vehicle Insurance</h1>
          <div className="mx-auto max-w-4xl">
            <OfferPicker offer={offer} onChange={setOffer} />
          </div>
        </div>
      </section>

      {offer === "loan" ? (
        <LoanSelectionProvider initialSlug="vehicle-loan">
          <ServicePage
            key="vehicle-loan"
            title="Vehicle Loan"
            subtitle="Check vehicle loan options for a new or used car or bike."
            imageSrc="/images/service/personal.webp"
            badge="Vehicle loan"
            hideHeader
            loanTabs
            compactTop
          />
        </LoanSelectionProvider>
      ) : (
        <ServicePage
          key="vehicle-insurance"
          title="Vehicle Insurance"
          subtitle="Apply for cover for your car or bike."
          imageSrc="/images/service/personal.webp"
          badge="Vehicle insurance"
          hideHeader
          navBorder
          serviceSlug="insurance"
          initialInsType="vehicle_insurance"
          compactTop
        />
      )}

      <section className="bg-white !py-10 dark:bg-darkmode lg:!py-14" aria-labelledby="vehicle-choices-heading">
        <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="vehicle-choices-heading" className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl">
              Need a <span className="theme-gradient-text">loan or insurance?</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray dark:text-gray-300 sm:text-base">
              Get the Best Vehicle Loan &amp; Insurance Services in One Place
            </p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOAN_CHOICES.map((item) => (
              <li key={item.title}>
                <a
                  href="#apply"
                  className="flex h-full items-center gap-4 rounded-2xl border border-[#E8ECF2] bg-white p-4 shadow-[0_4px_24px_rgba(16,45,71,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(66,54,251,0.12)] dark:border-dark_border dark:bg-darklight sm:p-5"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#4236FB]">
                    <ChoiceIcon name={item.icon} />
                  </span>
                  <span className="min-w-0">
                    {item.label !== item.title ? (
                      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-gray dark:text-gray-400">{item.label}</span>
                    ) : null}
                    <span className="mt-0.5 block text-base font-bold text-midnight_text dark:text-white">{item.title}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
