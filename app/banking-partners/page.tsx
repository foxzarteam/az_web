import type { Metadata } from "next";
import Link from "next/link";
import CtaBanner from "@/app/about/components/cta-banner";
import JsonLd from "@/app/components/seo/JsonLd";
import { buildPageMetadata, pageSeoGlue } from "@/app/lib/seo";

const PAGE_TITLE = "Banking Partners | Apni Zaroorat";
const PAGE_DESC =
  "See the banks and lenders partnered with Apni Zaroorat. Choose a partner to apply for a personal loan online.";

function PartnerIcon({ kind }: { kind: "bank" | "company" }) {
  if (kind === "bank") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path d="M4 10.5 12 5l8 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6.5 10.5V17M10 10.5V17M14 10.5V17M17.5 10.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4.5 17h15M3.5 19.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path d="M5 20V6.5A1.5 1.5 0 0 1 6.5 5h6A1.5 1.5 0 0 1 14 6.5V20" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 10h3.5A1.5 1.5 0 0 1 19 11.5V20" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8.5h3M8 12h3M8 15.5h3M3.5 20h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const GROUPS: { title: string; icon: "bank" | "company"; names: string[] }[] = [
  {
    title: "Private Bank",
    icon: "bank",
    names: [
      "Axis Bank",
      "Kotak Bank",
      "IndusInd Bank",
      "DCB Bank",
      "IDFC FIRST Bank",
      "ICICI Bank",
      "HDFC Bank",
      "YES Bank",
      "Reliance",
      "HDFC Sales",
      "CITI Bank",
      "RBL Bank",
      "Federal Bank",
      "Saraswat",
      "Unity Small Finance",
      "LIC",
      "HSBC",
      "HDFC Home Loan",
      "Karur Vysya Bank",
      "IDBI",
      "UGRO Capital",
      "Karnataka Bank",
    ],
  },
  {
    title: "NBFC",
    icon: "company",
    names: [
      "DHFL",
      "SMFG India Credit",
      "L&T",
      "Tata Capital",
      "Bajaj Finserv",
      "Cholamandalam",
      "Hero Housing Finance",
      "Shriram Bank",
      "Godrej",
      "Aditya Birla",
      "IIFL",
      "Edelweiss",
      "Piramal Finance",
      "Vastu Housing Finance",
      "Clix Capital",
      "InCred",
      "Ujjivan Small Finance",
      "Capri Global",
      "NeoGrowth",
      "Capital First Ltd.",
      "Hero FinCorp",
      "Aadhar Housing Finance",
      "Lending Kart",
      "FT Cash",
      "LoanTap",
      "Indifi Technologies",
      "PaySense",
      "Home First Finance",
      "Digikredit",
      "INTELLEGROW",
      "PNB Housing Finance",
      "Poonawalla Fincorp",
      "Muthoot Finance",
      "Auxilo",
      "Bhanix Finance",
      "Art Housing Finance Ltd",
      "FatakPay",
      "Credila",
      "Prefr",
      "Epifi",
      "Credit Sea",
      "Avanse",
      "Zype",
      "Privo",
      "MoneyWide",
      "AU Small Finance",
      "IndiaBulls",
      "Arka Fincap",
      "Propelld",
      "Aavas Financiers",
    ],
  },
  {
    title: "Nationalized Bank",
    icon: "bank",
    names: [
      "State Bank of India",
      "Bank of Baroda",
      "Canara Bank",
      "Punjab & Sind Bank",
      "Bank of Maharashtra",
      "Punjab National Bank",
      "Indian Bank",
      "Union Bank of India",
      "Bank of India",
    ],
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/banking-partners",
  absoluteTitle: true,
  image: "/images/og-default.jpg",
  imageAlt: "Apni Zaroorat banking partners",
});

const structuredData = pageSeoGlue({
  name: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/banking-partners",
  image: "/images/og-default.jpg",
  crumbs: [
    { name: "Home", path: "/" },
    { name: "Banking Partners", path: "/banking-partners" },
  ],
});

export default function BankingPartnersPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="theme-gradient-bg px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 md:pt-32">
        <div className="container mx-auto md:max-w-screen-md lg:max-w-screen-xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-2xl font-bold text-white xs:text-3xl sm:mb-4 sm:text-4xl md:text-5xl">
              Our Banking Partners
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
              Tap any partner to apply for a personal loan.
            </p>
          </div>
        </div>
      </div>
      <section className="bg-[linear-gradient(180deg,#f3f1ff_0%,#fff8f3_100%)] px-4 py-10 dark:bg-darkmode sm:px-6 sm:py-14">
        <div className="container mx-auto max-w-6xl space-y-10">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="theme-gradient-text mb-4 inline-block text-base font-bold sm:text-lg">{group.title}</h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {group.names.map((name) => (
                  <li key={name}>
                    <Link
                      href="/products/personal-loan"
                      className="flex min-h-[4.75rem] items-center justify-center gap-2.5 rounded-2xl border border-[#cfc6ff] bg-white px-3.5 py-3.5 text-left text-sm font-semibold leading-snug text-slate-800 shadow-[0_8px_22px_rgba(66,54,251,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#FF7E29] hover:shadow-[0_12px_28px_rgba(255,126,41,0.16)] dark:border-[#4236FB]/50 dark:bg-darklight dark:text-white"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4236FB] to-[#FF7E29] text-white">
                        <PartnerIcon kind={group.icon} />
                      </span>
                      <span className="min-w-0 flex-1">{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner
        title="Ready to apply?"
        description="Start a personal loan or insurance application — simple, digital, and secure."
        primaryHref="/products/personal-loan/"
        primaryLabel="Personal loan"
        secondaryHref="/products/insurance/"
        secondaryLabel="Insurance"
      />
    </>
  );
}
