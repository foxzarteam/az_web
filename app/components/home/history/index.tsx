import Image from "next/image";
import Link from "next/link";

export default function History() {
  return (
    <section className="history-bg !py-10 sm:!py-12 lg:!py-16">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md dark:text-black mx-auto grid grid-cols-1 lg:grid-cols-12 py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-full gap-8 lg:gap-0">
        <div className="col-span-1 lg:col-span-7 min-w-0" data-aos="fade-right">
          <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl text-midnight_text dark:text-white mb-4 sm:mb-6 md:mb-8 font-bold leading-tight">
            Our Story <br />
            Your financial need, our priority
          </p>
          <p className="mb-4 sm:mb-6 md:mb-8 pb-2 text-gray text-sm sm:text-base leading-relaxed">
            Apni Zaroorat helps you compare and apply for loans, insurance, and credit cards online.
            <br />
            We connect you with the best rates and quick approval—
            <br />
            all from one place.
          </p>
          <Link href="/#featured" className="text-sm sm:text-base md:text-xl px-5 sm:px-6 md:px-9 py-2.5 sm:py-3 border border-primary text-primary hover:text-white hover:bg-primary rounded-lg inline-block">
            Explore Services
          </Link>
        </div>
        <div className="flex justify-center lg:block col-span-1 lg:col-span-5" data-aos="fade-left">
          <div className="bg-white dark:bg-darklight dark:text-white p-4 sm:p-5 w-full max-w-[240px] sm:max-w-60 border-4 border-primary rounded-lg">
            <p className="mb-8 sm:mb-12 md:mb-16 text-xl sm:text-2xl md:text-3xl text-midnight_text dark:text-white font-bold">APNI ZAROORAT</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-black text-opacity-60 dark:text-gray text-sm sm:text-base">Years of Trust</p>
                <p className="text-4xl sm:text-5xl md:text-[65px] leading-[1.2] -mt-1 text-midnight_text dark:text-white font-bold mb-2">10+</p>
              </div>
              <div className="shrink-0">
                <Image src="/images/history/logo.svg" alt="company" width={93} height={130} className="w-16 h-auto sm:w-20 md:w-[93px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
