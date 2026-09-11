/**
 * India income-tax estimate engine.
 * Add a new entry in FINANCIAL_YEARS to support future FYs without rewriting UI.
 */

export type FinancialYearId = "fy_2025_26";
export type AgeBand = "below_60" | "senior" | "super_senior";
export type RegimeChoice = "new" | "old" | "compare";
export type RegimeId = "new" | "old";

type Slab = { upTo: number; rate: number };

export type FyRules = {
  id: FinancialYearId;
  label: string;
  assessmentYear: string;
  maxIncome: number;
  /** Standard deduction for salaried / pensioners */
  stdDeductionNew: number;
  stdDeductionOld: number;
  cap80c: number;
  /** Soft UI cap for 80D (self + family + parents mix) */
  cap80d: number;
  cap24b: number;
  /** Other Chapter VI-A style deductions (old regime only) */
  capOtherDeductions: number;
  newSlabs: Slab[];
  oldBasicExemption: Record<AgeBand, number>;
  rebate87aNew: { maxTaxable: number; maxRebate: number };
  rebate87aOld: { maxTaxable: number; maxRebate: number };
  cessRate: number;
};

/** Registry — append next FY here when Budget rules change. */
export const FINANCIAL_YEARS: Record<FinancialYearId, FyRules> = {
  fy_2025_26: {
    id: "fy_2025_26",
    label: "FY 2025-26",
    assessmentYear: "AY 2026-27",
    maxIncome: 2_00_00_000,
    stdDeductionNew: 75_000,
    stdDeductionOld: 50_000,
    cap80c: 1_50_000,
    cap80d: 1_00_000,
    cap24b: 2_00_000,
    capOtherDeductions: 2_00_000,
    // Budget 2025 new-regime slabs
    newSlabs: [
      { upTo: 4_00_000, rate: 0 },
      { upTo: 8_00_000, rate: 0.05 },
      { upTo: 12_00_000, rate: 0.1 },
      { upTo: 16_00_000, rate: 0.15 },
      { upTo: 20_00_000, rate: 0.2 },
      { upTo: 24_00_000, rate: 0.25 },
      { upTo: Infinity, rate: 0.3 },
    ],
    oldBasicExemption: {
      below_60: 2_50_000,
      senior: 3_00_000,
      super_senior: 5_00_000,
    },
    rebate87aNew: { maxTaxable: 12_00_000, maxRebate: 60_000 },
    rebate87aOld: { maxTaxable: 5_00_000, maxRebate: 12_500 },
    cessRate: 0.04,
  },
};

export const DEFAULT_FY: FinancialYearId = "fy_2025_26";
export const FY_OPTIONS = Object.values(FINANCIAL_YEARS).map((fy) => ({
  id: fy.id,
  label: fy.label,
}));

/** @deprecated use FINANCIAL_YEARS[DEFAULT_FY].label */
export const FY_LABEL = FINANCIAL_YEARS[DEFAULT_FY].label;

export const AGE_OPTIONS: { id: AgeBand; label: string }[] = [
  { id: "below_60", label: "Below 60 years" },
  { id: "senior", label: "60–79 years" },
  { id: "super_senior", label: "80+ years" },
];

export type TaxInputs = {
  fyId: FinancialYearId;
  ageBand: AgeBand;
  annualSalary: number;
  otherIncome: number;
  section80c: number;
  section80d: number;
  homeLoanInterest: number;
  otherDeductions: number;
};

export type RegimeBreakdown = {
  id: RegimeId;
  label: string;
  totalIncome: number;
  standardDeduction: number;
  chapterViaDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87a: number;
  surcharge: number;
  cess: number;
  annualTax: number;
  monthlyTax: number;
};

export type TaxEstimateResult = {
  fy: FyRules;
  totalIncome: number;
  old: RegimeBreakdown;
  new: RegimeBreakdown;
  betterRegime: RegimeId | "same";
  taxSaving: number;
  /** Primary estimate based on regime choice */
  estimatedAnnualTax: number;
  estimatedMonthlyTax: number;
  activeTaxableIncome: number;
};

function clampNonNegative(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function roundRupee(n: number): number {
  return Math.max(0, Math.round(n));
}

function taxFromSlabs(income: number, slabs: Slab[]): number {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const slice = Math.min(income, slab.upTo) - prev;
    if (slice > 0) tax += slice * slab.rate;
    prev = slab.upTo;
  }
  return tax;
}

function oldSlabs(fy: FyRules, age: AgeBand): Slab[] {
  const nil = fy.oldBasicExemption[age];
  return [
    { upTo: nil, rate: 0 },
    { upTo: 5_00_000, rate: 0.05 },
    { upTo: 10_00_000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ];
}

function surchargeOn(taxAfterRebate: number, taxableIncome: number): number {
  if (taxableIncome <= 50_00_000) return 0;
  if (taxableIncome <= 1_00_00_000) return taxAfterRebate * 0.1;
  if (taxableIncome <= 2_00_00_000) return taxAfterRebate * 0.15;
  if (taxableIncome <= 5_00_00_000) return taxAfterRebate * 0.25;
  return taxAfterRebate * 0.37;
}

function finalize(
  id: RegimeId,
  label: string,
  totalIncome: number,
  standardDeduction: number,
  chapterViaDeductions: number,
  taxableIncome: number,
  taxBeforeRebate: number,
  rebate87a: number,
  cessRate: number,
): RegimeBreakdown {
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87a);
  const surcharge = surchargeOn(taxAfterRebate, taxableIncome);
  const cess = (taxAfterRebate + surcharge) * cessRate;
  const annualTax = roundRupee(taxAfterRebate + surcharge + cess);

  return {
    id,
    label,
    totalIncome: roundRupee(totalIncome),
    standardDeduction: roundRupee(standardDeduction),
    chapterViaDeductions: roundRupee(chapterViaDeductions),
    taxableIncome: roundRupee(taxableIncome),
    taxBeforeRebate: roundRupee(taxBeforeRebate),
    rebate87a: roundRupee(rebate87a),
    surcharge: roundRupee(surcharge),
    cess: roundRupee(cess),
    annualTax,
    monthlyTax: roundRupee(annualTax / 12),
  };
}

function computeNew(fy: FyRules, totalIncome: number, hasSalary: boolean): RegimeBreakdown {
  const std = hasSalary ? fy.stdDeductionNew : 0;
  const taxable = Math.max(0, totalIncome - std);
  let tax = taxFromSlabs(taxable, fy.newSlabs);

  let rebate = 0;
  if (taxable <= fy.rebate87aNew.maxTaxable) {
    rebate = Math.min(tax, fy.rebate87aNew.maxRebate);
  } else {
    const cap = taxable - fy.rebate87aNew.maxTaxable;
    if (tax > cap) tax = cap;
  }

  return finalize(
    "new",
    "New Tax Regime",
    totalIncome,
    std,
    0,
    taxable,
    tax,
    rebate,
    fy.cessRate,
  );
}

function computeOld(fy: FyRules, inputs: TaxInputs, totalIncome: number): RegimeBreakdown {
  const hasSalary = inputs.annualSalary > 0;
  const std = hasSalary ? fy.stdDeductionOld : 0;
  const c80c = Math.min(clampNonNegative(inputs.section80c), fy.cap80c);
  const c80d = Math.min(clampNonNegative(inputs.section80d), fy.cap80d);
  const home = Math.min(clampNonNegative(inputs.homeLoanInterest), fy.cap24b);
  const other = Math.min(clampNonNegative(inputs.otherDeductions), fy.capOtherDeductions);
  const chapter = c80c + c80d + home + other;

  const taxable = Math.max(0, totalIncome - std - chapter);
  const tax = taxFromSlabs(taxable, oldSlabs(fy, inputs.ageBand));
  const rebate =
    taxable <= fy.rebate87aOld.maxTaxable
      ? Math.min(tax, fy.rebate87aOld.maxRebate)
      : 0;

  return finalize(
    "old",
    "Old Tax Regime",
    totalIncome,
    std,
    chapter,
    taxable,
    tax,
    rebate,
    fy.cessRate,
  );
}

export function getFyRules(fyId: FinancialYearId = DEFAULT_FY): FyRules {
  return FINANCIAL_YEARS[fyId] ?? FINANCIAL_YEARS[DEFAULT_FY];
}

export function standardDeductionFor(
  fyId: FinancialYearId,
  regime: RegimeChoice,
  hasSalary: boolean,
): number {
  if (!hasSalary) return 0;
  const fy = getFyRules(fyId);
  if (regime === "old") return fy.stdDeductionOld;
  if (regime === "new") return fy.stdDeductionNew;
  // Compare: show new-regime std as primary hint (both applied separately in calc)
  return fy.stdDeductionNew;
}

export function estimateTax(
  raw: Partial<TaxInputs> & { regimeChoice?: RegimeChoice },
): TaxEstimateResult {
  const fyId = raw.fyId ?? DEFAULT_FY;
  const fy = getFyRules(fyId);
  const regimeChoice: RegimeChoice = raw.regimeChoice ?? "compare";

  const inputs: TaxInputs = {
    fyId,
    ageBand: raw.ageBand ?? "below_60",
    annualSalary: Math.min(clampNonNegative(raw.annualSalary ?? 0), fy.maxIncome),
    otherIncome: Math.min(clampNonNegative(raw.otherIncome ?? 0), fy.maxIncome),
    section80c: clampNonNegative(raw.section80c ?? 0),
    section80d: clampNonNegative(raw.section80d ?? 0),
    homeLoanInterest: clampNonNegative(raw.homeLoanInterest ?? 0),
    otherDeductions: clampNonNegative(raw.otherDeductions ?? 0),
  };

  const totalIncome = Math.min(
    inputs.annualSalary + inputs.otherIncome,
    fy.maxIncome,
  );
  const hasSalary = inputs.annualSalary > 0;

  const neu = computeNew(fy, totalIncome, hasSalary);
  const old = computeOld(fy, inputs, totalIncome);

  const diff = Math.abs(neu.annualTax - old.annualTax);
  let betterRegime: RegimeId | "same" = "same";
  if (diff >= 50) {
    betterRegime = neu.annualTax < old.annualTax ? "new" : "old";
  }

  const taxSaving = betterRegime === "same" ? 0 : diff;

  let estimatedAnnualTax: number;
  let estimatedMonthlyTax: number;
  let activeTaxableIncome: number;

  if (regimeChoice === "new") {
    estimatedAnnualTax = neu.annualTax;
    estimatedMonthlyTax = neu.monthlyTax;
    activeTaxableIncome = neu.taxableIncome;
  } else if (regimeChoice === "old") {
    estimatedAnnualTax = old.annualTax;
    estimatedMonthlyTax = old.monthlyTax;
    activeTaxableIncome = old.taxableIncome;
  } else {
    const best = betterRegime === "old" ? old : neu;
    estimatedAnnualTax = best.annualTax;
    estimatedMonthlyTax = best.monthlyTax;
    activeTaxableIncome = best.taxableIncome;
  }

  return {
    fy,
    totalIncome: roundRupee(totalIncome),
    old,
    new: neu,
    betterRegime,
    taxSaving,
    estimatedAnnualTax,
    estimatedMonthlyTax,
    activeTaxableIncome,
  };
}

/** Back-compat aliases used by older imports */
export const CAP_80C = FINANCIAL_YEARS.fy_2025_26.cap80c;
export const CAP_24B = FINANCIAL_YEARS.fy_2025_26.cap24b;
export const MAX_80D = FINANCIAL_YEARS.fy_2025_26.cap80d;
export const MAX_INCOME = FINANCIAL_YEARS.fy_2025_26.maxIncome;
export const CAP_80CCD1B = 50_000;

export function compareTaxRegimes(raw: {
  grossIncome?: number;
  ageBand?: AgeBand;
  isSalaried?: boolean;
  section80c?: number;
  section80d?: number;
  section80ccd1b?: number;
  homeLoanInterest?: number;
}) {
  const otherFromNps = clampNonNegative(raw.section80ccd1b ?? 0);
  const r = estimateTax({
    annualSalary: raw.grossIncome ?? 0,
    ageBand: raw.ageBand,
    section80c: raw.section80c,
    section80d: raw.section80d,
    homeLoanInterest: raw.homeLoanInterest,
    otherDeductions: otherFromNps,
    otherIncome: 0,
    regimeChoice: "compare",
  });
  return {
    new: {
      ...r.new,
      totalTax: r.new.annualTax,
      effectiveRate:
        r.totalIncome > 0
          ? Math.round((r.new.annualTax / r.totalIncome) * 1000) / 10
          : 0,
    },
    old: {
      ...r.old,
      totalTax: r.old.annualTax,
      effectiveRate:
        r.totalIncome > 0
          ? Math.round((r.old.annualTax / r.totalIncome) * 1000) / 10
          : 0,
    },
    recommended: r.betterRegime,
    savingsIfRecommended: r.taxSaving,
    taxSavedByDeductionsInOld: 0,
  };
}
