import QuickEasyProcessSection from "@/app/components/products/QuickEasyProcessSection";
import { PERSONAL_LOAN_PROCESS_STEPS } from "./quickEasyProcessSteps";

export default function QuickEasyProcess() {
  return (
    <QuickEasyProcessSection
      subtitle="Complete your application in minutes and get fast approval."
      steps={PERSONAL_LOAN_PROCESS_STEPS}
    />
  );
}
