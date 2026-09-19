"use client";

import BrandedError from "@/app/components/shared/BrandedError";
import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body className="min-h-[100dvh] bg-[#F3F5FB]">
        <BrandedError
          code="500"
          title="Something went wrong"
          description="Apni Zaroorat could not load this page. Try again, or go home to continue."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
