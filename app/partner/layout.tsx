import type { Metadata } from "next";

/** Partner portal uses the same admin session cookie — must not be statically generated. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function PartnerSegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
