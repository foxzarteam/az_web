import { COMPANY_STATS } from "@/app/config/constants";

const AOS_DELAYS = {
  RIGHT: "fade-right",
  UP: "fade-up",
  LEFT: "fade-left",
} as const;

export default function CompanyInfo() {
  return (
    <div className="dark:bg-darkmode pt-12 sm:pt-16 md:pt-20">
      <div className="w-full bg-primary">
        <div className="container lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {COMPANY_STATS.map((stat, index) => {
              const aosDelay = index === 0 ? AOS_DELAYS.RIGHT : index === 1 ? AOS_DELAYS.UP : AOS_DELAYS.LEFT;
              return (
                <div
                  key={index}
                  className={`flex lg:flex-row flex-col justify-center items-center ${index < COMPANY_STATS.length - 1 ? "md:border-r border-white/20" : ""} py-6 sm:py-8 md:py-10 px-4`}
                  data-aos={aosDelay}
                >
                  <p className="text-4xl sm:text-5xl md:text-[60px] leading-[1.2] mr-0 md:mr-4 mb-1 md:mb-0 text-white">{stat.value}</p>
                  <p className="text-lg sm:text-xl md:text-2xl text-white text-center md:text-left">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
