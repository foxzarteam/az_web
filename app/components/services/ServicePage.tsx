"use client";

import Image from "next/image";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
};

export default function ServicePage({ title, subtitle, imageSrc, badge, hideHeader }: ServicePageProps) {
  return (
    <section className="pt-28 pb-16 bg-gradient-to-b from-light to-white dark:from-darkmode dark:to-semidark">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            {!hideHeader && (
              <>
                {badge && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1 text-xs font-semibold mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {badge}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-midnight_text dark:text-white mb-4">
                  {title}
                </h1>
                <p className="text-base sm:text-lg text-gray dark:text-gray-300 mb-8 max-w-xl">
                  {subtitle}
                </p>
              </>
            )}

            <div className="border-2 border-primary rounded-3xl shadow-xl max-w-lg w-full">
              <div className="bg-white dark:bg-darklight rounded-[14px] p-5 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-midnight_text dark:text-white">
                      Start your application
                    </h2>
                    <p className="text-[11px] sm:text-xs text-gray dark:text-gray-400 mt-1">
                      Just 3 quick details – no documents needed right now.
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end text-right text-[10px] uppercase tracking-[0.18em] text-primary/80">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                      Step 1 of 2
                    </span>
                  </div>
                </div>

                <form className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    PAN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter PAN (e.g. ABCDE1234F)"
                    required
                    className="w-full rounded-xl border border-border/80 dark:border-dark_border/70 bg-white dark:bg-darkmode/80 px-3.5 py-2.5 text-sm text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary shadow-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Mobile as per Aadhaar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10 digit mobile number"
                      required
                      className="w-full rounded-xl border border-border/80 dark:border-dark_border/70 bg-white dark:bg-darkmode/80 px-3.5 py-2.5 text-sm text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="As per PAN / Aadhaar"
                      required
                      className="w-full rounded-xl border border-border/80 dark:border-dark_border/70 bg-white dark:bg-darkmode/80 px-3.5 py-2.5 text-sm text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary shadow-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-blue-700 text-white text-sm sm:text-base font-semibold py-2.5 px-4 transition-colors shadow-md"
                >
                  Submit Details
                  <span className="text-xs">&gt;</span>
                </button>
                <p className="text-[11px] text-gray-500 dark:text-gray-500 mt-2">
                  By submitting, you agree to be contacted by Apni Zaroorat and its lending partners.
                </p>
                </form>
              </div>
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
              <div className="relative z-10">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={640}
                  height={480}
                  className="w-full h-full max-h-[420px] object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

