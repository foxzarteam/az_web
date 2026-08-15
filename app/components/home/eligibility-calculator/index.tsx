"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { formatRupee } from "@/app/utils/format";

const PersonalLoanApplyModal = dynamic(
  () => import("@/app/components/leads/PersonalLoanApplyModal"),
  { ssr: false },
);

type Profession = "salaried" | "self_employed";

const LIMITS = {
  MIN_INCOME: 15_000,
  MAX_INCOME: 5_00_000,
  STEP_INCOME: 5_000,
  MIN_EMI: 0,
  MAX_EMI: 2_50_000,
  STEP_EMI: 5_000,
  FOIR_SALARIED: 0.5,
  FOIR_SELF_EMPLOYED: 0.45,
} as const;

const EMPLOYMENT_OPTIONS = [
  { value: "", label: "Select Employment Type" },
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self Employed" },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function snapToStep(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min;
  if (value >= max) return max;
  if (value <= min) return min;
  const steps = Math.round((value - min) / step);
  return clamp(min + steps * step, min, max);
}

type ChanceLevel = "low" | "fair" | "good" | "excellent";

function getChance(score: number): {
  level: ChanceLevel;
  label: string;
  color: string;
} {
  // Avoid emoji glyphs here — Node vs browser emoji rendering often causes
  // "server rendered text didn't match the client" hydration errors.
  if (score < 40) {
    return { level: "low", label: "Low Chance", color: "#E53935" };
  }
  if (score < 60) {
    return { level: "fair", label: "Fair Chance", color: "#FB8C00" };
  }
  if (score < 80) {
    return { level: "good", label: "Good Chance", color: "#43A047" };
  }
  return { level: "excellent", label: "Excellent Chance", color: "#2E7D32" };
}

/** Simple 0–100 eligibility score from income + EMI burden (no loan amount shown). */
function computeEligibility(monthlyIncome: number, employment: Profession, existingEmi: number) {
  const foir = employment === "salaried" ? LIMITS.FOIR_SALARIED : LIMITS.FOIR_SELF_EMPLOYED;
  const maxAffordableEmi = monthlyIncome * foir;
  const remaining = maxAffordableEmi - existingEmi;
  const emiBurden = monthlyIncome > 0 ? existingEmi / monthlyIncome : 1;

  // Income suitability (0–40)
  let incomePts = 0;
  if (monthlyIncome >= 75_000) incomePts = 40;
  else if (monthlyIncome >= 40_000) incomePts = 32;
  else if (monthlyIncome >= 25_000) incomePts = 24;
  else if (monthlyIncome >= 15_000) incomePts = 14;

  // EMI manageable (0–35)
  let emiPts = 0;
  if (existingEmi <= 0) emiPts = 35;
  else if (emiBurden <= 0.2) emiPts = 30;
  else if (emiBurden <= 0.35) emiPts = 22;
  else if (emiBurden <= 0.45) emiPts = 12;
  else emiPts = 4;

  // Headroom / reasonable capacity (0–25)
  let capacityPts = 0;
  if (remaining >= monthlyIncome * 0.35) capacityPts = 25;
  else if (remaining >= monthlyIncome * 0.2) capacityPts = 18;
  else if (remaining > 0) capacityPts = 10;
  else capacityPts = 0;

  // Small boost for salaried profiles
  const employmentPts = employment === "salaried" ? 0 : -3;

  const incomeOk = monthlyIncome >= 25_000;
  const emiOk = existingEmi <= 0 || existingEmi <= maxAffordableEmi;
  const capacityOk = remaining > 0;

  let score = clamp(Math.round(incomePts + emiPts + capacityPts + employmentPts), 0, 100);
  // Keep the headline chance consistent with the detailed checks below.
  if (!incomeOk) score = Math.min(score, 55);
  if (!emiOk) score = Math.min(score, 55);
  if (!capacityOk) score = Math.min(score, 35);
  const chance = getChance(score);

  const reasons = [
    {
      ok: incomeOk,
      yes: "Your income looks suitable for a personal loan",
      no: "Your income is on the lower side for most lenders",
    },
    {
      ok: emiOk,
      yes: "Your existing EMI is well within limits",
      no: "Your existing EMI takes up a big part of your income",
    },
    {
      ok: capacityOk,
      yes: "You have enough room for a new EMI",
      no: "There is limited room for a new EMI right now",
    },
  ];

  const hasWeakPoints = reasons.some((r) => !r.ok);

  let closing: string;
  if (score >= 80 && !hasWeakPoints) {
    closing = "Excellent profile! Apply with Apni Zaroorat and get your personal loan with a quick, paperless process.";
  } else if (score >= 60) {
    closing = "Good profile. Apply with Apni Zaroorat and get a personal loan that fits your needs.";
  } else if (score >= 40) {
    closing = "Your profile looks okay. Apply with Apni Zaroorat and get a personal loan matched to your needs.";
  } else {
    closing = "Every profile is different. Fill the form and Apni Zaroorat will check the best options for you.";
  }

  return { score, chance, reasons, hasWeakPoints, closing };
}

const BRAND = "Apni Zaroorat";

/** Highlights the brand name inside a sentence. */
function BrandText({ text }: { text: string }) {
  const parts = text.split(BRAND);
  return (
    <>
      {parts.map((part, i) => (
        <span key={`${part}-${i}`}>
          {part}
          {i < parts.length - 1 && (
            <span className="font-semibold text-primary">{BRAND}</span>
          )}
        </span>
      ))}
    </>
  );
}

function EligibilityMeter({ score }: { score: number }) {
  const safe = clamp(score / 100, 0, 1);
  const rotation = -90 + safe * 180;

  return (
    <div className="relative w-[200px] sm:w-[240px]" aria-hidden>
      <svg viewBox="0 0 200 118" className="h-auto w-full overflow-visible">
        {/* 5 segments: red → orange → yellow → light green → dark green */}
        <path d="M 18 100 A 82 82 0 0 1 42.8 42.8" fill="none" stroke="#E53935" strokeWidth="20" />
        <path d="M 42.8 42.8 A 82 82 0 0 1 82.5 20.2" fill="none" stroke="#FB8C00" strokeWidth="20" />
        <path d="M 82.5 20.2 A 82 82 0 0 1 117.5 20.2" fill="none" stroke="#F9A825" strokeWidth="20" />
        <path d="M 117.5 20.2 A 82 82 0 0 1 157.2 42.8" fill="none" stroke="#7CB342" strokeWidth="20" />
        <path d="M 157.2 42.8 A 82 82 0 0 1 182 100" fill="none" stroke="#2E7D32" strokeWidth="20" />
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "100px 100px",
            transformBox: "view-box",
            transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          <line x1="100" y1="100" x2="100" y2="28" stroke="#1B2A4A" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="8" fill="#1B2A4A" />
          <circle cx="100" cy="100" r="3.5" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

function ReasonIcon({ ok }: { ok: boolean }) {
  if (ok) {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#43A047]" aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFEBEE] text-[#E53935]" aria-hidden>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 2l6 6M8 2 2 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const isPlaceholder = value === "";

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#1B2A4A] dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark_border dark:bg-darkmode dark:text-white ${
            isPlaceholder ? "text-gray" : "font-medium text-[#1B2A4A] dark:text-white"
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value || "placeholder"} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-sm font-medium text-[#1B2A4A] dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(snapToStep(Number(e.target.value), min, max, step))}
            className="loan-amount-slider w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4236FB 0%, #4236FB ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] text-gray sm:text-[11px]">
            <span>{formatRupee(min)}</span>
            <span>{formatRupee(max)}</span>
          </div>
        </div>
        <div className="w-[120px] shrink-0 sm:w-[140px]">
          <input
            type="text"
            inputMode="numeric"
            value={String(value)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              onChange(clamp(Number(digits) || 0, min, max));
            }}
            onBlur={() => onChange(snapToStep(value, min, max, step))}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-2.5 text-center text-sm font-semibold text-[#1B2A4A] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark_border dark:bg-darkmode dark:text-white"
            aria-label={label}
          />
        </div>
      </div>
    </div>
  );
}

export default function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(50_000);
  const [employment, setEmployment] = useState<Profession | "">("salaried");
  const [existingEmi, setExistingEmi] = useState(0);
  const [error, setError] = useState("");
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyModalMounted, setApplyModalMounted] = useState(false);

  const result = useMemo(() => {
    const profession: Profession = employment || "salaried";
    return computeEligibility(monthlyIncome, profession, existingEmi);
  }, [monthlyIncome, employment, existingEmi]);

  const handleCheck = () => {
    if (!employment) {
      setError("Please select employment type to check eligibility.");
      return;
    }
    setError("");
    setApplyModalMounted(true);
    setApplyOpen(true);
  };

  return (
    <section
      id="eligibility-calculator"
      className="w-full min-w-0 bg-[#F7F8FC] py-10 dark:bg-darkmode sm:py-12 md:py-14"
      aria-labelledby="eligibility-heading"
    >
      <div className="container mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div
          className="overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_8px_40px_rgba(16,45,71,0.08)] dark:border-dark_border dark:bg-darklight"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — form */}
            <div className="p-5 sm:p-7 lg:p-8">
              <h2
                id="eligibility-heading"
                className="text-xl font-bold text-[#1B2A4A] dark:text-white sm:text-2xl"
              >
                Check Your Eligibility
              </h2>
              <p className="mt-1.5 text-sm text-gray">
                Check your eligibility in less than 1 minute
              </p>

              <div className="mt-6 space-y-5 sm:mt-7 sm:space-y-6">
                <SliderField
                  id="elig-income"
                  label="Monthly Income"
                  value={monthlyIncome}
                  min={LIMITS.MIN_INCOME}
                  max={LIMITS.MAX_INCOME}
                  step={LIMITS.STEP_INCOME}
                  onChange={(n) => {
                    setMonthlyIncome(n);
                    setError("");
                  }}
                />

                <SelectField
                  id="elig-employment"
                  label="Employment Type"
                  value={employment}
                  onChange={(v) => {
                    setEmployment(v as Profession | "");
                    setError("");
                  }}
                  options={EMPLOYMENT_OPTIONS}
                />

                <SliderField
                  id="elig-emi"
                  label="Existing EMI (if any)"
                  value={existingEmi}
                  min={LIMITS.MIN_EMI}
                  max={LIMITS.MAX_EMI}
                  step={LIMITS.STEP_EMI}
                  onChange={(n) => {
                    setExistingEmi(n);
                    setError("");
                  }}
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

              <button
                type="button"
                onClick={handleCheck}
                className="btn-gradient btn-shine relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(66,54,251,0.28)] sm:mt-7 sm:text-base"
              >
                Check Eligibility to Apply
                <span aria-hidden>→</span>
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray sm:text-[13px]">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <rect x="5" y="9" width="10" height="8" rx="1.5" fill="#22C55E" opacity="0.2" />
                  <rect x="5" y="9" width="10" height="8" rx="1.5" stroke="#22C55E" strokeWidth="1.3" />
                  <path
                    d="M7.5 9V7a2.5 2.5 0 0 1 5 0v2"
                    stroke="#22C55E"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                This will not impact your credit score
              </p>

              {applyModalMounted && (
                <PersonalLoanApplyModal
                  open={applyOpen}
                  onClose={() => setApplyOpen(false)}
                  initialEmploymentType={
                    employment === "salaried" || employment === "self_employed"
                      ? employment
                      : undefined
                  }
                  initialNetMonthlyIncome={
                    Number.isFinite(monthlyIncome) && monthlyIncome > 0
                      ? monthlyIncome
                      : undefined
                  }
                />
              )}
            </div>

            {/* Right — live result (updates on every slider change) */}
            <div
              id="eligibility-result"
              className="flex flex-col items-center justify-center bg-[#FAFBFD] px-5 py-8 sm:px-8 sm:py-10 dark:bg-darkmode/40"
            >
              <div className="w-full">
                <div className="mb-4 flex justify-center sm:mb-5">
                  <EligibilityMeter score={result.score} />
                </div>

                <p className="text-center text-xs font-medium uppercase tracking-wide text-gray">
                  Result
                </p>
                <p
                  className="mt-1 flex items-center justify-center gap-2 text-center text-xl font-bold transition-colors duration-300 sm:text-2xl"
                  style={{ color: result.chance.color }}
                  aria-live="polite"
                >
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: result.chance.color }}
                  />
                  {result.chance.label}
                </p>

                <p className="mt-3 text-center text-sm text-[#1B2A4A] dark:text-white sm:text-base">
                  Eligibility Score:{" "}
                  <span
                    className="font-bold transition-colors duration-300"
                    style={{ color: result.chance.color }}
                  >
                    {result.score}/100
                  </span>
                </p>

                <div className="mt-5 rounded-xl border border-[#E8ECF2] bg-white p-4 dark:border-dark_border dark:bg-darklight">
                  <p className="mb-2.5 text-sm font-semibold text-[#1B2A4A] dark:text-white">Why?</p>
                  <ul className="space-y-2.5">
                    {result.reasons.map((reason) => (
                      <li
                        key={reason.yes}
                        className="flex items-start gap-2.5 text-sm text-[#1B2A4A] dark:text-white"
                      >
                        <ReasonIcon ok={reason.ok} />
                        <span>{reason.ok ? reason.yes : reason.no}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 border-t border-dashed border-[#E8ECF2] pt-3 text-[13px] leading-snug text-[#1B2A4A] dark:border-dark_border dark:text-white">
                    <BrandText text={result.closing} />
                  </p>
                </div>

                <p className="mt-5 text-center text-[11px] leading-relaxed text-gray italic">
                  *Indicative check only. Final approval depends on lender verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
