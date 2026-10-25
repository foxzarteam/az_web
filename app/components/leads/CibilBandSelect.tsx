"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SELECTABLE_CIBIL_BANDS, SELECTABLE_VEHICLE_CIBIL_BANDS } from "@/app/lib/leads/leadForm";

function cibilOption(band: string): { value: string; text: string; mark: "+" | "-" | "x" } {
  if (band === "unknown") return { value: band, text: "I do not know", mark: "x" };
  const above = band.startsWith("above_");
  return {
    value: band,
    text: `${above ? "Above" : "Below"} ${band.slice(band.indexOf("_") + 1)}`,
    mark: above ? "+" : "-",
  };
}

export const STANDARD_CIBIL_OPTIONS = SELECTABLE_CIBIL_BANDS.map(cibilOption);
export const VEHICLE_CIBIL_OPTIONS = SELECTABLE_VEHICLE_CIBIL_BANDS.map(cibilOption);

type CibilOption = { value: string; text: string; mark: "+" | "-" | "x" };

type ScoreMarkKind = "+" | "-" | "x";

function ScoreMark({ mark }: { mark: ScoreMarkKind }) {
  const color = mark === "+" ? "bg-green-600" : mark === "-" ? "bg-red-600" : "bg-black";
  const glyph = mark === "+" ? "+" : mark === "-" ? "−" : "×";
  return (
    <span
      className={`ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full align-middle text-[11px] font-bold leading-none text-white ${color}`}
    >
      {glyph}
    </span>
  );
}

function ScoreLabel({ text, mark }: { text: string; mark: ScoreMarkKind }) {
  return (
    <span>
      {text}
      <ScoreMark mark={mark} />
    </span>
  );
}

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  options?: readonly CibilOption[];
};

export default function CibilBandSelect({ id, value, onChange, className, options = STANDARD_CIBIL_OPTIONS }: Props) {
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
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={`${className} !h-10 overflow-hidden !py-0 flex items-center justify-between gap-2 text-left`}
      >
        <span className={`min-w-0 flex-1 truncate whitespace-nowrap ${selected ? "" : "text-gray-400"}`}>
          {selected ? <ScoreLabel text={selected.text} mark={selected.mark} /> : "Select CIBIL score"}
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
          node?.setCustomValidity(value ? "" : "Select your CIBIL score");
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-0"
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-darklight"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`flex w-full px-3.5 py-2 text-left text-base text-midnight_text hover:bg-gray-50 dark:text-white dark:hover:bg-white/5 ${
                    active ? "bg-primary/5" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <ScoreLabel text={option.text} mark={option.mark} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
