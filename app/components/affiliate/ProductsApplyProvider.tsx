"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { captureAffiliateCodeFromLocation } from "@/app/lib/affiliate/refCookie";

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

/** Products hub apply buttons go to the product page. Partner code stays in the tab session. */
export default function ProductsApplyProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const openPersonalLoan = useCallback(() => {
    captureAffiliateCodeFromLocation();
    router.push("/products/personal-loan/");
  }, [router]);

  const openInsurance = useCallback(() => {
    captureAffiliateCodeFromLocation();
    router.push("/products/insurance/");
  }, [router]);

  const value = useMemo(
    () => ({ openPersonalLoan, openInsurance }),
    [openPersonalLoan, openInsurance],
  );

  return <ProductsApplyContext.Provider value={value}>{children}</ProductsApplyContext.Provider>;
}
