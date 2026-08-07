import type { Metadata } from "next";
import type { ReactNode } from "react";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, pageSeoGlue } from "@/app/lib/seo";

const PAGE_NAME = "Refund & Cancellation Policy";
const PAGE_DESC =
  "Apni Zaroorat refund and cancellation policy for personal loan and insurance applications submitted through our free platform.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_NAME,
  description: PAGE_DESC,
  path: "/refund-policy",
});

const structuredData = pageSeoGlue({
  name: PAGE_NAME,
  description: PAGE_DESC,
  path: "/refund-policy",
});

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-4 sm:pb-6">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-2.5 space-y-3 text-gray-600 dark:text-gray-300">{children}</div>
    </div>
  );
}

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white sm:mb-4 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Clear &amp; fair refunds
            </span>
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              Refund Policy
            </h1>
          </div>
        </div>
      </div>

      <section className="dark:bg-darkmode py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:border-dark_border dark:bg-darklight sm:p-10 lg:p-12">
            <p className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary sm:mb-8 sm:px-4 sm:text-sm">
              Last update: August 2026
            </p>
            <div className="space-y-10 text-base leading-relaxed text-midnight_text dark:text-gray-200 sm:space-y-12 sm:text-[17px]">
              <Section title="1. Overview &amp; Scope">
                <p>
                  This Refund and Cancellation Policy (&quot;Policy&quot;) is applicable to all users,
                  customers, and visitors (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) accessing or utilizing
                  the financial services provided by Apni Zaroorat (&quot;Company&quot;, &quot;Platform&quot;,
                  &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By registering on our Platform or applying for any
                  financial products (including but not limited to Personal Loans and Insurance),
                  you unconditionally agree to the terms laid out in this Policy.
                </p>
              </Section>

              <Section title="2. Fee Structure (No Upfront Charges)">
                <p>
                  Apni Zaroorat operates strictly as a digital aggregator and technology bridge
                  (DSA/LSP).
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Zero Platform Fees:
                    </span>{" "}
                    We do not charge any upfront application fees, processing charges, or
                    consultation fees from our users for applying for loans or credit products.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Direct Partner Deductions:
                    </span>{" "}
                    If a lending Partner (Bank/NBFC) approves your loan, they may deduct their
                    respective processing fees, GST, or stamping charges directly from your
                    sanctioned loan amount before disbursal. Apni Zaroorat has no jurisdiction,
                    control, or liability over these third-party deductions.
                  </li>
                </ul>
              </Section>

              <Section title="3. Refunds &amp; Cancellations for Loan Products">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Non-Applicability:
                    </span>{" "}
                    Since Apni Zaroorat does not collect any monetary payments directly from users
                    for loan applications, the provision for a refund or cancellation of payments
                    does not apply to our Platform.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Post-Disbursal Cancellations:
                    </span>{" "}
                    If a user wishes to cancel a loan after the amount has been disbursed to their
                    bank account, they must contact the respective lending Bank/NBFC directly. The
                    cancellation will be governed entirely by the lender&apos;s internal pre-closure
                    or cancellation policies.
                  </li>
                </ul>
              </Section>

              <Section title="4. Refunds &amp; Cancellations for Insurance Products">
                <p>
                  When users apply for insurance policies via our Platform, all premium payments are
                  processed securely and routed directly to the authorized IRDAI-registered
                  Insurance Companies.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Free-Look Period:
                    </span>{" "}
                    In accordance with the Insurance Regulatory and Development Authority of India
                    (IRDAI) guidelines, all life and health insurance policies come with a standard
                    &quot;Free-Look Period&quot; (typically 15 to 30 days from the date of receipt of
                    the policy document).
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Initiating a Cancellation:
                    </span>{" "}
                    If you disagree with the terms of your policy, you have the right to cancel it
                    within this Free-Look Period. You must initiate this cancellation request
                    directly with the respective Insurance Company.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Refund Processing:
                    </span>{" "}
                    Upon successful cancellation within the stipulated time, the Insurance Company
                    will process your refund (subject to deductions for stamp duty, medical tests,
                    or proportionate risk premium). Apni Zaroorat assumes no responsibility for the
                    timeline, processing, or rejection of such insurance refunds.
                  </li>
                </ul>
              </Section>

              <Section title="5. Erroneous or Duplicate Transactions">
                <p>
                  In the rare event that Apni Zaroorat integrates a payment gateway in the future
                  for value-added services (e.g., premium credit reports) and a technical error
                  occurs:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    If a duplicate payment or double debit is processed due to server timeouts or
                    API failures, the user must notify our support team within 48 hours.
                  </li>
                  <li>
                    Upon verification with our payment gateway partner, any valid duplicate
                    transaction will be refunded to the original payment source within 7 to 10
                    business days.
                  </li>
                </ul>
              </Section>

              <Section title="6. Chargebacks &amp; Disputes">
                <p>
                  In the event of a dispute or a chargeback raised by a user with their bank or
                  credit card issuer regarding any transaction linked to our Platform, Apni Zaroorat
                  reserves the right to suspend the user&apos;s account pending a complete
                  investigation. We will share all necessary logs, API hits, and application records
                  with the financial institution to resolve the chargeback fairly.
                </p>
              </Section>

              <Section title="7. Modification of Policy">
                <p>
                  Apni Zaroorat reserves the absolute right to modify, amend, or update this Refund
                  and Cancellation Policy at any time without prior individual notice. Users are
                  encouraged to review this page periodically to stay informed of our current
                  practices.
                </p>
              </Section>

              <Section title="8. Contact Us">
                <p>
                  For any clarifications or disputes related to cancellations and refunds, please
                  reach out to our dedicated support mechanism:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">Email:</span>{" "}
                    <a
                      href="mailto:support@apnizaroorat.com"
                      className="font-semibold text-primary hover:underline"
                    >
                      support@apnizaroorat.com
                    </a>
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Grievance Officer:
                    </span>{" "}
                    <a
                      href="mailto:grievance@apnizaroorat.com"
                      className="font-semibold text-primary hover:underline"
                    >
                      grievance@apnizaroorat.com
                    </a>
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Registered Address:
                    </span>{" "}
                    937, Subhash Chowk, Jaipur, Rajasthan 302002.
                  </li>
                </ul>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
