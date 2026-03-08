"use client";

import { useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const digits = mobile.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative pt-24 sm:pt-28 pb-6 sm:pb-0 overflow-x-hidden min-h-0 lg:min-h-[380px]" style={{ backgroundColor: "#2F73F2" }}>
      <div className="container mx-auto px-4 sm:px-4 lg:max-w-screen-xl md:max-w-screen-md relative z-10 h-full max-w-full">
        <div className="grid lg:grid-cols-12 grid-cols-1 lg:items-end gap-6 lg:gap-0 min-h-0 lg:min-h-[300px]">
          <div className="flex flex-col col-span-1 lg:col-span-6 justify-center items-start mb-4 lg:mb-[60px]" data-aos="fade-right">
            <div className="mb-4 sm:mb-6">
              <h1 className="md:text-[50px] leading-[1.2] text-2xl sm:text-4xl text-white font-bold">
                Loans, Insurance & Credit Cards
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-white/90 font-medium">
                Compare Best Rates | Quick Approval | 100% Online
              </p>
            </div>
            <div className="w-full max-w-xl">
              <div className="bg-white dark:bg-darkmode rounded-xl shadow-lg p-5 sm:p-6 md:p-8">
                <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-4">Let&apos;s Get Started</h2>
                <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-dark_border overflow-hidden bg-white dark:bg-[#0c121e]">
                  <span className="pl-3 flex items-center shrink-0" aria-hidden>
                    <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm overflow-hidden" aria-label="India">
                      <rect width="24" height="16" fill="#FF9933" />
                      <rect y="5.33" width="24" height="5.33" fill="#fff" />
                      <rect y="10.67" width="24" height="5.33" fill="#138808" />
                      <circle cx="12" cy="8" r="2.2" fill="#000080" />
                      <g fill="#fff" stroke="#000080" strokeWidth="0.15">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                          <line key={i} x1="12" y1="8" x2="12" y2="5.8" transform={`rotate(${i * 30} 12 8)`} />
                        ))}
                      </g>
                    </svg>
                  </span>
                  <span className="pl-2 pr-3 text-midnight_text dark:text-gray-400 font-medium">+91</span>
                  <span className="h-6 w-px bg-gray-300 dark:bg-dark_border" aria-hidden />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 py-3 sm:py-3.5 px-3 min-w-0 text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none dark:bg-transparent"
                  />
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-5 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white bg-primary rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Check Free Credit Score
                </button>
              </div>
            </div>
          </div>
          <div className="flex col-span-1 lg:col-span-6 justify-center lg:justify-end items-center lg:items-end self-center lg:self-end">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[520px] mt-2 lg:mt-12">
              <Image
                src="/images/hero/hero.png"
                alt="hero"
                width={520}
                height={400}
                className="w-full h-auto object-contain object-center lg:object-bottom block"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 400px, 520px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
