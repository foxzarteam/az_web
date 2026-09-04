"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ADMIN_BTN_PRIMARY, ADMIN_ERROR, ADMIN_INPUT, ADMIN_LABEL, ADMIN_UI } from "@/app/admin/dashboard/adminUi";

export default function AgentLoginForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/agent/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobile.replace(/\D/g, "").slice(0, 10),
          mpin: pin.replace(/\D/g, "").slice(0, 4),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Invalid phone or PIN");
        return;
      }
      router.push("/agent/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center px-4 py-16"
      style={{
        background: `linear-gradient(160deg, ${ADMIN_UI.sidebar} 0%, #0f1a4a 48%, ${ADMIN_UI.sidebarDeep} 100%)`,
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/20">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#4236FB]">
          Agent affiliate
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in with your mobile and 4-digit PIN</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error ? <p className={ADMIN_ERROR}>{error}</p> : null}
          <label className="block">
            <span className={ADMIN_LABEL}>Mobile</span>
            <input
              className={ADMIN_INPUT}
              inputMode="numeric"
              maxLength={10}
              required
              autoComplete="tel"
              placeholder="10-digit mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </label>
          <label className="block">
            <span className={ADMIN_LABEL}>PIN</span>
            <input
              className={ADMIN_INPUT}
              type="password"
              inputMode="numeric"
              maxLength={4}
              required
              autoComplete="current-password"
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </label>
          <button type="submit" disabled={loading} className={`${ADMIN_BTN_PRIMARY} w-full`}>
            {loading ? "Signing in…" : "Enter portal"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link href="/become-partner/" className="font-medium text-[#4236FB] hover:underline">
            Join as partner
          </Link>
          <span className="mx-2 text-slate-300">·</span>
          <Link href="/" className="font-medium text-[#4236FB] hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
