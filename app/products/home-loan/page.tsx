import LoanPageView, { loanPageMetadata } from "@/app/components/products/loans/LoanPageView";

export const metadata = loanPageMetadata("home-loan");

export default function HomeLoanPage() {
  return <LoanPageView pageKey="home-loan" />;
}
