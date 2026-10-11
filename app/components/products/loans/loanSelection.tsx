"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type LoanSelection = {
  slug: string;
  setSlug: (slug: string) => void;
};

const LoanSelectionContext = createContext<LoanSelection | null>(null);

export function LoanSelectionProvider({
  children,
  initialSlug = "personal-loan",
}: {
  children: ReactNode;
  initialSlug?: string;
}) {
  const [slug, setSlug] = useState(initialSlug);
  return <LoanSelectionContext.Provider value={{ slug, setSlug }}>{children}</LoanSelectionContext.Provider>;
}

export function useLoanSelection(): LoanSelection | null {
  return useContext(LoanSelectionContext);
}
