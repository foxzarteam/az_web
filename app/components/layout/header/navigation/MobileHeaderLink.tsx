"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderItem } from "@/app/types/layout/menu";

const MOBILE_SERVICE_GRADIENTS: Record<string, string> = {
  "Personal Loan": "from-[#ff9a9e] to-[#fad0c4]",
  "Business Loan": "from-[#a18cd1] to-[#fbc2eb]",
  "Home Loan": "from-[#84fab0] to-[#8fd3f4]",
  "Credit Card": "from-[#f6d365] to-[#fda085]",
  Insurance: "from-[#cfd9df] to-[#e2ebf0]",
};

export default function MobileHeaderLink({ item, onClose }: { item: HeaderItem; onClose: () => void }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const isActive = path === item.href || (item.submenu?.some((s) => s.href === path) ?? false);

  return (
    <div className="relative w-full">
      {item.submenu ? (
        <>
          <button
            type="button"
            onClick={() => setSubmenuOpen((prev) => !prev)}
            className={`flex items-center justify-between w-full py-2 px-3 rounded-md text-left focus:outline-none dark:text-opacity-60 ${
              isActive ? "bg-primary text-white dark:bg-primary dark:text-white dark:text-opacity-100" : "text-midnight_text dark:text-white"
            }`}
          >
            {item.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
              className={`transition-transform ${submenuOpen ? "rotate-180" : ""}`}
            >
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
            </svg>
          </button>
          {submenuOpen && item.submenu && (
            <div className="bg-white dark:bg-darkmode py-2 px-3 w-full space-y-1">
              {item.submenu.map((subItem, index) => {
                const gradient = MOBILE_SERVICE_GRADIENTS[subItem.label] ?? "from-primary/10 to-primary/40";
                const active = subItem.href === path;
                return (
                  <Link
                    key={index}
                    href={subItem.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg py-2 px-3 text-sm ${
                      active ? "bg-primary text-white" : "text-midnight_text dark:text-gray hover:bg-light dark:hover:bg-semidark"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-base`}
                    >
                      {subItem.label.includes("Personal") && "₹"}
                      {subItem.label.includes("Business") && "🏢"}
                      {subItem.label.includes("Home") && "🏠"}
                      {subItem.label.includes("Credit") && "💳"}
                      {subItem.label === "Insurance" && "🛡️"}
                    </div>
                    <span className="font-semibold">{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href}
          onClick={onClose}
          className={`flex items-center justify-between w-full py-2 px-3 rounded-md ${isActive ? "bg-primary text-white dark:bg-primary dark:text-white" : "text-midnight_text dark:text-white"}`}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
}
