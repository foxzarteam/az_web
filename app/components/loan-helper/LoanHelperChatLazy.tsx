"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LoanHelperChat = dynamic(
  () => import("@/app/components/loan-helper/LoanHelperChat"),
  { ssr: false },
);

/** Render after mount so SSR HTML stays empty and matches the first client paint. */
export default function LoanHelperChatLazy() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) return null;
  return <LoanHelperChat />;
}
