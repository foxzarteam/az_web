"use client";

import { useEffect, useState } from "react";
import { SCROLL_THRESHOLD } from "@/app/config/constants";
import { scrollToTop as scrollToTopUtil } from "@/app/utils/scroll";

function getScrollVisibility(): boolean {
  return typeof window !== "undefined" && window.pageYOffset > SCROLL_THRESHOLD;
}

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(getScrollVisibility());
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[999]">
      {isVisible && (
        <button
          type="button"
          onClick={() => scrollToTopUtil()}
          aria-label="Scroll to top"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-[#102C46] text-white shadow-md transition hover:opacity-90"
        >
          <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white" />
        </button>
      )}
    </div>
  );
}
