"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderItem } from "@/app/types/layout/menu";
import { serviceSubmenuGradient, serviceSubmenuIcon } from "./serviceSubmenuUi";

export default function HeaderLink({ item }: { item: HeaderItem }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();

  const handleMouseEnter = () => {
    if (item.submenu && item.submenu.length > 0) setSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  const isActive =
    path === item.href || (item.submenu && item.submenu.length > 0 && item.submenu.some((s) => s.href === path));
  const isServices = item.label === "Services" && item.submenu && item.submenu.length > 0;

  return (
    <div
      className={item.submenu && item.submenu.length > 0 ? "relative" : ""}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`text-lg flex items-center gap-1 py-3 font-semibold text-midnight_text hover:text-primary dark:text-white dark:hover:text-primary ${isActive ? "!text-primary" : ""}`}
      >
        {item.label}
        {item.submenu && item.submenu.length > 0 && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
          </svg>
        )}
      </Link>
      {submenuOpen && item.submenu && item.submenu.length > 0 && !isServices && (
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
        <div className="absolute top-10 left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-darkmode shadow-xl dark:shadow-darkmd rounded-2xl z-50 border border-gray-100/80 dark:border-white/10 w-[min(90vw,300px)] sm:w-[min(320px,90vw)] max-w-[360px] px-3 sm:px-4 py-3">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {item.submenu?.map((subItem, index) => {
              const gradient = serviceSubmenuGradient(subItem, index);
              const icon = serviceSubmenuIcon(subItem);
              return (
                <Link
                  key={subItem.slug ?? subItem.href}
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
                    <span className="text-lg font-semibold leading-none">{icon}</span>
                  </div>
                  <span className="text-sm sm:text-base font-bold leading-snug whitespace-nowrap">
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
