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
};

const VALIDITY_MESSAGE = "Please agree to the terms and conditions to continue.";

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
}: Props) {
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
            e.currentTarget.setCustomValidity(VALIDITY_MESSAGE);
          }}
          required={required}
          className={
            compact
              ? "h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/80"
              : "mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/80"
          }
        />
        <span className={`leading-relaxed ${textClassName}`}>
          {compact ? (
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
