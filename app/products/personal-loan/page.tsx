import LoanPageView, { loanPageMetadata } from "@/app/components/products/loans/LoanPageView";

export const metadata = loanPageMetadata("personal-loan");

export default function PersonalLoanPage() {
  return <LoanPageView pageKey="personal-loan" />;
}
