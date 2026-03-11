"use client";

import Link from "next/link";
import { COLORS } from "@/app/config/constants";

const CARD_BGS = [
  "bg-blue-50 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-500/20",
  "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-500/20",
  "bg-violet-50 dark:bg-violet-900/20 border-violet-200/60 dark:border-violet-500/20",
  "bg-amber-50 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-500/20",
];

const SERVICES = [
  {
    title: "Home Loan",
    description: "Instant approval at lowest interest rates",
    badge: "Quick Sanction",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 shrink-0" aria-hidden>
        <path d="M24 6L8 20v22h12V28h8v14h12V20L24 6z" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" strokeLinejoin="round" />
        <text x="24" y="26" fontSize="12" fill={COLORS.PRIMARY} textAnchor="middle" fontWeight="700">%</text>
      </svg>
    ),
    primary: true,
  },
  {
    title: "Personal Loan",
    description: "Paperless process at low rate",
    badge: "Quick Disbursal",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 shrink-0" aria-hidden>
        <path d="M28 12H14a4 4 0 00-4 4v20a4 4 0 004 4h20a4 4 0 004-4V22" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M28 12v8h8l6-6-6-6h-8z" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="20" cy="32" r="3" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" />
      </svg>
    ),
    primary: false,
  },
  {
    title: "Business Loan",
    description: "Fund your business with flexible tenure",
    badge: "Flexible Repayment",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 shrink-0" aria-hidden>
        <rect x="10" y="12" width="28" height="26" rx="2" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" />
        <path d="M10 22h28M18 12V8a2 2 0 014 0v4M26 12V8a2 2 0 014 0v4" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M16 30h4v6h-4zM28 30h4v6h-4z" fill={COLORS.PRIMARY} />
      </svg>
    ),
    primary: false,
  },
  {
    title: "Credit Card",
    description: "Choose cards from all top banks",
    badge: "Rewards Unlimited",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 shrink-0" aria-hidden>
        <rect x="4" y="14" width="40" height="28" rx="3" stroke={COLORS.PRIMARY} strokeWidth="2" fill="none" />
        <rect x="4" y="14" width="40" height="12" rx="2" fill={COLORS.PRIMARY} fillOpacity="0.25" />
        <circle cx="14" cy="20" r="3" fill={COLORS.PRIMARY} />
        <path d="M8 32h32M8 38h18" stroke={COLORS.PRIMARY} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    primary: false,
  },
];

export default function DiscoverProperties() {
  return (
    <section className="bg-white dark:bg-darkmode relative overflow-hidden">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4 sm:px-4 relative z-10 max-w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-midnight_text dark:text-white text-center" data-aos="fade-up">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SERVICES.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-xl border p-4 sm:p-6 flex flex-col min-h-[240px] sm:min-h-[280px] transition-colors duration-300 hover:shadow-md ${CARD_BGS[index]}`}
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <span className="absolute top-0 right-0 bg-accent text-midnight_text text-xs font-bold px-3 py-1.5 rounded-bl-lg rounded-tr-xl">
                {item.badge}
              </span>
              <div className="flex items-start gap-3 mb-4 pt-6">
                <span className="text-primary">{item.icon}</span>
                <h3 className="text-xl font-bold text-midnight_text dark:text-white pt-1">{item.title}</h3>
              </div>
              <p className="text-gray dark:text-gray-400 text-sm mb-3 flex-1">{item.description}</p>
              <Link
                href="/#featured"
                className={`inline-flex items-center justify-center gap-1 rounded-lg py-2.5 px-4 text-sm font-semibold transition-colors ${
                  item.primary
                    ? "bg-primary text-white hover:bg-blue-700"
                    : "border border-primary text-primary dark:border-white/30 dark:text-white hover:bg-primary/10 dark:hover:bg-white/10"
                }`}
              >
                Apply Now <span className="ml-0.5">&gt;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
