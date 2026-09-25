"use client";

import { useMemo } from "react";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import EmploymentIncomeFields from "@/app/components/leads/EmploymentIncomeFields";
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
  leadCommissionAmount,
} from "./leadDisplay";
import {
  type EditForm,
  type FieldErrors,
  isMaskedPanValue,
} from "./leadEditForm";

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
  hideStatus = false,
  canApprove = false,
}: {
  form: EditForm;
  setForm: (next: EditForm) => void;
  inputClass: string;
  fieldErrors: FieldErrors;
  clearFieldError: (key: keyof FieldErrors) => void;
  panMode?: "create" | "edit";
  onRevealPan?: () => void;
  revealingPan?: boolean;
  /** Partners cannot set lead status (always pending). */
  hideStatus?: boolean;
  /** Only admin can set Approved (credits partner commission). */
  canApprove?: boolean;
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

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {form.category === "personal_loan" ? (
        <>
          <div className={`sm:col-span-2${commissionLocked ? " pointer-events-none opacity-60" : ""}`}>
            <LoanAmountSlider
              id="admin-lead-loan-amount"
              value={form.requiredAmount}
              onChange={(value) => {
                if (commissionLocked) return;
                setForm({ ...form, requiredAmount: value });
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <EmploymentIncomeFields
              idPrefix="admin-lead"
              employmentType={form.employmentType}
              netMonthlyIncome={form.netMonthlyIncome}
              onEmploymentChange={(value) => {
                setForm({ ...form, employmentType: value });
                clearFieldError("employmentType");
              }}
              onIncomeChange={(value) => {
                setForm({ ...form, netMonthlyIncome: value });
                clearFieldError("netMonthlyIncome");
              }}
              inputClassName={inputClass}
              labelClassName={ADMIN_LABEL}
              labelAsSpan
              employmentError={<FieldErrorText message={fieldErrors.employmentType} />}
              incomeError={<FieldErrorText message={fieldErrors.netMonthlyIncome} />}
            />
          </div>
        </>
      ) : form.category === "insurance" ? (
        <label className="block sm:col-span-2">
          <span className={ADMIN_LABEL}>Insurance type</span>
          <select
            className={inputClass}
            value={form.insType}
            disabled={commissionLocked}
            onChange={(e) => setForm({ ...form, insType: e.target.value })}
          >
            <option value="">Select insurance type</option>
            {insSelectOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block sm:col-span-2">
        <span className={ADMIN_LABEL}>Name</span>
        <input
          className={inputClass}
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="enter name"
          required
        />
      </label>
      <label className="block">
        <span className={ADMIN_LABEL}>Phone</span>
        <input
          className={inputClass}
          value={form.mobileNumber}
          onChange={(e) => {
            setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, "") });
            clearFieldError("mobileNumber");
          }}
          placeholder="enter phone number"
          inputMode="numeric"
          required
          maxLength={10}
        />
        <FieldErrorText message={fieldErrors.mobileNumber} />
      </label>
      <label className="block">
        <span className={ADMIN_LABEL}>Pincode</span>
        <input
          className={inputClass}
          value={form.pincode}
          onChange={(e) => {
            setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) });
            clearFieldError("pincode");
          }}
          placeholder="6-digit pincode"
          inputMode="numeric"
          maxLength={6}
        />
        <FieldErrorText message={fieldErrors.pincode} />
      </label>
      <div className="block">
        <span className={ADMIN_LABEL}>PAN</span>
        <div className="flex items-center gap-2">
          <input
            className={`${inputClass} min-w-0 flex-1 font-mono tracking-wide`}
            value={form.pan}
            onChange={(e) => {
              setForm({ ...form, pan: e.target.value.toUpperCase() });
              clearFieldError("pan");
            }}
            placeholder="enter PAN number"
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
        <span className={ADMIN_LABEL}>Product</span>
        <select
          className={inputClass}
          value={form.category}
          disabled={commissionLocked}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      {!hideStatus ? (
        <label className="block">
          <span className={ADMIN_LABEL}>Status</span>
          <select
            className={inputClass}
            value={form.status}
            disabled={statusLocked}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
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
          {canApprove && form.status === "approved" ? (
            <span className="mt-2 block rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
              Approved credits partner commission (
              {form.category === "insurance"
                ? "₹1,000"
                : `${formatCurrencyInr(leadCommissionAmount(form.category, form.requiredAmount))} (2%)`}
              ).
            </span>
          ) : null}
        </label>
      ) : null}
    </div>
  );
}
