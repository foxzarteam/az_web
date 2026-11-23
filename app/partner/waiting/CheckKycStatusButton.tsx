"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckKycStatusButton() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  return (
    <button
      type="button"
      disabled={checking}
      onClick={() => {
        setChecking(true);
        router.refresh();
        setTimeout(() => setChecking(false), 800);
      }}
      className="mt-6 inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      {checking ? "Checking…" : "Check status"}
    </button>
  );
}
