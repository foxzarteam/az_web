const CARDS = [
  {
    title: "Our Mission",
    description:
      "To simplify the way people access credit by offering a seamless, secure and transparent platform that connects borrowers with the most suitable loan options.",
    cardClass: "bg-[#EEF0FF] dark:bg-darklight",
    iconClass: "text-primary",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        <path d="M12 3V1.5M21 12h1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Our Vision",
    description:
      "To become India's most trusted digital lending platform, empowering millions of individuals to fulfill their financial needs and aspirations.",
    cardClass: "bg-[#FFF1E7] dark:bg-darklight",
    iconClass: "text-[#FF7E29]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <path
          d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export default function MissionVision() {
  return (
    <section className="bg-white !pt-0 dark:bg-darkmode">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mb-8 text-center sm:mb-10" data-aos="fade-up">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl">
            Our <span className="theme-gradient-text">Mission &amp; Vision</span>
          </h2>
          <span className="theme-gradient-bg mx-auto mt-3 block h-1 w-14 rounded-full" aria-hidden />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className={`flex items-start gap-4 rounded-2xl p-5 sm:gap-5 sm:p-7 ${card.cardClass}`}
              data-aos="fade-up"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(16,45,71,0.1)] dark:bg-darkmode sm:h-14 sm:w-14 ${card.iconClass}`}
              >
                {card.icon}
              </span>
              <div className="min-w-0">
                <h3 className="!text-base font-bold !text-midnight_text dark:!text-white sm:!text-lg">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray dark:text-gray-400 sm:mt-2 sm:text-[15px]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
