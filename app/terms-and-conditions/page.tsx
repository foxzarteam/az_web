import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, LEGAL_KEYWORDS, pageSeoGlue } from "@/app/lib/seo";

const PAGE_TITLE = "Terms & Conditions | Apni Zaroorat";
const PAGE_DESC =
  "Terms and conditions for using Apni Zaroorat personal loan and insurance services, online tools, and partner platform.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/terms-and-conditions",
  absoluteTitle: true,
  keywords: [
    ...LEGAL_KEYWORDS,
    "terms and conditions",
    "Apni Zaroorat terms of use",
    "loan platform terms",
  ],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/terms-and-conditions",
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

export default function TermsAndConditionsPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white sm:mb-4 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Terms of Use
            </span>
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              Terms and Conditions
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
              <Section title="1. Introduction &amp; Acceptance of Terms">
                <p>
                  Welcome to Apni Zaroorat (hereinafter referred to as the &quot;Company,&quot;
                  &quot;Platform,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Use legally bind any
                  individual or entity (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) accessing our website,
                  mobile application, or digital tools. By accessing, browsing, or utilizing the
                  Platform to apply for financial products (including but not limited to Personal
                  Loans and Insurance), you explicitly acknowledge that you have read,
                  understood, and agreed to be bound by these Terms and our{" "}
                  <Link href="/privacy-policy/" className="font-semibold text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  . If you do not agree to these terms, you must strictly cease the use of this
                  Platform immediately.
                </p>
              </Section>

              <Section title="2. Nature of Services &amp; Platform Role">
                <p>
                  Apni Zaroorat operates strictly as a technology-driven aggregator, Loan Service
                  Provider (LSP), and Direct Selling Agent (DSA). We are NOT a Bank, Non-Banking
                  Financial Company (NBFC), or an Insurance Underwriter.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      For Loan Products:
                    </span>{" "}
                    We act as an intermediary, transmitting your requirements to RBI-registered
                    banks and NBFCs (&quot;Lending Partners&quot;). We do not lend our own funds or
                    determine credit eligibility.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      For Insurance Products:
                    </span>{" "}
                    We act as a facilitator/aggregator for IRDAI-registered Insurance Companies
                    (&quot;Insurance Partners&quot;). We do not underwrite risks or settle claims.
                  </li>
                </ul>
              </Section>

              <Section title="3. User Eligibility &amp; Accuracy of Data">
                <p>
                  To use the services of Apni Zaroorat, you represent and warrant that you are a
                  resident of India, at least 18 years of age, and possess the legal capacity to
                  enter into a binding contract under the Indian Contract Act, 1872.
                </p>
                <p>
                  You are solely responsible for the authenticity of the data provided (including
                  PAN, Aadhaar, Income Proofs, and Medical History). Submission of false, forged,
                  or third-party information without explicit authorization constitutes fraud and
                  will result in immediate permanent suspension of your profile and potential
                  reporting to law enforcement authorities.
                </p>
              </Section>

              <Section title="4. Explicit Consent for Credit Checks &amp; Communication">
                <p>
                  By proceeding on the Platform, you grant Apni Zaroorat and its authorized Partners
                  irrevocable consent to:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Fetch, verify, and store your credit information from authorized Credit
                    Information Companies (CICs) such as Experian, CIBIL, Equifax, or CRIF High
                    Mark to evaluate your eligibility for loan products.
                  </li>
                  <li>
                    Contact you via SMS, WhatsApp, Email, or automated voice calls regarding your
                    application status, product offers, and reminders. This consent overrides any
                    registration on the National Do Not Call (NDNC) registry or similar DND
                    preferences.
                  </li>
                </ul>
              </Section>

              <Section title="5. Insurance-Specific Disclaimers">
                <p>
                  When applying for insurance products through Apni Zaroorat, you acknowledge that:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Claim Settlement:
                    </span>{" "}
                    Apni Zaroorat holds zero liability in the approval or rejection of any insurance
                    claim. Claim settlement is the sole discretion and responsibility of the
                    respective Insurance Partner.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Premium Payments:
                    </span>{" "}
                    All premium payments must be directed only to the Insurance Company. Apni
                    Zaroorat never collects insurance premiums in its own accounts.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Free-Look Period:
                    </span>{" "}
                    Cancellations and refunds of insurance policies are strictly governed by the
                    standard &apos;Free-Look Period&apos; policies of the issuing Insurance Company as
                    per IRDAI guidelines.
                  </li>
                </ul>
              </Section>

              <Section title="6. Loan-Specific Disclaimers">
                <p>
                  The approval, rejection, loan amount sanctioned, interest rate applied, and
                  repayment tenure are exclusively determined by the Lending Partner based on their
                  internal credit and risk policies. Apni Zaroorat cannot guarantee the approval of
                  any loan application and shall not be held liable for any financial impact
                  resulting from application rejection or delays in disbursal.
                </p>
              </Section>

              <Section title="7. Limitation of Liability">
                <p className="uppercase tracking-wide">
                  To the maximum extent permitted by applicable law, the Company, its founders,
                  directors, employees, and technology partners shall not be liable for any direct,
                  indirect, punitive, incidental, special, or consequential damages arising out of
                  or in any way connected with:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>The delay or inability to use the Platform or services;</li>
                  <li>
                    The rejection of your loan or insurance application by the respective partners;
                  </li>
                  <li>
                    Any dispute, harassment, or recovery tactics employed by the Lending Partner or
                    their authorized collection agencies;
                  </li>
                  <li>Server downtime, API failures, or unauthorized access to your device.</li>
                </ul>
                <p className="uppercase tracking-wide">
                  Your contract for any financial product is strictly a bipartite agreement between
                  you and the respective Bank, NBFC, or Insurance Company.
                </p>
              </Section>

              <Section title="8. Intellectual Property Rights">
                <p>
                  All source code, UI/UX designs, content, graphics, and algorithms associated with
                  Apni Zaroorat are the exclusive intellectual property of the Company. Users are
                  strictly prohibited from reverse-engineering, scraping data, or utilizing
                  automated bots to interact with our systems.
                </p>
              </Section>

              <Section title="9. Indemnification">
                <p>
                  You agree to indemnify and hold harmless Apni Zaroorat and its affiliates from any
                  legal claims, financial penalties, or expenses (including attorney fees) resulting
                  from your violation of these Terms, submission of fraudulent documents, or breach
                  of any applicable laws.
                </p>
              </Section>

              <Section title="10. Governing Law &amp; Jurisdiction">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of
                  India. Any disputes arising in connection with these Terms or the use of the
                  Platform shall be subject to the exclusive jurisdiction of the competent courts
                  located in Jaipur, Rajasthan.
                </p>
              </Section>

              <Section title="11. Grievance Redressal Mechanism">
                <p>
                  In compliance with the Digital Lending Guidelines and applicable regulations, Apni
                  Zaroorat has a dedicated grievance redressal process.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      For Platform/Tech Queries:
                    </span>{" "}
                    You may reach our support team at{" "}
                    <a
                      href="mailto:support@apnizaroorat.com"
                      className="font-semibold text-primary hover:underline"
                    >
                      support@apnizaroorat.com
                    </a>
                    .
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      For Product/Lender Disputes:
                    </span>{" "}
                    If your grievance pertains to the actual loan product, credit decision, interest
                    rates, or insurance claims, please note that Apni Zaroorat holds no control over
                    these matters. Such disputes must be escalated directly to the respective
                    lending Bank/NBFC, Insurance Company, or the{" "}
                    <a
                      href="https://cms.rbi.org.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      RBI Ombudsman
                    </a>
                    .
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Grievance Officer:
                    </span>{" "}
                    For strictly platform-specific unresolved disputes, you may contact our
                    Grievance Officer in writing:
                    <br />
                    Email:{" "}
                    <a
                      href="mailto:grievance@apnizaroorat.com"
                      className="font-semibold text-primary hover:underline"
                    >
                      grievance@apnizaroorat.com
                    </a>
                    <br />
                    Address: 937, Subhash Chowk, Jaipur, Rajasthan 302002.
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
