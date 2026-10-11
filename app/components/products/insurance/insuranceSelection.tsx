"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type InsuranceSelection = {
  value: string;
  setValue: (value: string) => void;
};

const InsuranceSelectionContext = createContext<InsuranceSelection | null>(null);

export function InsuranceSelectionProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState("health_insurance");
  return (
    <InsuranceSelectionContext.Provider value={{ value, setValue }}>{children}</InsuranceSelectionContext.Provider>
  );
}

export function useInsuranceSelection(): InsuranceSelection | null {
  return useContext(InsuranceSelectionContext);
}
