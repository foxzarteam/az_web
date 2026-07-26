import type { Metadata } from "next";
import ContactInfo from "./components/contact-info";
import ContactForm from "./components/form";
import Location from "./components/office-location";
import { CONTACT } from "@/app/config/constants";
import {
  absoluteSeoUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  graphJsonLd,
  jsonLdScript,
  organizationJsonLd,
} from "@/app/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Apni Zaroorat for personal loans and insurance. Call, email, or visit our Jaipur office for instant support.",
  path: "/contact",
  image: "/images/contact-page/contact.webp",
  imageAlt: "Contact Apni Zaroorat",
});

const structuredData = graphJsonLd(
  organizationJsonLd(),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]),
  {
    "@type": "ContactPage",
    name: "Contact Apni Zaroorat",
    url: absoluteSeoUrl("/contact"),
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Apni Zaroorat",
      telephone: CONTACT.PHONE_TEL,
      email: CONTACT.EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.ADDRESS,
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302002",
        addressCountry: "IN",
      },
      url: absoluteSeoUrl("/"),
    },
  },
);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }}
      />
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
      <ContactForm />
      <ContactInfo />
      <Location />
    </>
  );
}
