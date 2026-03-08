import Image from "next/image";
import Link from "next/link";

export default function History() {
  return (
    <section className="history-bg !py-12 lg:!py-16">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md dark:text-black mx-auto grid grid-cols-1 lg:grid-cols-12 py-8 lg:py-10 px-4 sm:px-4 max-w-full">
        <div className="col-span-1 lg:col-span-7" data-aos="fade-right">
          <p className="text-2xl sm:text-3xl md:text-4xl text-midnight_text dark:text-white mb-6 sm:mb-8 font-bold">
            Our Story <br />
            Your financial need, our priority
          </p>
          <p className="mb-6 sm:mb-8 pb-2 text-gray text-sm sm:text-base">
            Apni Zaroorat helps you compare and apply for loans, insurance, and credit cards online. We connect you with the best rates and quick approval—all from one place.
          </p>
          <Link href="/#featured" className="text-base sm:text-xl px-6 sm:px-9 py-2.5 sm:py-3 border border-primary text-primary hover:text-white hover:bg-primary rounded-lg inline-block">
            Explore Services
          </Link>
        </div>
        <div className="hidden lg:block col-span-1 lg:col-span-5" data-aos="fade-left">
          <div className="bg-white dark:bg-darklight dark:text-white p-4 max-w-60 border-4 border-primary rounded-lg">
            <p className="mb-16 text-3xl text-midnight_text dark:text-white font-bold">APNI ZAROORAT</p>
            <div className="flex justify-between">
              <div>
                <p className="text-black text-opacity-60 dark:text-gray">Years of Trust</p>
                <p className="text-[65px] leading-[1.2] -mt-1 text-midnight_text dark:text-white font-bold mb-2">10+</p>
              </div>
              <div>
                <Image src="/images/history/logo.svg" alt="company" width={93} height={130} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
