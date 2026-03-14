"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export type PopupVariant = "success" | "warning" | "danger";

type SuccessPopupProps = {
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
  variant?: PopupVariant;
};

const variantConfig = {
  success: {
    title: "Done!",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    progressBar: "bg-emerald-500 dark:bg-emerald-400",
    border: "border-gray-200/80 dark:border-white/10",
    icon: (
      <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
  warning: {
    title: "Please wait",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    progressBar: "bg-amber-500 dark:bg-amber-400",
    border: "border-amber-200/80 dark:border-amber-500/30",
    icon: (
      <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  danger: {
    title: "Notice",
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-600 dark:text-red-400",
    progressBar: "bg-red-500 dark:bg-red-400",
    border: "border-red-200/80 dark:border-red-500/30",
    icon: (
      <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
};

export default function SuccessPopup({ message, onClose, autoCloseMs = 3000, variant = "success" }: SuccessPopupProps) {
  const config = variantConfig[variant];

  // Freeze page at current scroll – body fixed at scrollY so page na hile
  useEffect(() => {
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevStyle = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "0";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prevStyle.overflow;
      document.body.style.paddingRight = prevStyle.paddingRight;
      document.body.style.position = prevStyle.position;
      document.body.style.top = prevStyle.top;
      document.body.style.left = prevStyle.left;
      document.body.style.right = prevStyle.right;
      document.body.style.width = prevStyle.width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [onClose, autoCloseMs]);

  const popup = (
    <div
      className="success-modal-overlay fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm min-h-screen w-full"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      role="alertdialog"
      aria-live="polite"
      aria-label={variant === "success" ? "Success" : variant === "warning" ? "Warning" : "Alert"}
    >
      <div className={`success-modal-box bg-white dark:bg-darklight rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border mx-4 ${config.border}`}>
        {/* Icon */}
        <div className="pt-8 pb-4 px-6 sm:px-8">
          <div className={`success-modal-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full opacity-0 ${config.iconBg} ${config.iconColor}`}>
            {config.icon}
          </div>
        </div>

        {/* Text */}
        <div className="px-6 sm:px-8 pb-6 text-center">
          <h3 className="text-xl font-semibold text-midnight_text dark:text-white mb-2">
            {config.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Auto-close progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-white/5">
          <div
            className={`h-full rounded-b-2xl ${config.progressBar}`}
            style={{
              animation: `success-progress-shrink ${autoCloseMs}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(popup, document.body);
}
