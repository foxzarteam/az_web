import Link from "next/link";
import { CONTACT } from "@/app/config/constants";

export default function Location() {
  return (
    <section className="bg-primary lg:py-24 py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-9 gap-4 sm:gap-6 md:gap-7 border-b border-solid border-white border-opacity-50 pb-8 sm:pb-11">
          <div className="sm:col-span-2 md:col-span-3">
            <h2 className="text-white text-xl xs:text-2xl sm:text-3xl md:text-4xl leading-[1.2] font-bold">Apni Zaroorat</h2>
          </div>
          <div className="sm:col-span-2 md:col-span-3 min-w-0">
            <p className="text-base sm:text-lg md:text-xl text-white text-opacity-80 font-normal max-w-full md:max-w-64">
              Apni Zaroorat – Loans, Insurance & Credit Cards Online
            </p>
          </div>
          <div className="sm:col-span-2 md:col-span-3 min-w-0">
            <Link href={`mailto:${CONTACT.EMAIL}`} className="text-base sm:text-lg md:text-xl text-white font-medium underline block mb-2 break-all">
              {CONTACT.EMAIL}
            </Link>
            <Link href={`tel:${CONTACT.PHONE}`} className="text-base sm:text-lg md:text-xl text-white text-opacity-80 flex items-center gap-2 hover:text-opacity-100 w-fit">
              <span className="text-white text-opacity-60">Call</span>
              {CONTACT.PHONE}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
