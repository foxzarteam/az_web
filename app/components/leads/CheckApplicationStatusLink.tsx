import Link from "next/link";

type CheckApplicationStatusLinkProps = {
  className?: string;
  /** Close parent modal before navigating (optional). */
  onNavigate?: () => void;
};

/** Footer link under loan apply forms → customer status login. */
export default function CheckApplicationStatusLink({
  className = "",
  onNavigate,
}: CheckApplicationStatusLinkProps) {
  return (
    <p className={`text-center text-xs text-gray sm:text-sm ${className}`.trim()}>
      Already applied?{" "}
      <Link
        href="/customer/login/"
        onClick={onNavigate}
        className="font-semibold text-primary underline-offset-2 hover:underline"
      >
        Check your application status
      </Link>
    </p>
  );
}
