"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hidePublicChrome } from "@/app/lib/layout/hidePublicChrome";

function ChatFabPlaceholder({
  busy = false,
  onOpen,
}: {
  busy?: boolean;
  onOpen?: () => void;
}) {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-[1000] sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={onOpen}
        disabled={busy || !onOpen}
        aria-label={busy ? "Loading Loan Advisor" : "Open Loan Advisor, 1 new message"}
        className="btn-gradient relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(66,54,251,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_28px_rgba(66,54,251,0.45)] active:scale-95 animate-pulse-subtle disabled:hover:scale-100"
      >
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#EF4444] px-1 text-[11px] font-bold leading-none text-white shadow-sm"
          aria-hidden
        >
          1
        </span>
        {busy ? (
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden
          />
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3C7.03 3 3 6.58 3 11c0 2.13 1.05 4.05 2.74 5.45L4 21l4.86-1.71C10.47 19.76 11.21 20 12 20c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

const LoanHelperChat = dynamic(
  () => import("@/app/components/loan-helper/LoanHelperChat"),
  {
    ssr: false,
    loading: () => <ChatFabPlaceholder busy />,
  },
);

/**
 * Global chat must not download on first paint.
 * Lightweight FAB only; full widget loads after click, first interaction, or idle.
 */
export default function LoanHelperChatLazy() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [openOnLoad, setOpenOnLoad] = useState(false);

  const loadChat = useCallback((open = false) => {
    if (open) setOpenOnLoad(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready || hidePublicChrome(pathname)) return;

    const onInteract = () => loadChat(false);
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    for (const event of events) {
      window.addEventListener(event, onInteract, { once: true, passive: true });
    }

    let idleId = 0;
    let timeoutId = 0;
    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(() => loadChat(false), { timeout: 5000 });
    } else {
      timeoutId = window.setTimeout(() => loadChat(false), 5000);
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, onInteract);
      }
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [loadChat, pathname, ready]);

  if (hidePublicChrome(pathname)) return null;
  if (!ready) {
    return <ChatFabPlaceholder onOpen={() => loadChat(true)} />;
  }

  return <LoanHelperChat initialOpen={openOnLoad} />;
}
