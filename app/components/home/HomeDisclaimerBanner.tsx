import Link from "next/link";
import type { CSSProperties } from "react";

const DISCLAIMER_TEXT =
  "⚠️ Disclaimer: Apni Zaroorat is a completely free platform. We NEVER ask for advance payments, cash deposits, or upfront fees. Beware of fraudsters.";

const bannerStyle: CSSProperties = {
  width: "100%",
  height: 40,
  maxHeight: 40,
  margin: 0,
  padding: 0,
  overflow: "hidden",
  backgroundColor: "#fef08a",
  borderTop: "1px solid #f59e0b",
  borderBottom: "1px solid #f59e0b",
  position: "relative",
  zIndex: 1,
};

const trackStyle: CSSProperties = {
  display: "flex",
  width: "max-content",
  height: 40,
  alignItems: "center",
  flexWrap: "nowrap",
  animation: "az-disclaimer-scroll 40s linear infinite",
};

const groupStyle: CSSProperties = {
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  height: 40,
  flexWrap: "nowrap",
};

const itemStyle: CSSProperties = {
  display: "inline-flex",
  flexShrink: 0,
  alignItems: "center",
  height: 40,
  padding: "0 24px",
  whiteSpace: "nowrap",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "40px",
  color: "#78350f",
  overflowWrap: "normal",
  wordBreak: "keep-all",
};

/** Slim yellow ticker above footer. Styles are inline so global CSS cannot break it. */
export default function HomeDisclaimerBanner() {
  const item = (
    <span style={itemStyle}>
      {DISCLAIMER_TEXT}
      <span style={{ marginLeft: 24, color: "#b45309" }} aria-hidden>
        •
      </span>
    </span>
  );

  const group = (
    <div style={groupStyle}>
      {item}
      {item}
      {item}
    </div>
  );

  return (
    <div style={bannerStyle} role="note" aria-label="Fraud disclaimer">
      <style>{`
        @keyframes az-disclaimer-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <p className="sr-only">
        {DISCLAIMER_TEXT}{" "}
        <Link href="/disclaimer/">Read full disclaimer</Link>
      </p>
      <div style={trackStyle} aria-hidden>
        {group}
        {group}
      </div>
    </div>
  );
}
