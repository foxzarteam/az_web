"use client";

import { useProductsApply } from "@/app/components/affiliate/ProductsApplyProvider";

/** Bottom CTA on products hub — opens apply modals (does not leave partner `/r/CODE` URL). */
export default function ProductsHubReadyCta() {
  const { openPersonalLoan, openInsurance } = useProductsApply();

  return (
    <section className="!m-0 !mb-0 w-full !rounded-none bg-[#FFF1E7] !px-0 !py-0 dark:bg-darklight">
      <div
        className="mx-auto flex w-full max-w-full flex-col items-center gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-0 xl:px-16"
        data-aos="fade-up"
      >
        <div className="hidden shrink-0 items-center self-center lg:flex lg:py-6">
          <div className="flex h-[190px] w-[190px] items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_28px_rgba(16,45,71,0.1)] xl:h-[210px] xl:w-[210px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/about_foot.webp"
              alt=""
              width={320}
              height={320}
              className="block h-full w-full object-contain object-center p-3"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center lg:py-8 lg:text-left">
          <h2 className="!text-lg font-bold !text-midnight_text dark:!text-white sm:!text-xl md:!text-2xl">
            Ready to apply?
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-base">
            Start a personal loan or insurance application — simple, digital, and secure.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 xs:w-auto xs:flex-row sm:gap-4 lg:shrink-0 lg:py-8">
          <button
            type="button"
            onClick={openPersonalLoan}
            className="btn-gradient btn-shine relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(66,54,251,0.3)] transition duration-300 sm:px-7 sm:py-3.5 sm:text-base"
          >
            Personal loan
          </button>
          <button
            type="button"
            onClick={openInsurance}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-primary/30 bg-white px-6 py-3 text-sm font-bold text-primary transition duration-300 hover:border-primary hover:bg-primary/5 dark:bg-darkmode dark:text-white sm:px-7 sm:py-3.5 sm:text-base"
          >
            Insurance
          </button>
        </div>
      </div>
    </section>
  );
}
