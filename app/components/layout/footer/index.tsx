"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTACT, SOCIAL_LINKS, DEFAULT_IMAGES } from "@/app/config/constants";

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 bg-midnight_text dark:bg-semidark overflow-hidden">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md pt-10 pb-5 px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-span-4 col-span-12 flex items-center">
            <Link href="/" className="mb-6 inline-block max-w-40">
              <Image src={DEFAULT_IMAGES.LOGO_WHITE} alt="logo" width={156} height={38} />
            </Link>
          </div>
          <div className="md:col-span-8 col-span-12 grid grid-cols-12 gap-4">
            <div className="lg:col-span-4 col-span-12">
              <h4 className="mb-4 text-lg text-white">Address</h4>
              <p className="mb-6 text-gray text-base">
                Apni Zaroorat – Loans, Insurance & Credit Cards. Compare and apply online.
              </p>
              <div className="flex items-center gap-2">
                <a href={SOCIAL_LINKS.FACEBOOK} className="p-1 rounded-md text-midnight_text bg-white/50 hover:bg-primary" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M16.294 8.86875H14.369H13.6815V8.18125V6.05V5.3625H14.369H15.8128C16.1909 5.3625 16.5003 5.0875 16.5003 4.675V1.03125C16.5003 0.653125 16.2253 0.34375 15.8128 0.34375H13.3034C10.5878 0.34375 8.69714 2.26875 8.69714 5.12187V8.1125V8.8H8.00964H5.67214C5.19089 8.8 4.74402 9.17812 4.74402 9.72812V12.2031C4.74402 12.6844 5.12214 13.1313 5.67214 13.1313H7.94089H8.62839V13.8188V20.7281C8.62839 21.2094 9.00652 21.6562 9.55652 21.6562H12.7878C12.994 21.6562 13.1659 21.5531 13.3034 21.4156C13.4409 21.2781 13.544 21.0375 13.544 20.8312V13.8531V13.1656H14.2659H15.8128C16.2596 13.1656 16.6034 12.8906 16.6721 12.4781V12.4438V12.4094L17.1534 10.0375C17.1878 9.79688 17.1534 9.52187 16.9471 9.24687C16.8784 9.075 16.569 8.90312 16.294 8.86875Z" /></svg>
                </a>
                <a href={SOCIAL_LINKS.TWITTER} className="p-1 rounded-md text-midnight_text bg-white/50 hover:bg-primary" aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" /></svg>
                </a>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12">
              <h4 className="mb-4 text-lg text-white">Quick Links</h4>
              <ul>
                <li><Link href="/contact" className="mb-3 inline-block text-base text-gray hover:text-white">Contact</Link></li>
                <li><Link href="/#featured" className="mb-3 inline-block text-base text-gray hover:text-white">Products & Offers</Link></li>
                <li><Link href="/#blog" className="mb-3 inline-block text-base text-gray hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-4 col-span-12">
              <h4 className="mb-4 text-lg text-white">Popular</h4>
              <ul>
                <li><Link href="/#featured" className="mb-3 inline-block text-base text-gray hover:text-white">Personal Loan</Link></li>
                <li><Link href="/#featured" className="mb-3 inline-block text-base text-gray hover:text-white">Insurance</Link></li>
                <li><Link href="/#featured" className="mb-3 inline-block text-base text-gray hover:text-white">Credit Card</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border dark:border-dark_border py-6 sm:py-8">
        <div className="container flex flex-col lg:flex-row justify-between items-center mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 gap-4 max-w-full">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-sm sm:text-base text-white text-center lg:text-left">
            <span>Phone: <Link href={`tel:${CONTACT.PHONE}`} className="text-gray hover:text-white">{CONTACT.PHONE}</Link></span>
            <span>Email: <Link href={`mailto:${CONTACT.EMAIL}`} className="text-gray hover:text-white break-all">{CONTACT.EMAIL}</Link></span>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-white font-bold">Newsletter</span>
            <div className="flex w-full sm:w-auto max-w-xs sm:max-w-none">
              <input type="email" placeholder="Email address" className="py-3 px-3 rounded-l-lg border border-transparent dark:bg-darkmode dark:border-dark_border dark:text-gray w-full min-w-0 sm:w-40 md:w-52 focus:outline-none focus:border-primary text-sm" />
              <button type="button" className="py-3 px-4 sm:px-5 bg-primary text-white rounded-r-lg hover:bg-blue-700 shrink-0 text-sm sm:text-base">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
