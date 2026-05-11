"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LOGIN_PREFILL = {
  email: "info@apnizaroorat.com",
  password: "admin@123",
} as const;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(LOGIN_PREFILL.email);
  const [password, setPassword] = useState(LOGIN_PREFILL.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Login failed");
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
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-light via-white to-[#e4eefc] px-4 py-16 dark:from-[#040810] dark:via-[#0a1424] dark:to-[#060a12]">
      <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-white p-8 shadow-xl shadow-primary/10 dark:border-primary/25 dark:bg-darklight">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="mt-2 text-center text-2xl font-bold text-midnight_text dark:text-white">Sign in</h1>
        <p className="mt-1 text-center text-sm text-gray dark:text-gray-400">Apni Zaroorat control panel</p>

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
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-midnight_text outline-none ring-primary/30 placeholder:text-gray-400 focus:border-primary focus:ring-2 dark:border-dark_border dark:bg-darkmode dark:text-white"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-white">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-midnight_text outline-none ring-primary/30 placeholder:text-gray-400 focus:border-primary focus:ring-2 dark:border-dark_border dark:bg-darkmode dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
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
