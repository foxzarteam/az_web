"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { CONTACT, SOCIAL_LINKS } from "@/app/config/constants";
import { SITELINK_PAGES, seoPath } from "@/app/lib/seo";
import { useRemoteServiceCards } from "@/app/lib/services/useRemoteServiceCards";
import { serviceCardsToSubmenu } from "@/app/lib/services/submenu";
import { hidePublicChrome } from "@/app/lib/layout/hidePublicChrome";

const linkClass =
  "flex min-h-[36px] items-center py-1 text-sm text-white/90 hover:text-white sm:text-base";

const TOOL_LINKS = [
  { href: "/emi-calculator/", label: "EMI Calculator" },
  { href: "/check-eligibility/", label: "Check Eligibility" },
  { href: "/tax-saving-calculator/", label: "Tax Saving Calculator" },
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

  if (hidePublicChrome(pathname)) {
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
              alt="Apni Zaroorat logo"
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
            <a
              href={`tel:${CONTACT.PHONE_TEL}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-white/95 p-2.5 transition hover:opacity-90"
              aria-label={`Call ${CONTACT.PHONE}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#34C759"
                  d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                />
              </svg>
            </a>
            <a
              href={`mailto:${CONTACT.EMAIL}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-white/95 p-2.5 transition hover:opacity-90"
              aria-label={`Email ${CONTACT.EMAIL}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                <path fill="#FBBC04" d="M22 6.5 12 14 2 6.5V6l10 7 10-7v.5z" />
                <path fill="#4285F4" d="M2 6.5V18l6.5-5.25L2 6.5z" />
                <path fill="#34A853" d="M22 6.5V18l-6.5-5.25L22 6.5z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-white/95 p-2.5 transition hover:opacity-90"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <defs>
                  <radialGradient id="igFooterGrad" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <path
                  fill="url(#igFooterGrad)"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-white/95 p-2.5 transition hover:opacity-90"
              aria-label="YouTube"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#FF0000"
                  d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                />
                <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-white/95 p-2.5 transition hover:opacity-90"
              aria-label="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#1877F2"
                  d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          <div className="min-w-0 text-left">
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg text-white">Quick Links</h4>
            <ul className="space-y-0.5">
              <li>
                <Link href="/products/" className={linkClass}>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact/" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/become-partner/" className={linkClass}>
                  Partner
                </Link>
              </li>
              <li>
                <Link href="/about/" className={linkClass}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0 text-left">
            <h4 className="mb-3 sm:mb-4 text-base sm:text-lg text-white">
              <Link href="/products/" className="text-white hover:text-white">
                Products
              </Link>
            </h4>
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

        <nav
          aria-label="Apni Zaroorat site map"
          className="mt-8 border-t border-white/10 pt-6 sm:mt-10"
        >
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-white/70">
            All pages
          </p>
          <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-1 gap-y-1 text-center text-xs sm:text-sm">
            {SITELINK_PAGES.map((page, index) => (
              <li key={page.path} className="inline-flex items-center">
                {index > 0 ? (
                  <span className="mx-1.5 text-white/30 select-none" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link href={seoPath(page.path)} className="text-white/85 hover:text-white">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-white/60">
            Follow:{" "}
            <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
              Instagram
            </a>
            {" · "}
            <a href={SOCIAL_LINKS.YOUTUBE} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
              YouTube
            </a>
            {" · "}
            <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
              Facebook
            </a>
          </p>
        </nav>

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-center text-xs text-gray sm:text-sm">
            © 2026 Apni Zaroorat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
