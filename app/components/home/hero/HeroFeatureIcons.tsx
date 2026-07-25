type FeatureItemProps = {
  icon: React.ReactNode;
  highlight: string;
  text: string;
};

function FeatureItem({ icon, highlight, text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
      <span className="flex h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0FF]">
        {icon}
      </span>
      <span className="whitespace-nowrap text-[11px] xs:text-xs sm:text-sm leading-snug">
        <span className="block font-semibold text-midnight_text dark:text-white">{highlight}</span>
        <span className="block text-gray">{text}</span>
      </span>
    </div>
  );
}

const DocumentIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" aria-hidden>
    <path d="M7 3.5h5l3.5 3.5V16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V5A1.5 1.5 0 0 1 7 3.5Z" fill="#4236FB" opacity="0.15" />
    <path d="M7 3.5h5l3.5 3.5V16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V5A1.5 1.5 0 0 1 7 3.5Z" stroke="#4236FB" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 3.5V7h3.5M7.5 11h5M7.5 13.5h4" stroke="#4236FB" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const ApprovalIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="8" fill="#4236FB" opacity="0.15" />
    <circle cx="10" cy="10" r="8" stroke="#4236FB" strokeWidth="1.2" />
    <path d="M6.5 10l2.5 2.5 5-5" stroke="#4236FB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OnlineIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" aria-hidden>
    <rect x="3" y="5" width="14" height="9" rx="1.5" fill="#4236FB" opacity="0.15" />
    <rect x="3" y="5" width="14" height="9" rx="1.5" stroke="#4236FB" strokeWidth="1.2" />
    <path d="M7 16h6M10 14v2" stroke="#4236FB" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 8.5h8M6 11h5.5" stroke="#4236FB" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
  </svg>
);

export default function HeroFeatureIcons() {
  return (
    <div className="mt-4 sm:mt-5 flex flex-nowrap items-center gap-x-3 xs:gap-x-6 sm:gap-x-10">
      <FeatureItem icon={<DocumentIcon />} highlight="Minimal" text="Documents" />
      <FeatureItem icon={<ApprovalIcon />} highlight="Quick" text="Approval" />
      <FeatureItem icon={<OnlineIcon />} highlight="Paperless" text="Process" />
    </div>
  );
}
