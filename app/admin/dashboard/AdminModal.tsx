"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ADMIN_UI } from "./adminUi";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Wider layout for detail / multi-column forms */
  wide?: boolean;
  footer?: React.ReactNode;
};

export default function AdminModal({ title, onClose, children, wide = false, footer }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close overlay"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`relative z-10 flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-dark_border dark:bg-darklight ${
          wide
            ? "max-h-[92vh] min-h-[min(480px,85vh)] max-w-5xl"
            : "max-h-[90vh] max-w-2xl"
        }`}
      >
        <div
          className="flex shrink-0 items-center justify-between border-b px-6 py-5 sm:px-8"
          style={{
            borderColor: ADMIN_UI.border,
            background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-9 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: ADMIN_UI.primary }}
              aria-hidden
            />
            <h2
              id="admin-modal-title"
              className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <div
            className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t bg-slate-50/80 px-6 py-4 sm:px-8 dark:border-dark_border dark:bg-semidark/40"
            style={{ borderColor: ADMIN_UI.border }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
