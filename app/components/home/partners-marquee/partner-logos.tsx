import type { ReactNode, SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & { title: string };

function LogoFrame({ title, children, className, ...rest }: LogoProps & { children: ReactNode }) {
  return (
    <svg
      role="img"
      viewBox="0 0 160 48"
      className={className}
      aria-label={title}
      {...rest}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

/** Kotak — Commons par clean vector nahi mila; stylised fallback */
export function LogoKotak(props: Omit<LogoProps, "title">) {
  return (
    <LogoFrame title="Kotak Mahindra Bank" {...props}>
      <rect width="160" height="48" rx="8" fill="#fff" />
      <rect x="10" y="10" width="140" height="28" rx="4" fill="#ED1C24" />
      <text x="80" y="29" fill="#fff" fontSize="11" fontFamily="system-ui,Segoe UI,sans-serif" fontWeight="700" textAnchor="middle">
        Kotak
      </text>
    </LogoFrame>
  );
}
