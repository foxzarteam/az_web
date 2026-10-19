import LoanPageView, { loanPageMetadata } from "@/app/components/products/loans/LoanPageView";

export const metadata = loanPageMetadata("vehicle-loan");

export default function VehicleLoanPage() {
  return <LoanPageView pageKey="vehicle-loan" />;
}
