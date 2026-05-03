import { COMPANY_STATS } from "@/app/config/constants";

const AOS_DELAYS = {
  RIGHT: "fade-right",
  UP: "fade-up",
  LEFT: "fade-left",
} as const;

export default function CompanyInfo() {
  return (
    <div className="dark:bg-darkmode pt-0">
      <div className="w-full bg-primary">
        <div className="container lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
            {COMPANY_STATS.map((stat, index) => {
              const aosDelay = index === 0 ? AOS_DELAYS.RIGHT : index === 1 ? AOS_DELAYS.UP : AOS_DELAYS.LEFT;
              return (
                <div
                  key={index}
                  className={`flex flex-row justify-center items-center gap-1.5 sm:gap-0 ${index < COMPANY_STATS.length - 1 ? "sm:border-r border-white/20" : ""} py-4 sm:py-6 md:py-8 lg:py-10 px-2 sm:px-4`}
                  data-aos={aosDelay}
                >
                  <p className="text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3rem] leading-[1.15] mr-0 md:mr-4 mb-0 text-white shrink-0 tabular-nums tracking-tight">
                    {stat.value}
                  </p>
                  <p className="min-w-0 text-[10px] leading-snug text-white/95 xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center md:text-left">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
