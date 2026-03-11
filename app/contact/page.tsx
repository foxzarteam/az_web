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
      <div className="pt-32 pb-8 bg-primary">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Contact Us
          </h1>
          <p className="text-white/90 text-center text-lg max-w-2xl mx-auto">
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
