import Link from "next/link";

const DISCLAIMER_TEXT =
  "⚠️ Disclaimer: Apni Zaroorat is a completely free platform. We NEVER ask for advance payments, cash deposits, or upfront fees. Beware of fraudsters.";

/**
 * Slim yellow ticker above footer.
 * Must NOT use <section> — globals.css applies huge py-* to every section.
 */
export default function HomeDisclaimerBanner() {
  const chunk = (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap px-6 text-[13px] font-semibold leading-none text-[#78350f] sm:text-sm">
      {DISCLAIMER_TEXT}
      <span className="mx-6 text-[#b45309]" aria-hidden>
        •
      </span>
    </span>
  );

  return (
    <div
      role="note"
      aria-label="Fraud disclaimer"
      className="disclaimer-banner relative z-[1] w-full overflow-hidden border-y border-[#f59e0b] bg-[#fef08a] !py-0"
      style={{ height: 38, maxHeight: 38, paddingTop: 0, paddingBottom: 0 }}
    >
      <p className="sr-only">
        {DISCLAIMER_TEXT}{" "}
        <Link href="/disclaimer/">Read full disclaimer</Link>
      </p>
      <div
        className="flex h-full items-center overflow-hidden"
        style={{ height: 38 }}
        aria-hidden
      >
        <div className="disclaimer-marquee-track flex h-full w-max flex-nowrap items-center">
          {chunk}
          {chunk}
          {chunk}
          {chunk}
        </div>
      </div>
    </div>
  );
}
