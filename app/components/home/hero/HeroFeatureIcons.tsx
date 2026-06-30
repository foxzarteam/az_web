type FeatureItemProps = {
  icon: React.ReactNode;
  text: string;
};

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF0FF]">
        {icon}
      </span>
      <span className="text-xs sm:text-sm font-medium text-gray leading-snug">{text}</span>
    </div>
  );
}

const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" aria-hidden>
    <path d="M10 2l6 2.5v5c0 3.5-2.5 6-6 7.5C6.5 15.5 4 13 4 9.5v-5L10 2z" fill="#4236FB" opacity="0.15" />
    <path d="M10 2l6 2.5v5c0 3.5-2.5 6-6 7.5C6.5 15.5 4 13 4 9.5v-5L10 2z" stroke="#4236FB" strokeWidth="1.2" />
    <path d="M7.5 10l1.8 1.8L12.5 8.5" stroke="#4236FB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="8" fill="#4236FB" opacity="0.15" />
    <circle cx="10" cy="10" r="8" stroke="#4236FB" strokeWidth="1.2" />
    <path d="M10 5.5V10l3 2" stroke="#4236FB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ApprovalIcon = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="8" fill="#4236FB" opacity="0.15" />
    <circle cx="10" cy="10" r="8" stroke="#4236FB" strokeWidth="1.2" />
    <path d="M6.5 10l2.5 2.5 5-5" stroke="#4236FB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HeroFeatureIcons() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-2.5 gap-y-2 sm:gap-x-3 mb-3 sm:mb-4">
      <FeatureItem icon={<ShieldIcon />} text="Low Interest Rates" />
      <FeatureItem icon={<ApprovalIcon />} text="Quick Approval" />
      <FeatureItem icon={<ClockIcon />} text="Disbursal in 24 Hours*" />
    </div>
  );
}
