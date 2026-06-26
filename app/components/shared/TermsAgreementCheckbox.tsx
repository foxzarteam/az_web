"use client";

import Link from "next/link";

type Props = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
  required?: boolean;
};

export const TERMS_AGREEMENT_ERROR = "Please agree to the terms and conditions to continue.";

export default function TermsAgreementCheckbox({
  id = "terms-agreement",
  checked,
  onChange,
  error,
  className,
  required = true,
}: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/80"
          aria-invalid={!!error}
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          I agree to{" "}
          <Link
            href="/terms-and-conditions"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms and conditions
          </Link>
        </span>
      </label>
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
