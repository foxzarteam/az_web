"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PUBLIC_API_BASE_URL } from "@/app/config/constants";

/** Dev-only prefill from NEXT_PUBLIC_ADMIN_LOGIN_PREFILL_* — never hardcode passwords. */
const LOGIN_PREFILL = {
  email:
    process.env.NODE_ENV !== "production"
      ? (process.env.NEXT_PUBLIC_ADMIN_LOGIN_PREFILL_EMAIL ?? "").trim()
      : "",
  password:
    process.env.NODE_ENV !== "production"
      ? (process.env.NEXT_PUBLIC_ADMIN_LOGIN_PREFILL_PASSWORD ?? "").trim()
      : "",
};

type NestLoginJson = {
  ok?: boolean;
  user?: { id: string; email: string; role: string; full_name?: string };
};

function nestAuthLoginUrl(): string {
  return `${PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api/auth/login`;
}

function digitsOnly(v: string): string {
  return v.replace(/\D/g, "");
}

function isMobileLogin(identifier: string): boolean {
  const d = digitsOnly(identifier);
  if (d.length === 12 && d.startsWith("91")) return /^[6-9]\d{9}$/.test(d.slice(2));
  if (d.length === 11 && d.startsWith("0")) return /^[6-9]\d{9}$/.test(d.slice(1));
  return /^[6-9]\d{9}$/.test(d.slice(-10)) && d.length >= 10;
}

export default function LoginForm({ mode = "admin" }: { mode?: "admin" | "partner" }) {
  const partnerOnly = mode === "partner";
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string>(partnerOnly ? "" : LOGIN_PREFILL.email);
  const [password, setPassword] = useState<string>(partnerOnly ? "" : LOGIN_PREFILL.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (partnerOnly || isMobileLogin(identifier)) {
        if (!isMobileLogin(identifier)) {
          setError("Enter a valid 10-digit mobile number");
          return;
        }
        const pin = digitsOnly(password).slice(0, 4);
        if (!/^\d{4}$/.test(pin)) {
          setError("Enter your 4-digit PIN");
          return;
        }
        const sessionRes = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: digitsOnly(identifier).slice(-10),
            mpin: pin,
          }),
          credentials: "same-origin",
        });
        const sessionData = (await sessionRes.json().catch(() => ({}))) as {
          error?: string;
          role?: string;
        };
        if (!sessionRes.ok) {
          setError(sessionData.error?.trim() || "Invalid phone or PIN");
          return;
        }
        const role = String(sessionData.role).toLowerCase();
        if (partnerOnly && role !== "agent") {
          setError("This login is for partners only");
          return;
        }
        router.push(role === "agent" ? "/partner/dashboard" : "/admin/dashboard");
        router.refresh();
        return;
      }

      const email = identifier.trim();
      const nestRes = await fetch(nestAuthLoginUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
        mode: "cors",
        credentials: "omit",
      });

      const nestJson = (await nestRes.json().catch(() => ({}))) as NestLoginJson;

      if (!nestRes.ok || !nestJson.ok || !nestJson.user?.id || !nestJson.user?.email || !nestJson.user?.role) {
        setError("Invalid email or password");
        return;
      }

      const sessionRes = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      });
      const sessionData = (await sessionRes.json().catch(() => ({}))) as { error?: string };

      if (!sessionRes.ok) {
        setError(sessionData.error?.trim() || "Could not create session.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-light via-white to-[#e4eefc] px-4 pb-12 pt-24 sm:pb-16 sm:pt-28 md:pb-20 md:pt-32 dark:from-[#040810] dark:via-[#0a1424] dark:to-[#060a12]">
      <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-white p-8 shadow-xl shadow-primary/10 dark:border-primary/25 dark:bg-darklight">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {partnerOnly ? "Partner" : "Portal"}
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold text-midnight_text dark:text-white">Sign in</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error ? (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
              role="alert"
            >
              {error}
            </div>
          ) : null}
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-white">
              {partnerOnly ? "Mobile" : "Email or mobile"}
            </label>
            <input
              id="admin-email"
              name={partnerOnly ? "mobile" : "email"}
              type={partnerOnly ? "tel" : "text"}
              inputMode={partnerOnly ? "numeric" : undefined}
              autoComplete={partnerOnly ? "tel" : "username"}
              required
              value={identifier}
              onChange={(e) =>
                setIdentifier(partnerOnly ? digitsOnly(e.target.value).slice(0, 10) : e.target.value)
              }
              maxLength={partnerOnly ? 10 : undefined}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-midnight_text outline-none ring-primary/30 placeholder:text-gray-400 focus:border-primary focus:ring-2 dark:border-dark_border dark:bg-darkmode dark:text-white"
              placeholder={partnerOnly ? "10-digit mobile" : "you@company.com or 10-digit mobile"}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-white">
              {partnerOnly ? "PIN" : "Password / PIN"}
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              inputMode={partnerOnly ? "numeric" : undefined}
              autoComplete={partnerOnly ? "current-password" : "current-password"}
              required
              value={password}
              onChange={(e) =>
                setPassword(partnerOnly ? digitsOnly(e.target.value).slice(0, 4) : e.target.value)
              }
              maxLength={partnerOnly ? 4 : undefined}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-midnight_text outline-none ring-primary/30 placeholder:text-gray-400 focus:border-primary focus:ring-2 dark:border-dark_border dark:bg-darkmode dark:text-white"
              placeholder={partnerOnly ? "4-digit PIN" : "Password or 4-digit PIN"}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl btn-gradient py-3 text-sm font-bold text-white transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray dark:text-gray-400">
          <Link href="/" className="font-medium text-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
