import QuickEasyProcessSection from "@/app/components/products/QuickEasyProcessSection";
import { INSURANCE_PROCESS_STEPS } from "./quickEasyProcessSteps";

export default function QuickEasyProcess() {
  return (
    <QuickEasyProcessSection
      subtitle="Get the right insurance cover in just a few simple steps."
      steps={INSURANCE_PROCESS_STEPS}
    />
  );
}
