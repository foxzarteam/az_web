"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const PersonalLoanApplyModal = dynamic(
  () => import("@/app/components/leads/PersonalLoanApplyModal"),
  { ssr: false },
);
const InsuranceApplyModal = dynamic(
  () => import("@/app/components/leads/InsuranceApplyModal"),
  { ssr: false },
);

type ProductsApplyContextValue = {
  openPersonalLoan: () => void;
  openInsurance: () => void;
};

const ProductsApplyContext = createContext<ProductsApplyContextValue | null>(null);

export function useProductsApply(): ProductsApplyContextValue {
  const ctx = useContext(ProductsApplyContext);
  if (!ctx) {
    throw new Error("useProductsApply must be used within ProductsApplyProvider");
  }
  return ctx;
}

/** Shared apply modals for products hub (cards + bottom CTA) so partner `/r/CODE` URL stays. */
export default function ProductsApplyProvider({ children }: { children: ReactNode }) {
  const [loanOpen, setLoanOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);

  const openPersonalLoan = useCallback(() => setLoanOpen(true), []);
  const openInsurance = useCallback(() => setInsuranceOpen(true), []);

  const value = useMemo(
    () => ({ openPersonalLoan, openInsurance }),
    [openPersonalLoan, openInsurance],
  );

  return (
    <ProductsApplyContext.Provider value={value}>
      {children}
      <PersonalLoanApplyModal open={loanOpen} onClose={() => setLoanOpen(false)} />
      <InsuranceApplyModal open={insuranceOpen} onClose={() => setInsuranceOpen(false)} />
    </ProductsApplyContext.Provider>
  );
}
