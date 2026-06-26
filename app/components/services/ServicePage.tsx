"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import LeadApplyModal from "@/app/components/leads/LeadApplyModal";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import { MOBILE_VALIDATION } from "@/app/config/constants";
import { mapServiceToCategory } from "@/app/utils/leadApi";
import { fetchActiveServiceCards } from "@/app/utils/fetchActiveServiceCards";
import { sanitizeMobileInput, validateMobileNumber } from "@/app/utils/validation";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
  serviceSlug?: string;
};

const FALLBACK_SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select service" },
  { value: "personal-loan", label: "Personal Loan" },
  { value: "home-loan", label: "Home Loan" },
  { value: "business-loan", label: "Business Loan" },
  { value: "credit-card", label: "Credit Card" },
  { value: "insurance", label: "Insurance" },
];

function slugFromServiceHref(href: string): string {
  return href.replace(/^\/services\//, "").replace(/\/$/, "").trim();
}

function slugFromPathname(pathname: string): string {
  const m = pathname.match(/\/services\/([^/]+)/);
  return m?.[1]?.trim() ?? "";
}

function getSuccessMessage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("personal")) return "Your Personal Loan application has been received. We'll contact you shortly.";
  if (t.includes("home")) return "Your Home Loan application has been received. We'll contact you shortly.";
  if (t.includes("business")) return "Your Business Loan application has been received. We'll contact you shortly.";
  if (t.includes("credit")) return "Your Credit Card application has been received. We'll contact you shortly.";
  if (t.includes("insurance")) return "Your Insurance request has been received. We'll contact you shortly.";
  return `Your ${title} application has been received. We'll contact you shortly.`;
}

export default function ServicePage({
  title,
  subtitle,
  imageSrc,
  badge,
  hideHeader,
  serviceSlug: serviceSlugProp,
}: ServicePageProps) {
  const pathname = usePathname();
  const pageServiceSlug = useMemo(
    () => (serviceSlugProp?.trim() || slugFromPathname(pathname) || "").trim(),
    [serviceSlugProp, pathname],
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [serviceOptions, setServiceOptions] = useState(FALLBACK_SERVICE_OPTIONS);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { cards, status } = await fetchActiveServiceCards();
      if (cancelled || status !== "ok" || cards.length === 0) return;
      setServiceOptions([
        { value: "", label: "Select service" },
        ...cards.map((c) => {
          const slug = slugFromServiceHref(c.href);
          return { value: slug, label: c.title.trim() || slug };
        }),
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openApplyModal = () => {
    const validation = validateMobileNumber(mobile);
    if (!validation.isValid) {
      setMobileError(validation.error || "Enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");
    setShowApplyModal(true);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(sanitizeMobileInput(e.target.value));
    if (mobileError) setMobileError("");
  };

  const category = mapServiceToCategory(pageServiceSlug || "personal-loan");

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 bg-gradient-to-b from-light to-white dark:from-darkmode dark:to-semidark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="min-w-0 flex flex-col w-full order-1 lg:order-1 lg:justify-center" data-aos="fade-right">
            {!hideHeader && (
              <>
                {badge && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {badge}
                  </span>
                )}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-midnight_text dark:text-white mb-3 sm:mb-4">
                  {title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray dark:text-gray-300 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                  {subtitle}
                </p>
              </>
            )}

            <div className="bg-gradient-to-r from-primary to-[#ff7a1a] p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex flex-col lg:min-h-[300px]">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-5 sm:py-6 lg:py-8 px-4 sm:px-5 md:px-6 flex flex-1 flex-col min-h-0">
                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-midnight_text dark:text-white">
                    Let&apos;s Get Started
                  </h2>
                  <p className="mt-1 text-sm text-gray dark:text-gray-400">
                    Apply for {title}
                  </p>
                </div>

                {showSuccess && (
                  <SuccessPopup
                    message={getSuccessMessage(title)}
                    onClose={() => setShowSuccess(false)}
                    autoCloseMs={3000}
                  />
                )}

                <LeadApplyModal
                  open={showApplyModal}
                  mobile={mobile.replace(/\D/g, "")}
                  category={category}
                  serviceOptions={serviceOptions}
                  defaultService={pageServiceSlug}
                  onClose={() => setShowApplyModal(false)}
                  onEditMobile={() => setShowApplyModal(false)}
                  onSuccess={() => {
                    setMobile("");
                    setTermsAccepted(false);
                    setShowSuccess(true);
                  }}
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    openApplyModal();
                  }}
                  className="mt-4 flex flex-1 flex-col gap-4 min-h-0"
                >
                  <div>
                    <label className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="flex items-center rounded-lg sm:rounded-xl border border-gray-300 dark:border-dark_border overflow-hidden bg-white dark:bg-darkmode/80">
                      <span className="pl-2.5 sm:pl-3 flex items-center shrink-0" aria-hidden>
                        <IndiaFlag />
                      </span>
                      <span className="pl-1.5 sm:pl-2 pr-2 sm:pr-3 text-sm text-midnight_text dark:text-white font-medium">+91</span>
                      <span className="h-5 sm:h-6 w-px bg-gray-300 dark:bg-dark_border" aria-hidden />
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={handleMobileInputChange}
                        pattern="[0-9]*"
                        className="flex-1 py-2.5 sm:py-3 px-2.5 sm:px-3 min-w-0 text-sm sm:text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    {mobileError && <p className="text-red-600 text-xs sm:text-sm mt-2">{mobileError}</p>}
                  </div>

                  <TermsAgreementCheckbox
                    id="service-terms"
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                  />

                  <div className="mt-auto w-full pt-3 sm:pt-4">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-primary hover:bg-blue-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 transition-colors shadow-md min-h-[44px]"
                    >
                      Apply Now
                    </button>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-500 mt-2">
                      By submitting, you agree to be contacted by Apni Zaroorat and its lending partners.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 order-2 lg:order-2 w-full h-full min-h-[280px] lg:min-h-[420px]" data-aos="fade-left">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 shadow-2xl sm:rounded-3xl lg:min-h-[420px]">
              <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/20 blur-3xl sm:h-32 sm:w-32" />
              <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-accent/30 blur-3xl sm:-bottom-12 sm:-right-12 sm:h-40 sm:w-40" />
              <div className="relative z-10 h-full min-h-[280px] w-full lg:min-h-[420px]">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={640}
                  height={480}
                  className="h-full min-h-[280px] w-full object-cover object-center lg:min-h-[420px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
