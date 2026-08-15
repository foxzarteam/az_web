import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/seo/JsonLd";
import ContactInfo from "./components/contact-info";
import ContactForm from "./components/form";
import Location from "./components/office-location";
import {
  buildPageMetadata,
  CONTACT_KEYWORDS,
  pageSeoGlue,
} from "@/app/lib/seo";

const PAGE_TITLE = "Contact Apni Zaroorat | Loan & Insurance Support";
const PAGE_DESC =
  "Contact Apni Zaroorat for personal loan and insurance support across India. Call, email, or write to us for applications, partners, and customer queries.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/contact",
  absoluteTitle: true,
  image: "/images/contact-page/contact.webp",
  imageAlt: "Contact Apni Zaroorat",
  keywords: [...CONTACT_KEYWORDS],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/contact",
  pageType: "ContactPage",
  image: "/images/contact-page/contact.webp",
  includeLocalBusiness: true,
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 mb-3 sm:mb-4 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              We&apos;re here to help
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Contact Us
            </h1>
            <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
              Get in touch with us. We&apos;re here to help you.
            </p>
          </div>
        </div>
      </div>
      <section
        className="bg-white px-4 py-8 dark:bg-darkmode sm:px-6 sm:py-10"
        aria-labelledby="contact-support-heading"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <h2
            id="contact-support-heading"
            className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl"
          >
            Help with loans, insurance, and applications
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-base">
            Contact Apni Zaroorat for help with a personal loan or insurance
            application, document requirements, eligibility questions, or partner
            enquiries. Include your registered mobile number when asking about an
            existing application, but never send an OTP, banking password, UPI PIN, or
            card security code. You can review our{" "}
            <Link
              href="/products/personal-loan/"
              className="font-semibold text-primary hover:underline"
            >
              personal loan service
            </Link>
            , explore{" "}
            <Link
              href="/products/insurance/"
              className="font-semibold text-primary hover:underline"
            >
              insurance options
            </Link>
            , or use the form below to send a query.
          </p>
        </div>
      </section>
      <ContactForm />
      <ContactInfo />
      <Location />
    </>
  );
}
