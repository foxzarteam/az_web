import type { Metadata } from "next";
import type { ReactNode } from "react";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, LEGAL_KEYWORDS, pageSeoGlue } from "@/app/lib/seo";

const PAGE_TITLE = "Privacy Policy & Data Protection | Apni Zaroorat";
const PAGE_DESC =
  "Privacy policy for Apni Zaroorat — how we collect, use, store, and protect your data when you apply for loans, insurance, or use our platform.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/privacy-policy",
  absoluteTitle: true,
  keywords: [
    ...LEGAL_KEYWORDS,
    "privacy policy",
    "Apni Zaroorat data privacy",
    "loan application data protection",
  ],
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/privacy-policy",
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white sm:mb-4 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Your data stays protected
            </span>
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              Privacy Policy
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
              <Section title="1. Introduction">
                <p>
                  At Apni Zaroorat (hereinafter referred to as &quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
                  &quot;us&quot;), we are deeply committed to protecting the privacy and security of your
                  personal and financial information. This Privacy Policy outlines our practices
                  regarding the collection, use, storage, sharing, and protection of your data when
                  you access our website, mobile application, or digital platforms (collectively,
                  the &quot;Platform&quot;) to apply for financial products such as Personal Loans and
                  Insurance.
                </p>
                <p>
                  By using the Platform, you explicitly consent to the data practices described in
                  this policy. If you do not agree with these practices, please do not use our
                  services.
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <p>
                  To facilitate your loan or insurance applications effectively, we collect the
                  following categories of information on a strict &quot;need-to-know&quot; basis:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Personally Identifiable Information (PII):
                    </span>{" "}
                    Name, Date of Birth, Gender, PAN (Permanent Account Number), Aadhaar details
                    (voluntarily provided for KYC), and demographic information.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Contact Information:
                    </span>{" "}
                    Mobile number, email address, and residential address.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Employment &amp; Financial Information:
                    </span>{" "}
                    Employment type, monthly income, employer details, and basic financial data
                    required by lending or insurance partners to assess eligibility.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Technical &amp; Device Data:
                    </span>{" "}
                    IP address, browser type, operating system, device identifiers, and platform
                    usage logs. This is collected automatically to enhance platform security,
                    prevent fraud, and comply with Google Play Store data safety guidelines.
                  </li>
                </ul>
                <p>
                  <span className="font-semibold text-midnight_text dark:text-white">Note:</span>{" "}
                  Apni Zaroorat does not collect or store your core banking passwords, UPI PINs, or
                  credit card CVVs.
                </p>
              </Section>

              <Section title="3. How We Use Your Information">
                <p>
                  Your data is utilized strictly for the following legal and operational purposes:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    To match your profile with the eligibility criteria of our RBI-registered
                    Lending Partners (for loans) and IRDAI-registered Insurance Partners (for
                    insurance).
                  </li>
                  <li>
                    To fetch your credit report from Credit Information Companies (CICs) upon your
                    explicit consent.
                  </li>
                  <li>
                    To communicate application status, deliver OTPs, and provide customer support.
                  </li>
                  <li>
                    To prevent fraudulent activities, unauthorized access, and ensure compliance
                    with Anti-Money Laundering (AML) laws.
                  </li>
                </ul>
              </Section>

              <Section title="4. Data Sharing &amp; Disclosure (Third-Party Sharing)">
                <p>
                  Apni Zaroorat does NOT sell your personal data to third-party marketing agencies.
                </p>
                <p>
                  We operate as an intermediary (DSA/LSP) and only share your encrypted data with:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Authorized Partners:
                    </span>{" "}
                    Registered Banks, NBFCs, and Insurance Companies to process your requested
                    financial product.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Service Providers:
                    </span>{" "}
                    Credit bureaus, KYC verification APIs, and secure cloud hosting providers (e.g.,
                    AWS/Google Cloud) bound by strict non-disclosure agreements.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Legal &amp; Regulatory Authorities:
                    </span>{" "}
                    When legally mandated by court orders, government agencies, or regulatory
                    bodies (RBI/IRDAI) for investigation or compliance purposes.
                  </li>
                </ul>
              </Section>

              <Section title="5. Data Security &amp; Retention">
                <p>
                  We implement industry-standard security measures, including 256-bit SSL encryption
                  and secure API gateways, to protect your data against unauthorized access or
                  alteration.
                </p>
                <p>
                  We retain your personal data only for as long as necessary to fulfill the purposes
                  outlined in this policy or as mandated by the statutory retention laws of India.
                  Once the purpose is fulfilled and the legal retention period expires, your data is
                  securely deleted or anonymized.
                </p>
              </Section>

              <Section title="6. Your Rights (Right to Be Forgotten)">
                <p>Under applicable data protection laws, you possess the right to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Access and review the personal information you have provided to us.</li>
                  <li>Request corrections to any inaccurate or incomplete data.</li>
                  <li>
                    Request the deletion of your account and data (&quot;Right to be Forgotten&quot;).
                    Please note that data deletion requests are subject to the mandatory retention
                    guidelines imposed by the RBI/IRDAI on our lending and insurance partners.
                  </li>
                </ul>
              </Section>

              <Section title="7. Changes to This Privacy Policy">
                <p>
                  The Company reserves the right to modify or update this Privacy Policy at any time
                  to reflect changes in legal or regulatory frameworks. Any significant changes will
                  be updated on this page. Continued use of the Platform signifies your acceptance
                  of the updated policy.
                </p>
              </Section>

              <Section title="8. Data Grievance Officer">
                <p>
                  If you have any questions, concerns, or discrepancies regarding the processing of
                  your personal data, please contact our designated Data Grievance Officer:
                </p>
                <ul className="list-none space-y-2 pl-0">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">Email:</span>{" "}
                    <a
                      href="mailto:grievance@apnizaroorat.com"
                      className="font-semibold text-primary hover:underline"
                    >
                      grievance@apnizaroorat.com
                    </a>
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Address:
                    </span>{" "}
                    937, Subhash Chowk, Jaipur, Rajasthan 302002.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      Response Time:
                    </span>{" "}
                    We strive to acknowledge data-related queries within 48 hours and resolve them
                    within the legally mandated timeframe.
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
