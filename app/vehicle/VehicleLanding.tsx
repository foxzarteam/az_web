"use client";

import { useState } from "react";
import ServicePage from "@/app/components/services/ServicePage";
import HowItWorksSection, { type HowItWorksStep } from "@/app/components/products/HowItWorksSection";
import { LoanSelectionProvider } from "@/app/components/products/loans/loanSelection";
import FaqSection from "@/app/components/home/faq";
import CtaBanner from "@/app/about/components/cta-banner";
import { VEHICLE_FAQ, VEHICLE_INS_TYPES } from "./copy";

type Offer = "loan" | "insurance";

const OFFERS: { id: Offer; title: string; text: string; image: string }[] = [
  {
    id: "loan",
    title: "Vehicle Loan",
    text: "Finance a new or used car or bike",
    image: "/images/loans/car-loan.gif?v=10",
  },
  {
    id: "insurance",
    title: "Vehicle Insurance",
    text: "Cover your car or bike",
    image: "/images/loans/insurance.gif",
  },
];

function OfferPicker({ offer, onChange }: { offer: Offer; onChange: (next: Offer) => void }) {
  return (
    <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
        {OFFERS.map((item) => {
          const selected = item.id === offer;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(item.id)}
                className={`flex h-full w-full flex-col items-center rounded-2xl p-[2px] text-center transition duration-300 ${
                  selected
                    ? "-translate-y-1 bg-[linear-gradient(90deg,#4236FB_0%,#4236FB_42%,#FF7E29_100%)] shadow-[0_16px_34px_rgba(66,54,251,0.22)]"
                    : "bg-transparent hover:-translate-y-0.5"
                }`}
              >
                <span className="relative flex h-full w-full flex-col items-center rounded-[14px] bg-[#EEF0FF] px-3 py-4 sm:px-4 sm:py-5">
                  {selected ? (
                    <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(90deg,#4236FB,#FF7E29)] text-white">
                      <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                        <path d="M3.5 8.2 6.4 11l6.1-6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" width={96} height={96} className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
                  <p className="mt-2 text-sm font-semibold text-midnight_text">{item.title}</p>
                  <p className="mt-1 text-xs leading-snug text-gray">{item.text}</p>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
  );
}

const STEPS: HowItWorksStep[] = [
  {
    num: 1,
    title: "Pick Loan or Insurance",
    description: "Choose Vehicle Loan if you are buying, or Vehicle Insurance if you need cover.",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12h8M8 9h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Enter Your Details",
    description: "Share your name, mobile number, PAN and current pincode.",
    iconWrapClass: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 19c1.2-2.5 3.2-3.5 6-3.5s4.8 1 6 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Verify Mobile",
    description: "Confirm the OTP sent to your mobile number.",
    iconWrapClass: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m9.5 12 1.8 1.8 3.2-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "We Guide the Next Step",
    description: "A team member helps you with the lender or insurer options available for you.",
    iconWrapClass: "bg-[#F3EEFF] text-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <path d="M5 16.5 12 4l7 12.5H5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 10v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const POINTS = [
  { title: "Car and bike", text: "The same page works whether you need a car or a two-wheeler." },
  { title: "New or used", text: "A Vehicle Loan can be used for a new vehicle or a used one." },
  { title: "Two insurance choices", text: "Apply for Vehicle Insurance or Third Party Pvt Vehicle Insurance." },
  { title: "One application", text: "Fill the form once. We do not ask you to visit a branch to start." },
];

export default function VehicleLanding() {
  const [offer, setOffer] = useState<Offer>("loan");
  const picker = <OfferPicker offer={offer} onChange={setOffer} />;

  return (
    <>
      <h1 className="sr-only">Vehicle Loan and Vehicle Insurance</h1>
      <section id="offers" className="bg-white pb-2 pt-20 dark:bg-darkmode sm:pt-24">
        <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-primary">Vehicle finance</p>
          <h2 className="mt-2 text-center text-2xl font-bold text-midnight_text dark:text-white sm:text-3xl">
            Vehicle Loan and <span className="theme-gradient-text">Vehicle Insurance</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-relaxed text-gray dark:text-gray-300 sm:text-base">
            Buying a car or bike, or need cover for the one you already have. Pick one option and apply on this page.
          </p>
          <div className="mx-auto mt-6 max-w-3xl">{picker}</div>
        </div>
      </section>
      {offer === "loan" ? (
        <LoanSelectionProvider initialSlug="vehicle-loan">
          <ServicePage
            key="vehicle-loan"
            title="Vehicle Loan"
            subtitle="Check vehicle loan options for a new or used car or bike."
            imageSrc="/images/loans/car-loan.gif?v=10"
            badge="Vehicle loan"
            hideHeader
            loanTabs
            onlyLoanSlug="vehicle-loan"
          />
        </LoanSelectionProvider>
      ) : (
        <ServicePage
          key="vehicle-insurance"
          title="Vehicle Insurance"
          subtitle="Apply for cover for your car or bike."
          imageSrc="/images/loans/insurance.gif"
          badge="Vehicle insurance"
          hideHeader
          navBorder
          serviceSlug="insurance"
          insTypes={VEHICLE_INS_TYPES}
        />
      )}

      <section className="bg-[#F5F7FB] py-10 dark:bg-darkmode lg:py-14">
        <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
          <h2 className="text-center text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl">
            Built for your <span className="theme-gradient-text">vehicle</span>
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POINTS.map((item) => (
              <li key={item.title} className="rounded-2xl border border-[#E8ECF2] bg-white p-5 dark:border-dark_border dark:bg-darklight">
                <h3 className="text-base font-bold text-midnight_text dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray dark:text-gray-400">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HowItWorksSection headingPrefix="Start in" headingHighlight="4 Simple Steps" steps={STEPS} />
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
