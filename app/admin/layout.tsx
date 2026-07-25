import type { Metadata } from "next";

/** Admin uses `cookies()` for session — must not be statically generated. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
