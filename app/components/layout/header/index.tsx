"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Logo from "./logo";
import HeaderLink from "./navigation/HeaderLink";
import MobileHeaderLink from "./navigation/MobileHeaderLink";
import type { HeaderItem } from "@/app/types/layout/menu";
import { fetchData } from "@/app/utils/api";

const SERVICES_SUBMENU = [
  { label: "Personal Loan", href: "/services/personal-loan" },
  { label: "Business Loan", href: "/services/business-loan" },
  { label: "Home Loan", href: "/services/home-loan" },
  { label: "Credit Card", href: "/services/credit-card" },
  { label: "Insurance", href: "/services/insurance" },
];

const defaultHeaderData: HeaderItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    submenu: SERVICES_SUBMENU,
  },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function loadHeaderData(): Promise<HeaderItem[]> {
  return fetchData<{ headerData?: HeaderItem[] }>("/api/layoutdata", { headerData: defaultHeaderData }).then(
    (response) => {
      const items = response.headerData?.length ? response.headerData : defaultHeaderData;
      // Ensure Services always has our submenu, even if API data misses it
      return items.map((item) =>
        item.label === "Services"
          ? { ...item, submenu: SERVICES_SUBMENU }
          : item
      );
    }
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [data, setData] = useState<HeaderItem[]>(defaultHeaderData);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    loadHeaderData().then(setData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node) && navbarOpen) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navbarOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-semidark shadow-sm transition-all duration-200"
    >
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4 sm:px-6 h-16 sm:h-16 md:h-20 gap-2 min-w-0">
        <Logo />
        <nav className="hidden lg:flex flex-grow items-center justify-center space-x-4 xl:space-x-6 min-w-0">
          {data.map((item, index) => (
            <HeaderLink key={index} item={item} />
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3 md:gap-4 shrink-0">
          <Link
            href="/become-partner"
            className="hidden sm:inline-flex items-center px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-primary rounded-lg transition-all duration-300 hover:bg-blue-700 btn-shine"
          >
            Become a Partner
          </Link>
          <div className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-midnight_text dark:text-white">
            {mounted && (
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center p-0 border-0 bg-transparent cursor-pointer rounded"
              >
                <svg viewBox="0 0 16 16" className="h-7 w-7 sm:h-6 sm:w-6 dark:hidden" fill="currentColor" aria-hidden>
                  <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
                </svg>
                <svg viewBox="0 0 23 23" className="h-7 w-7 sm:h-6 sm:w-6 hidden dark:block" fill="currentColor" aria-hidden>
                  <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="block lg:hidden p-2.5 sm:p-2 rounded-lg text-midnight_text dark:text-white"
            aria-label="Toggle mobile menu"
          >
            <span className="block w-7 h-0.5 sm:w-6 sm:h-0.5 bg-current mt-0" />
            <span className="block w-7 h-0.5 sm:w-6 sm:h-0.5 bg-current mt-1.5" />
            <span className="block w-7 h-0.5 sm:w-6 sm:h-0.5 bg-current mt-1.5" />
          </button>
        </div>
      </div>
      {navbarOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setNavbarOpen(false)} aria-hidden />
      )}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 z-50 right-0 h-full w-full bg-white dark:bg-darkmode shadow-lg transform transition-transform duration-300 max-w-[min(320px,85vw)] sm:max-w-xs ${
          navbarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold text-midnight_text dark:text-white">Menu</h2>
          <button
            type="button"
            onClick={() => setNavbarOpen(false)}
            className="p-2 rounded-lg text-midnight_text dark:text-white"
            aria-label="Close mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-start p-4 sm:p-5 gap-1 w-full overflow-y-auto max-h-[calc(100vh-80px)]">
          {data.map((item, index) => (
            <MobileHeaderLink key={index} item={item} onClose={() => setNavbarOpen(false)} />
          ))}
          <Link
            href="/become-partner"
            onClick={() => setNavbarOpen(false)}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg transition-all duration-300 hover:bg-blue-700 text-center btn-shine"
          >
            Become a Partner
          </Link>
        </nav>
      </div>
    </header>
  );
}
