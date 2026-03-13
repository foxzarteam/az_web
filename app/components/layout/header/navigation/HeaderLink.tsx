"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderItem } from "@/app/types/layout/menu";

const SERVICES_COLORS: Record<string, string> = {
  "Personal Loan": "from-[#ff9a9e] to-[#fad0c4]",
  "Business Loan": "from-[#a18cd1] to-[#fbc2eb]",
  "Home Loan": "from-[#84fab0] to-[#8fd3f4]",
  "Credit Card": "from-[#f6d365] to-[#fda085]",
  Insurance: "from-[#cfd9df] to-[#e2ebf0]",
};

export default function HeaderLink({ item }: { item: HeaderItem }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const handleMouseEnter = () => {
    if (item.submenu) setSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  const isActive = path === item.href || (item.submenu?.some((s) => s.href === path) ?? false);
  const isServices = item.label === "Services" && item.submenu;

  return (
    <div
      className={item.submenu ? "relative" : ""}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`text-base flex items-center gap-1 py-3 font-normal text-midnight_text hover:text-primary dark:text-white dark:hover:text-primary ${isActive ? "!text-primary" : ""}`}
      >
        {item.label}
        {item.submenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
          </svg>
        )}
      </Link>
      {submenuOpen && item.submenu && !isServices && (
        <div className="absolute py-2 top-9 left-0 mt-0.5 w-60 bg-white dark:bg-darkmode shadow-lg dark:shadow-darkmd rounded-lg z-50">
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block px-4 py-2 ${path === subItem.href ? "text-white bg-primary hover:bg-blue-700" : "text-midnight_text dark:text-white hover:bg-section dark:hover:bg-semidark"}`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
      {submenuOpen && isServices && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-darkmode shadow-xl dark:shadow-darkmd rounded-2xl z-50 border border-gray-100/80 dark:border-white/10 min-w-[640px] max-w-[760px] px-5 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {item.submenu.map((subItem, index) => {
              const gradient = SERVICES_COLORS[subItem.label] ?? "from-primary/10 to-primary/30";
              return (
                <Link
                  key={index}
                  href={subItem.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    path === subItem.href
                      ? "bg-primary text-white"
                      : "hover:bg-light dark:hover:bg-semidark text-midnight_text dark:text-white"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm shrink-0`}
                  >
                    {subItem.label.includes("Personal") && (
                      <span className="text-lg font-semibold">₹</span>
                    )}
                    {subItem.label.includes("Business") && (
                      <span className="text-base font-semibold">🏢</span>
                    )}
                    {subItem.label.includes("Home") && (
                      <span className="text-base font-semibold">🏠</span>
                    )}
                    {subItem.label.includes("Credit") && (
                      <span className="text-base font-semibold">💳</span>
                    )}
                    {subItem.label === "Insurance" && (
                      <span className="text-base font-semibold">🛡️</span>
                    )}
                  </div>
                  <span className="text-[13px] font-semibold leading-snug whitespace-nowrap">
                    {subItem.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
