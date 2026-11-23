"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toPublicClientError } from "@/app/lib/publicClientError";

type FileSlot = "aadhaarFront" | "aadhaarBack" | "panCard" | "selfie";

const SLOTS: { id: FileSlot; label: string }[] = [
  { id: "aadhaarFront", label: "Aadhaar — Front, JPG, PNG or PDF" },
  { id: "aadhaarBack", label: "Aadhaar — Back, JPG, PNG or PDF" },
  { id: "panCard", label: "PAN Card, JPG, PNG or PDF" },
  { id: "selfie", label: "Selfie / photo, JPG or PNG" },
];

async function filePayload(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  return {
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    contentBase64: btoa(binary),
  };
}

const FIELD_ERROR = "mt-1 text-xs font-medium text-rose-600";
const INPUT_OK =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const INPUT_ERR =
  "mt-1.5 w-full rounded-xl border border-rose-400 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={FIELD_ERROR}>{message}</p>;
}

function FilePick({
  label,
  file,
  accept,
  error,
  onChange,
}: {
  label: string;
  file: File | null;
  accept: string;
  error?: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50/40 ${error ? "border-rose-400" : "border-slate-300"}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-slate-800">{label}</span>
        <span className="block truncate text-xs text-slate-500">
          {file ? file.name : "Choose a clear, visible document"}
        </span>
      </span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
    <FieldError message={error} />
    </div>
  );
}

type FieldKey =
  | "aadhaarNumber"
  | "pan"
  | "bankName"
  | "accountHolder"
  | "accountNumber"
  | "ifsc"
  | FileSlot
  | "files";

type FieldErrors = Partial<Record<FieldKey, string>>;

export default function KycForm({ rejected = false }: { rejected?: boolean }) {
  const router = useRouter();
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [pan, setPan] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [files, setFiles] = useState<Record<FileSlot, File | null>>({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    selfie: null,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  function clearError(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!/^\d{12}$/.test(aadhaarNumber)) next.aadhaarNumber = "Enter a 12-digit Aadhaar number.";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase())) next.pan = "Enter a valid PAN.";
    if (bankName.trim().length < 2) next.bankName = "Enter bank name.";
    if (accountHolder.trim().length < 2) next.accountHolder = "Enter account holder name.";
    if (!/^\d{9,18}$/.test(accountNumber)) next.accountNumber = "Enter a valid account number.";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) next.ifsc = "Enter a valid IFSC.";
    for (const slot of SLOTS) {
      if (!files[slot.id]) {
        next[slot.id] = `Upload ${slot.label.split(",")[0]}.`;
      } else if ((files[slot.id]?.size ?? 0) > 2 * 1024 * 1024) {
        next[slot.id] = "File must be 2 MB or smaller.";
      }
    }
    const totalBytes = SLOTS.reduce((sum, slot) => sum + (files[slot.id]?.size ?? 0), 0);
    if (totalBytes > 3.5 * 1024 * 1024) {
      next.files = "Total upload must be under 3.5 MB. Compress the images and try again.";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const [aadhaarFront, aadhaarBack, panCard, selfie] = await Promise.all([
        filePayload(files.aadhaarFront!),
        filePayload(files.aadhaarBack!),
        filePayload(files.panCard!),
        filePayload(files.selfie!),
      ]);
      const res = await fetch("/api/agent/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaarNumber,
          pan: pan.toUpperCase(),
          bankName: bankName.trim(),
          accountHolder: accountHolder.trim(),
          accountNumber,
          ifsc: ifsc.toUpperCase(),
          aadhaarFront,
          aadhaarBack,
          panCard,
          selfie,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setSubmitError(toPublicClientError(data.error ?? data.message, "Could not submit KYC."));
        return;
      }
      router.replace("/partner/waiting");
      router.refresh();
    } catch {
      setSubmitError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        Partner onboarding
      </p>
      <h1 className="text-2xl font-semibold text-slate-900">Complete your KYC</h1>
      <p className="mt-1 text-sm text-slate-500">
        One last step before your partner dashboard unlocks.
      </p>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Upload correct and clearly visible documents. Blurred, mismatched, or incorrect documents will
        lead to your KYC being rejected.
      </div>

      {rejected ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Previous documents were not approved. Please upload a fresh set and submit again.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              1
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Identity — Aadhaar</h2>
              <p className="text-xs text-slate-500">Government-issued proof of identity</p>
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Aadhaar number
            <input
              value={aadhaarNumber}
              onChange={(e) => {
                setAadhaarNumber(e.target.value.replace(/\D/g, "").slice(0, 12));
                clearError("aadhaarNumber");
              }}
              inputMode="numeric"
              maxLength={12}
              placeholder="12-digit Aadhaar number"
              className={errors.aadhaarNumber ? INPUT_ERR : INPUT_OK}
            />
          </label>
          <FieldError message={errors.aadhaarNumber} />
          <p className="mt-1.5 text-xs text-slate-400">We store a masked version in admin review screens.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <FilePick
              label={SLOTS[0]!.label}
              file={files.aadhaarFront}
              error={errors.aadhaarFront}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(file) => {
                setFiles((prev) => ({ ...prev, aadhaarFront: file }));
                clearError("aadhaarFront");
              }}
            />
            <FilePick
              label={SLOTS[1]!.label}
              file={files.aadhaarBack}
              error={errors.aadhaarBack}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(file) => {
                setFiles((prev) => ({ ...prev, aadhaarBack: file }));
                clearError("aadhaarBack");
              }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              2
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">PAN card</h2>
              <p className="text-xs text-slate-500">Required for payout compliance</p>
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            PAN number
            <input
              value={pan}
              onChange={(e) => {
                setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10));
                clearError("pan");
              }}
              maxLength={10}
              placeholder="ABCDE1234F"
              className={`uppercase ${errors.pan ? INPUT_ERR : INPUT_OK}`}
            />
          </label>
          <FieldError message={errors.pan} />
          <div className="mt-4">
            <FilePick
              label={SLOTS[2]!.label}
              file={files.panCard}
              error={errors.panCard}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(file) => {
                setFiles((prev) => ({ ...prev, panCard: file }));
                clearError("panCard");
              }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              3
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Bank details</h2>
              <p className="text-xs text-slate-500">Payout account for partner earnings</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Bank name
              <input
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  clearError("bankName");
                }}
                className={errors.bankName ? INPUT_ERR : INPUT_OK}
              />
              <FieldError message={errors.bankName} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Account holder
              <input
                value={accountHolder}
                onChange={(e) => {
                  setAccountHolder(e.target.value);
                  clearError("accountHolder");
                }}
                className={errors.accountHolder ? INPUT_ERR : INPUT_OK}
              />
              <FieldError message={errors.accountHolder} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Account number
              <input
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18));
                  clearError("accountNumber");
                }}
                inputMode="numeric"
                className={errors.accountNumber ? INPUT_ERR : INPUT_OK}
              />
              <FieldError message={errors.accountNumber} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              IFSC
              <input
                value={ifsc}
                onChange={(e) => {
                  setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11));
                  clearError("ifsc");
                }}
                maxLength={11}
                className={`uppercase ${errors.ifsc ? INPUT_ERR : INPUT_OK}`}
              />
              <FieldError message={errors.ifsc} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              4
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Selfie / photo</h2>
              <p className="text-xs text-slate-500">Face clearly visible, no sunglasses</p>
            </div>
          </div>
          <FilePick
            label={SLOTS[3]!.label}
            file={files.selfie}
            error={errors.selfie}
            accept="image/jpeg,image/png,image/webp"
            onChange={(file) => {
              setFiles((prev) => ({ ...prev, selfie: file }));
              clearError("selfie");
            }}
          />
          <FieldError message={errors.files} />
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Submitting…" : "Submit for review"}
        </button>
        {submitError ? <p className={`${FIELD_ERROR} text-center`}>{submitError}</p> : null}
      </form>
    </div>
  );
}
