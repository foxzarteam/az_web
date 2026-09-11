"use client";

import { useMemo, useRef, useState } from "react";
import { PUBLIC_API_BASE_URL } from "@/app/config/constants";
import { formatRupee } from "@/app/utils/format";
import {
  AGE_OPTIONS,
  DEFAULT_FY,
  estimateTax,
  FY_OPTIONS,
  getFyRules,
  standardDeductionFor,
  type AgeBand,
  type FinancialYearId,
  type RegimeChoice,
} from "../lib/taxCalc";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#4236FB] focus:ring-2 focus:ring-[#4236FB]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 dark:border-dark_border dark:bg-darkmode dark:text-white dark:disabled:bg-white/5";

function parseAmount(raw: string): number {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function Field({
  id,
  label,
  children,
  className = "",
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-600 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function MoneyInput({
  id,
  label,
  value,
  onChange,
  max,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  disabled?: boolean;
}) {
  return (
    <Field id={id} label={label}>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4236FB]">
          ₹
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "");
            if (!digits) {
              onChange("");
              return;
            }
            onChange(String(Math.min(Number(digits), max)));
          }}
          className={`${inputCls} pl-6`}
          placeholder="0"
        />
      </div>
    </Field>
  );
}

export default function TaxSavingCalculator() {
  const [fyId, setFyId] = useState<FinancialYearId>(DEFAULT_FY);
  const [ageBand, setAgeBand] = useState<AgeBand>("below_60");
  const [salary, setSalary] = useState("1200000");
  const [otherIncome, setOtherIncome] = useState("0");
  const [sec80c, setSec80c] = useState("150000");
  const [sec80d, setSec80d] = useState("25000");
  const [homeLoan, setHomeLoan] = useState("0");
  const [otherDed, setOtherDed] = useState("0");
  const [regimeChoice, setRegimeChoice] = useState<RegimeChoice>("compare");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  /** Session-level: same phone not posted again from this browser tab. */
  const sentPhonesRef = useRef<Set<string>>(new Set());

  const fy = getFyRules(fyId);
  const deductionsEnabled = regimeChoice !== "new";
  const appliedStd = standardDeductionFor(fyId, regimeChoice, parseAmount(salary) > 0);

  const result = useMemo(
    () =>
      estimateTax({
        fyId,
        ageBand,
        annualSalary: parseAmount(salary),
        otherIncome: parseAmount(otherIncome),
        section80c: parseAmount(sec80c),
        section80d: parseAmount(sec80d),
        homeLoanInterest: parseAmount(homeLoan),
        otherDeductions: parseAmount(otherDed),
        regimeChoice,
      }),
    [fyId, ageBand, salary, otherIncome, sec80c, sec80d, homeLoan, otherDed, regimeChoice],
  );

  const betterLabel =
    result.betterRegime === "same"
      ? "Both similar"
      : result.betterRegime === "new"
        ? "New looks better"
        : "Old looks better";

  /** Silent lead capture — no success/error toast (user must not notice data save). */
  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim().slice(0, 80);
    const mobile = phone.replace(/\D/g, "").slice(0, 10);
    if (trimmedName.length < 2 || !/^[6-9]\d{9}$/.test(mobile)) {
      return;
    }
    if (submitting || sentPhonesRef.current.has(mobile)) {
      return;
    }

    setSubmitting(true);
    sentPhonesRef.current.add(mobile);
    try {
      await fetch(`${PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api/contact/tax-calculator-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: trimmedName, phone: mobile }),
        keepalive: true,
      });
    } catch {
      // Allow one silent retry later if network failed before server saw it
      sentPhonesRef.current.delete(mobile);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#F3F5FB] py-8 dark:bg-darkmode sm:py-10">
      <div className="container relative z-[1] mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#4236FB]/20 bg-white px-3 py-1 text-[11px] font-semibold text-[#4236FB] dark:bg-darklight">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {fy.label} · Live estimate
          </span>
          <p className="text-xs text-slate-500">Not a guaranteed tax liability</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5 lg:items-stretch">
          {/* LEFT 50% — compact form */}
          <form
            onSubmit={(e) => void handleLeadSubmit(e)}
            noValidate
            className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-dark_border dark:bg-darklight sm:p-5"
          >
            <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-white">Your details</h2>

            <div className="grid flex-1 grid-cols-2 content-start gap-3">
              <Field id="tax-full-name" label="Full name">
                <input
                  id="tax-full-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="Full name"
                  className={inputCls}
                />
              </Field>

              <Field id="tax-phone" label="Phone">
                <div className="relative">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">
                    +91
                  </span>
                  <input
                    id="tax-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    }}
                    placeholder="Mobile"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </Field>

              <Field id="fy" label="Financial Year">
                <select
                  id="fy"
                  value={fyId}
                  onChange={(e) => setFyId(e.target.value as FinancialYearId)}
                  className={inputCls}
                >
                  {FY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="age" label="Age Group">
                <select
                  id="age"
                  value={ageBand}
                  onChange={(e) => setAgeBand(e.target.value as AgeBand)}
                  className={inputCls}
                >
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tax Regime" className="col-span-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: "new" as const, label: "New" },
                      { id: "old" as const, label: "Old" },
                      { id: "compare" as const, label: "Compare" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRegimeChoice(opt.id)}
                      className={`rounded-xl border px-2 py-2 text-xs font-bold transition ${
                        regimeChoice === opt.id
                          ? "border-[#4236FB] bg-[#EEF0FF] text-[#4236FB]"
                          : "border-slate-200 text-slate-600 dark:border-dark_border dark:text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              <MoneyInput
                id="salary"
                label="Annual Salary / Gross"
                value={salary}
                onChange={setSalary}
                max={fy.maxIncome}
              />

              <MoneyInput
                id="other-income"
                label="Other Income"
                value={otherIncome}
                onChange={setOtherIncome}
                max={fy.maxIncome}
              />

              <Field label="Standard Deduction" className="col-span-2">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-dark_border dark:bg-darkmode">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatRupee(appliedStd)}
                  </span>
                  <span className="text-[11px] text-slate-500">Auto · {fy.label}</span>
                </div>
              </Field>

              <MoneyInput
                id="80c"
                label="Section 80C"
                value={sec80c}
                onChange={setSec80c}
                max={fy.cap80c}
                disabled={!deductionsEnabled}
              />
              <MoneyInput
                id="80d"
                label="Section 80D"
                value={sec80d}
                onChange={setSec80d}
                max={fy.cap80d}
                disabled={!deductionsEnabled}
              />
              <MoneyInput
                id="home"
                label="Home Loan 24(b)"
                value={homeLoan}
                onChange={setHomeLoan}
                max={fy.cap24b}
                disabled={!deductionsEnabled}
              />
              <MoneyInput
                id="other-ded"
                label="Other Deductions"
                value={otherDed}
                onChange={setOtherDed}
                max={fy.capOtherDeductions}
                disabled={!deductionsEnabled}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient mt-auto w-full min-h-11 rounded-xl text-sm font-bold text-white disabled:opacity-60"
            >
              Check Now
            </button>
          </form>

          {/* RIGHT 50% — same height as form, content stretched */}
          <div className="flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-dark_border dark:bg-darklight sm:p-5">
            <div className="flex flex-[1.15] flex-col justify-center rounded-2xl bg-gradient-to-br from-[#4236FB] via-[#5A4CFC] to-[#FF7E29] p-5 text-white sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/75">
                {betterLabel}
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                {formatRupee(result.taxSaving)}
              </p>
              <p className="mt-1 text-sm text-white/85">Estimated tax saving</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/15 px-3 py-3 sm:px-4 sm:py-4">
                  <p className="text-[10px] uppercase text-white/70">Annual tax</p>
                  <p className="mt-1 text-lg font-bold sm:text-xl">
                    {formatRupee(result.estimatedAnnualTax)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/15 px-3 py-3 sm:px-4 sm:py-4">
                  <p className="text-[10px] uppercase text-white/70">Monthly</p>
                  <p className="mt-1 text-lg font-bold sm:text-xl">
                    {formatRupee(result.estimatedMonthlyTax)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5 sm:p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Comparison · estimate only
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-white px-2.5 py-4 text-center shadow-sm dark:bg-darkmode sm:py-5">
                  <p className="text-[10px] font-semibold text-slate-500">Old Regime</p>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    {formatRupee(result.old.annualTax)}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-2.5 py-4 text-center shadow-sm dark:bg-darkmode sm:py-5">
                  <p className="text-[10px] font-semibold text-slate-500">New Regime</p>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    {formatRupee(result.new.annualTax)}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-2.5 py-4 text-center dark:bg-emerald-500/10 sm:py-5">
                  <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    You Save
                  </p>
                  <p className="mt-2 text-base font-bold text-emerald-700 dark:text-emerald-300 sm:text-lg">
                    {formatRupee(result.taxSaving)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5 sm:p-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex justify-between gap-2 border-b border-slate-200/80 py-2 dark:border-white/10">
                  <span className="text-slate-500">Total Income</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatRupee(result.totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200/80 py-2 dark:border-white/10">
                  <span className="text-slate-500">Taxable</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatRupee(result.activeTaxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200/80 py-2 dark:border-white/10">
                  <span className="text-slate-500">Old tax</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatRupee(result.old.annualTax)}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-b border-slate-200/80 py-2 dark:border-white/10">
                  <span className="text-slate-500">New tax</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatRupee(result.new.annualTax)}
                  </span>
                </div>
                <div className="flex justify-between gap-2 py-2">
                  <span className="text-slate-500">Better</span>
                  <span className="font-bold text-[#4236FB]">
                    {result.betterRegime === "same"
                      ? "Similar"
                      : result.betterRegime === "new"
                        ? "New"
                        : "Old"}
                  </span>
                </div>
                <div className="flex justify-between gap-2 py-2">
                  <span className="text-slate-500">Saving</span>
                  <span className="font-bold text-emerald-600">{formatRupee(result.taxSaving)}</span>
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-slate-400">
                Estimates for {fy.label} ({fy.assessmentYear}) with Budget rules, 87A rebate & 4%
                cess. Confirm with a CA before filing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
