import Link from "next/link";
import { CONTACT } from "@/app/config/constants";

export default function Location() {
  return (
    <section className="theme-gradient-bg lg:py-24 py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-9 gap-6 sm:gap-6 md:gap-7 border-b border-solid border-white border-opacity-50 pb-8 sm:pb-11">
          <div className="sm:col-span-2 md:col-span-3">
            <h2 className="text-white text-xl xs:text-2xl sm:text-3xl md:text-4xl leading-[1.2] font-bold">
              Apni Zaroorat
            </h2>
          </div>

          <div className="sm:col-span-2 md:col-span-3 min-w-0">
            <Link
              href={`mailto:${CONTACT.EMAIL}`}
              className="text-base sm:text-lg md:text-xl text-white font-medium underline block mb-2 break-all"
            >
              {CONTACT.EMAIL}
            </Link>
            <Link
              href={`tel:${CONTACT.PHONE_TEL}`}
              className="text-base sm:text-lg md:text-xl text-white text-opacity-80 flex items-center gap-2 hover:text-opacity-100 w-fit"
            >
              <span className="text-white text-opacity-60">Call</span>
              {CONTACT.PHONE}
            </Link>
          </div>

          <div className="sm:col-span-2 md:col-span-3 min-w-0 text-left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/70 sm:text-base">
              Products
            </p>
            <div className="flex flex-col items-start gap-1.5">
              <Link
                href="/products/personal-loan/"
                className="text-sm sm:text-base text-white font-medium hover:underline underline-offset-4"
              >
                Personal Loan
              </Link>
              <Link
                href="/products/insurance/"
                className="text-sm sm:text-base text-white font-medium hover:underline underline-offset-4"
              >
                Insurance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
