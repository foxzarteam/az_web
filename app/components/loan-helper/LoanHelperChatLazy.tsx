"use client";

import dynamic from "next/dynamic";

/** Client boundary so root layout can skip SSR for the chat widget. */
const LoanHelperChat = dynamic(
  () => import("@/app/components/loan-helper/LoanHelperChat"),
  { ssr: false },
);

export default function LoanHelperChatLazy() {
  return <LoanHelperChat />;
}
