import UsedCarLoanCalculator from "@/app/components/products/vehicle/UsedCarLoanCalculator";

const POINTS = [
  "Keep Your Car, Get Maximum Loan",
  "Flexible Tenure & EMI Options",
  "Minimal Documentation",
];

function CheckIcon() {
  return (
    <span
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full theme-gradient-bg text-white sm:h-6 sm:w-6"
      aria-hidden
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none">
        <path
          d="M3.5 8.2 6.4 11l6.1-6.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function UsedCarOfferSection() {
  return (
    <section
      className="overflow-hidden bg-white !py-10 dark:bg-darkmode lg:!py-14"
      aria-labelledby="used-car-offer-heading"
    >
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="order-1 min-w-0 w-full lg:col-span-6" data-aos="fade-right">
            <UsedCarLoanCalculator />
          </div>

          <div className="order-2 flex min-w-0 flex-col justify-center lg:col-span-6" data-aos="fade-left">
            <h2
              id="used-car-offer-heading"
              className="text-xl font-bold leading-snug text-midnight_text dark:text-white sm:text-2xl md:text-[1.65rem]"
            >
              Turn Your Old Car
              <span className="mt-1 block">
                into <span className="theme-gradient-text">Big Financial Support!</span>
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray dark:text-gray-300 sm:mt-5 sm:text-base">
              Turn your old car into an opportunity! Get loan offers of up to 150% of your car&apos;s
              value with Apni Zaroorat, subject to lender eligibility and approval.
            </p>
            <ul className="mt-6 space-y-3 sm:mt-7 sm:space-y-3.5">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm font-semibold text-midnight_text dark:text-white sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
