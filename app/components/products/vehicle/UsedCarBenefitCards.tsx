const CARDS = [
  {
    title: "Up to 150%",
    text: "Loan on Your Old Vehicle",
    wrap: "bg-[#FFF1E7] text-[#F97316]",
    icon: (
      <span className="text-xl font-bold leading-none sm:text-2xl" aria-hidden>
        ₹
      </span>
    ),
  },
  {
    title: "Simple & Fast",
    text: "Approval Process",
    wrap: "bg-[#EEF0FF] text-[#4236FB]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M13 3 6 13.5h5.2L10.4 21 18 10.2h-5.1L13 3Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M13 3 6 13.5h5.2L10.4 21 18 10.2h-5.1L13 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Secure Loan &",
    text: "Low ROI",
    wrap: "bg-[#F3EEFF] text-[#7C3AED]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M12 3.8 5.8 6.4v5c0 3.8 2.6 7.1 6.2 8.2 3.6-1.1 6.2-4.4 6.2-8.2v-5L12 3.8Z"
          fill="currentColor"
          opacity="0.12"
        />
        <path
          d="M12 3.8 5.8 6.4v5c0 3.8 2.6 7.1 6.2 8.2 3.6-1.1 6.2-4.4 6.2-8.2v-5L12 3.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9.2 10.6h2.2a1.7 1.7 0 0 1 0 3.4H9.8M9.2 14h2.4a1.6 1.6 0 1 0 0-3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.4 8.8v1.6M10.4 14v1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.2 9.2v6.2M14.2 15.4 16 13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Trusted &",
    text: "Secure Partner",
    wrap: "bg-[#E7F8F1] text-[#10B981]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M12 3.5 5.5 6.2v5.2c0 4 2.7 7.4 6.5 8.6 3.8-1.2 6.5-4.6 6.5-8.6V6.2L12 3.5Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M12 3.5 5.5 6.2v5.2c0 4 2.7 7.4 6.5 8.6 3.8-1.2 6.5-4.6 6.5-8.6V6.2L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12.1 1.9 1.9 3.8-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function UsedCarBenefitCards() {
  return (
    <section id="offers" className="bg-[#F5F7FB] py-10 dark:bg-darkmode" aria-label="Used car loan benefits">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <ul data-offer-picker className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {CARDS.map((card) => (
            <li key={card.title}>
              <article className="flex h-full flex-col items-center rounded-2xl border border-[#EEF1F6] bg-white px-4 py-4 text-center shadow-[0_8px_28px_rgba(16,45,71,0.06)] dark:border-dark_border dark:bg-darklight sm:px-5 sm:py-4">
                <span className="theme-gradient-bg mb-3 rounded-full p-[2px]">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12 ${card.wrap}`}
                  >
                    {card.icon}
                  </span>
                </span>
                <h3 className="text-sm font-bold leading-snug text-midnight_text dark:text-white sm:text-[0.95rem]">
                  {card.title}
                  <span className="mt-0.5 block font-semibold">{card.text}</span>
                </h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
