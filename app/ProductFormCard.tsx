"use client";

const TABS = [
  { id: "personal-loan", display: "Personal Loan" },
  { id: "home-loan", display: "Home Loan" },
  { id: "business-loan", display: "Business Loan" },
  { id: "credit-card", display: "Credit Card" },
] as const;

const DEFAULT_TAB_ID = "personal-loan";

type Props = { selectedTabId?: string };

export default function ProductFormCard({ selectedTabId = DEFAULT_TAB_ID }: Props) {
  const _current =
    TABS.find((t) => t.id === selectedTabId) ?? TABS.find((t) => t.id === DEFAULT_TAB_ID)!;
  void _current; // reserved for tab UI
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
        <form className="space-y-3">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-[11px] font-semibold text-slate-700">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="As per Aadhaar"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-[11px] font-semibold text-slate-700">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="As per Aadhaar"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-[11px] font-semibold text-slate-700">
              Email <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
            />
          </div>
          <div>
            <label htmlFor="pincode" className="mb-1 block text-[11px] font-semibold text-slate-700">
              Pincode
            </label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Submit
          </button>
        </form>
    </div>
  );
}
