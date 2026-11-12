"use client";

import Image from "next/image";

const CARDS = [
  { id: "hdfc", name: "HDFC Bank", src: "/images/card/HDFC.webp" },
  { id: "idfc", name: "IDFC FIRST", src: "/images/card/IDFC.webp" },
  { id: "idfc-fd", name: "IDFC FIRST FD", src: "/images/card/IDFC_FD.webp" },
  { id: "sbi", name: "SBI Card", src: "/images/card/SBI.webp" },
  { id: "axis", name: "Axis Bank", src: "/images/card/Axis.webp" },
  { id: "au", name: "AU Bank", src: "/images/card/AU.webp" },
  { id: "bob", name: "Bank of Baroda", src: "/images/card/BOB.webp" },
  { id: "rbl", name: "RBL Bank", src: "/images/card/RBL.webp" },
  { id: "yes", name: "YES Bank", src: "/images/card/YES.webp" },
  { id: "equitas", name: "Equitas", src: "/images/card/Equitas.webp" },
  { id: "scapia", name: "Scapia", src: "/images/card/SCAPIA.webp" },
] as const;

function scrollToApplyForm() {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CreditCardOffers() {
  return (
    <section
      className="bg-[#F5F7FB] !py-10 dark:bg-darkmode lg:!py-14"
      aria-labelledby="credit-card-offers-heading"
    >
      <div className="container mx-auto max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mb-8 text-center sm:mb-10" data-aos="fade-up">
          <h2
            id="credit-card-offers-heading"
            className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
          >
            Get All Credit Cards in{" "}
            <span className="theme-gradient-text">One Place</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray dark:text-gray-400 sm:text-base">
            Select your cards to get exciting offers and amazing rewards
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
          {CARDS.map((card, index) => (
            <li key={card.id} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8ECF2] bg-white shadow-[0_8px_28px_rgba(16,45,71,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(16,45,71,0.14)] dark:border-dark_border dark:bg-darklight">
                <div className="relative aspect-square w-full overflow-hidden bg-[#F5F7FB] dark:bg-darkmode">
                  <Image
                    src={card.src}
                    alt={`${card.name} credit card`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading={index < 4 ? "eager" : "lazy"}
                    quality={75}
                  />
                </div>
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <button
                    type="button"
                    onClick={scrollToApplyForm}
                    aria-label={`Get offer for ${card.name}`}
                    className="btn-gradient inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95"
                  >
                    Get Offer
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
