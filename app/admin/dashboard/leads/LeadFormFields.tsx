"use client";

import { useMemo } from "react";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import LoanTenureSlider from "@/app/components/services/LoanTenureSlider";
import EmploymentIncomeFields from "@/app/components/leads/EmploymentIncomeFields";
import InsuranceTypeSelect from "@/app/components/leads/InsuranceTypeSelect";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import { useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
import { productHrefToSlug } from "@/app/lib/services/allowedProducts";
import { useInsuranceTypeOptions } from "@/app/lib/services/useInsuranceTypeOptions";
import { mapServiceToCategory } from "@/app/utils/leadApi";
import { insuranceTypeLabel } from "@/app/utils/leadForm";
import {
  ADMIN_BTN_SECONDARY,
  ADMIN_LABEL,
} from "@/app/components/shared/crm/ui";
import {
  CATEGORIES,
  STATUSES,
  categoryLabel,
  formatCurrencyInr,
} from "./leadDisplay";
import {
  type EditForm,
  type FieldErrors,
  isMaskedPanValue,
} from "./leadEditForm";
import {
  COMMISSION_LIMITS,
  commissionPreviewRupees,
  isInsuranceCategory,
  lockedCommissionType,
} from "./leadCommission";

function FieldErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{message}</span>
  );
}

export default function LeadFormFields({
  form,
  setForm,
  inputClass,
  fieldErrors,
  clearFieldError,
  panMode = "create",
  onRevealPan,
  revealingPan,
  canApprove = false,
  partnerConsent = false,
}: {
  form: EditForm;
  setForm: (next: EditForm) => void;
  inputClass: string;
  fieldErrors: FieldErrors;
  clearFieldError: (key: keyof FieldErrors) => void;
  panMode?: "create" | "edit";
  onRevealPan?: () => void;
  revealingPan?: boolean;
  /** Only admin can set Approved (credits partner commission). */
  canApprove?: boolean;
  /** Partner add-lead must confirm the customer's details before save. */
  partnerConsent?: boolean;
}) {
  const panLocked = panMode === "edit" && isMaskedPanValue(form.pan);
  const commissionLocked = !canApprove && form.status === "approved";
  const statusLocked = commissionLocked;
  const statusOptions = STATUSES.filter(
    (s) => s.value !== "approved" || canApprove || form.status === "approved",
  );
  const insuranceTypeOptions = useInsuranceTypeOptions();
  const serviceCards = useServiceCards();
  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    const out: { value: string; label: string }[] = [];
    for (const card of serviceCards) {
      const value = mapServiceToCategory(productHrefToSlug(card.href));
      if (!value || seen.has(value)) continue;
      seen.add(value);
      out.push({ value, label: card.title });
    }
    if (out.length === 0) {
      for (const c of CATEGORIES) {
        out.push({ value: c.value, label: c.label });
        seen.add(c.value);
      }
    }
    if (form.category && !seen.has(form.category)) {
      out.push({ value: form.category, label: categoryLabel(form.category) });
    }
    return out;
  }, [serviceCards, form.category]);
  const insSelectOptions = useMemo(() => {
    const list = insuranceTypeOptions.map((o) => ({ ...o }));
    if (form.insType && !list.some((o) => o.value === form.insType)) {
      list.push({ value: form.insType, label: insuranceTypeLabel(form.insType) });
    }
    return list;
  }, [insuranceTypeOptions, form.insType]);

  const fieldLabel = "mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300";
  const publicInput =
    "w-full min-h-10 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-base text-midnight_text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80 dark:text-white";

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:gap-4">
        {form.category === "insurance" ? (
          <div className="sm:col-span-2">
            <span className={fieldLabel}>
              Insurance type <span className="text-red-500">*</span>
            </span>
            <InsuranceTypeSelect
              id="admin-lead-insurance-type"
              value={form.insType}
              disabled={commissionLocked}
              options={insSelectOptions}
              onChange={(value) => {
                setForm({ ...form, insType: value });
                clearFieldError("insType");
              }}
              className="flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-left text-base text-midnight_text outline-none focus:ring-2 focus:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80 dark:text-white"
            />
            <FieldErrorText message={fieldErrors.insType} />
          </div>
        ) : null}
        <label className="block">
          <span className={fieldLabel}>
            Full Name <span className="text-red-500">*</span>
          </span>
          <input
            className={publicInput}
            value={form.fullName}
            onChange={(e) => {
              setForm({ ...form, fullName: e.target.value });
              clearFieldError("fullName");
            }}
            placeholder="Full Name (As per PAN)"
            required
          />
          <FieldErrorText message={fieldErrors.fullName} />
        </label>
        <div className="block">
          <span className={fieldLabel}>
            PAN Card number <span className="text-red-500">*</span>
          </span>
        <div className="flex items-center gap-2">
          <input
            className={`${publicInput} min-w-0 flex-1 font-mono tracking-wide`}
            value={form.pan}
            onChange={(e) => {
              setForm({ ...form, pan: e.target.value.toUpperCase() });
              clearFieldError("pan");
            }}
            placeholder="e.g. ABCDE1234F"
            required={panMode === "create"}
            maxLength={10}
            readOnly={panLocked}
          />
          {panMode === "edit" && onRevealPan ? (
            <button
              type="button"
              onClick={onRevealPan}
              disabled={revealingPan || !panLocked}
              className={`${ADMIN_BTN_SECONDARY} shrink-0 whitespace-nowrap`}
              title={panLocked ? "Reveal full PAN (audited)" : "PAN already revealed"}
            >
              {revealingPan ? "…" : panLocked ? "Reveal" : "Shown"}
            </button>
          ) : null}
        </div>
        {panLocked ? (
          <span className="mt-1 block text-xs text-slate-500">
            Masked by default. Reveal is audited with your admin account.
          </span>
        ) : null}
        <FieldErrorText message={fieldErrors.pan} />
        </div>
        <label className="block">
          <span className={fieldLabel}>
            Mobile Number <span className="text-red-500">*</span>
          </span>
          <div className="flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80">
            <span className="flex shrink-0 items-center pl-3" aria-hidden>
              <IndiaFlag />
            </span>
            <span className="px-2 text-base font-semibold text-midnight_text dark:text-white">+91</span>
            <span className="h-6 w-px shrink-0 bg-gray-300 dark:bg-dark_border" aria-hidden />
            <input
              className="min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none dark:text-white"
              value={form.mobileNumber}
              onChange={(e) => {
                setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, "") });
                clearFieldError("mobileNumber");
              }}
              placeholder="10-digit mobile"
              inputMode="numeric"
              required
              maxLength={10}
            />
          </div>
          <FieldErrorText message={fieldErrors.mobileNumber} />
        </label>
        <label className="block">
          <span className={fieldLabel}>
            Current Residence Pincode <span className="text-red-500">*</span>
          </span>
          <input
            className={publicInput}
            value={form.pincode}
            onChange={(e) => {
              setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) });
              clearFieldError("pincode");
            }}
            placeholder="e.g. 302002"
            inputMode="numeric"
            maxLength={6}
          />
          <FieldErrorText message={fieldErrors.pincode} />
        </label>
        {form.category === "personal_loan" ? (
          <>
            <div className={commissionLocked ? "pointer-events-none opacity-60" : ""}>
              <LoanAmountSlider
                id="admin-lead-loan-amount"
                value={form.requiredAmount}
                onChange={(value) => {
                  if (commissionLocked) return;
                  setForm({ ...form, requiredAmount: value });
                }}
              />
            </div>
            <EmploymentIncomeFields
              idPrefix="admin-lead"
              netMonthlyIncome={form.netMonthlyIncome}
              onIncomeChange={(value) => {
                setForm({ ...form, netMonthlyIncome: value });
                clearFieldError("netMonthlyIncome");
              }}
              inputClassName={publicInput}
              labelClassName={fieldLabel}
              incomeError={<FieldErrorText message={fieldErrors.netMonthlyIncome} />}
              incomeWithRupee
            />
          </>
        ) : null}
      </div>
      {panMode === "edit" ? (
        <label className="block">
          <span className={ADMIN_LABEL}>Product</span>
          <select
            className={inputClass}
            value={form.category}
            disabled={commissionLocked}
            onChange={(e) => {
              const category = e.target.value;
              const commissionType = lockedCommissionType(category);
              setForm({
                ...form,
                category,
                commissionType: form.status === "approved" ? commissionType : "",
                commissionValue: form.commissionType === commissionType ? form.commissionValue : "",
              });
              clearFieldError("commissionValue");
            }}
          >
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {panMode === "edit" && canApprove ? (
        <label className="block">
          <span className={ADMIN_LABEL}>Status</span>
          <select
            className={inputClass}
            value={form.status}
            disabled={statusLocked}
            onChange={(e) => {
              const status = e.target.value;
              const commissionType = lockedCommissionType(form.category);
              setForm({
                ...form,
                status,
                commissionType: status === "approved" ? commissionType : form.commissionType,
                commissionValue:
                  status === "approved" && form.commissionType !== commissionType
                    ? ""
                    : form.commissionValue,
              });
              clearFieldError("commissionValue");
            }}
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {statusLocked ? (
            <span className="mt-1 block text-xs text-slate-500">
              Only an admin can change an approved lead or its commission.
            </span>
          ) : null}
        </label>
      ) : null}
      {panMode === "edit" && canApprove && form.partnerLead && form.status === "approved" ? (
        <ApprovedCommissionFields
          form={form}
          setForm={setForm}
          inputClass={inputClass}
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
          disabled={commissionLocked}
        />
      ) : null}
      {form.category === "personal_loan" ? (
        <div className={`sm:col-span-2${commissionLocked ? " pointer-events-none opacity-60" : ""}`}>
          <LoanTenureSlider
            id="admin-lead-loan-tenure"
            value={form.loanTenureMonths}
            onChange={(months) => {
              if (commissionLocked) return;
              setForm({ ...form, loanTenureMonths: months });
            }}
          />
        </div>
      ) : null}
      {panMode === "create" && partnerConsent ? (
        <div className="sm:col-span-2">
          <TermsAgreementCheckbox
            id="partner-lead-consent"
            variant="partner"
            checked={form.consentAccepted}
            onChange={(checked) => {
              setForm({ ...form, consentAccepted: checked });
              clearFieldError("consent");
            }}
            textClassName="text-sm leading-snug text-slate-600 dark:text-gray-300"
          />
          <FieldErrorText message={fieldErrors.consent} />
        </div>
      ) : null}
    </div>
  );
}

function ApprovedCommissionFields({
  form,
  setForm,
  inputClass,
  fieldErrors,
  clearFieldError,
  disabled,
}: {
  form: EditForm;
  setForm: (next: EditForm) => void;
  inputClass: string;
  fieldErrors: FieldErrors;
  clearFieldError: (key: keyof FieldErrors) => void;
  disabled: boolean;
}) {
  const fixed = isInsuranceCategory(form.category);
  const preview = commissionPreviewRupees(form.category, form.requiredAmount, form.commissionValue);
  const { percentMin, percentMax, fixedMin, fixedMax } = COMMISSION_LIMITS;

  return (
    <div className="block">
      <label className="block" htmlFor="admin-lead-commission-value">
        <span className={ADMIN_LABEL}>{fixed ? "Fixed amount" : "Percentage"}</span>
        {fixed ? (
          <div className="flex min-h-[46px] items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-[#4236FB] focus-within:ring-2 focus-within:ring-[#4236FB]/20 dark:border-dark_border dark:bg-darkmode">
            <span className="flex shrink-0 items-center pl-3" aria-hidden>
              <span className="theme-gradient-bg flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold leading-none text-white shadow-[0_2px_8px_rgba(66,54,251,0.35)]">
                ₹
              </span>
            </span>
            <span className="ml-2.5 h-6 w-px shrink-0 bg-slate-200 dark:bg-dark_border" aria-hidden />
            <input
              id="admin-lead-commission-value"
              className="min-h-[46px] min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 dark:text-white"
              value={form.commissionValue}
              disabled={disabled}
              inputMode="decimal"
              placeholder={`${fixedMin} to ${fixedMax}`}
              onChange={(e) => {
                const commissionValue = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
                setForm({ ...form, commissionType: lockedCommissionType(form.category), commissionValue });
                clearFieldError("commissionValue");
              }}
            />
          </div>
        ) : (
          <input
            id="admin-lead-commission-value"
            className={inputClass}
            value={form.commissionValue}
            disabled={disabled}
            inputMode="decimal"
            placeholder={`${percentMin} to ${percentMax}`}
            onChange={(e) => {
              const commissionValue = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
              setForm({ ...form, commissionType: lockedCommissionType(form.category), commissionValue });
              clearFieldError("commissionValue");
            }}
          />
        )}
      </label>
      <span className="mt-1 block text-xs text-slate-500">
        {fixed
          ? `Enter a fixed amount from ₹${fixedMin.toLocaleString("en-IN")} to ₹${fixedMax.toLocaleString("en-IN")}.`
          : `Enter a percentage from ${percentMin} to ${percentMax}.`}
        {preview != null ? ` Partner gets ${formatCurrencyInr(preview)}.` : ""}
      </span>
      <FieldErrorText message={fieldErrors.commissionValue} />
    </div>
  );
}
