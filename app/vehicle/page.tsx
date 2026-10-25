import { permanentRedirect } from "next/navigation";

export default function VehicleAdsRedirectPage() {
  permanentRedirect("/products/vehicle/");
}
