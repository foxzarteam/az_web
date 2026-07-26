import Image from "next/image";

const FEATURES = [
  {
    title: "Secure",
    description: "Your data is 100% safe with us",
    iconWrapClass: "bg-[#EEF0FF] text-[#4236FB]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden>
        <path
          d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M12 3 5 6v6c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="m9 11.5 2.2 2.2L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Fast",
    description: "Quick application and approval",
    iconWrapClass: "bg-[#FEF5E7] text-[#F59E0B]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden>
        <path
          d="M13 2 5 13.5h5.5L11 22l8-11.5h-5.5L13 2Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M13 2 5 13.5h5.5L11 22l8-11.5h-5.5L13 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Transparent",
    description: "No hidden charges, no surprises",
    iconWrapClass: "bg-[#FDEBEC] text-[#EF4444]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden>
        <circle cx="9" cy="8.5" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 19c.6-3 2.9-4.5 5.5-4.5s4.9 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16.5" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.5 14.7c2.4.2 4.4 1.6 5 4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AboutIntro() {
  return (
    <section className="overflow-x-hidden bg-white dark:bg-darkmode">
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Left copy */}
          <div className="order-1 min-w-0 lg:col-span-5" data-aos="fade-right">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              About Us
            </span>

            <h2 className="mt-2 max-w-full font-bold !leading-[1.25] text-midnight_text dark:text-white !text-[clamp(1.125rem,4.8vw+0.25rem,2.75rem)]">
              <span className="block whitespace-nowrap">We Are Here to Simplify</span>
              <span className="mt-1 block whitespace-nowrap sm:mt-1.5">
                Your <span className="theme-gradient-text">Loan Journey</span>
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray sm:mt-5 sm:text-base">
              Apni Zaroorat is a digital platform that connects you with trusted
              lending partners to help you get the right personal loan with
              ease, transparency and security.
            </p>

            <div className="mt-6 flex flex-nowrap items-start gap-1.5 sm:mt-8 sm:gap-2.5">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex min-w-0 flex-1 items-start gap-1.5 sm:gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${feature.iconWrapClass}`}
                  >
                    {feature.icon}
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-[11px] font-bold leading-tight text-midnight_text dark:text-white sm:text-sm">
                      {feature.title}
                    </span>
                    <span className="mt-0.5 block text-[9px] leading-snug text-gray sm:text-[11px] sm:leading-snug">
                      {feature.description}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual — image with cards column beside it, like mock */}
          <div
            className="order-2 mx-auto flex w-full max-w-[560px] flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-4 lg:col-span-7 lg:mx-0 lg:ml-auto lg:max-w-[660px] lg:gap-6"
            data-aos="fade-left"
          >
            <Image
              src="/images/hero/about.webp"
              alt="Apni Zaroorat - simplifying your loan journey"
              width={696}
              height={848}
              className="block h-auto w-full max-w-[320px] object-contain sm:min-w-0 sm:flex-1 sm:max-w-none"
              sizes="(max-width: 640px) 320px, 340px"
              priority
            />

            <div className="flex w-full shrink-0 flex-col gap-4 sm:w-[220px] sm:gap-5 lg:w-[240px]">
              {/* Quote card */}
              <div className="rounded-2xl bg-white p-4 shadow-[0_10px_36px_rgba(16,45,71,0.12)] dark:bg-darklight sm:p-5">
                <svg viewBox="0 0 24 24" className="mb-2 h-6 w-6 text-[#FF7E29]" fill="currentColor" aria-hidden>
                  <path d="M5 16c-1.1 0-2-.9-2-2 0-3.9 2.3-7.2 5.6-8.8l.9 1.7C7.2 8.2 5.8 10 5.4 12H7c1.1 0 2 .9 2 2v2H5v0Zm10 0c-1.1 0-2-.9-2-2 0-3.9 2.3-7.2 5.6-8.8l.9 1.7c-2.3 1.3-3.7 3.1-4.1 5.1H17c1.1 0 2 .9 2 2v2h-4v0Z" />
                </svg>
                <p className="text-base font-semibold leading-relaxed text-midnight_text dark:text-white sm:text-lg">
                  Every Great Journey Begins with a Single Step. Let Us Help You
                  Take Yours.
                </p>
                <p className="mt-2 text-xs font-semibold text-gray sm:text-[13px]">– Team Apni Zaroorat</p>
              </div>

              {/* Customer First badge */}
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_10px_36px_rgba(16,45,71,0.12)] dark:bg-darklight">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                    <circle cx="9" cy="8.5" r="2.5" fill="currentColor" />
                    <path d="M4.5 17c.5-2.6 2.3-4 4.5-4s4 1.4 4.5 4" fill="currentColor" />
                    <circle cx="15.5" cy="9.5" r="2" fill="currentColor" />
                    <path d="M14.5 13.4c1.9.3 3.4 1.5 3.9 3.6" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-sm font-bold leading-tight text-midnight_text dark:text-white">
                  Customer First
                  <br />
                  Always
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
