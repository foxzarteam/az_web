import Image from "next/image";

const audiences = [
  {
    title: "Existing DSA & Loan Agents",
    text: "Earn extra income by offering more financial products.",
    chip: "bg-blue-400 text-blue-950",
    icon: "briefcase",
  },
  {
    title: "Insurance Agents & Financial Advisors",
    text: "Earn additional commission through client referrals.",
    chip: "bg-emerald-400 text-emerald-950",
    icon: "shield",
  },
  {
    title: "Real Estate Agents & Property Dealers",
    text: "Earn extra income by referring customers for loans.",
    chip: "bg-amber-400 text-amber-950",
    icon: "building",
  },
  {
    title: "CA & Tax Consultants",
    text: "Generate additional income through financial referrals.",
    chip: "bg-violet-400 text-violet-950",
    icon: "calculator",
  },
  {
    title: "Small Business Owners & Shopkeepers",
    text: "Earn extra income alongside your existing business.",
    chip: "bg-teal-400 text-teal-950",
    icon: "store",
  },
  {
    title: "Freelancers & Finance Enthusiasts",
    text: "Earn money with flexible financial service opportunities.",
    chip: "bg-rose-400 text-rose-950",
    icon: "laptop",
  },
  {
    title: "Students & Freshers",
    text: "Earn while learning and building your career.",
    chip: "bg-indigo-400 text-indigo-950",
    icon: "cap",
  },
  {
    title: "Retired Professionals & Bank Employees",
    text: "Earn additional income using your experience and network.",
    chip: "bg-orange-400 text-orange-950",
    icon: "badge",
  },
  {
    title: "CSC & E-Mitra Operators",
    text: "Earn extra commission by offering financial services.",
    chip: "bg-sky-400 text-sky-950",
    icon: "id",
  },
  {
    title: "Social Media Influencers",
    text: "Monetize your audience through eligible customer referrals.",
    chip: "bg-fuchsia-400 text-fuchsia-950",
    icon: "megaphone",
  },
  {
    title: "Housewives & Homemakers",
    text: "Earn from home with flexible working opportunities.",
    chip: "bg-yellow-400 text-yellow-950",
    icon: "home",
  },
  {
    title: "Sales Professionals & Business Consultants",
    text: "Earn extra commission through successful customer referrals.",
    chip: "bg-pink-400 text-pink-950",
    icon: "chart",
  },
] as const;

function AudienceIcon({ name }: { name: (typeof audiences)[number]["icon"] }) {
  const common = "h-4 w-4 shrink-0";
  switch (name) {
    case "briefcase":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M12 3 5 6v6c0 4.2 2.8 7.4 7 9 4.2-1.6 7-4.8 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M4 20V6l8-3 8 3v14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 20v-5h6v5M4 20h16M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "calculator":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "store":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M4 10 6 4h12l2 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 10h16v10H4V10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <rect x="4" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M2 19h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "cap":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="m3 10 9-5 9 5-9 5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M7 12v4c1.6 1.3 3.6 2 5 2s3.4-.7 5-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6.5 20v-2.2A3.5 3.5 0 0 1 10 14.3h4a3.5 3.5 0 0 1 3.5 3.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "id":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13 10h5M13 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "megaphone":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M4 10v4h3l8 4V6L7 10H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M7 14.5 8.2 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="m4 11 8-7 8 7v9H4v-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7 16V9M12 16V5M17 16v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

function AudienceCard({ item }: { item: (typeof audiences)[number] }) {
  return (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80">
        <AudienceIcon name={item.icon} />
      </span>
      <div className="min-w-0">
        <h3 className="m-0 break-words text-sm font-bold leading-tight text-black">{item.title}</h3>
        <p className="m-0 break-words pt-0.5 text-xs font-medium leading-snug">{item.text}</p>
      </div>
    </>
  );
}

const collageAlt =
  "People who can become partners, including DSA and loan agents, insurance advisors, property dealers, CAs, shopkeepers, freelancers, students, retired professionals, CSC operators, influencers, homemakers, and sales consultants";

function PartnerCollage() {
  return (
    <Image
      src="/images/features/work.webp"
      alt={collageAlt}
      width={1024}
      height={1536}
      sizes="100vw"
      className="h-auto w-full rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
    />
  );
}

const imageLeft = [
  "Existing DSA & Loan Agents",
  "Real Estate Agents & Property Dealers",
  "Small Business Owners & Shopkeepers",
  "Students & Freshers",
  "CSC & E-Mitra Operators",
  "Social Media Influencers",
] as const;

const imageRight = [
  "Insurance Agents & Financial Advisors",
  "CA & Tax Consultants",
  "Freelancers & Finance Enthusiasts",
  "Retired Professionals & Bank Employees",
  "Sales Professionals & Business Consultants",
  "Housewives & Homemakers",
] as const;

export default function PartnerAudience() {
  const byTitle = new Map(audiences.map((item) => [item.title, item]));
  const left = imageLeft.map((title) => byTitle.get(title)!);
  const right = imageRight.map((title) => byTitle.get(title)!);

  return (
    <section aria-labelledby="who-can-become-dsa" className="bg-white px-4 py-10 dark:bg-darkmode sm:px-6 sm:py-14">
      <div className="container mx-auto md:max-w-screen-md lg:max-w-screen-xl">
        <h2 id="who-can-become-dsa" className="mb-6 text-center text-xl font-bold text-midnight_text dark:text-white xs:text-2xl sm:mb-8 sm:text-3xl md:text-4xl">
          Who Can Become a DSA Partner?
        </h2>

        <div className="grid items-center gap-6 lg:hidden">
          <div className="order-1 flex items-center justify-center">
            <PartnerCollage />
          </div>
          <ul className="order-2 grid grid-cols-1 gap-y-3 sm:gap-x-2.5 sm:gap-y-4 md:grid-cols-2">
            {audiences.map((item) => (
              <li
                key={item.title}
                className={`flex min-h-0 items-center gap-2.5 rounded-xl px-3 py-2 sm:gap-3 sm:px-3.5 ${item.chip}`}
              >
                <AudienceCard item={item} />
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden w-full lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-4">
          <ul className="grid grid-rows-6 gap-3">
            {left.map((item) => (
              <li key={item.title} className={`flex h-[4.75rem] items-center gap-2.5 rounded-xl px-3 ${item.chip}`}>
                <AudienceCard item={item} />
              </li>
            ))}
          </ul>
          <div className="flex h-full min-h-0 items-stretch self-stretch">
            <div className="relative h-full" style={{ aspectRatio: "1024 / 1536" }}>
              <Image
                src="/images/features/work.webp"
                alt={collageAlt}
                fill
                sizes="420px"
                className="rounded-xl object-contain shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
              />
            </div>
          </div>
          <ul className="grid grid-rows-6 gap-3">
            {right.map((item) => (
              <li key={item.title} className={`flex h-[4.75rem] items-center gap-2.5 rounded-xl px-3 ${item.chip}`}>
                <AudienceCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
