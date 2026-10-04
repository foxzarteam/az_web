import Image from "next/image";

const audiences = [
  {
    title: "Existing DSA & Loan Agents",
    text: "Earn extra income by offering more financial products.",
    chip: "bg-blue-400 text-blue-950",
    image: "/images/work/1.webp",
  },
  {
    title: "Insurance Agents & Financial Advisors",
    text: "Earn additional commission through client referrals.",
    chip: "bg-emerald-400 text-emerald-950",
    image: "/images/work/2.webp",
  },
  {
    title: "Real Estate Agents & Property Dealers",
    text: "Earn extra income by referring customers for loans.",
    chip: "bg-amber-400 text-amber-950",
    image: "/images/work/3.webp",
  },
  {
    title: "CA & Tax Consultants",
    text: "Generate additional income through financial referrals.",
    chip: "bg-violet-400 text-violet-950",
    image: "/images/work/4.webp",
  },
  {
    title: "Small Business Owners & Shopkeepers",
    text: "Earn extra income alongside your existing business.",
    chip: "bg-teal-400 text-teal-950",
    image: "/images/work/5.webp",
  },
  {
    title: "Freelancers & Finance Enthusiasts",
    text: "Earn money with flexible financial service opportunities.",
    chip: "bg-rose-400 text-rose-950",
    image: "/images/work/6.webp",
  },
  {
    title: "Students & Freshers",
    text: "Earn while learning and building your career.",
    chip: "bg-indigo-400 text-indigo-950",
    image: "/images/work/7.webp",
  },
  {
    title: "Retired Professionals & Bank Employees",
    text: "Earn additional income using your experience and network.",
    chip: "bg-orange-400 text-orange-950",
    image: "/images/work/8.webp",
  },
  {
    title: "CSC & E-Mitra Operators",
    text: "Earn extra commission by offering financial services.",
    chip: "bg-sky-400 text-sky-950",
    image: "/images/work/9.webp",
  },
  {
    title: "Social Media Influencers",
    text: "Monetize your audience through eligible customer referrals.",
    chip: "bg-fuchsia-400 text-fuchsia-950",
    image: "/images/work/10.webp",
  },
  {
    title: "Housewives & Homemakers",
    text: "Earn from home with flexible working opportunities.",
    chip: "bg-yellow-400 text-yellow-950",
    image: "/images/work/12.webp",
  },
  {
    title: "Sales Professionals & Business Consultants",
    text: "Earn extra commission through successful customer referrals.",
    chip: "bg-pink-400 text-pink-950",
    image: "/images/work/11.webp",
  },
] as const;

function AudienceCard({ item }: { item: (typeof audiences)[number] }) {
  return (
    <li className={`flex items-center gap-3 rounded-xl px-3 py-2 ${item.chip}`}>
      <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-white/80">
        <Image src={item.image} alt="" fill sizes="96px" className="object-contain" />
      </span>
      <div className="min-w-0">
        <h3 className="m-0 text-sm font-bold leading-tight text-black">{item.title}</h3>
        <p className="m-0 pt-0.5 text-xs font-medium leading-snug">{item.text}</p>
      </div>
    </li>
  );
}

export default function PartnerAudience() {
  const left = audiences.slice(0, 6);
  const right = audiences.slice(6);

  return (
    <section aria-labelledby="who-can-become-dsa" className="bg-light px-4 py-10 dark:bg-darkmode sm:px-6 sm:py-14">
      <div className="container mx-auto md:max-w-screen-md lg:max-w-screen-xl">
        <h2 id="who-can-become-dsa" className="mb-6 text-center text-xl font-bold text-midnight_text dark:text-white xs:text-2xl sm:mb-8 sm:text-3xl md:text-4xl">
          Who Can Become a DSA Partner?
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <ul className="grid gap-3">
            {left.map((item) => (
              <AudienceCard key={item.title} item={item} />
            ))}
          </ul>
          <ul className="grid gap-3">
            {right.map((item) => (
              <AudienceCard key={item.title} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
