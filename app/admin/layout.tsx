/** Admin uses `cookies()` for session — must not be statically generated. */
export const dynamic = "force-dynamic";

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
