"use client";

export type AddLeadProduct = "personal_loan" | "insurance";

const PRODUCTS: {
  key: AddLeadProduct;
  title: string;
  detail: string;
  className: string;
}[] = [
  {
    key: "personal_loan",
    title: "Personal Loan",
    detail: "Amount, employment, income, and tenure",
    className: "bg-[#4236FB] shadow-[0_12px_28px_rgba(66,54,251,0.28)]",
  },
  {
    key: "insurance",
    title: "Insurance",
    detail: "Health, motor, life, and other covers",
    className: "theme-gradient-bg shadow-[0_12px_28px_rgba(255,126,41,0.22)]",
  },
];

export default function AddLeadProductPicker({
  onSelect,
}: {
  onSelect: (product: AddLeadProduct) => void;
}) {
  return (
    <div className="p-6 sm:p-8">
      <p className="text-sm text-slate-600 dark:text-gray-300">
        Choose whether this lead is for a personal loan or insurance.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRODUCTS.map((product) => (
          <button
            key={product.key}
            type="button"
            onClick={() => onSelect(product.key)}
            className={`flex min-h-36 flex-col items-start justify-between rounded-2xl p-5 text-left text-white transition hover:brightness-110 ${product.className}`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              {product.key === "personal_loan" ? <LoanIcon /> : <InsuranceIcon />}
            </span>
            <span>
              <span className="mt-4 block text-lg font-bold">{product.title}</span>
              <span className="mt-1 block text-sm text-white/85">{product.detail}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LoanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="white" strokeWidth="1.7" />
      <path d="M3 10h18" stroke="white" strokeWidth="1.7" />
      <path d="M7 15h4" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function InsuranceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 19 6.2v5.3c0 4.2-2.8 7.2-7 8.9-4.2-1.7-7-4.7-7-8.9V6.2L12 3.5Z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 12.2 11 14.2 15.2 10" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
