"use client";

import { useState } from "react";
import Image from "next/image";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import { createLead, mapServiceToCategory } from "@/app/utils/leadApi";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
};

function getSuccessMessage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("personal")) return "Your Personal Loan application has been received. We'll contact you shortly.";
  if (t.includes("home")) return "Your Home Loan application has been received. We'll contact you shortly.";
  if (t.includes("business")) return "Your Business Loan application has been received. We'll contact you shortly.";
  if (t.includes("credit")) return "Your Credit Card application has been received. We'll contact you shortly.";
  if (t.includes("insurance")) return "Your Insurance request has been received. We'll contact you shortly.";
  return `Your ${title} application has been received. We'll contact you shortly.`;
}

// PAN: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)
const PAN_REGEX = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
// Name: only letters, spaces, dots – no special characters
const NAME_REGEX = /^[a-zA-Z\s.]*$/;

export default function ServicePage({ title, subtitle, imageSrc, badge, hideHeader }: ServicePageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ pan?: string; mobile?: string; fullName?: string; api?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: typeof errors = {};
    const panTrim = pan.trim().toUpperCase();
    if (!panTrim) {
      next.pan = "PAN is required";
    } else if (!PAN_REGEX.test(panTrim)) {
      next.pan = "Invalid PAN (e.g. ABCDE1234F – 5 letters, 4 digits, 1 letter)";
    }
    const mobileTrim = mobile.replace(/\D/g, "");
    if (!mobileTrim) {
      next.mobile = "Mobile number is required";
    } else if (mobileTrim.length !== 10) {
      next.mobile = "Enter valid 10 digit mobile number";
    } else if (!/^[6-9]/.test(mobileTrim)) {
      next.mobile = "Mobile number must start with 6, 7, 8, or 9";
    }
    const nameTrim = fullName.trim();
    if (!nameTrim) {
      next.fullName = "Full name is required";
    } else if (!NAME_REGEX.test(nameTrim)) {
      next.fullName = "Name should not contain special characters or numbers";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const getCategoryFromTitle = (): ReturnType<typeof mapServiceToCategory> => {
    const t = title.toLowerCase();
    if (t.includes("personal")) return mapServiceToCategory("personal-loan");
    if (t.includes("home")) return mapServiceToCategory("home-loan");
    if (t.includes("business")) return mapServiceToCategory("business-loan");
    if (t.includes("credit")) return mapServiceToCategory("credit-card");
    if (t.includes("insurance")) return mapServiceToCategory("insurance");
    return mapServiceToCategory("personal-loan"); // default
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, api: undefined }));

    try {
      const panTrim = pan.trim().toUpperCase();
      const mobileTrim = mobile.replace(/\D/g, "");
      const nameTrim = fullName.trim();
      const category = getCategoryFromTitle();

      const response = await createLead({
        pan: panTrim,
        mobileNumber: mobileTrim,
        fullName: nameTrim,
        category,
      });

      if (response.success) {
        setShowSuccess(true);
        setPan("");
        setMobile("");
        setFullName("");
        setErrors({});
      } else {
        setErrors((prev) => ({ ...prev, api: response.message || "Failed to submit. Please try again." }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, api: "Network error. Please try again later." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 10);
    setPan(v.toUpperCase());
    if (errors.pan) setErrors((prev) => ({ ...prev, pan: undefined }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(v);
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value.replace(/[^a-zA-Z\s.]/g, ""));
    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
  };

  return (
    <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 bg-gradient-to-b from-light to-white dark:from-darkmode dark:to-semidark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl md:max-w-screen-md max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="min-w-0 flex flex-col w-full lg:h-full order-1 lg:order-1" data-aos="fade-right">
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

            <div className="bg-gradient-to-r from-primary to-[#ff7a1a] p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex-1 flex flex-col min-h-0 lg:min-h-[420px]">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-6 sm:py-10 lg:py-14 px-4 sm:px-5 md:px-7 flex-1 flex flex-col min-h-0">
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-midnight_text dark:text-white">
                    Start your application
                  </h2>
                </div>

                {showSuccess && (
                  <SuccessPopup
                    message={getSuccessMessage(title)}
                    onClose={() => setShowSuccess(false)}
                    autoCloseMs={3000}
                  />
                )}

                {errors.api && (
                  <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.api}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    PAN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={handlePanChange}
                    maxLength={10}
                    placeholder="Enter PAN (e.g. ABCDE1234F)"
                    className={`w-full rounded-lg sm:rounded-xl border bg-white dark:bg-darkmode/80 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary shadow-sm ${errors.pan ? "border-red-500 dark:border-red-500" : "border-border/80 dark:border-dark_border/70"}`}
                  />
                  {errors.pan && <p className="mt-1 text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.pan}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Mobile as per Aadhaar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={mobile}
                      onChange={handleMobileChange}
                      maxLength={10}
                      placeholder="10 digit mobile number"
                      pattern="[0-9]*"
                      className={`w-full rounded-lg sm:rounded-xl border bg-white dark:bg-darkmode/80 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary shadow-sm ${errors.mobile ? "border-red-500 dark:border-red-500" : "border-border/80 dark:border-dark_border/70"}`}
                    />
                    {errors.mobile && <p className="mt-1 text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.mobile}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={handleNameChange}
                      placeholder="As per PAN / Aadhaar"
                      className={`w-full rounded-lg sm:rounded-xl border bg-white dark:bg-darkmode/80 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary shadow-sm ${errors.fullName ? "border-red-500 dark:border-red-500" : "border-border/80 dark:border-dark_border/70"}`}
                    />
                    {errors.fullName && <p className="mt-1 text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.fullName}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 sm:mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-primary hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base font-semibold py-2.5 sm:py-3 px-4 transition-colors shadow-md min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                  {!isSubmitting && <span className="text-xs">&gt;</span>}
                </button>
                <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-500 mt-1.5 sm:mt-2">
                  By submitting, you agree to be contacted by Apni Zaroorat and its lending partners.
                </p>
                </form>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 order-2 lg:order-2 w-full h-full min-h-[280px] lg:min-h-[420px]" data-aos="fade-left">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 h-full min-h-[280px] lg:min-h-[420px]">
              <div className="absolute -top-10 -left-10 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-12 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-accent/30 blur-3xl" />
              <div className="relative z-10 w-full h-full min-h-[280px] lg:min-h-[420px]">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={640}
                  height={480}
                  className="w-full h-full min-h-[280px] lg:min-h-[420px] object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

