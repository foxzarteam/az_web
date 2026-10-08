"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import {
  applyThanksCopy,
  takeApplyThanks,
  type ApplyThanksPayload,
} from "@/app/lib/customer/applyThanks";

export default function ApplyThanksPopup() {
  const [payload, setPayload] = useState<ApplyThanksPayload | null>(null);

  useEffect(() => {
    setPayload(takeApplyThanks());
  }, []);

  useEffect(() => {
    if (!payload) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPayload(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [payload]);

  useBodyScrollLock(Boolean(payload));

  if (!payload || typeof document === "undefined") return null;

  const copy = applyThanksCopy(payload);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-thanks-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />
        <button
          type="button"
          onClick={() => setPayload(null)}
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-midnight_text"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="px-6 pb-7 pt-8 text-center sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 4 12 14.01l-3-3" />
            </svg>
          </div>
          <h2 id="apply-thanks-title" className="mt-5 text-2xl font-bold text-midnight_text">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray sm:text-base">{copy.body}</p>
          <button
            type="button"
            onClick={() => setPayload(null)}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
