import type { Metadata } from "next";
import ContactInfo from "./components/contact-info";
import ContactForm from "./components/form";
import Location from "./components/office-location";

export const metadata: Metadata = {
  title: "Contact Us | Apni Zaroorat",
  description: "Get in touch with Apni Zaroorat for loans, insurance, and credit cards. Contact us for instant support.",
};

export default function ContactPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 bg-primary px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-white/90 text-center text-base sm:text-lg max-w-2xl mx-auto">
            Get in touch with us. We&apos;re here to help you.
          </p>
        </div>
      </div>
      <ContactForm />
      <ContactInfo />
      <Location />
    </>
  );
}
