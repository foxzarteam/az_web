"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { PERSONAL_LOAN_EMI_LIMITS, COLORS } from "@/app/config/constants";
import { formatRupee } from "@/app/utils/format";

const PersonalLoanApplyModal = dynamic(
  () => import("@/app/components/leads/PersonalLoanApplyModal"),
  { ssr: false },
);

/** Monthly reducing-balance EMI — same method lenders use for personal loans. */
function calculateEMI(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) {
    const emi = Math.ceil(principal / months);
    const totalAmount = emi * months;
    return { emi, totalInterest: Math.max(0, totalAmount - principal), totalAmount };
  }
  const emiRaw =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const emi = Math.round(emiRaw);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;
  return { emi, totalInterest, totalAmount };
}

function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Snap to step; always allow exact min/max so sliders can hit ₹10L / max rate. */
function snapToStep(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min;
  if (value >= max) return max;
  if (value <= min) return min;
  const steps = Math.round((value - min) / step);
  const snapped = min + steps * step;
  // Avoid float noise (e.g. 14.100000000000001) for 0.1 rate steps
  const decimals = String(step).includes(".") ? String(step).split(".")[1].length : 0;
  return clampValue(Number(snapped.toFixed(decimals)), min, max);
}

export default function Calculator() {
  const [principal, setPrincipal] = useState(500_000);
  const [annualRate, setAnnualRate] = useState(12);
  const [tenureYears, setTenureYears] = useState(4);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyModalMounted, setApplyModalMounted] = useState(false);

  const { emi, totalInterest, totalAmount } = useMemo(
    () => calculateEMI(principal, annualRate, tenureYears),
    [principal, annualRate, tenureYears]
  );

  const total = totalAmount || 1;
  const principalShare = totalAmount ? principal / total : 1;
  const interestShare = totalAmount ? totalInterest / total : 0;
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const principalDash = principalShare * circumference;
  const interestDash = interestShare * circumference;

  return (
    <section
      id="emi-calculator"
      className="w-full min-w-0 bg-white py-10 dark:bg-semidark sm:py-12 md:py-14"
      aria-labelledby="emi-calculator-heading"
    >
      <div
        className="container mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md"
        data-aos="fade-left"
      >
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        <div
          className="flex min-w-0 w-full flex-col items-start justify-center gap-4 text-left lg:py-2"
          data-aos="fade-right"
        >
          <div className="w-full min-w-0">
            <h2
              id="emi-calculator-heading"
              className="mb-3 text-lg font-bold text-midnight_text dark:text-white sm:mb-4 sm:text-xl md:text-2xl lg:text-3xl"
            >
              Personal Loan EMI Calculator
            </h2>
            <p className="text-sm leading-relaxed text-gray sm:text-base md:text-lg">
              Estimate your personal loan EMI on a reducing balance basis. Adjust amount, interest rate, and tenure to see
              monthly EMI, total interest, and repayment amount before you apply.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-5 sm:gap-6">
            <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="principalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={COLORS.GRADIENT_START} />
                    <stop offset="100%" stopColor={COLORS.GRADIENT_END} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={r} fill="none" stroke="#EDE5FF" strokeWidth="22" className="dark:opacity-80" />
                <circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="url(#principalGradient)"
                  strokeWidth="22"
                  strokeDasharray={`${principalDash} ${circumference}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="#D4BCFA"
                  strokeWidth="22"
                  strokeDasharray={`${interestDash} ${circumference}`}
                  strokeDashoffset={-principalDash}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out dark:opacity-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-gray uppercase tracking-wide">Principal</span>
                <span className="text-lg sm:text-xl font-bold text-midnight_text dark:text-white">
                  {totalAmount ? Math.round((principalShare * 100)) : 100}%
                </span>
                <span className="text-xs text-gray mt-0.5">Interest {totalAmount ? Math.round((interestShare * 100)) : 0}%</span>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 text-left sm:gap-4 md:grid-cols-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-gray sm:text-xs">Monthly EMI</p>
                <p className="truncate text-sm font-bold text-primary sm:text-base md:text-lg">{formatRupee(emi)}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-gray sm:text-xs">Principal amount</p>
                <p className="truncate text-sm font-bold text-midnight_text dark:text-white sm:text-base md:text-lg">
                  {formatRupee(principal)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-gray sm:text-xs">Total interest</p>
                <p className="truncate text-sm font-bold text-midnight_text dark:text-white sm:text-base md:text-lg">
                  {formatRupee(totalInterest)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-gray sm:text-xs">Total amount</p>
                <p className="truncate text-sm font-bold text-midnight_text dark:text-white sm:text-base md:text-lg">
                  {formatRupee(totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex min-w-0 w-full flex-col items-start justify-center lg:py-2"
          data-aos="fade-left"
        >
          <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:border-dark_border dark:bg-darklight">
            <div className="theme-gradient-bg px-6 py-4 text-center">
              <p className="text-xl font-bold text-white">Personal Loan EMI Calculator</p>
              <p className="mt-1 text-sm text-white/80">Calculate EMI for your Personal Loan</p>
            </div>

            <div className="space-y-6 p-6 text-left">
              <div>
                <label htmlFor="calc-pl-principal" className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Personal loan amount (₹)
                </label>
                <input
                  id="calc-pl-principal"
                  type="number"
                  min={PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT}
                  max={PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT}
                  step={PERSONAL_LOAN_EMI_LIMITS.STEP_AMOUNT}
                  value={principal}
                  onChange={(e) =>
                    setPrincipal(
                      clampValue(
                        Number(e.target.value) || 0,
                        PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT
                      )
                    )
                  }
                  onBlur={() =>
                    setPrincipal(
                      snapToStep(
                        principal,
                        PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
                        PERSONAL_LOAN_EMI_LIMITS.STEP_AMOUNT
                      )
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="flex justify-between text-xs text-gray mt-1">
                  <span>{formatRupee(PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT)}</span>
                  <span>{formatRupee(PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT)}</span>
                </div>
                <input
                  type="range"
                  min={PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT}
                  max={PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT}
                  step={PERSONAL_LOAN_EMI_LIMITS.STEP_AMOUNT}
                  value={principal}
                  aria-label="Personal loan amount slider"
                  aria-valuetext={formatRupee(principal)}
                  onChange={(e) =>
                    setPrincipal(
                      snapToStep(
                        Number(e.target.value),
                        PERSONAL_LOAN_EMI_LIMITS.MIN_AMOUNT,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_AMOUNT,
                        PERSONAL_LOAN_EMI_LIMITS.STEP_AMOUNT
                      )
                    )
                  }
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              <div>
                <label htmlFor="calc-pl-rate" className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Interest rate (p.a. %) — personal loan range
                </label>
                <input
                  id="calc-pl-rate"
                  type="number"
                  min={PERSONAL_LOAN_EMI_LIMITS.MIN_RATE}
                  max={PERSONAL_LOAN_EMI_LIMITS.MAX_RATE}
                  step={PERSONAL_LOAN_EMI_LIMITS.STEP_RATE}
                  value={annualRate}
                  onChange={(e) =>
                    setAnnualRate(
                      clampValue(
                        Number(e.target.value) || 0,
                        PERSONAL_LOAN_EMI_LIMITS.MIN_RATE,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_RATE
                      )
                    )
                  }
                  onBlur={() =>
                    setAnnualRate(
                      snapToStep(
                        annualRate,
                        PERSONAL_LOAN_EMI_LIMITS.MIN_RATE,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_RATE,
                        PERSONAL_LOAN_EMI_LIMITS.STEP_RATE
                      )
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="range"
                  min={PERSONAL_LOAN_EMI_LIMITS.MIN_RATE}
                  max={PERSONAL_LOAN_EMI_LIMITS.MAX_RATE}
                  step={PERSONAL_LOAN_EMI_LIMITS.STEP_RATE}
                  value={annualRate}
                  aria-label="Interest rate slider"
                  aria-valuetext={`${annualRate}% per annum`}
                  onChange={(e) =>
                    setAnnualRate(
                      snapToStep(
                        Number(e.target.value),
                        PERSONAL_LOAN_EMI_LIMITS.MIN_RATE,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_RATE,
                        PERSONAL_LOAN_EMI_LIMITS.STEP_RATE
                      )
                    )
                  }
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              <div>
                <label htmlFor="calc-pl-tenure" className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Tenure (years) — typical personal loan up to 7 years
                </label>
                <input
                  id="calc-pl-tenure"
                  type="number"
                  min={PERSONAL_LOAN_EMI_LIMITS.MIN_TENURE}
                  max={PERSONAL_LOAN_EMI_LIMITS.MAX_TENURE}
                  step={1}
                  value={tenureYears}
                  onChange={(e) =>
                    setTenureYears(
                      clampValue(
                        Number(e.target.value) || 0,
                        PERSONAL_LOAN_EMI_LIMITS.MIN_TENURE,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_TENURE
                      )
                    )
                  }
                  onBlur={() =>
                    setTenureYears(
                      snapToStep(
                        tenureYears,
                        PERSONAL_LOAN_EMI_LIMITS.MIN_TENURE,
                        PERSONAL_LOAN_EMI_LIMITS.MAX_TENURE,
                        1
                      )
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="range"
                  min={PERSONAL_LOAN_EMI_LIMITS.MIN_TENURE}
                  max={PERSONAL_LOAN_EMI_LIMITS.MAX_TENURE}
                  step={1}
                  value={tenureYears}
                  aria-label="Loan tenure slider"
                  aria-valuetext={`${tenureYears} years`}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>
            </div>

            <div className="border-t border-border bg-gray-50 px-4 py-4 sm:px-5 sm:py-5 md:px-6 dark:border-dark_border dark:bg-darkmode/50">
              <button
                type="button"
                onClick={() => {
                  setApplyModalMounted(true);
                  setApplyOpen(true);
                }}
                className="btn-gradient btn-shine relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(66,54,251,0.3)] transition duration-300 sm:py-3.5 sm:text-base"
              >
                Start Your Application
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-gray italic">
                *Indicative EMI only. Actual rate, tenure, and EMI depend on the lender and your profile.
              </p>
              {applyModalMounted && (
                <PersonalLoanApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
