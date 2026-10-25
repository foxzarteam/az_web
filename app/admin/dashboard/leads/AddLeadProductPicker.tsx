"use client";

export type AddLeadProduct =
  | "personal_loan"
  | "home_loan"
  | "vehicle_loan"
  | "business_loan"
  | "insurance";

const PRODUCTS: { key: AddLeadProduct; label: string; image: string }[] = [
  { key: "personal_loan", label: "Personal Loan", image: "/images/loans/personal-loan-white.gif" },
  { key: "home_loan", label: "Home Loan", image: "/images/loans/home-loan-white.gif" },
  { key: "vehicle_loan", label: "Vehicle Loan", image: "/images/loans/car-loan-white.gif?v=12" },
  { key: "business_loan", label: "Business Loan", image: "/images/loans/business-loan-white.gif" },
  { key: "insurance", label: "Insurance", image: "/images/loans/insurance-white.gif" },
];

export default function AddLeadProductPicker({
  onSelect,
}: {
  onSelect: (product: AddLeadProduct) => void;
}) {
  return (
    <div className="p-6 sm:p-8">
      <p className="text-sm text-slate-600 dark:text-gray-300">
        Choose a product. The form for that product opens next.
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {PRODUCTS.map((product) => (
          <li key={product.key}>
            <button
              type="button"
              onClick={() => onSelect(product.key)}
              className="flex h-full w-full flex-col items-center rounded-2xl border border-[#E8ECF2] bg-white px-3 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(16,45,71,0.08)] dark:border-dark_border dark:bg-darkmode"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt=""
                width={160}
                height={160}
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
              <span className="mt-3 text-sm font-semibold text-midnight_text dark:text-white">{product.label}</span>
              <span className="btn-gradient mt-4 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-white sm:min-h-10 sm:text-sm">
                Apply Now
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
