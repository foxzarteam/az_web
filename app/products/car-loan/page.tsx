import { permanentRedirect } from "next/navigation";

export default function CarLoanRedirectPage() {
  permanentRedirect("/products/vehicle-loan/");
}
