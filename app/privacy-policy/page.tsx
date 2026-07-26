import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/app/lib/seo";
import { CONTACT } from "@/app/config/constants";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Apni Zaroorat — how we collect, use, and protect your data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4">
            Privacy Policy
          </h1>
        </div>
      </div>
      <section className="dark:bg-darkmode py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:border-dark_border dark:bg-darklight sm:p-10">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Last updated: 26 Jul 2026. This policy explains how Apni Zaroorat (&quot;we&quot;, &quot;us&quot;)
              handles personal information when you use our website and loan application services.
            </p>

            <div className="mt-8 space-y-6 text-sm leading-relaxed text-midnight_text dark:text-gray-200">
              <div>
                <h2 className="text-lg font-bold">1. Information we collect</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  When you apply or contact us, we may collect your name, mobile number, email, PAN
                  (stored encrypted), loan amount or product preference, and related application
                  details needed to process your request.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">2. How we use information</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  We use your data to process loan/insurance enquiries, verify your mobile number,
                  contact you about your application, improve our services, and meet legal or
                  regulatory obligations.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">3. Sharing</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  We may share necessary details with lending partners or service providers only to
                  fulfill your request. We do not sell your personal information.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">4. Security</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Sensitive identifiers such as PAN are encrypted at rest. Access to full PAN in our
                  admin tools is restricted, audited, and shown masked by default.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">5. Your choices</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  You may request updates to your profile details from your customer dashboard, or
                  contact us to ask about correction or deletion of application data where legally
                  allowed.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">6. Contact</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Questions about privacy:{" "}
                  <a href={`mailto:${CONTACT.EMAIL}`} className="font-semibold text-primary hover:underline">
                    {CONTACT.EMAIL}
                  </a>
                  {CONTACT.PHONE ? (
                    <>
                      {" "}
                      or call{" "}
                      <a href={`tel:${CONTACT.PHONE_TEL}`} className="font-semibold text-primary hover:underline">
                        {CONTACT.PHONE}
                      </a>
                    </>
                  ) : null}
                  .
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/terms-and-conditions"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/"
                className="btn-gradient inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
