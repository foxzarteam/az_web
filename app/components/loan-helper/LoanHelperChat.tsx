"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { sanitizeMobileInput, validateMobileNumber } from "@/app/utils/validation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const AVATAR_SRC = "/images/loan-helper/avatar.png";
const TIMESTAMP = "10:30 AM";

const EMPLOYMENT_OPTIONS = [
  { id: "salaried", label: "Salaried" },
  { id: "self-employed", label: "Self-employed" },
] as const;

const SALARY_OPTIONS = [
  { id: "under-20k", label: "Under ₹20,000" },
  { id: "20-40k", label: "₹20,000 – ₹40,000" },
  { id: "40-70k", label: "₹40,000 – ₹70,000" },
  { id: "above-70k", label: "Above ₹70,000" },
] as const;

const EMI_OPTIONS = [
  { id: "yes", label: "Haan, chal rahi hai" },
  { id: "no", label: "Nahi, koi EMI nahi" },
] as const;

const LOAN_AMOUNT_OPTIONS = [
  { id: "under-2", label: "Under ₹2 lakh" },
  { id: "2-5", label: "₹2 – ₹5 lakh" },
  { id: "5-10", label: "₹5 – ₹10 lakh" },
  { id: "above-10", label: "Above ₹10 lakh" },
] as const;

type EmploymentId = (typeof EMPLOYMENT_OPTIONS)[number]["id"];
type SalaryId = (typeof SALARY_OPTIONS)[number]["id"];
type EmiId = (typeof EMI_OPTIONS)[number]["id"];
type LoanAmountId = (typeof LOAN_AMOUNT_OPTIONS)[number]["id"];
type Step =
  | "employment"
  | "salary"
  | "emi"
  | "loan_amount"
  | "mobile"
  | "complete";

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3C7.03 3 3 6.58 3 11c0 2.13 1.05 4.05 2.74 5.45L4 21l4.86-1.71C10.47 19.76 11.21 20 12 20c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5 text-[#6b7280]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-[#1DA851]" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleTickIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-white/90" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M1.5 8.5L4 11l3.5-5M6.5 8.5L9 11l3.5-5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AvatarCircle({ sizePx, alt = "" }: { sizePx: number; alt?: string }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f3f4f6] shadow-sm"
      style={{
        width: sizePx,
        height: sizePx,
        minWidth: sizePx,
        minHeight: sizePx,
      }}
    >
      <Image
        src={AVATAR_SRC}
        alt={alt}
        fill
        sizes={`${sizePx}px`}
        className="object-cover object-[50%_22%]"
        aria-hidden={!alt}
      />
    </span>
  );
}

function BotAvatar() {
  return <AvatarCircle sizePx={28} />;
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[88%] items-start gap-2">
      <BotAvatar />
      <div className="min-w-0 rounded-2xl rounded-tl-md bg-[#D4EDCE] px-3.5 py-2.5 text-[13px] leading-snug text-[#111827] shadow-sm">
        {children}
        <div className="mt-1 flex justify-end">
          <span className="text-[10px] text-[#9ca3af]">{TIMESTAMP}</span>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-tr-md bg-[#1DA851] px-3.5 py-2.5 text-[13px] leading-snug text-white shadow-sm">
        <p>{children}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-white/80">{TIMESTAMP}</span>
          <DoubleTickIcon />
        </div>
      </div>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
        selected
          ? "border-[#1DA851] bg-white text-[#128C7E] shadow-sm"
          : "border-[#e5e7eb] bg-white text-[#374151] hover:border-[#1DA851]/50 hover:shadow-sm"
      }`}
    >
      {label}
    </button>
  );
}

function OptionGroup({
  options,
  onSelect,
  selectedId,
  layout = "wrap",
}: {
  options: readonly { id: string; label: string }[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
  layout?: "wrap" | "column";
}) {
  return (
    <div
      className={`flex gap-2 pl-9 animate-in-fade ${
        layout === "column" ? "flex-col" : "flex-wrap"
      }`}
    >
      {options.map((opt) => (
        <OptionButton
          key={opt.id}
          label={opt.label}
          selected={selectedId === opt.id}
          onClick={() => onSelect(opt.id)}
        />
      ))}
    </div>
  );
}

export default function LoanHelperChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("employment");
  const [employment, setEmployment] = useState<EmploymentId | null>(null);
  const [salary, setSalary] = useState<SalaryId | null>(null);
  const [emi, setEmi] = useState<EmiId | null>(null);
  const [loanAmount, setLoanAmount] = useState<LoanAmountId | null>(null);
  const [mobileInput, setMobileInput] = useState("");
  const [submittedMobile, setSubmittedMobile] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const handleFabClick = () => {
    setIsOpen((open) => !open);
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const t = window.setTimeout(scrollToBottom, 120);
      return () => window.clearTimeout(t);
    }
  }, [
    isOpen,
    step,
    employment,
    salary,
    emi,
    loanAmount,
    submittedMobile,
    mobileError,
    scrollToBottom,
  ]);

  const handleEmploymentSelect = (id: EmploymentId) => {
    setEmployment(id);
    setStep("salary");
  };

  const handleSalarySelect = (id: SalaryId) => {
    setSalary(id);
    setStep("emi");
  };

  const handleEmiSelect = (id: EmiId) => {
    setEmi(id);
    setStep("loan_amount");
  };

  const handleLoanAmountSelect = (id: LoanAmountId) => {
    setLoanAmount(id);
    setStep("mobile");
    setMobileInput("");
    setMobileError("");
  };

  const handleMobileSubmit = () => {
    const validation = validateMobileNumber(mobileInput);
    if (!validation.isValid) {
      setMobileError(validation.error ?? "Invalid mobile number.");
      return;
    }
    setMobileError("");
    setSubmittedMobile(mobileInput);
    setStep("complete");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && step === "mobile") {
      e.preventDefault();
      handleMobileSubmit();
    }
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const employmentLabel =
    EMPLOYMENT_OPTIONS.find((o) => o.id === employment)?.label ?? "";
  const salaryLabel = SALARY_OPTIONS.find((o) => o.id === salary)?.label ?? "";
  const emiLabel = EMI_OPTIONS.find((o) => o.id === emi)?.label ?? "";
  const loanAmountLabel =
    LOAN_AMOUNT_OPTIONS.find((o) => o.id === loanAmount)?.label ?? "";

  const incomeQuestion =
    employment === "self-employed"
      ? "Great! 👍\nAapka approx monthly business income kitna hai?"
      : "Great! 👍\nAapki monthly in-hand salary kitni hai approx?";

  const inputEnabled = step === "mobile";
  const inputPlaceholder =
    step === "mobile"
      ? "Apna 10-digit mobile number likhein..."
      : "Type your answer...";

  return (
    <div
      className={`${inter.className} fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-[1000] flex flex-col items-end sm:bottom-6 sm:right-6`}
    >
      {isOpen && (
        <div
          role="dialog"
          aria-label="Loan Advisor chat"
          className="mb-3 flex h-[min(620px,calc(100dvh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_8px_40px_rgba(17,24,39,0.12)] animate-in-fade"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3">
            <AvatarCircle sizePx={40} alt="Loan Advisor" />
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold leading-tight text-[#111827]">
                Loan Advisor
              </h2>
              <p className="flex items-center gap-1.5 text-[11px] text-[#6b7280]">
                <span className="h-2 w-2 rounded-full bg-[#1DA851]" aria-hidden />
                Online
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 transition-colors hover:bg-[#f3f4f6]"
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
          </header>

          <div
            ref={chatBodyRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-3 py-4"
          >
            <BotBubble>
              <p className="whitespace-pre-line">
                Namaste! 👋{"\n"}
                Main aapki loan eligibility check karne me help karunga.{"\n"}
                Chaliye shuru karte hain.
              </p>
            </BotBubble>

            <BotBubble>
              <p>Aap salaried hain ya self-employed?</p>
            </BotBubble>

            {step === "employment" && (
              <OptionGroup
                options={EMPLOYMENT_OPTIONS}
                onSelect={(id) => handleEmploymentSelect(id as EmploymentId)}
              />
            )}

            {employment && (
              <>
                <UserBubble>{employmentLabel}</UserBubble>

                <BotBubble>
                  <p className="whitespace-pre-line">{incomeQuestion}</p>
                </BotBubble>

                {step === "salary" && (
                  <OptionGroup
                    layout="column"
                    options={SALARY_OPTIONS}
                    onSelect={(id) => handleSalarySelect(id as SalaryId)}
                  />
                )}

                {salary && (
                  <>
                    <UserBubble>{salaryLabel}</UserBubble>

                    <BotBubble>
                      <p>Koi EMI already chal rahi hai?</p>
                    </BotBubble>

                    {step === "emi" && (
                      <OptionGroup
                        options={EMI_OPTIONS}
                        onSelect={(id) => handleEmiSelect(id as EmiId)}
                      />
                    )}

                    {emi && (
                      <>
                        <UserBubble>{emiLabel}</UserBubble>

                        <BotBubble>
                          <p>Aapko approx kitna loan chahiye?</p>
                        </BotBubble>

                        {step === "loan_amount" && (
                          <OptionGroup
                            layout="column"
                            options={LOAN_AMOUNT_OPTIONS}
                            onSelect={(id) =>
                              handleLoanAmountSelect(id as LoanAmountId)
                            }
                          />
                        )}

                        {loanAmount && (
                          <>
                            <UserBubble>{loanAmountLabel}</UserBubble>

                            {(step === "mobile" || step === "complete") && (
                              <BotBubble>
                                <p className="whitespace-pre-line">
                                  Great 👍{"\n"}
                                  Aapka profile kaafi lenders ke liye suitable lag raha hai.{"\n"}
                                  Detailed lender matches dekhne ke liye mobile number verify
                                  karein.
                                </p>
                              </BotBubble>
                            )}

                            {submittedMobile && (
                              <>
                                <UserBubble>{submittedMobile}</UserBubble>
                                <BotBubble>
                                  <p className="whitespace-pre-line">
                                    Shukriya! 🙏{"\n"}
                                    Aapka number receive ho gaya. Hum jald hi aapko best lender
                                    matches ke saath contact karenge.
                                  </p>
                                </BotBubble>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
          </div>

          <div className="shrink-0 border-t border-[#e5e7eb] bg-white px-3 pb-3 pt-2.5">
            <div className="flex items-center gap-2">
              <input
                type="tel"
                inputMode="numeric"
                placeholder={inputPlaceholder}
                value={mobileInput}
                onChange={(e) => {
                  setMobileInput(sanitizeMobileInput(e.target.value));
                  if (mobileError) setMobileError("");
                }}
                onKeyDown={handleInputKeyDown}
                readOnly={!inputEnabled}
                className="h-10 min-w-0 flex-1 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-4 text-[13px] text-[#111827] outline-none transition-shadow placeholder:text-[#9ca3af] read-only:cursor-default focus:border-[#1DA851]/40 focus:ring-2 focus:ring-[#1DA851]/15"
                aria-label={inputPlaceholder}
              />
              <button
                type="button"
                onClick={() => step === "mobile" && handleMobileSubmit()}
                disabled={step !== "mobile"}
                className="btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
            {mobileError ? (
              <p className="mt-1.5 text-center text-[10px] text-red-600">{mobileError}</p>
            ) : null}
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#6b7280]">
              <ShieldIcon />
              Your information is 100% secure with us.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleFabClick}
        aria-label={
          isOpen
            ? "Close Loan Advisor"
            : "Open Loan Advisor, 1 new message"
        }
        aria-expanded={isOpen}
        className={`btn-gradient relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(66,54,251,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_28px_rgba(66,54,251,0.45)] active:scale-95 ${
          !isOpen ? "animate-pulse-subtle" : ""
        }`}
      >
        {!isOpen && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#EF4444] px-1 text-[11px] font-bold leading-none text-white shadow-sm"
            aria-hidden
          >
            1
          </span>
        )}
        {isOpen ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <ChatIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
