import type { ReactNode } from "react";

type StripItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

function IconWell({ children }: { children: ReactNode }) {
  return (
    <span className="btn-gradient btn-shine relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-[0_4px_18px_rgba(66,54,251,0.4)]">
      <span className="relative z-[1] text-white">{children}</span>
    </span>
  );
}

function IconPrivacy() {
  return (
    <svg viewBox="0 0 20 20" className="h-[19px] w-[19px]" fill="none" aria-hidden>
      <path d="M10 2l6 2.5v5c0 3.5-2.5 6-6 7.5C6.5 15.5 4 13 4 9.5v-5L10 2z" fill="white" opacity="0.18" />
      <path d="M10 2l6 2.5v5c0 3.5-2.5 6-6 7.5C6.5 15.5 4 13 4 9.5v-5L10 2z" stroke="white" strokeWidth="1.2" />
      <rect x="8.5" y="9.5" width="3" height="4" rx="0.6" stroke="white" strokeWidth="1.1" />
      <path d="M9.3 9.5V8.8a0.7 0.7 0 0 1 1.4 0v0.7" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function IconDocuments() {
  return (
    <svg viewBox="0 0 20 20" className="h-[19px] w-[19px]" fill="none" aria-hidden>
      <path
        d="M7 3.5h5l3.5 3.5V16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="white"
        opacity="0.15"
      />
      <path
        d="M7 3.5h5l3.5 3.5V16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M12 3.5V7h3.5M7.5 11h5M7.5 13.5h4" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function IconFastProcessing() {
  return (
    <svg viewBox="0 0 20 20" className="h-[19px] w-[19px]" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.5" fill="white" opacity="0.15" />
      <circle cx="10" cy="10" r="7.5" stroke="white" strokeWidth="1.2" />
      <path
        d="M11.2 5.5 8.2 11h2.7l-0.9 3.8L12.8 10H10l1.2-4.5Z"
        fill="white"
        stroke="white"
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconOnline() {
  return (
    <svg viewBox="0 0 20 20" className="h-[19px] w-[19px]" fill="none" aria-hidden>
      <rect x="3" y="5" width="14" height="9" rx="1.5" stroke="white" strokeWidth="1.2" />
      <path d="M7 16h6M10 14v2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 8.5h8M6 11h5.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

const STRIP_ITEMS: StripItem[] = [
  {
    title: "100% Online Process",
    description: "Complete your application from anywhere.",
    icon: (
      <IconWell>
        <IconOnline />
      </IconWell>
    ),
  },
  {
    title: "Minimal Documents",
    description: "Simple process with minimal paperwork.",
    icon: (
      <IconWell>
        <IconDocuments />
      </IconWell>
    ),
  },
  {
    title: "Fast Processing",
    description: "Quick processing to help you save time.",
    icon: (
      <IconWell>
        <IconFastProcessing />
      </IconWell>
    ),
  },
  {
    title: "Privacy Protected",
    description: "Your data is 100% safe and confidential.",
    icon: (
      <IconWell>
        <IconPrivacy />
      </IconWell>
    ),
  },
];

export default function HeroTrustStrip() {
  return (
    <div className="relative z-10 mt-5 w-full sm:mt-6 lg:mt-7">
      <div className="w-full border-y border-white/[0.08] bg-gradient-to-r from-[#0a1020] via-[#111827] to-[#0a1020] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STRIP_ITEMS.map((item, index) => (
            <div
              key={item.title}
              className={[
                "flex items-center gap-3.5 px-5 py-4 sm:gap-4 sm:px-8 sm:py-[18px] lg:px-10 lg:py-5",
                index < STRIP_ITEMS.length - 1 ? "border-b border-white/[0.07]" : "",
                index % 2 === 0 && index < STRIP_ITEMS.length - 1 ? "sm:border-r sm:border-white/[0.07]" : "",
                index < 2 ? "sm:border-b sm:border-white/[0.07] lg:border-b-0" : "",
                index < STRIP_ITEMS.length - 1 ? "lg:border-b-0 lg:border-r lg:border-white/[0.07]" : "",
              ].join(" ")}
            >
              {item.icon}
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight text-white sm:text-sm">{item.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400 sm:text-xs">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
