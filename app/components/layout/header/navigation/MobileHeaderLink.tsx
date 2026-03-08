"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderItem } from "@/app/types/layout/menu";

export default function MobileHeaderLink({ item, onClose }: { item: HeaderItem; onClose: () => void }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const handleToggle = () => {
    if (item.submenu) setSubmenuOpen((prev) => !prev);
    else onClose();
  };

  const isActive = path === item.href || (item.submenu?.some((s) => s.href === path) ?? false);

  return (
    <div className="relative w-full">
      {item.submenu ? (
        <>
          <button
            type="button"
            onClick={() => setSubmenuOpen((prev) => !prev)}
            className={`flex items-center justify-between w-full py-2 px-3 rounded-md text-left focus:outline-none dark:text-opacity-60 ${isActive ? "bg-primary text-white dark:bg-primary dark:text-white dark:text-opacity-100" : "text-midnight_text dark:text-white"}`}
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
            <div className="bg-white dark:bg-darkmode py-2 px-3 w-full">
              {item.submenu.map((subItem, index) => (
                <Link
                  key={index}
                  href={subItem.href}
                  onClick={onClose}
                  className={`block py-2 px-3 ${subItem.href === path ? "!text-primary dark:!text-primary" : "text-gray dark:text-gray"}`}
                >
                  {subItem.label}
                </Link>
              ))}
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
