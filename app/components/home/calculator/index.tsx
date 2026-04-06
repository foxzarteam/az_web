"use client";

import { useState, useMemo } from "react";
import { LOAN_LIMITS, COLORS } from "@/app/config/constants";
import { formatRupee } from "@/app/utils/format";

function calculateEMI(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) return { emi: principal / months, totalInterest: 0, totalAmount: principal };
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;
  return { emi, totalInterest, totalAmount };
}

function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function Calculator() {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);

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
    <section className="dark:bg-darkmode">
      <div
        className="container mx-auto grid max-w-full grid-cols-1 gap-6 px-4 sm:px-6 sm:gap-8 md:max-w-screen-md lg:max-w-screen-xl lg:grid-cols-2 lg:gap-10 lg:px-8"
        data-aos="fade-left"
      >
        <div
          className="flex min-w-0 flex-col items-center justify-center gap-4 text-center lg:py-2"
          data-aos="fade-right"
        >
          <div className="w-full max-w-md lg:max-w-lg">
            <h2 className="mb-3 text-lg font-bold text-midnight_text dark:text-white sm:mb-4 sm:text-xl md:text-2xl lg:text-3xl">
              Plan Your Loan
            </h2>
            <p className="text-sm leading-relaxed text-gray sm:text-base md:text-lg">
              Check your EMI and choose the right loan amount. Compare interest rates and tenure to make an informed decision.
            </p>
          </div>
          <div className="flex w-full justify-center">
            <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="principalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={COLORS.GRADIENT_START} />
                    <stop offset="100%" stopColor={COLORS.GRADIENT_END} />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="#E8EEFC"
                  strokeWidth="22"
                  className="dark:opacity-80"
                />
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
                  stroke="#B8D4F1"
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
          </div>
        </div>

        <div
          className="flex min-w-0 w-full flex-col items-center justify-center lg:py-2"
          data-aos="fade-left"
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-white shadow-lg dark:border-dark_border dark:bg-darklight">
            <div className="bg-primary px-6 py-4 text-center">
              <h3 className="text-xl font-bold text-white">EMI Calculator</h3>
              <p className="mt-1 text-sm text-white/80">Calculate EMI on Home, Personal & Business Loans</p>
            </div>

            <div className="space-y-6 p-6 text-center">
              <div>
                <label className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Loan amount (₹)
                </label>
                <input
                  type="number"
                  min={LOAN_LIMITS.MIN_AMOUNT}
                  max={LOAN_LIMITS.MAX_AMOUNT}
                  step={LOAN_LIMITS.STEP_AMOUNT}
                  value={principal}
                  onChange={(e) => setPrincipal(clampValue(Number(e.target.value) || 0, LOAN_LIMITS.MIN_AMOUNT, LOAN_LIMITS.MAX_AMOUNT))}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="flex justify-between text-xs text-gray mt-1">
                  <span>{formatRupee(LOAN_LIMITS.MIN_AMOUNT)}</span>
                  <span>{formatRupee(LOAN_LIMITS.MAX_AMOUNT)}</span>
                </div>
                <input
                  type="range"
                  min={LOAN_LIMITS.MIN_AMOUNT}
                  max={LOAN_LIMITS.MAX_AMOUNT}
                  step={LOAN_LIMITS.STEP_AMOUNT}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Rate of interest (p.a.) %
                </label>
                <input
                  type="number"
                  min={LOAN_LIMITS.MIN_RATE}
                  max={LOAN_LIMITS.MAX_RATE}
                  step={LOAN_LIMITS.STEP_RATE}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(clampValue(Number(e.target.value) || 0, LOAN_LIMITS.MIN_RATE, LOAN_LIMITS.MAX_RATE))}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="range"
                  min={LOAN_LIMITS.MIN_RATE}
                  max={LOAN_LIMITS.MAX_RATE}
                  step={LOAN_LIMITS.STEP_RATE}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-midnight_text dark:text-gray-300">
                  Loan tenure (years)
                </label>
                <input
                  type="number"
                  min={LOAN_LIMITS.MIN_TENURE}
                  max={LOAN_LIMITS.MAX_TENURE}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(clampValue(Number(e.target.value) || 0, LOAN_LIMITS.MIN_TENURE, LOAN_LIMITS.MAX_TENURE))}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="range"
                  min={LOAN_LIMITS.MIN_TENURE}
                  max={LOAN_LIMITS.MAX_TENURE}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>
            </div>

            <div className="border-t border-border bg-gray-50 px-4 py-4 sm:px-5 sm:py-5 md:px-6 dark:border-dark_border dark:bg-darkmode/50">
              <div className="grid grid-cols-2 gap-3 text-center sm:gap-4 md:grid-cols-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-gray sm:text-xs">Monthly EMI</p>
                  <p className="truncate text-sm font-bold text-primary sm:text-base md:text-lg">{formatRupee(emi)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-gray sm:text-xs">Principal amount</p>
                  <p className="truncate text-sm font-bold text-midnight_text dark:text-white sm:text-base md:text-lg">
                    {formatRupee(principal)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-gray sm:text-xs">Total interest</p>
                  <p className="truncate text-sm font-bold text-midnight_text dark:text-white sm:text-base md:text-lg">
                    {formatRupee(totalInterest)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-gray sm:text-xs">Total amount</p>
                  <p className="truncate text-sm font-bold text-midnight_text dark:text-white sm:text-base md:text-lg">
                    {formatRupee(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
