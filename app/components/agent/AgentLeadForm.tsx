"use client";

import { useState } from "react";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import { PUBLIC_FORM_SUBMIT_AJAX_URL } from "@/app/config/constants";

type Props = {
  agentName: string;
};

export default function AgentLeadForm({ agentName }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!PUBLIC_FORM_SUBMIT_AJAX_URL) {
      console.error("Set NEXT_PUBLIC_FORM_SUBMIT_AJAX_URL in .env.local for form submissions.");
      setLoading(false);
      setShowSuccess(true);
      return;
    }

    const payload = {
      ...formData,
      message: `[Agent lead — ${agentName}]\n${formData.message}`.trim(),
    };

    try {
      const response = await fetch(PUBLIC_FORM_SUBMIT_AJAX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setShowSuccess(true);
      } else {
        setShowSuccess(true);
      }
    } catch {
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {showSuccess && (
        <SuccessPopup
          message="Thank you! Your advisor will reach out shortly."
          onClose={() => setShowSuccess(false)}
          autoCloseMs={3500}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="agent-glass-card flex w-full flex-col rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_-15px_rgba(47,115,242,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-semidark/80 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)] sm:p-8"
      >
        <div className="mb-1 h-1 w-14 rounded-full bg-gradient-to-r from-primary via-sky-400 to-cyan" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-midnight_text dark:text-white">Let&apos;s talk</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray dark:text-gray-400">
          Tell us what you need — <span className="font-medium text-midnight_text dark:text-gray-300">{agentName}</span> will
          reply shortly.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="agent-lead-name" className="mb-1.5 block text-xs font-semibold text-midnight_text dark:text-gray-300">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="agent-lead-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-midnight_text shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-darkmode/50 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="agent-lead-email" className="mb-1.5 block text-xs font-semibold text-midnight_text dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="agent-lead-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-midnight_text shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-darkmode/50 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="agent-lead-phone" className="mb-1.5 block text-xs font-semibold text-midnight_text dark:text-gray-300">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                id="agent-lead-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-midnight_text shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-darkmode/50 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="agent-lead-msg" className="mb-1.5 block text-xs font-semibold text-midnight_text dark:text-gray-300">
              How can we help?
            </label>
            <textarea
              id="agent-lead-msg"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Loan amount, city, employment type…"
              className="w-full resize-y rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-midnight_text shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-darkmode/50 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="agent-cta-btn group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[#2563eb] py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">{loading ? "Sending…" : "Send message"}</span>
            <span
              className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-500 group-hover:translate-x-[100%]"
              aria-hidden
            />
          </button>
        </div>
      </form>
    </div>
  );
}
