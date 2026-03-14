import Image from "next/image";

export default function Testimonials() {
  return (
    <section id="about" className="dark:bg-darkmode">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md px-4 sm:px-6 lg:px-8 mx-auto py-8 sm:py-10 md:py-12 flex flex-col-reverse md:flex-row items-center justify-between max-w-full gap-8 md:gap-10">
        <div className="flex justify-between w-full min-w-0 gap-6 lg:gap-8">
          <div className="flex-1 lg:block hidden min-w-0" data-aos="fade-right">
            <Image
              src="/images/testimonial/vector-smart.png"
              alt="testimonial"
              width={451}
              height={470}
              quality={100}
              className="max-w-full h-auto w-full"
            />
          </div>
          <div className="flex-1 min-w-0 max-w-full" data-aos="fade-left">
            <Image src="/images/testimonial/quote.svg" alt="quote" className="mb-3 sm:mb-4 md:mb-6 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-[135px] lg:h-[135px]" height={135} width={135} />
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-gray mb-4 sm:mb-6 md:mb-12 leading-relaxed">
              I got my personal loan approved in 24 hours through Apni Zaroorat. The process was simple and the rates were better than what I was getting elsewhere. Highly recommend for anyone looking for loans or credit cards.
            </p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-midnight_text dark:text-white">Rahul Sharma</p>
            <p className="text-gray text-xs sm:text-sm md:text-lg lg:text-xl">Personal Loan Customer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
