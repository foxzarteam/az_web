"use client";

import BrandedError from "@/app/components/shared/BrandedError";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <BrandedError
      code="500"
      title="Something went wrong"
      description="This page could not be loaded. You can try again, or go home to continue with loans, insurance, and calculators."
      onRetry={reset}
    />
  );
}
