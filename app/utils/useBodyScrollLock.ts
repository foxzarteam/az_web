"use client";

import { useEffect } from "react";

/**
 * Nested-modal safe body scroll lock.
 * Uses overflow:hidden only (no position:fixed) so unlock does not jump the page.
 */
let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

function acquireBodyScrollLock() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    savedPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : savedPaddingRight;
  }
  lockCount += 1;
}

function releaseBodyScrollLock() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
  }
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    acquireBodyScrollLock();
    return () => {
      releaseBodyScrollLock();
    };
  }, [locked]);
}

/** Blur active element so modal close does not scroll the opener into view. */
export function blurActiveElement() {
  if (typeof document === "undefined") return;
  const el = document.activeElement;
  if (el instanceof HTMLElement && el !== document.body) {
    el.blur();
  }
}
