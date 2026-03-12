"use client";

import Image from "next/image";
import Link from "next/link";
import { CONTACT, SOCIAL_LINKS } from "@/app/config/constants";

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 bg-midnight_text dark:bg-semidark overflow-hidden">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md pt-10 pb-5 px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-span-4 col-span-12 flex items-center">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 sm:gap-3">
              <Image 
                src="/images/logo/app_icon.png" 
                alt="Apni Zaroorat" 
                width={48} 
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
              <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                Apni Zaroorat
              </span>
            </Link>
          </div>
          <div className="md:col-span-8 col-span-12 grid grid-cols-12 gap-4">
            <div className="lg:col-span-4 col-span-12">
              <h4 className="mb-4 text-lg text-white">Address</h4>
              <p className="mb-6 text-gray text-base">
                Apni Zaroorat – Loans, Insurance & Credit Cards. Compare and apply online.
              </p>
              <div className="flex items-center gap-2">
                <a href={`tel:${CONTACT.PHONE}`} className="p-1 rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Phone">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
                <a href={`mailto:${CONTACT.EMAIL}`} className="p-1 rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
                <a href={SOCIAL_LINKS.FACEBOOK} className="p-1 rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M16.294 8.86875H14.369H13.6815V8.18125V6.05V5.3625H14.369H15.8128C16.1909 5.3625 16.5003 5.0875 16.5003 4.675V1.03125C16.5003 0.653125 16.2253 0.34375 15.8128 0.34375H13.3034C10.5878 0.34375 8.69714 2.26875 8.69714 5.12187V8.1125V8.8H8.00964H5.67214C5.19089 8.8 4.74402 9.17812 4.74402 9.72812V12.2031C4.74402 12.6844 5.12214 13.1313 5.67214 13.1313H7.94089H8.62839V13.8188V20.7281C8.62839 21.2094 9.00652 21.6562 9.55652 21.6562H12.7878C12.994 21.6562 13.1659 21.5531 13.3034 21.4156C13.4409 21.2781 13.544 21.0375 13.544 20.8312V13.8531V13.1656H14.2659H15.8128C16.2596 13.1656 16.6034 12.8906 16.6721 12.4781V12.4438V12.4094L17.1534 10.0375C17.1878 9.79688 17.1534 9.52187 16.9471 9.24687C16.8784 9.075 16.569 8.90312 16.294 8.86875Z" /></svg>
                </a>
                <a href={SOCIAL_LINKS.TWITTER} className="p-1 rounded-md text-midnight_text bg-white/50 hover:bg-primary transition-colors" aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" /></svg>
                </a>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12">
              <h4 className="mb-4 text-lg text-white">Quick Links</h4>
              <ul>
                <li><Link href="/contact" className="mb-3 inline-block text-base text-gray hover:text-white">Contact</Link></li>
                <li><Link href="/#featured" className="mb-3 inline-block text-base text-gray hover:text-white">Service</Link></li>
                <li><Link href="/about" className="mb-3 inline-block text-base text-gray hover:text-white">About</Link></li>
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
    </footer>
  );
}
