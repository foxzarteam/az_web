import LoanPageView, { loanPageMetadata } from "@/app/components/products/loans/LoanPageView";

export const metadata = loanPageMetadata("car-loan");

export default function CarLoanPage() {
  return <LoanPageView pageKey="car-loan" />;
}
