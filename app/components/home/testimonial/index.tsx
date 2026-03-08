import Image from "next/image";

export default function Testimonials() {
  return (
    <section id="about" className="px-4 md:px-0 dark:bg-darkmode">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md px-4 sm:px-6 md:px-8 mx-auto py-8 sm:py-12 flex flex-col-reverse md:flex-row items-center justify-between max-w-full">
        <div className="flex justify-between w-full min-w-0">
          <div className="flex-1 lg:block hidden" data-aos="fade-right">
            <Image
              src="/images/testimonial/vector-smart.png"
              alt="testimonial"
              width={451}
              height={470}
              quality={100}
              className="max-w-full h-auto"
            />
          </div>
          <div className="flex-1 min-w-0" data-aos="fade-left">
            <Image src="/images/testimonial/quote.svg" alt="quote" className="mb-4 md:mb-6 w-20 h-20 sm:w-28 sm:h-28 md:w-[135px] md:h-[135px]" height={135} width={135} />
            <p className="text-base sm:text-lg md:text-2xl text-gray mb-6 md:mb-12">
              I got my personal loan approved in 24 hours through Apni Zaroorat. The process was simple and the rates were better than what I was getting elsewhere. Highly recommend for anyone looking for loans or credit cards.
            </p>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-midnight_text dark:text-white">Rahul Sharma</p>
            <p className="text-gray text-sm sm:text-lg md:text-xl">Personal Loan Customer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
