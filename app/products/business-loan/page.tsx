import LoanPageView, { loanPageMetadata } from "@/app/components/products/loans/LoanPageView";

export const metadata = loanPageMetadata("business-loan");

export default function BusinessLoanPage() {
  return <LoanPageView pageKey="business-loan" />;
}
