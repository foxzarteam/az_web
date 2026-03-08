"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

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

export default function Calculator() {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);

  const { emi, totalInterest, totalAmount } = useMemo(
    () => calculateEMI(principal, annualRate, tenureYears),
    [principal, annualRate, tenureYears]
  );

  function formatRupee(n: number) {
    const str = Math.round(n).toString();
    if (str.length <= 3) return "₹" + str;
    let result = str.slice(-3);
    let i = str.length - 3;
    while (i > 0) {
      result = str.slice(Math.max(0, i - 2), i) + "," + result;
      i -= 2;
    }
    return "₹" + result;
  }

  const total = totalAmount || 1;
  const principalShare = totalAmount ? principal / total : 1;
  const interestShare = totalAmount ? totalInterest / total : 0;
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const principalDash = principalShare * circumference;
  const interestDash = interestShare * circumference;

  return (
    <section className="dark:bg-darkmode">
      <div className="container px-4 lg:max-w-screen-xl md:max-w-screen-md mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 justify-between items-stretch max-w-full" data-aos="fade-left">
        <div className="w-full max-w-full lg:max-w-md lg:w-[26rem] flex flex-col gap-8 flex-shrink-0" data-aos="fade-right">
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 font-bold text-midnight_text dark:text-white">
              Plan Your Loan
            </h2>
            <p className="text-base sm:text-lg text-gray">
              Check your EMI and choose the right loan amount. Compare interest rates and tenure to make an informed decision.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
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
                  stroke="#2F73F2"
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

        <div className="w-full lg:flex-1 lg:min-w-0 lg:max-w-xl" data-aos="fade-left">
          <div className="bg-white dark:bg-darklight rounded-2xl shadow-lg border border-border dark:border-dark_border overflow-hidden">
            <div className="bg-primary px-6 py-4">
              <h3 className="text-xl font-bold text-white">EMI Calculator</h3>
              <p className="text-white/80 text-sm">Calculate EMI on Home, Personal & Business Loans</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1">
                  Loan amount (₹)
                </label>
                <input
                  type="number"
                  min={10000}
                  max={10000000}
                  step={10000}
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(10000, Number(e.target.value) || 0))}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="flex justify-between text-xs text-gray mt-1">
                  <span>₹10,000</span>
                  <span>₹1 Cr</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={10000000}
                  step={10000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1">
                  Rate of interest (p.a.) %
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  step={0.1}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Math.max(1, Math.min(30, Number(e.target.value) || 0)))}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.1}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1">
                  Loan tenure (years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Math.max(1, Math.min(30, Number(e.target.value) || 0)))}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-dark_border bg-white dark:bg-darkmode text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </div>
            </div>

            <div className="border-t border-border dark:border-dark_border bg-gray-50 dark:bg-darkmode/50 px-6 py-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-gray uppercase tracking-wide">Monthly EMI</p>
                  <p className="text-lg font-bold text-primary">{formatRupee(emi)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray uppercase tracking-wide">Principal amount</p>
                  <p className="text-lg font-bold text-midnight_text dark:text-white">{formatRupee(principal)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray uppercase tracking-wide">Total interest</p>
                  <p className="text-lg font-bold text-midnight_text dark:text-white">{formatRupee(totalInterest)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray uppercase tracking-wide">Total amount</p>
                  <p className="text-lg font-bold text-midnight_text dark:text-white">{formatRupee(totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-primary text-white rounded-b-2xl">
              <p className="text-sm opacity-90">Need help choosing?</p>
              <Link href="tel:+919098870980" className="font-semibold hover:underline">
                Call us: +91 90988 70980
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
