import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Apni Zaroorat",
  description: "Terms and conditions for Apni Zaroorat products.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 bg-primary px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4">
            Terms and Conditions
          </h1>
        </div>
      </div>
      <section className="dark:bg-darkmode py-12 sm:py-16 lg:py-20 px-4 sm:px-6 min-h-[50vh] flex items-center">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md w-full">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-border dark:border-dark_border bg-white dark:bg-darklight shadow-xl shadow-primary/10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-skyBlue to-cyan" aria-hidden />
            <div className="flex min-h-[280px] sm:min-h-[340px] md:min-h-[400px] flex-col items-center justify-center px-6 py-16 sm:px-10 sm:py-20 text-center">
              <div className="mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-midnight_text dark:text-white">
                Coming Soon
              </p>
              <p className="mt-4 max-w-md text-sm sm:text-base text-gray dark:text-gray-400 leading-relaxed">
                We&apos;re preparing our terms and conditions. Please check back shortly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
