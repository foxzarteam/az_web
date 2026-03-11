import Link from "next/link";
import { CONTACT } from "@/app/config/constants";

export default function Location() {
  return (
    <section className="bg-primary lg:py-24 py-16 px-4">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
        <div className="grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-7 border-b border-solid border-white border-opacity-50 pb-11">
          <div className="col-span-3">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl leading-[1.2] font-bold">Apni Zaroorat</h2>
          </div>
          <div className="col-span-3">
            <p className="text-xl text-white text-opacity-80 font-normal max-w-64">
              Apni Zaroorat – Loans, Insurance & Credit Cards Online
            </p>
          </div>
          <div className="col-span-3">
            <Link href={`mailto:${CONTACT.EMAIL}`} className="text-xl text-white font-medium underline block mb-2">
              {CONTACT.EMAIL}
            </Link>
            <Link href={`tel:${CONTACT.PHONE}`} className="text-xl text-white text-opacity-80 flex items-center gap-2 hover:text-opacity-100 w-fit">
              <span className="text-white text-opacity-60">Call</span>
              {CONTACT.PHONE}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
