function BenefitIcon({ kind }: { kind: "earn" | "anywhere" | "start" | "payout" }) {
  const common = "h-7 w-7 sm:h-8 sm:w-8 text-primary";
  switch (kind) {
    case "earn":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7v10M9.5 9.5c.6-1 1.5-1.5 2.5-1.5 1.4 0 2.5.9 2.5 2s-1.1 2-2.5 2h-1c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2c1 0 1.9-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "anywhere":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "start":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M5 19 14.5 4.5 19 19l-7-2.5L5 19Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14.5 4.5 12 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "payout":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M13 3 5 13.5h5.5L11 21l8-11.5h-5.5L13 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function PartnerBenefits() {
  const benefits = [
    {
      kind: "earn" as const,
      title: "Earn Up to ₹1 Lakh+ Monthly",
      description: "Help people get financial products and earn high commissions.",
    },
    {
      kind: "anywhere" as const,
      title: "Work From Anywhere",
      description: "Run your business anytime using just your mobile.",
    },
    {
      kind: "start" as const,
      title: "Zero Investment Start",
      description: "No joining fee, no investment — start earning instantly.",
    },
    {
      kind: "payout" as const,
      title: "Fast & Secure Payouts",
      description: "Receive your earnings quickly after successful approvals.",
    },
  ];

  return (
    <section className="bg-light dark:bg-darkmode py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-midnight_text dark:text-white text-center mb-8 sm:mb-12" data-aos="fade-up">
          Why Partner With Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-white dark:bg-darklight border border-border dark:border-dark_border rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-0"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="mb-3 sm:mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12">
                <BenefitIcon kind={benefit.kind} />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-midnight_text dark:text-white mb-1.5 sm:mb-2 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-gray dark:text-gray-400 text-xs sm:text-sm leading-snug">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
