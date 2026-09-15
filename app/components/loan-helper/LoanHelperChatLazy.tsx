"use client";

import dynamic from "next/dynamic";

const LoanHelperChat = dynamic(
  () => import("@/app/components/loan-helper/LoanHelperChat"),
  { ssr: false },
);

export default function LoanHelperChatLazy() {
  return <LoanHelperChat />;
}
