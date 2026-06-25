import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Apni Zaroorat",
  description: "Terms and conditions for Apni Zaroorat services.",
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
      <section className="dark:bg-darkmode py-16 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md text-center">
          <p className="text-xl sm:text-2xl font-semibold text-midnight_text dark:text-white">
            Coming soon
          </p>
        </div>
      </section>
    </>
  );
}
