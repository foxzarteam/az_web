import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
  title: "Agent portal",
};

export default function AgentSegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
