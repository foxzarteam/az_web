"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { CONTACT, SOCIAL_LINKS } from "@/app/config/constants";
import { useRemoteServiceCards } from "@/app/lib/services/useRemoteServiceCards";
import { serviceCardsToSubmenu } from "@/app/lib/services/submenu";

const linkClass =
  "flex min-h-[36px] items-center py-1 text-sm text-gray hover:text-white sm:text-base";

const TOOL_LINKS = [
  { href: "/#emi-calculator", label: "EMI Calculator" },
  { href: "/#eligibility-calculator", label: "Eligibility Checker" },
] as const;

const LEGAL_LINKS = [
  { href: "/terms-and-conditions/", label: "Terms & Conditions" },
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/refund-policy/", label: "Refund Policy" },
  { href: "/disclaimer/", label: "Disclaimer" },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const { cards } = useRemoteServiceCards();
  const serviceLinks = useMemo(() => serviceCardsToSubmenu(cards), [cards]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/customer")) {
    return null;
  }

  return (
    <footer id="contact" className="relative z-10 bg-midnight_text dark:bg-semidark overflow-hidden">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md pt-8 sm:pt-10 pb-5 px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="mb-8 flex flex-row items-center justify-between gap-4 sm:mb-10">
          <Link
            href="/"
            className="inline-flex min-h-[44px] min-w-0 items-center gap-3"
            aria-label="Apni Zaroorat home"
          >
            <Image
              src="/favicon.webp"
              alt=""
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/25 sm:h-14 sm:w-14"
              sizes="56px"
              unoptimized
            />
            <span className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
              Apni Zaroorat
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <a href={`tel:${CONTACT.PHONE_TEL}`} className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <a href={`mailto:${CONTACT.EMAIL}`} className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.FACEBOOK} className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M16.294 8.86875H14.369H13.6815V8.18125V6.05V5.3625H14.369H15.8128C16.1909 5.3625 16.5003 5.0875 16.5003 4.675V1.03125C16.5003 0.653125 16.2253 0.34375 15.8128 0.34375H13.3034C10.5878 0.34375 8.69714 2.26875 8.69714 5.12187V8.1125V8.8H8.00964H5.67214C5.19089 8.8 4.74402 9.17812 4.74402 9.72812V12.2031C4.74402 12.6844 5.12214 13.1313 5.67214 13.1313H7.94089H8.62839V13.8188V20.7281C8.62839 21.2094 9.00652 21.6562 9.55652 21.6562H12.7878C12.994 21.6562 13.1659 21.5531 13.3034 21.4156C13.4409 21.2781 13.544 21.0375 13.544 20.8312V13.8531V13.1656H14.2659H15.8128C16.2596 13.1656 16.6034 12.8906 16.6721 12.4781V12.4438V12.4094L17.1534 10.0375C17.1878 9.79688 17.1534 9.52187 16.9471 9.24687C16.8784 9.075 16.569 8.90312 16.294 8.86875Z" /></svg>
            </a>
            <a href={SOCIAL_LINKS.TWITTER} className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" /></svg>
            </a>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          <div className="min-w-0 text-left">
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg text-white">Quick Links</h4>
            <ul className="space-y-0.5">
              <li>
                <Link href="/about/" className={linkClass}>
                  About Company
                </Link>
              </li>
              <li>
                <Link href="/products/personal-loan/" className={linkClass}>
                  Personal Loan
                </Link>
              </li>
              <li>
                <Link href="/products/insurance/" className={linkClass}>
                  Insurance
                </Link>
              </li>
              <li>
                <Link href="/contact/" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/become-partner/" className={linkClass}>
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0 text-left">
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg text-white">Products</h4>
            <ul className="space-y-0.5">
              {serviceLinks.map((s) => (
                <li key={s.slug ?? s.href}>
                  <Link href={s.href} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/customer/login/" className={linkClass}>
                  Check Application Status
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0 text-left">
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg text-white">Tools</h4>
            <ul className="space-y-0.5">
              {TOOL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 text-left">
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg text-white">Legal</h4>
            <ul className="space-y-0.5">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 sm:mt-10">
          <p className="text-center text-xs text-gray sm:text-sm">
            © 2026 Apni Zaroorat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
