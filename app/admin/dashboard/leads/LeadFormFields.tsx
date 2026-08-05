"use client";

import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import EmploymentIncomeFields from "@/app/components/leads/EmploymentIncomeFields";
import { INSURANCE_TYPE_OPTIONS } from "@/app/utils/leadForm";
import {
  ADMIN_BTN_SECONDARY,
  ADMIN_LABEL,
} from "../adminUi";
import { CATEGORIES, STATUSES } from "./leadDisplay";
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
}: {
  form: EditForm;
  setForm: (next: EditForm) => void;
  inputClass: string;
  fieldErrors: FieldErrors;
  clearFieldError: (key: keyof FieldErrors) => void;
  panMode?: "create" | "edit";
  onRevealPan?: () => void;
  revealingPan?: boolean;
}) {
  const panLocked = panMode === "edit" && isMaskedPanValue(form.pan);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {form.category === "personal_loan" ? (
        <>
          <div className="sm:col-span-2">
            <LoanAmountSlider
              id="admin-lead-loan-amount"
              value={form.requiredAmount}
              onChange={(value) => setForm({ ...form, requiredAmount: value })}
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
      ) : (
        <label className="block sm:col-span-2">
          <span className={ADMIN_LABEL}>Insurance type</span>
          <select
            className={inputClass}
            value={form.insType}
            onChange={(e) => setForm({ ...form, insType: e.target.value })}
          >
            {INSURANCE_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}
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
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={ADMIN_LABEL}>Status</span>
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
