import LoanPageView, { loanPageMetadata } from "@/app/components/products/loans/LoanPageView";

export const metadata = loanPageMetadata("loans");

export default function LoansPage() {
  return <LoanPageView pageKey="loans" />;
}
