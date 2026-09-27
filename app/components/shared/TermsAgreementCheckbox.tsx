"use client";

import Link from "next/link";

type Props = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  textClassName?: string;
  required?: boolean;
  showPrivacyPolicy?: boolean;
  /** Shorter single-line copy for tight layouts (e.g. modals). */
  compact?: boolean;
  /** Lead apply forms: contact consent plus T&C and Privacy Policy links. */
  variant?: "default" | "lead";
};

const VALIDITY_MESSAGE = "Please agree to the terms and conditions to continue.";
const LEAD_VALIDITY_MESSAGE =
  "Please agree to the T&C and Privacy Policy to continue.";

export function LeadCreditDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-[11px] leading-snug text-gray-500 dark:text-gray-400 ${className}`}>
      By proceeding, you consent to fetching your credit report for eligibility checks via our
      RBI-regulated partners.
    </p>
  );
}

function stopLinkToggle(e: React.MouseEvent) {
  e.stopPropagation();
}

export default function TermsAgreementCheckbox({
  id = "terms-agreement",
  checked,
  onChange,
  className,
  textClassName = "text-sm text-gray-700 dark:text-gray-300",
  required = true,
  showPrivacyPolicy = true,
  compact = false,
  variant = "default",
}: Props) {
  const validityMessage = variant === "lead" ? LEAD_VALIDITY_MESSAGE : VALIDITY_MESSAGE;
  return (
    <div className={className}>
      <div className={`flex gap-2 ${compact ? "items-center" : "items-start gap-2.5"}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            e.target.setCustomValidity("");
            onChange(e.target.checked);
          }}
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity(validityMessage);
          }}
          required={required}
          className={
            compact
              ? "h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/80"
              : "mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/80"
          }
        />
        <span className={`leading-relaxed ${textClassName}`}>
          {variant === "lead" ? (
            <>
              <label htmlFor={id} className="cursor-pointer">
                I agree to the{" "}
              </label>
              <Link
                href="/terms-and-conditions"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLinkToggle}
                onMouseDown={stopLinkToggle}
              >
                T&amp;C
              </Link>
              <label htmlFor={id} className="cursor-pointer">
                {" "}
                and{" "}
              </label>
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLinkToggle}
                onMouseDown={stopLinkToggle}
              >
                Privacy Policy
              </Link>
              <label htmlFor={id} className="cursor-pointer">
                , and authorize Apni Zaroorat and its lending partners to contact me.
              </label>
            </>
          ) : compact ? (
            <>
              <label htmlFor={id} className="cursor-pointer">
                I agree to the{" "}
              </label>
              <Link
                href="/terms-and-conditions"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLinkToggle}
                onMouseDown={stopLinkToggle}
              >
                Terms
              </Link>
              {showPrivacyPolicy ? (
                <>
                  {" "}
                  &amp;{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stopLinkToggle}
                    onMouseDown={stopLinkToggle}
                  >
                    Privacy Policy
                  </Link>
                </>
              ) : null}
              <label htmlFor={id} className="cursor-pointer">
                .
              </label>
            </>
          ) : (
            <>
              <label htmlFor={id} className="cursor-pointer">
                I agree to the{" "}
              </label>
              <Link
                href="/terms-and-conditions"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopLinkToggle}
                onMouseDown={stopLinkToggle}
              >
                Terms &amp; Conditions
              </Link>
              {showPrivacyPolicy ? (
                <>
                  {" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stopLinkToggle}
                    onMouseDown={stopLinkToggle}
                  >
                    Privacy Policy
                  </Link>
                </>
              ) : null}{" "}
              <label htmlFor={id} className="cursor-pointer">
                of Apni Zaroorat.
              </label>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
