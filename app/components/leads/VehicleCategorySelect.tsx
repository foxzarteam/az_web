"use client";

import { useEffect, useId, useRef, useState } from "react";
import { vehicleCategoryImageSrc } from "@/app/lib/leads/leadForm";
import type { InsuranceTypeOption } from "@/app/lib/services/types";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: InsuranceTypeOption[];
  className: string;
};

export default function VehicleCategorySelect({ id, value, onChange, options, className }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${open ? "z-50" : ""}`}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={`${className} !h-10 overflow-hidden !py-0 flex items-center justify-between gap-2 text-left`}
      >
        <span className={`flex min-w-0 flex-1 items-center gap-2 overflow-hidden ${selected ? "" : "text-gray-400"}`}>
          {selected ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vehicleCategoryImageSrc(selected.image)}
                alt=""
                width={28}
                height={28}
                className="h-6 w-6 shrink-0 object-contain"
              />
              <span className="truncate whitespace-nowrap">{selected.label}</span>
            </>
          ) : (
            <span className="truncate whitespace-nowrap">Select vehicle category</span>
          )}
        </span>
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-400">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <input
        tabIndex={-1}
        aria-hidden
        value={value}
        required
        onChange={() => undefined}
        ref={(node) => {
          node?.setCustomValidity(value ? "" : "Select vehicle category");
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-0"
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-visible rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-darklight"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-midnight_text hover:bg-gray-50 dark:text-white dark:hover:bg-white/5 ${
                    active ? "bg-primary/5" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicleCategoryImageSrc(option.image)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-6 w-6 shrink-0 object-contain"
                  />
                  <span>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
