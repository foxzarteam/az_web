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
                  className={`flex flex-row justify-center items-center gap-2 sm:gap-0 ${index < COMPANY_STATS.length - 1 ? "sm:border-r border-white/20" : ""} py-5 sm:py-6 md:py-8 lg:py-10 px-4`}
                  data-aos={aosDelay}
                >
                  <p className="text-3xl xs:text-4xl sm:text-5xl md:text-[60px] leading-[1.2] mr-0 md:mr-4 mb-0 text-white shrink-0">{stat.value}</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center md:text-left">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
