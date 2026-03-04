"use client";

import { useState } from "react";
import { Bebas_Neue } from "next/font/google";
import ProductFormCard from "./ProductFormCard";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });

const TABS = [
  { id: "personal-loan", label: "Personal Loan" },
  { id: "home-loan", label: "Home Loan" },
  { id: "business-loan", label: "Business Loan" },
  { id: "credit-card", label: "Credit Card" },
] as const;

export default function SellMoreTabsAndCard() {
  const [selected, setSelected] = useState<string>("personal-loan");

  return (
    <>
      <div className="mb-8 flex flex-nowrap gap-3 overflow-x-auto pb-1 text-xs font-medium text-slate-700 md:text-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelected(tab.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 transition-colors ${
              selected === tab.id
                ? "border border-orange-500 bg-orange-50 text-orange-600"
                : "border border-slate-200 bg-slate-50 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <div className="overflow-visible rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-white shadow-lg shadow-slate-500/40 az-card-hover">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <ProductFormCard selectedTabId={selected} />
            </div>
            <div className="relative flex min-h-[280px] items-center justify-center overflow-visible py-4">
              <div className="absolute inset-0 flex items-center justify-center overflow-visible" aria-hidden="true">
                <div className="h-64 w-44 rounded-[32px] bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-orange-500/40 az-card-spin-cw" />
              </div>
              <div className="relative z-10 flex h-60 w-40 items-center justify-center rounded-[32px] bg-gradient-to-br from-slate-50 to-slate-300 p-3 shadow-2xl shadow-slate-900/40 az-card-spin-ccw">
                <span
                  key={selected}
                  className={`az-movie-text text-center text-xl font-bold uppercase leading-tight tracking-wider text-slate-800 ${bebas.className}`}
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
                >
                  {TABS.find((t) => t.id === selected)?.label ?? "Personal Loan"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 az-card-hover overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trusted partners
          </p>
          <p className="text-sm font-medium text-slate-900">
            Work with leading financial brands in India
          </p>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-3 whitespace-nowrap text-[11px] text-slate-700 animate-[az-marquee_16s_linear_infinite]">
              {[
                "Axis Bank",
                "IDFC FIRST",
                "Bajaj Finserv",
                "Kotak 811",
                "Upstox",
                "Paytm Money",
                "Freecharge",
                "Jupiter",
                "IndiaGold",
              ].map((name) => (
                <div
                  key={name + "-1"}
                  className="flex h-10 min-w-[110px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center"
                >
                  {name}
                </div>
              ))}
              {[
                "Axis Bank",
                "IDFC FIRST",
                "Bajaj Finserv",
                "Kotak 811",
                "Upstox",
                "Paytm Money",
                "Freecharge",
                "Jupiter",
                "IndiaGold",
              ].map((name) => (
                <div
                  key={name + "-2"}
                  className="flex h-10 min-w-[110px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Brand logos are placeholders. Replace with official assets as needed.
          </p>
        </div>
      </div>
    </>
  );
}
