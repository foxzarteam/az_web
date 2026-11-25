"use client";

import { useMemo, useState } from "react";
import { formatRupee } from "@/app/lib/format";
import { isValidVehicleRc, sanitizeVehicleRc } from "@/app/lib/leads/leadForm";
import { setUsedCarEligibility } from "@/app/lib/leads/usedCarEligibilityPick";

const VALUE = { min: 50_000, max: 30_00_000, step: 10_000 } as const;
const AGE = { min: 0, max: 15 } as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function snap(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min;
  const steps = Math.round((value - min) / step);
  return clamp(min + steps * step, min, max);
}

function ageMultiplier(years: number): number {
  if (years <= 2) return 1.5;
  if (years <= 5) return 1.3;
  if (years <= 8) return 1.1;
  if (years <= 12) return 0.9;
  if (years <= 15) return 0.7;
  return 0;
}

function ageLabel(years: number): string {
  if (years <= 0) return "Less than 1 year";
  if (years >= AGE.max) return "15+ years";
  return years === 1 ? "1 year" : `${years} years`;
}

function rangeFill(value: number, min: number, max: number): string {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, #4236FB 0%, #FF7E29 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`;
}

function scrollToApplyForm() {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function UsedCarLoanCalculator() {
  const [rc, setRc] = useState("");
  const [value, setValue] = useState(5_00_000);
  const [age, setAge] = useState(3);
  const [rcError, setRcError] = useState("");

  const estimate = useMemo(() => {
    const multiplier = ageMultiplier(age);
    const maxLoan = Math.round((value * multiplier) / 1000) * 1000;
    return { maxLoan, eligible: multiplier > 0 && maxLoan >= VALUE.min };
  }, [age, value]);

  function handleCheck() {
    if (!isValidVehicleRc(rc)) {
      setRcError("Enter a valid vehicle RC number (e.g. MH12AB1234)");
      return;
    }
    setRcError("");
    setUsedCarEligibility({ eligible: estimate.eligible, amount: estimate.maxLoan, rc: sanitizeVehicleRc(rc) });
    window.setTimeout(scrollToApplyForm, 80);
  }

  return (
    <div className="h-full w-full min-w-0">
      <div className="theme-gradient-bg h-full rounded-2xl p-[2px] shadow-[0_12px_32px_rgba(66,54,251,0.12)]">
        <div className="flex h-full flex-col rounded-[18px] bg-white p-5 dark:bg-darklight sm:p-6">
          <h3 className="text-lg font-bold text-midnight_text dark:text-white sm:text-xl">
            Check used car loan eligibility
          </h3>

          <div className="mt-5 flex flex-1 flex-col space-y-5">
            <div>
              <label htmlFor="used-car-rc" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                Vehicle RC number
              </label>
              <input
                id="used-car-rc"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={rc}
                placeholder="MH12AB1234"
                onChange={(event) => {
                  setRc(sanitizeVehicleRc(event.target.value));
                  setRcError("");
                }}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wide text-midnight_text outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:ring-2 focus:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80 dark:text-white"
              />
              {rcError ? <p className="mt-1 text-xs text-red-600">{rcError}</p> : null}
            </div>

            <div>
              <div className="mb-1.5 flex items-end justify-between gap-3">
                <label htmlFor="used-car-value" className="text-sm font-medium text-midnight_text dark:text-gray-300">
                  What&apos;s Your Car&apos;s Current Value?
                </label>
                <span className="text-sm font-bold text-primary">{formatRupee(value)}</span>
              </div>
              <input
                id="used-car-value"
                type="range"
                min={VALUE.min}
                max={VALUE.max}
                step={VALUE.step}
                value={value}
                onChange={(event) => {
                  setValue(snap(Number(event.target.value), VALUE.min, VALUE.max, VALUE.step));
                }}
                className="loan-amount-slider w-full cursor-pointer"
                style={{ background: rangeFill(value, VALUE.min, VALUE.max) }}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-end justify-between gap-3">
                <label htmlFor="used-car-age" className="text-sm font-medium text-midnight_text dark:text-gray-300">
                  How Old Is Your Car?
                </label>
                <span className="text-sm font-bold text-primary">{ageLabel(age)}</span>
              </div>
              <input
                id="used-car-age"
                type="range"
                min={AGE.min}
                max={AGE.max}
                step={1}
                value={age}
                onChange={(event) => setAge(Number(event.target.value))}
                className="loan-amount-slider w-full cursor-pointer"
                style={{ background: rangeFill(age, AGE.min, AGE.max) }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheck}
            className="btn-gradient btn-shine relative mt-6 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl px-4 text-sm font-bold text-white shadow-[0_6px_18px_rgba(66,54,251,0.24)]"
          >
            Check Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}
