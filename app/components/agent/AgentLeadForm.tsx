"use client";

import { useMemo, useState } from "react";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import { useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
import { useRemoteServiceCards } from "@/app/lib/services/useRemoteServiceCards";
import { PUBLIC_FORM_SUBMIT_AJAX_URL } from "@/app/config/constants";

type Props = {
  agentName: string;
};

const emptyForm = { name: "", email: "", phone: "", product: "" };

export default function AgentLeadForm({ agentName }: Props) {
  const fromLayout = useServiceCards();
  const { cards: serviceRows, isLoading: servicesLoading } = useRemoteServiceCards(fromLayout);
  const serviceOptions = useMemo(() => serviceRows.filter((c) => c.title?.trim() && c.href), [serviceRows]);

  const [formData, setFormData] = useState(emptyForm);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productError, setProductError] = useState<string | undefined>();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    if (name === "product" && productError) setProductError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceOptions.length > 0 && !formData.product.trim()) {
      setProductError("Please select a product");
      return;
    }
    setProductError(undefined);
    setLoading(true);

    if (!PUBLIC_FORM_SUBMIT_AJAX_URL) {
      console.error("Set NEXT_PUBLIC_FORM_SUBMIT_AJAX_URL in .env.local for form submissions.");
      setLoading(false);
      setShowSuccess(true);
      return;
    }

    const selected = serviceOptions.find((c) => c.href === formData.product);
    const productLine = selected
      ? `Product: ${selected.title} (${selected.href})`
      : "Product: (not selected — list unavailable)";

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone,
      product: formData.product || undefined,
      productTitle: selected?.title,
      message: `[Agent lead — ${agentName}]\n${productLine}`.trim(),
    };

    try {
      const response = await fetch(PUBLIC_FORM_SUBMIT_AJAX_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setFormData(emptyForm);
        setTermsAccepted(false);
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

  const fieldClass =
    "w-full rounded-xl border border-primary/15 bg-white/95 px-4 py-3.5 text-sm text-midnight_text shadow-sm transition placeholder:text-gray/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 dark:border-primary/25 dark:bg-semidark/80 dark:text-white dark:placeholder:text-gray-400";
  const selectClass = `${fieldClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

  return (
    <div className="relative w-full">
      {showSuccess && (
        <SuccessPopup
          message="Thank you. We got your message and will contact you soon."
          onClose={() => setShowSuccess(false)}
          autoCloseMs={3500}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-white to-light/80 p-6 shadow-xl shadow-primary/15 backdrop-blur-md dark:border-primary/30 dark:from-darklight dark:to-semidark dark:shadow-primary/20 sm:p-8"
      >
        <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-primary via-skyBlue to-cyan" aria-hidden />
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-midnight_text dark:text-white">Need free financial advice?</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray dark:text-gray-300">
          Get in touch — <span className="font-semibold text-primary dark:text-sky-200">{agentName}</span> will get back to you soon.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <div>
            <label htmlFor="agent-lead-name" className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-primary/90 dark:text-sky-300/90">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="agent-lead-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={fieldClass}
            />
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <label htmlFor="agent-lead-email" className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-primary/90 dark:text-sky-300/90">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="agent-lead-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={fieldClass}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="agent-lead-phone" className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-primary/90 dark:text-sky-300/90">
                Phone <span className="text-red-500">*</span>
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
                placeholder="10 digit mobile"
                className={fieldClass}
              />
            </div>
          </div>
          <TermsAgreementCheckbox
            id="agent-lead-terms"
            checked={termsAccepted}
            onChange={setTermsAccepted}
          />
          <div>
            <label htmlFor="agent-lead-product" className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-primary/90 dark:text-sky-300/90">
              Select product <span className="text-red-500">*</span>
            </label>
            <select
              id="agent-lead-product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required={serviceOptions.length > 0}
              disabled={servicesLoading && serviceOptions.length === 0}
              className={selectClass}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23668199'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              }}
            >
              <option value="">{servicesLoading ? "Loading products…" : "Select product"}</option>
              {serviceOptions.map((c) => (
                <option key={c.href} value={c.href}>
                  {c.title}
                </option>
              ))}
            </select>
            {serviceOptions.length === 0 && !servicesLoading ? (
              <p className="mt-1 text-[11px] text-gray dark:text-gray-400">Products could not be loaded. You can still submit; we will match you manually.</p>
            ) : null}
            {productError ? <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{productError}</p> : null}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="agent-cta-btn group relative mt-1 w-full overflow-hidden rounded-full bg-gradient-to-r from-primary via-[#2563eb] to-cyan py-4 text-sm font-bold text-white shadow-lg shadow-primary/35 transition hover:shadow-xl hover:shadow-primary/45 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">{loading ? "Sending…" : "Send"}</span>
            <span
              className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-500 group-hover:translate-x-[100%]"
              aria-hidden
            />
          </button>
        </div>
      </form>
    </div>
  );
}
