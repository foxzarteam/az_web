"use client";

import { useState } from "react";
import Image from "next/image";
import { FAQ_ITEMS } from "./faq-data";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqAccordionItem({
  item,
  open,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow duration-300 dark:bg-darklight ${
        open
          ? "border-primary/30 shadow-[0_8px_30px_rgba(66,54,251,0.1)]"
          : "border-[#E8ECF2] shadow-[0_2px_12px_rgba(16,45,71,0.05)] hover:border-primary/20 dark:border-dark_border"
      }`}
    >
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5"
        >
          <span
            className={`text-sm font-bold leading-snug sm:text-base ${
              open ? "text-primary" : "text-midnight_text dark:text-white"
            }`}
          >
            {item.question}
          </span>
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              open ? "bg-[#EEF0FF]" : "bg-[#F5F7FB] dark:bg-white/5"
            }`}
          >
            <ChevronIcon open={open} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm leading-relaxed text-gray dark:text-gray-400 sm:px-5 sm:pb-5 sm:text-[15px]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faq"
      className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 dark:bg-semidark"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 md:max-w-screen-md lg:max-w-screen-xl lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-12">
          <h2
            id="faq-heading"
            className="text-xl font-bold text-midnight_text dark:text-white sm:text-2xl md:text-3xl"
            data-aos="fade-up"
          >
            Frequently Asked <span className="theme-gradient-text">Questions</span>
          </h2>
        </div>

        <div
          className="grid w-full min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-10 lg:gap-10 xl:gap-12"
          data-aos="fade-up"
        >
          <div className="w-full lg:col-span-3">
            <div className="relative w-full">
              <Image
                src="/images/hero/faq.png"
                alt="Frequently asked questions illustration"
                width={320}
                height={320}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:col-span-7">
            {FAQ_ITEMS.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
