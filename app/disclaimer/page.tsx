import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description:
    "Disclaimer for Apni Zaroorat — platform role, no approval guarantee, tools, and liability limits.",
  path: "/disclaimer",
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

export default function DisclaimerPage() {
  return (
    <>
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 theme-gradient-bg px-4 sm:px-6">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white sm:mb-4 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Please read carefully
            </span>
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              Disclaimer
            </h1>
          </div>
        </div>
      </div>

      <section className="dark:bg-darkmode py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:border-dark_border dark:bg-darklight sm:p-10 lg:p-12">
            <div className="space-y-10 text-base leading-relaxed text-midnight_text dark:text-gray-200 sm:space-y-12 sm:text-[17px]">
              <Section title="1. Platform Nature &amp; Role">
                <p>
                  Apni Zaroorat operates exclusively as a digital aggregator, Loan Service Provider
                  (LSP), and a Direct Selling Agent (DSA). We are strictly NOT a Bank, Non-Banking
                  Financial Company (NBFC), or an Insurance Provider. Our platform acts merely as a
                  technology bridge to connect users with RBI-registered lending institutions and
                  IRDAI-registered insurance companies.
                </p>
              </Section>

              <Section title="2. No Guarantee of Approval or Services">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      For Loans:
                    </span>{" "}
                    The final decision regarding the approval or rejection of a loan, the loan
                    amount sanctioned, the applicable interest rate, and the repayment tenure rests
                    entirely with the respective Bank/NBFC based on their internal credit policies
                    and your credit profile. Apni Zaroorat does not influence, guarantee, or promise
                    the approval of any financial product.
                  </li>
                  <li>
                    <span className="font-semibold text-midnight_text dark:text-white">
                      For Insurance:
                    </span>{" "}
                    The issuance of an insurance policy and the settlement of claims are the sole
                    discretion and responsibility of the respective Insurance Company. Apni Zaroorat
                    holds no liability in the underwriting process or claim disputes.
                  </li>
                </ul>
              </Section>

              <Section title="3. Accuracy of Information &amp; Tools">
                <p>
                  The information, content, and tools provided on Apni Zaroorat (including the
                  Personal Loan EMI Calculator, Insurance Premium Calculator, and Credit Eligibility
                  indicators) are strictly for informational and illustrative purposes only.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>These tools do not constitute financial, legal, or tax advice.</li>
                  <li>
                    Actual EMI amounts, premium quotes, and eligibility may vary significantly based
                    on the final terms provided by our Partner institutions. Users are advised to
                    independently verify all details directly with the respective financial
                    institution before making any commitments.
                  </li>
                </ul>
              </Section>

              <Section title="4. No Upfront Fees &amp; Fraud Alert">
                <p>
                  Apni Zaroorat and its official representatives will NEVER ask you to:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Deposit cash into any personal or corporate bank account.</li>
                  <li>
                    Pay advance processing fees, consultation charges, or &quot;file clearance&quot;
                    fees.
                  </li>
                  <li>
                    Share your sensitive banking passwords, UPI PINs, or ATM card CVVs over a phone
                    call or email.
                  </li>
                </ul>
                <p>
                  Our platform is completely free for users. Any processing fees levied by the
                  lending Bank/NBFC will be directly deducted from the sanctioned loan amount.
                  Please beware of scammers and imposters using our brand name.
                </p>
              </Section>

              <Section title="5. Third-Party Links &amp; Endorsements">
                <p>
                  Our website may contain links to third-party websites, APIs, or partner portals.
                  Apni Zaroorat does not endorse, guarantee, or take responsibility for the accuracy,
                  security, or privacy practices of these external sites. Accessing any third-party
                  link is entirely at the user&apos;s own risk.
                </p>
              </Section>

              <Section title="6. Limitation of Liability">
                <p>
                  By using this platform, you explicitly agree that Apni Zaroorat shall not be held
                  liable for any direct, indirect, incidental, or consequential damages, financial
                  losses, or disputes arising from your interactions with the third-party Banks,
                  NBFCs, or Insurance Companies featured on our platform.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
