"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { InsuranceTypeOption } from "@/app/lib/services/types";
import { INSURANCE_TYPE_OPTIONS, insuranceTypeImageSrc } from "@/app/utils/leadForm";

type MenuBox = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

function optionImage(option: InsuranceTypeOption): string {
  const fromOption = insuranceTypeImageSrc(option.image);
  if (fromOption) return fromOption;
  const known = INSURANCE_TYPE_OPTIONS.find((item) => item.value === option.value);
  return insuranceTypeImageSrc(known?.image);
}

function TypeIcon({ src }: { src: string }) {
  if (!src) {
    return <span className="h-6 w-6 shrink-0 rounded-md bg-[#EEF0FF] dark:bg-primary/20" aria-hidden />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" />
  );
}

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: InsuranceTypeOption[];
  className?: string;
};

export default function InsuranceTypeSelect({ id, value, onChange, options, className }: Props) {
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<MenuBox | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((item) => item.value === value);
  const selectedSrc = selected ? optionImage(selected) : "";

  function placeMenu() {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const gap = 6;
    const preferred = 220;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
    const spaceAbove = rect.top - gap - 12;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(140, Math.min(preferred, openUp ? spaceAbove : spaceBelow));
    setMenuBox({
      top: openUp ? Math.max(8, rect.top - gap - maxHeight) : rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  }

  useEffect(() => {
    if (!open) return;
    placeMenu();
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", placeMenu, true);
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", onKey);
    const selectedRow = menuRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    selectedRow?.scrollIntoView({ block: "nearest" });
    return () => {
      window.removeEventListener("resize", placeMenu);
      window.removeEventListener("scroll", placeMenu, true);
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open && menuBox
      ? createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-labelledby={id}
            style={{
              top: menuBox.top,
              left: menuBox.left,
              width: menuBox.width,
              maxHeight: menuBox.maxHeight,
            }}
            className="fixed z-[100000] overflow-y-auto overscroll-contain rounded-xl border border-[#E4E0FF] bg-white py-1 shadow-[0_12px_32px_rgba(66,54,251,0.16)] dark:border-dark_border dark:bg-darklight"
          >
            {options.map((option) => {
              const src = optionImage(option);
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "bg-[#EEF0FF] font-semibold text-primary dark:bg-primary/20"
                        : "text-midnight_text hover:bg-[#F6F4FF] dark:text-white dark:hover:bg-white/5"
                    }`}
                  >
                    <TypeIcon src={src} />
                    <span className="min-w-0 leading-snug">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={
          className ??
          "flex w-full min-h-10 items-center gap-2.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-left text-base text-midnight_text focus:outline-none focus:ring-2 focus:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80 dark:text-white"
        }
      >
        {selected ? <TypeIcon src={selectedSrc} /> : null}
        <span className={`min-w-0 flex-1 truncate ${selected ? "" : "text-gray-400"}`}>
          {selected?.label ?? "Select insurance type"}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className={`h-4 w-4 shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`}
        >
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {menu}
    </div>
  );
}
