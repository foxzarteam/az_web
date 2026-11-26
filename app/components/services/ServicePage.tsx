"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import SuccessPopup from "@/app/components/shared/SuccessPopup";
import TermsAgreementCheckbox, {
  LeadCreditDisclaimer,
} from "@/app/components/shared/TermsAgreementCheckbox";
import { reportFormValidity } from "@/app/lib/formValidation";
import CheckApplicationStatusLink from "@/app/components/leads/CheckApplicationStatusLink";
import IndiaFlag from "@/app/components/home/hero/IndiaFlag";
import LoanAmountSlider from "@/app/components/services/LoanAmountSlider";
import EmploymentIncomeFields, {
  EmploymentTypeField,
  LOAN_APPLY_EMPLOYMENT_OPTIONS,
} from "@/app/components/leads/EmploymentIncomeFields";
import CibilBandSelect, { VEHICLE_CIBIL_OPTIONS } from "@/app/components/leads/CibilBandSelect";
import VehicleCategorySelect from "@/app/components/leads/VehicleCategorySelect";
import { MOBILE_VALIDATION } from "@/app/config/constants";
import { customerLogin } from "@/app/lib/customer/authApi";
import {
  applyLead,
  isExistingApplicationError,
  leadIdFromResponse,
  mapServiceToCategory,
} from "@/app/lib/leads/leadApi";
import { personalLoanApplyPayload } from "@/app/lib/leads/personalLoanApply";
import { useLoanProducts, useServiceCards } from "@/app/components/providers/ServiceCardsProvider";
import { fetchActiveServiceCards } from "@/app/lib/services/fetchActiveServiceCards";
import type { LoanProductTab } from "@/app/lib/services/types";
import { mergeLoanPageTabs } from "@/app/lib/services/loanPageTabs";
import { useLoanSelection } from "@/app/components/products/loans/loanSelection";
import { useInsuranceSelection } from "@/app/components/products/insurance/insuranceSelection";
import { productHrefToSlug } from "@/app/lib/services/allowedProducts";
import { useInsuranceTypeOptions } from "@/app/lib/services/useInsuranceTypeOptions";
import { useVehicleCategoryOptions } from "@/app/lib/services/useVehicleCategoryOptions";
import InsuranceTypeSelect from "@/app/components/leads/InsuranceTypeSelect";
import {
  sanitizeLeadNameInput,
  sanitizeLeadPanInput,
  isVehicleLoanCategory,
  loanNotEligibleMessage,
  sanitizeLeadPincodeInput,
  sanitizeVehicleRc,
  CREDIT_CARD_KIND_OPTIONS,
  validateLeadEmail,
  validateLeadPanNameMobile,
  validateLeadPincode,
} from "@/app/lib/leads/leadForm";
import {
  collectServiceApplyErrors,
  loanAmountRangeError,
  reportTermsIfUnchecked,
  serviceApplyHasFieldError,
} from "@/app/lib/leads/serviceApplyValidate";
import { getVehicleCategoryPick, setVehicleCategoryPick, subscribeVehicleCategoryPick } from "@/app/lib/leads/vehicleCategoryPick";
import {
  getUsedCarEligibility,
  subscribeUsedCarEligibility,
  type UsedCarEligibility,
} from "@/app/lib/leads/usedCarEligibilityPick";
import { formatRupee } from "@/app/lib/format";
import { sanitizeMobileInput } from "@/app/lib/validation";
import { stashApplyThanks } from "@/app/lib/customer/applyThanks";

type ServicePageProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  badge?: string;
  hideHeader?: boolean;
  serviceSlug?: string;
  /** /products/loans: tabs for each active loan product. Amount range follows the selected tab. */
  loanTabs?: boolean;
  /** Insurance type selected when the form opens. Does not hide the other types. */
  initialInsType?: string;
  /** No page hero: clear the fixed navbar and draw a theme line under it. */
  navBorder?: boolean;
  /** Small screens only: rendered directly under the apply form. */
  aboveForm?: ReactNode;
  /** Page already has its own hero, so the form sits directly under it. */
  compactTop?: boolean;
  /** Vehicle loan form: preselect category (e.g. used_car). */
  initialVehicleCategory?: string;
  /** Keep the preselected category; dropdown stays closed and cannot change. */
  lockVehicleCategory?: boolean;
  imageClassName?: string;
  formHeading?: ReactNode;
};

function slugFromPathname(pathname: string): string {
  const m = pathname.match(/\/products\/([^/]+)/);
  return m?.[1]?.trim() ?? "";
}

const inputClass =
  "w-full min-h-10 shrink-0 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-dark_border bg-white dark:bg-darkmode/80 text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70";

const mobileShellClass =
  "flex min-h-10 shrink-0 items-center overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-dark_border dark:bg-darkmode/80";

const mobileInputClass =
  "min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-midnight_text dark:text-white placeholder:text-gray-400 focus:outline-none";

export default function ServicePage({
  title,
  subtitle,
  imageSrc,
  badge,
  hideHeader,
  serviceSlug: serviceSlugProp,
  loanTabs = false,
  initialInsType,
  navBorder = false,
  aboveForm,
  compactTop = false,
  initialVehicleCategory,
  lockVehicleCategory = false,
  imageClassName,
  formHeading,
}: ServicePageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageServiceSlug = useMemo(
    () => (serviceSlugProp?.trim() || slugFromPathname(pathname) || "").trim(),
    [serviceSlugProp, pathname],
  );

  const [usedCarEligibility, setUsedCarEligibility] = useState<UsedCarEligibility | null>(
    lockVehicleCategory ? getUsedCarEligibility : null,
  );
  const [existingAppMessage, setExistingAppMessage] = useState("");
  const [ineligibleMessage, setIneligibleMessage] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [panError, setPanError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanAmountError, setLoanAmountError] = useState("");
  const insuranceSelection = useInsuranceSelection();
  const [localInsType, setLocalInsType] = useState("");
  const insType = insuranceSelection?.value ?? localInsType;
  const setInsType = insuranceSelection?.setValue ?? setLocalInsType;
  const [netMonthlyIncome, setNetMonthlyIncome] = useState("");
  const [incomeError, setIncomeError] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [employmentError, setEmploymentError] = useState("");
  const [emiChoice, setEmiChoice] = useState<"" | "yes" | "no">("");
  const [emiChoiceError, setEmiChoiceError] = useState("");
  const [emiAmountError, setEmiAmountError] = useState("");
  const [cibilBand, setCibilBand] = useState("");
  const [cibilError, setCibilError] = useState("");
  const [creditCardKind, setCreditCardKind] = useState<"" | "fd" | "normal">("");
  const [creditCardKindError, setCreditCardKindError] = useState("");
  const [fdAmount, setFdAmount] = useState("");
  const [fdAmountError, setFdAmountError] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState(initialVehicleCategory || "new_car");
  const [vehicleCategoryError, setVehicleCategoryError] = useState("");
  const [carDetails, setCarDetails] = useState("");
  const [carDetailsError, setCarDetailsError] = useState("");
  const [vehicleRc, setVehicleRc] = useState("");
  const [vehicleRcError, setVehicleRcError] = useState("");
  const [existingCarLoan, setExistingCarLoan] = useState<"" | "yes" | "no">("");
  const [existingCarLoanError, setExistingCarLoanError] = useState("");
  const [totalMonthlyEmi, setTotalMonthlyEmi] = useState("0");
  const [pan, setPan] = useState("");
  /** Non-field only (API / network). Field errors stay under inputs. */
  const [formError, setFormError] = useState("");
  /** Loan apply only: 1 = basic details, 2 = eligibility. */
  const [loanStep, setLoanStep] = useState<1 | 2>(1);
  const loanSelection = useLoanSelection();
  const [localLoanSlug, setLocalLoanSlug] = useState("personal-loan");
  const loanSlug = loanSelection?.slug ?? localLoanSlug;
  const setLoanSlug = loanSelection?.setSlug ?? setLocalLoanSlug;
  const catalogLoans = useLoanProducts();
  const [fetchedLoans, setFetchedLoans] = useState<LoanProductTab[] | null>(null);
  const apiLoans = useMemo(() => {
    const hasRange = (list: LoanProductTab[]) =>
      list.some((item) => item.limitStart != null && item.limitEnd != null);
    const fetched = fetchedLoans ?? [];
    if (!hasRange(catalogLoans) && hasRange(fetched)) return fetched;
    if (catalogLoans.length > 0) return catalogLoans;
    return fetched;
  }, [catalogLoans, fetchedLoans]);
  const loanProducts = useMemo(() => (loanTabs ? mergeLoanPageTabs(apiLoans) : []), [apiLoans, loanTabs]);

  const service = loanTabs ? loanSlug : pageServiceSlug;
  const selectedCategory = mapServiceToCategory(service);
  const isCreditCard = selectedCategory === "credit_card";
  const showLoanAmount = loanTabs || selectedCategory === "personal_loan";
  const multiStep = showLoanAmount || isCreditCard;
  const cards = useServiceCards();
  const selectedLoanTitle =
    loanTabs
      ? loanProducts.find((item) => item.slug === loanSlug)?.title || "Loan"
      : title;
  const loanBounds = useMemo(() => {
    if (loanTabs) {
      const tab = loanProducts.find((item) => item.slug === loanSlug);
      const min = tab?.limitStart;
      const max = tab?.limitEnd;
      if (min == null || max == null || max < min) return undefined;
      return { min, max };
    }
    const card = cards.find((item) => productHrefToSlug(item.href) === "personal-loan");
    const min = card?.limitStart;
    const max = card?.limitEnd;
    if (min == null || max == null || max < min) return undefined;
    return { min, max };
  }, [cards, loanProducts, loanSlug, loanTabs]);
  const showInsuranceType = selectedCategory === "insurance";
  const stackNamePan = selectedCategory === "credit_card";
  const vehicleLoan = isVehicleLoanCategory(selectedCategory);
  const insuranceTypeOptions = useInsuranceTypeOptions();
  const vehicleCategoryOptions = useVehicleCategoryOptions();
  const defaultInsType = initialInsType ?? "health_insurance";

  useEffect(() => {
    if (!loanTabs) return;
    const hasRange = catalogLoans.some((item) => item.limitStart != null && item.limitEnd != null);
    if (catalogLoans.length > 0 && hasRange) return;
    let cancelled = false;
    void fetchActiveServiceCards().then((res) => {
      if (!cancelled && res.status === "ok") setFetchedLoans(res.loanProducts);
    });
    return () => {
      cancelled = true;
    };
  }, [catalogLoans, loanTabs]);

  useEffect(() => {
    if (!loanTabs || loanProducts.length === 0) return;
    if (loanProducts.some((item) => item.slug === loanSlug)) return;
    const preferred = loanProducts.find((item) => item.slug === "personal-loan") ?? loanProducts[0];
    if (preferred) setLoanSlug(preferred.slug);
  }, [loanProducts, loanSlug, loanTabs, setLoanSlug]);

  useEffect(() => {
    setInsType(selectedCategory === "insurance" ? defaultInsType : "");
    setNetMonthlyIncome("");
    setLoanAmount(0);
    setLoanAmountError("");
    setFullNameError("");
    setPanError("");
    setEmail("");
    setEmailError("");
    setMobileError("");
    setPincodeError("");
    setCibilBand("");
    setCibilError("");
    setCreditCardKind("");
    setCreditCardKindError("");
    setFdAmount("");
    setFdAmountError("");
    setEmploymentType("");
    setEmploymentError("");
    setIncomeError("");
    setEmiChoice("");
    setEmiChoiceError("");
    setEmiAmountError("");
    setVehicleCategory(
      isVehicleLoanCategory(selectedCategory)
        ? lockVehicleCategory
          ? initialVehicleCategory || "used_car"
          : getVehicleCategoryPick() || initialVehicleCategory || "new_car"
        : "",
    );
    setVehicleCategoryError("");
    setTotalMonthlyEmi("0");
    setLoanStep(1);
    setFormError("");
  }, [pageServiceSlug, selectedCategory, setInsType, defaultInsType, initialVehicleCategory, lockVehicleCategory]);

  useEffect(() => {
    if (!loanTabs) return;
    setLoanStep(1);
    setFormError("");
    setFullNameError("");
    setPanError("");
    setMobileError("");
    setPincodeError("");
    setLoanAmountError("");
    setCibilError("");
    setEmploymentError("");
    setIncomeError("");
    setEmiChoiceError("");
    setEmiAmountError("");
    setVehicleCategoryError("");
  }, [loanSlug, loanTabs]);

  useEffect(() => {
    if (!lockVehicleCategory) return;
    return subscribeUsedCarEligibility((value) => {
      setUsedCarEligibility(value);
      if (!value) return;
      if (value.rc) {
        setVehicleRc(sanitizeVehicleRc(value.rc));
        setVehicleRcError("");
      }
      if (value.eligible && value.amount > 0) {
        const next =
          loanBounds != null
            ? Math.min(Math.max(value.amount, loanBounds.min), loanBounds.max)
            : value.amount;
        setLoanAmount(next);
        setLoanAmountError("");
      }
    });
  }, [lockVehicleCategory, loanBounds]);

  useEffect(() => {
    if (lockVehicleCategory) return;
    return subscribeVehicleCategoryPick((value) => {
      if (loanTabs) setLoanSlug("vehicle-loan");
      setVehicleCategory(value);
    });
  }, [loanTabs, lockVehicleCategory, setLoanSlug]);

  const monthlyEmiAmount = Number(String(totalMonthlyEmi).replace(/\D/g, "") || "0");
  const hasExistingEmi: "" | "yes" | "no" = vehicleLoan ? "no" : emiChoice;

  useEffect(() => {
    const amount = document.getElementById("service-loan-amount");
    if (amount instanceof HTMLInputElement) amount.setCustomValidity("");
  }, [loanAmount]);

  const clearInlineFieldErrors = () => {
    setFullNameError("");
    setPanError("");
    setEmailError("");
    setMobileError("");
    setPincodeError("");
    setLoanAmountError("");
    setIncomeError("");
    setEmploymentError("");
    setEmiChoiceError("");
    setEmiAmountError("");
    setCibilError("");
    setVehicleCategoryError("");
    setCarDetailsError("");
    setVehicleRcError("");
    setExistingCarLoanError("");
    setCreditCardKindError("");
    setFdAmountError("");
  };

  /** Blank → native browser popup. Filled but invalid → red text under the field. */
  const goToLoanStep2 = (form?: HTMLFormElement | null) => {
    if (!multiStep) return;
    setFormError("");
    clearInlineFieldErrors();

    const amountInput = document.getElementById("service-loan-amount");
    if (amountInput instanceof HTMLInputElement) amountInput.setCustomValidity("");

    // Empty required fields + terms: browser/Bootstrap-style tooltip.
    if (form && !reportFormValidity(form)) return;

    const nameMobile = validateLeadPanNameMobile({
      pan,
      mobileDigits: mobile.replace(/\D/g, ""),
      fullName,
    });
    const pinDigits = pincode.replace(/\D/g, "");
    const pinErr = pinDigits ? validateLeadPincode(pincode) : undefined;
    const nameFilled = Boolean(fullName.trim());
    const panFilled = Boolean(pan.trim());
    const mobileFilled = Boolean(mobile.replace(/\D/g, ""));
    const vehicleMsg =
      vehicleLoan && vehicleCategory.trim() === "" ? "Select vehicle category" : "";

    const amountMsg =
      !vehicleLoan && loanAmount > 0
        ? loanAmountRangeError(loanAmount, loanBounds, {
            missingRange: Boolean(loanTabs && loanProducts.length > 0 && !loanBounds),
          })
        : "";

    setFullNameError(nameFilled ? nameMobile.fullName ?? "" : "");
    setPanError(panFilled ? nameMobile.pan ?? "" : "");
    setMobileError(mobileFilled ? nameMobile.mobile ?? "" : "");
    setPincodeError(pinErr ?? "");
    setVehicleCategoryError(vehicleMsg);
    setLoanAmountError(isCreditCard ? "" : amountMsg);
    const emailErr = isCreditCard ? validateLeadEmail(email) : undefined;
    setEmailError(email.trim() && emailErr ? emailErr : "");

    if (
      (nameFilled && nameMobile.fullName) ||
      (panFilled && nameMobile.pan) ||
      (mobileFilled && nameMobile.mobile) ||
      pinErr ||
      vehicleMsg ||
      (!isCreditCard && amountMsg) ||
      (isCreditCard && emailErr)
    ) {
      return;
    }

    if (!reportTermsIfUnchecked(termsAccepted)) return;
    setLoanStep(2);
  };

  const handleSubmit = async (form: HTMLFormElement) => {
    if (isSubmittingForm) return;
    // Multi-step: Continue never hits the API/DB — only advances UI after step-1 rules.
    if (multiStep && loanStep !== 2) {
      goToLoanStep2(form);
      return;
    }
    setFormError("");
    clearInlineFieldErrors();
    const amountInput = document.getElementById("service-loan-amount");
    if (amountInput instanceof HTMLInputElement) amountInput.setCustomValidity("");

    // Blank required fields → native popup (not red under-field text).
    if (!reportFormValidity(form)) return;
    if (!reportTermsIfUnchecked(termsAccepted)) return;

    const errors = collectServiceApplyErrors({
      pan,
      mobile,
      fullName,
      pincode,
      email,
      service,
      showLoanAmount,
      loanTabs,
      loanProductsCount: loanProducts.length,
      loanBounds,
      loanAmount,
      netMonthlyIncome,
      cibilBand,
      employmentType,
      hasExistingEmi,
      monthlyEmiAmount,
      vehicleLoan,
      skipCibil: lockVehicleCategory,
      carDetails,
      vehicleRc,
      existingCarLoan,
      vehicleCategory,
      showInsuranceType,
      insType,
      selectedCategory,
      creditCardKind,
      fdAmount,
    });

    const nameFilled = Boolean(fullName.trim());
    const panFilled = Boolean(pan.trim());
    const mobileFilled = Boolean(mobile.replace(/\D/g, ""));
    const incomeFilled = Boolean(String(netMonthlyIncome).replace(/\D/g, ""));
    const amountFilled = loanAmount > 0;
    const pinDigits = pincode.replace(/\D/g, "");
    const amountError = showLoanAmount
      ? loanAmountRangeError(loanAmount, loanBounds, {
          missingRange: Boolean(loanTabs && loanProducts.length > 0 && !loanBounds && amountFilled),
        })
      : "";
    const loanAmtError = amountError || (amountFilled || loanStep === 2 ? errors.loanAmt ?? "" : "");
    const emiFilled = Boolean(String(totalMonthlyEmi).replace(/\D/g, ""));
    const hasFieldError = serviceApplyHasFieldError(errors, loanAmtError);

    // Red under-field only for filled-but-invalid; blank stay native when field is visible.
    // If step-1 basics failed on step 2 (fields unmounted), show messages and return to step 1.
    const step1Failed = Boolean(
      errors.fullName ||
        errors.pan ||
        errors.mobile ||
        errors.pincode ||
        (isCreditCard && errors.email) ||
        (!isCreditCard && !vehicleLoan && (loanAmtError || errors.loanAmt)) ||
        (vehicleLoan && errors.vehicleCategory),
    );
    const showStep1Messages = !multiStep || loanStep === 1 || step1Failed;

    setFullNameError(
      showStep1Messages && (nameFilled || step1Failed) ? errors.fullName ?? "" : "",
    );
    setPanError(showStep1Messages && (panFilled || step1Failed) ? errors.pan ?? "" : "");
    setMobileError(
      showStep1Messages && (mobileFilled || step1Failed) ? errors.mobile ?? "" : "",
    );
    setPincodeError(
      showStep1Messages && (pinDigits || step1Failed) ? errors.pincode ?? "" : "",
    );
    setLoanAmountError(
      showStep1Messages || vehicleLoan ? loanAmtError || errors.loanAmt || "" : "",
    );
    setIncomeError(incomeFilled ? errors.netMonthlyIncome ?? "" : "");
    setEmploymentError(employmentType.trim() ? errors.employmentType ?? "" : "");
    setEmiChoiceError(emiChoice ? errors.hasExistingEmi ?? "" : "");
    setEmiAmountError(
      hasExistingEmi === "yes" && emiFilled ? errors.totalMonthlyEmi ?? "" : "",
    );
    setCibilError(
      lockVehicleCategory || (selectedCategory === "credit_card" && creditCardKind !== "normal")
        ? ""
        : cibilBand.trim()
          ? errors.cibilBand ?? ""
          : "",
    );
    setCreditCardKindError(
      selectedCategory === "credit_card" && creditCardKind ? errors.creditCardKind ?? "" : "",
    );
    setFdAmountError(
      selectedCategory === "credit_card" && creditCardKind === "fd" && fdAmount.trim()
        ? errors.fdAmount ?? ""
        : "",
    );
    setCarDetailsError(lockVehicleCategory && carDetails.trim() ? errors.carDetails ?? "" : "");
    setVehicleRcError(lockVehicleCategory && vehicleRc.trim() ? errors.vehicleRc ?? "" : "");
    setExistingCarLoanError(lockVehicleCategory && existingCarLoan ? errors.existingCarLoan ?? "" : "");
    setVehicleCategoryError(
      showStep1Messages && (vehicleCategory.trim() || step1Failed)
        ? errors.vehicleCategory ?? ""
        : "",
    );
    setEmailError(email.trim() ? errors.email ?? "" : "");

    if (hasFieldError) {
      if (multiStep && loanStep === 2 && step1Failed) setLoanStep(1);
      return;
    }
    if (errors.service) {
      setFormError(errors.service);
      return;
    }
    // Eligibility must pass before any DB write (server also rejects LOAN_NOT_ELIGIBLE).
    // Credit card uses the same CIBIL/EMI popup so junk leads never hit Meta.
    if (showLoanAmount || isCreditCard) {
      const blocked = loanNotEligibleMessage({
        category: selectedCategory,
        netMonthlyIncome: Number(String(netMonthlyIncome).replace(/\D/g, "")),
        employmentType,
        cibilBand: isCreditCard && creditCardKind !== "normal" ? "" : cibilBand,
        hasExistingEmi: vehicleLoan ? false : hasExistingEmi === "yes",
        totalMonthlyEmi: vehicleLoan || hasExistingEmi !== "yes" ? 0 : monthlyEmiAmount,
      });
      if (blocked) {
        setFormError("");
        setIneligibleMessage(blocked);
        return;
      }
    }
    setFormError("");
    setIsSubmittingForm(true);

    try {
      const category = mapServiceToCategory(service);
      const pin = pincode.replace(/\D/g, "");
      const digits = mobile.replace(/\D/g, "");
      const pl =
        showLoanAmount
          ? personalLoanApplyPayload({
              pan,
              mobile,
              fullName,
              pincode,
              loanAmount,
              netMonthlyIncome,
              cibilBand,
              hasExistingEmi,
              totalMonthlyEmi: String(monthlyEmiAmount),
            })
          : null;
      const payload = {
        pan: pan.trim().toUpperCase(),
        mobileNumber: digits,
        fullName: fullName.trim(),
        pincode: pin,
        category,
        ...(pl
          ? {
              requiredAmount: pl.requiredAmount,
              netMonthlyIncome: pl.netMonthlyIncome,
              ...(lockVehicleCategory ? {} : { cibilBand: pl.cibilBand }),
              ...(vehicleLoan
                ? {
                    vehicleCategory,
                    employmentType,
                    hasExistingEmi: false,
                    totalMonthlyEmi: 0,
                    ...(lockVehicleCategory
                      ? {
                          carDetails: carDetails.trim(),
                          vehicleRc: sanitizeVehicleRc(vehicleRc),
                          existingCarLoan: existingCarLoan === "yes",
                        }
                      : {}),
                  }
                : {
                    employmentType,
                    hasExistingEmi: pl.hasExistingEmi,
                    totalMonthlyEmi: pl.totalMonthlyEmi,
                  }),
            }
          : {}),
        ...(category === "insurance" ? { insType } : {}),
        ...(category === "credit_card" && (creditCardKind === "fd" || creditCardKind === "normal")
          ? {
              email: email.trim(),
              creditCardKind,
              employmentType,
              netMonthlyIncome: Number(String(netMonthlyIncome).replace(/\D/g, "")),
              hasExistingEmi: emiChoice === "yes",
              totalMonthlyEmi: emiChoice === "no" ? 0 : monthlyEmiAmount,
              ...(creditCardKind === "fd"
                ? { fdAmount: Number(fdAmount.replace(/\D/g, "")) }
                : { cibilBand }),
            }
          : {}),
        consentAccepted: termsAccepted,
      };
      const res = await applyLead(payload);
      if (!res.success) {
        if (res.code === "LOAN_NOT_ELIGIBLE") {
          setIneligibleMessage(res.message || "Sorry, you are not eligible for this loan.");
        } else if (isExistingApplicationError(res)) {
          setExistingAppMessage(
            res.message || "Your application is already KYC pending.",
          );
        } else {
          setFormError(res.message || "Could not submit application.");
        }
        return;
      }
      const savedId = leadIdFromResponse(res.data);
      if (!savedId) {
        setFormError("Could not submit application.");
        return;
      }
      stashApplyThanks({
        name: fullName.trim(),
        product: selectedLoanTitle.trim() || "application",
        leadId: savedId,
      });
      const login = await customerLogin(digits);
      if (!login.ok) {
        setFormError(login.message || "Application saved. Open Check Status to continue.");
        return;
      }
      router.replace("/customer/dashboard");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <section
      id="apply"
      className={`scroll-mt-24 ${
        compactTop
          ? "bg-white !pb-8 !pt-10 dark:bg-darkmode sm:!pb-12 xl:!pt-4"
          : loanTabs || navBorder
            ? "bg-white pb-0 pt-16 dark:bg-darkmode md:pt-20"
            : "bg-gradient-to-b from-light to-white pb-0 pt-8 dark:from-darkmode dark:to-semidark"
      }`}
    >
      <div className={`container mx-auto max-w-full px-4 sm:px-6 lg:max-w-screen-xl lg:px-8 ${!compactTop && (loanTabs || navBorder) ? "pt-10 xl:pt-0" : ""}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          <div className="min-w-0 flex flex-col w-full order-1 lg:order-1 lg:col-span-7 lg:justify-center" data-aos="fade-right">
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

            <div id="apply-form" className="theme-gradient-bg scroll-mt-24 p-[1px] rounded-2xl sm:rounded-3xl shadow-xl w-full min-w-0 flex flex-col">
              <div className="bg-white dark:bg-darklight rounded-2xl sm:rounded-3xl py-4 sm:py-6 lg:py-7 px-4 sm:px-6 md:px-7 flex flex-1 flex-col min-h-0 min-w-0">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className={`min-w-0 flex-1 leading-snug ${loanTabs ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"} font-semibold text-midnight_text dark:text-white`}>
                    {formHeading ??
                      (loanTabs ? (
                        <>
                          Check{" "}
                          <span className="theme-gradient-text font-extrabold">{selectedLoanTitle}</span>
                          {" "}Eligibility
                        </>
                      ) : (
                        <>
                          Apply for{" "}
                          <span className="theme-gradient-text font-extrabold">{selectedLoanTitle}</span>
                        </>
                      ))}
                  </h2>
                  {multiStep && loanStep === 2 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setFormError("");
                        setLoanStep(1);
                      }}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-midnight_text px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 sm:px-4 sm:text-sm"
                    >
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                        <path d="M16 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Back
                    </button>
                  ) : null}
                </div>

                {lockVehicleCategory && usedCarEligibility ? (
                  <div
                    className="theme-gradient-bg mb-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold leading-snug text-white sm:px-4 sm:py-3 sm:text-base"
                    role="status"
                  >
                    {usedCarEligibility.eligible ? (
                      <>
                        You are eligible for a loan of{" "}
                        <span className="font-extrabold underline decoration-white/70 underline-offset-2">
                          {formatRupee(usedCarEligibility.amount)}
                        </span>
                        . Please fill information below.
                      </>
                    ) : (
                      <>Cars older than 15 years usually do not qualify. Please fill information below for a lender review.</>
                    )}
                  </div>
                ) : null}

                {ineligibleMessage && (
                  <SuccessPopup
                    message={ineligibleMessage}
                    title="You are not eligible"
                    variant="danger"
                    onClose={() => setIneligibleMessage("")}
                    footer={
                      <button
                        type="button"
                        onClick={() => setIneligibleMessage("")}
                        className="inline-flex min-h-10 items-center justify-center rounded-full bg-midnight_text px-5 text-sm font-semibold text-white"
                      >
                        Okay
                      </button>
                    }
                  />
                )}

                {existingAppMessage && (
                  <SuccessPopup
                    message={existingAppMessage}
                    variant="warning"
                    onClose={() => setExistingAppMessage("")}
                    footer={<CheckApplicationStatusLink />}
                  />
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit(e.currentTarget);
                  }}
                  className="loan-apply-fields mt-3 flex flex-1 flex-col gap-3 min-h-0 sm:gap-4"
                >
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 break-words">
                      {formError}
                    </div>
                  )}

                  {multiStep ? (
                    <div className="space-y-1.5" aria-label={`Step ${loanStep} of 2`}>
                      <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">
                        <span>
                          Step {loanStep} of 2 —{" "}
                          {loanStep === 1 ? "Basic details" : isCreditCard ? "Card details" : "Eligibility"}
                        </span>
                        <span className="tabular-nums">{loanStep}/2</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark_border">
                        <div
                          className="theme-gradient-bg h-full rounded-full transition-[width] duration-300 ease-out"
                          style={{ width: loanStep === 1 ? "50%" : "100%" }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {showInsuranceType && (
                    <div className="relative">
                      <label htmlFor="service-ins-type" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                        Insurance type <span className="text-red-500">*</span>
                      </label>
                      <InsuranceTypeSelect
                        id="service-ins-type"
                        value={insType}
                        onChange={setInsType}
                        options={insuranceTypeOptions}
                      />
                      <input
                        value={insType}
                        required
                        onChange={() => undefined}
                        tabIndex={-1}
                        aria-label="Insurance type"
                        ref={(node) => {
                          node?.setCustomValidity(
                            insType.trim() ? "" : "Please select insurance type",
                          );
                        }}
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-0"
                      />
                    </div>
                  )}

                  {/* Loan step 1 / non-loan full form: basics */}
                  {(!multiStep || loanStep === 1) ? (
                    <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
                      {showLoanAmount && !vehicleLoan ? (
                        <div className="min-w-0 sm:col-span-2">
                          <LoanAmountSlider
                            id="service-loan-amount"
                            value={loanAmount}
                            onChange={(value) => {
                              setLoanAmount(value);
                              setLoanAmountError("");
                            }}
                            min={loanBounds?.min}
                            max={loanBounds?.max}
                            placeholder={
                              loanBounds
                                ? `₹${loanBounds.min.toLocaleString("en-IN")} – ₹${loanBounds.max.toLocaleString("en-IN")}`
                                : ""
                            }
                            required
                            error={loanAmountError}
                          />
                        </div>
                      ) : null}
                      {vehicleLoan ? (
                        <div className="min-w-0 sm:col-span-2">
                          <label htmlFor="service-vehicle-category" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                            Select vehicle category&nbsp;<span className="text-red-500">*</span>
                          </label>
                          <VehicleCategorySelect
                            id="service-vehicle-category"
                            value={vehicleCategory}
                            disabled={lockVehicleCategory}
                            onChange={(value) => {
                              if (lockVehicleCategory) return;
                              setVehicleCategory(value);
                              setVehicleCategoryPick(value);
                              setVehicleCategoryError("");
                            }}
                            options={vehicleCategoryOptions}
                            className={inputClass}
                          />
                          {vehicleCategoryError ? (
                            <p className="mt-1 text-xs text-red-600">{vehicleCategoryError}</p>
                          ) : null}
                        </div>
                      ) : null}
                      <div className={["min-w-0", stackNamePan ? "sm:col-span-2" : ""].filter(Boolean).join(" ")}>
                        <label htmlFor="service-fullname" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="service-fullname"
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(sanitizeLeadNameInput(e.target.value));
                            setFullNameError("");
                          }}
                          placeholder="Full Name (As per PAN)"
                          className={inputClass}
                          required
                        />
                        {fullNameError ? <p className="mt-1 text-xs text-red-600">{fullNameError}</p> : null}
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="service-pan" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                          PAN Card number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="service-pan"
                          type="text"
                          value={pan}
                          onChange={(e) => {
                            setPan(sanitizeLeadPanInput(e.target.value));
                            setPanError("");
                          }}
                          maxLength={10}
                          placeholder="e.g. ABCDE1234F"
                          className={inputClass}
                          required
                        />
                        {panError ? <p className="mt-1 text-xs text-red-600">{panError}</p> : null}
                      </div>
                      {stackNamePan ? (
                        <div className="min-w-0">
                          <label htmlFor="service-email" className="block text-sm font-medium text-midnight_text dark:text-gray-300 mb-1.5">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="service-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                            }}
                            placeholder="e.g. name@email.com"
                            className={inputClass}
                            required
                            maxLength={255}
                          />
                          {emailError ? <p className="mt-1 text-xs text-red-600">{emailError}</p> : null}
                        </div>
                      ) : null}
                      <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className={mobileShellClass}>
                          <span className="flex shrink-0 items-center pl-3" aria-hidden>
                            <IndiaFlag />
                          </span>
                          <span className="px-2 text-base font-semibold text-midnight_text dark:text-white">
                            +91
                          </span>
                          <span className="h-6 w-px shrink-0 bg-gray-300 dark:bg-dark_border" aria-hidden />
                          <input
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={MOBILE_VALIDATION.MAX_LENGTH}
                            placeholder="10-digit mobile"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(sanitizeMobileInput(e.target.value));
                              setMobileError("");
                            }}
                            pattern="[0-9]*"
                            className={mobileInputClass}
                            required
                          />
                        </div>
                        {mobileError ? <p className="mt-1 text-xs text-red-600">{mobileError}</p> : null}
                      </div>
                      <div className="min-w-0">
                        <label
                          htmlFor="service-pincode"
                          className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                        >
                          Current Residence Pincode <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2" aria-hidden>
                            <svg viewBox="0 0 24 24" className="h-5 w-5">
                              <defs>
                                <linearGradient id="pincode-pin-gradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#4236FB" />
                                  <stop offset="100%" stopColor="#FF7E29" />
                                </linearGradient>
                              </defs>
                              <path
                                fill="url(#pincode-pin-gradient)"
                                d="M12 2.2c-4.1 0-7.4 3.2-7.4 7.3 0 5.1 7.4 12.3 7.4 12.3s7.4-7.2 7.4-12.3c0-4.1-3.3-7.3-7.4-7.3z"
                              />
                              <circle cx="12" cy="9.4" r="2.5" fill="#fff" />
                            </svg>
                          </span>
                          <input
                            id="service-pincode"
                            type="text"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            maxLength={6}
                            placeholder="e.g. 302002"
                            value={pincode}
                            onChange={(e) => {
                              setPincode(sanitizeLeadPincodeInput(e.target.value));
                              setPincodeError("");
                            }}
                            pattern="[0-9]*"
                            className={`${inputClass} !pl-10`}
                            required
                          />
                        </div>
                        {pincodeError ? <p className="mt-1 text-xs text-red-600">{pincodeError}</p> : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Loan step 2: eligibility */}
                  {showLoanAmount && loanStep === 2 ? (
                    <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
                      {vehicleLoan ? (
                        <>
                          {lockVehicleCategory ? (
                            <>
                              <div className="min-w-0">
                                <label htmlFor="service-car-details" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                                  Car details <span className="text-red-500">*</span>
                                </label>
                                <input
                                  id="service-car-details"
                                  type="text"
                                  value={carDetails}
                                  onChange={(e) => {
                                    setCarDetails(e.target.value.slice(0, 120));
                                    setCarDetailsError("");
                                  }}
                                  placeholder="e.g. Swift VXI 2018"
                                  className={inputClass}
                                  required
                                />
                                {carDetailsError ? <p className="mt-1 text-xs text-red-600">{carDetailsError}</p> : null}
                              </div>
                              <div className="min-w-0">
                                <label htmlFor="service-vehicle-rc" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                                  RC number <span className="text-red-500">*</span>
                                </label>
                                <input
                                  id="service-vehicle-rc"
                                  type="text"
                                  value={vehicleRc}
                                  onChange={(e) => {
                                    setVehicleRc(sanitizeVehicleRc(e.target.value));
                                    setVehicleRcError("");
                                  }}
                                  placeholder="MH12AB1234"
                                  className={`${inputClass} uppercase`}
                                  required
                                />
                                {vehicleRcError ? <p className="mt-1 text-xs text-red-600">{vehicleRcError}</p> : null}
                              </div>
                              <div className="min-w-0">
                                <LoanAmountSlider
                                  id="service-loan-amount"
                                  value={loanAmount}
                                  onChange={(value) => {
                                    setLoanAmount(value);
                                    setLoanAmountError("");
                                  }}
                                  min={loanBounds?.min}
                                  max={loanBounds?.max}
                                  placeholder={
                                    loanBounds
                                      ? `₹${loanBounds.min.toLocaleString("en-IN")} – ₹${loanBounds.max.toLocaleString("en-IN")}`
                                      : ""
                                  }
                                  required
                                  error={loanAmountError}
                                />
                              </div>
                              <div className="min-w-0">
                                <label htmlFor="service-existing-car-loan" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                                  Loan running on this car? <span className="text-red-500">*</span>
                                </label>
                                <select
                                  id="service-existing-car-loan"
                                  value={existingCarLoan}
                                  onChange={(e) => {
                                    const next = e.target.value === "yes" || e.target.value === "no" ? e.target.value : "";
                                    setExistingCarLoan(next);
                                    setExistingCarLoanError("");
                                  }}
                                  className={inputClass}
                                  required
                                >
                                  <option value="">Select</option>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                                {existingCarLoanError ? (
                                  <p className="mt-1 text-xs text-red-600">{existingCarLoanError}</p>
                                ) : null}
                              </div>
                            </>
                          ) : (
                            <>
                          <div className="min-w-0 sm:col-span-2">
                            <LoanAmountSlider
                              id="service-loan-amount"
                              value={loanAmount}
                              onChange={(value) => {
                                setLoanAmount(value);
                                setLoanAmountError("");
                              }}
                              min={loanBounds?.min}
                              max={loanBounds?.max}
                              placeholder={
                                loanBounds
                                  ? `₹${loanBounds.min.toLocaleString("en-IN")} – ₹${loanBounds.max.toLocaleString("en-IN")}`
                                  : ""
                              }
                              required
                              error={loanAmountError}
                            />
                          </div>
                          <div className="min-w-0 sm:col-span-2">
                            <label htmlFor="service-cibil" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                              CIBIL score <span className="text-red-500">*</span>
                            </label>
                            <CibilBandSelect
                              id="service-cibil"
                              value={cibilBand}
                              onChange={(value) => {
                                setCibilBand(value);
                                setCibilError("");
                              }}
                              options={VEHICLE_CIBIL_OPTIONS}
                              className={inputClass}
                            />
                            {cibilError ? <p className="mt-1 text-xs text-red-600">{cibilError}</p> : null}
                          </div>
                            </>
                          )}
                          <EmploymentTypeField
                            id="service-employment"
                            value={employmentType}
                            options={LOAN_APPLY_EMPLOYMENT_OPTIONS}
                            onChange={(value) => {
                              setEmploymentType(value);
                              setEmploymentError("");
                            }}
                            className={inputClass}
                            labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                            error={
                              employmentError ? <p className="mt-1 text-xs text-red-600">{employmentError}</p> : null
                            }
                          />
                          <EmploymentIncomeFields
                            idPrefix="service"
                            netMonthlyIncome={netMonthlyIncome}
                            onIncomeChange={(value) => {
                              setNetMonthlyIncome(value);
                              setIncomeError("");
                            }}
                            inputClassName={inputClass}
                            labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                            incomeWithRupee
                            incomeError={
                              incomeError ? <p className="mt-1 text-xs text-red-600">{incomeError}</p> : null
                            }
                          />
                        </>
                      ) : (
                        <>
                          <div className="min-w-0 sm:col-span-2">
                            <label htmlFor="service-cibil" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                              CIBIL score <span className="text-red-500">*</span>
                            </label>
                            <CibilBandSelect
                              id="service-cibil"
                              value={cibilBand}
                              onChange={(value) => {
                                setCibilBand(value);
                                setCibilError("");
                              }}
                              className={inputClass}
                            />
                            {cibilError ? <p className="mt-1 text-xs text-red-600">{cibilError}</p> : null}
                          </div>
                          <EmploymentTypeField
                            id="service-employment"
                            value={employmentType}
                            options={LOAN_APPLY_EMPLOYMENT_OPTIONS}
                            onChange={(value) => {
                              setEmploymentType(value);
                              setEmploymentError("");
                            }}
                            className={inputClass}
                            labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                            error={
                              employmentError ? <p className="mt-1 text-xs text-red-600">{employmentError}</p> : null
                            }
                          />
                          <EmploymentIncomeFields
                            idPrefix="service"
                            netMonthlyIncome={netMonthlyIncome}
                            onIncomeChange={(value) => {
                              setNetMonthlyIncome(value);
                              setIncomeError("");
                            }}
                            inputClassName={inputClass}
                            labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                            incomeWithRupee
                            incomeError={
                              incomeError ? <p className="mt-1 text-xs text-red-600">{incomeError}</p> : null
                            }
                          />
                          <div className="min-w-0">
                            <label htmlFor="service-existing-emi" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                              Do you pay an existing loan EMI? <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="service-existing-emi"
                              value={emiChoice}
                              onChange={(e) => {
                                const next = e.target.value === "yes" || e.target.value === "no" ? e.target.value : "";
                                setEmiChoice(next);
                                setTotalMonthlyEmi(next === "yes" ? "" : "0");
                                setEmiChoiceError("");
                                setEmiAmountError("");
                              }}
                              className={inputClass}
                              required
                            >
                              <option value="">Select</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                            {emiChoiceError ? <p className="mt-1 text-xs text-red-600">{emiChoiceError}</p> : null}
                          </div>
                          <div className="min-w-0">
                            <label htmlFor="service-total-emi" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                              Total monthly EMI you already pay ? <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80">
                              <span
                                className="theme-gradient-text pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold leading-none"
                                aria-hidden
                              >
                                ₹
                              </span>
                              <input
                                id="service-total-emi"
                                type="text"
                                inputMode="numeric"
                                value={emiChoice === "no" ? "0" : totalMonthlyEmi}
                                onChange={(e) => {
                                  setTotalMonthlyEmi(e.target.value.replace(/\D/g, ""));
                                  setEmiAmountError("");
                                }}
                                placeholder={emiChoice === "yes" ? "e.g. 8000" : "0"}
                                readOnly={emiChoice !== "yes"}
                                className="min-h-10 min-w-0 flex-1 bg-transparent py-2 pl-9 pr-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none read-only:text-gray-500 dark:text-white"
                                required
                              />
                            </div>
                            {emiAmountError ? <p className="mt-1 text-xs text-red-600">{emiAmountError}</p> : null}
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}

                  {isCreditCard && loanStep === 2 ? (
                    <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="min-w-0">
                        <label
                          htmlFor="service-credit-card-kind"
                          className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                        >
                          Card type <span className="text-red-500">*</span>
                        </label>
                        <VehicleCategorySelect
                          id="service-credit-card-kind"
                          value={creditCardKind}
                          onChange={(value) => {
                            const next = value === "fd" || value === "normal" ? value : "";
                            setCreditCardKind(next);
                            setCreditCardKindError("");
                            if (next === "fd") {
                              setCibilBand("");
                              setCibilError("");
                            }
                            if (next === "normal") {
                              setFdAmount("");
                              setFdAmountError("");
                            }
                          }}
                          options={[...CREDIT_CARD_KIND_OPTIONS]}
                          className={inputClass}
                          placeholder="Select card type"
                          requiredMessage="Select Fixed Deposit Credit Card or Normal Credit Card"
                        />
                        {creditCardKindError ? (
                          <p className="mt-1 text-xs text-red-600">{creditCardKindError}</p>
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        {creditCardKind === "fd" ? (
                          <>
                            <label
                              htmlFor="service-fd-amount"
                              className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                            >
                              FD amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80">
                              <span
                                className="theme-gradient-text pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold leading-none"
                                aria-hidden
                              >
                                ₹
                              </span>
                              <input
                                id="service-fd-amount"
                                type="text"
                                inputMode="numeric"
                                value={fdAmount}
                                onChange={(e) => {
                                  setFdAmount(e.target.value.replace(/\D/g, "").slice(0, 10));
                                  setFdAmountError("");
                                }}
                                onBlur={() => {
                                  const amount = Number(fdAmount.replace(/\D/g, ""));
                                  if (fdAmount.trim() && (!Number.isFinite(amount) || amount < 5000)) {
                                    setFdAmountError("FD amount must be at least ₹5,000");
                                  }
                                }}
                                placeholder="Minimum 5000"
                                className="min-h-10 min-w-0 flex-1 bg-transparent py-2 pl-9 pr-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none dark:text-white"
                                required
                                min={5000}
                              />
                            </div>
                            {fdAmountError ? <p className="mt-1 text-xs text-red-600">{fdAmountError}</p> : null}
                          </>
                        ) : creditCardKind === "normal" ? (
                          <>
                            <label
                              htmlFor="service-credit-cibil"
                              className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                            >
                              CIBIL score <span className="text-red-500">*</span>
                            </label>
                            <CibilBandSelect
                              id="service-credit-cibil"
                              value={cibilBand}
                              onChange={(value) => {
                                setCibilBand(value);
                                setCibilError("");
                              }}
                              className={inputClass}
                            />
                            {cibilError ? <p className="mt-1 text-xs text-red-600">{cibilError}</p> : null}
                          </>
                        ) : (
                          <>
                            <label className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                              FD amount / CIBIL score
                            </label>
                            <input
                              type="text"
                              disabled
                              placeholder="Select card type first"
                              className={`${inputClass} cursor-not-allowed opacity-70`}
                            />
                          </>
                        )}
                      </div>
                      <EmploymentTypeField
                        id="service-employment"
                        value={employmentType}
                        options={LOAN_APPLY_EMPLOYMENT_OPTIONS}
                        onChange={(value) => {
                          setEmploymentType(value);
                          setEmploymentError("");
                        }}
                        className={inputClass}
                        labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                        error={
                          employmentError ? <p className="mt-1 text-xs text-red-600">{employmentError}</p> : null
                        }
                      />
                      <EmploymentIncomeFields
                        idPrefix="service"
                        netMonthlyIncome={netMonthlyIncome}
                        onIncomeChange={(value) => {
                          setNetMonthlyIncome(value);
                          setIncomeError("");
                        }}
                        inputClassName={inputClass}
                        labelClassName="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300"
                        incomeWithRupee
                        incomeError={
                          incomeError ? <p className="mt-1 text-xs text-red-600">{incomeError}</p> : null
                        }
                      />
                      <div className="min-w-0">
                        <label htmlFor="service-existing-emi" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                          Do you pay an existing loan EMI? <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="service-existing-emi"
                          value={emiChoice}
                          onChange={(e) => {
                            const next = e.target.value === "yes" || e.target.value === "no" ? e.target.value : "";
                            setEmiChoice(next);
                            setTotalMonthlyEmi(next === "yes" ? "" : "0");
                            setEmiChoiceError("");
                            setEmiAmountError("");
                          }}
                          className={inputClass}
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        {emiChoiceError ? <p className="mt-1 text-xs text-red-600">{emiChoiceError}</p> : null}
                      </div>
                      <div className="min-w-0">
                        <label htmlFor="service-total-emi" className="mb-1.5 block text-sm font-medium text-midnight_text dark:text-gray-300">
                          Total monthly EMI you already pay ? <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex min-h-10 items-center overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-primary/70 dark:border-dark_border dark:bg-darkmode/80">
                          <span
                            className="theme-gradient-text pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold leading-none"
                            aria-hidden
                          >
                            ₹
                          </span>
                          <input
                            id="service-total-emi"
                            type="text"
                            inputMode="numeric"
                            value={emiChoice === "no" ? "0" : totalMonthlyEmi}
                            onChange={(e) => {
                              setTotalMonthlyEmi(e.target.value.replace(/\D/g, ""));
                              setEmiAmountError("");
                            }}
                            placeholder={emiChoice === "yes" ? "e.g. 8000" : "0"}
                            readOnly={emiChoice !== "yes"}
                            className="min-h-10 min-w-0 flex-1 bg-transparent py-2 pl-9 pr-3 text-base text-midnight_text placeholder:text-gray-400 focus:outline-none read-only:text-gray-500 dark:text-white"
                            required
                          />
                        </div>
                        {emiAmountError ? <p className="mt-1 text-xs text-red-600">{emiAmountError}</p> : null}
                      </div>
                    </div>
                  ) : null}

                  <TermsAgreementCheckbox
                    id="service-terms"
                    variant="lead"
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    textClassName="text-xs leading-snug text-gray-600 dark:text-gray-400 sm:text-sm"
                  />

                  <div className={multiStep ? "w-full" : "mt-auto w-full pt-2 sm:pt-3"}>
                    {multiStep && loanStep === 1 ? (
                      <button
                        type="button"
                        onClick={(e) => goToLoanStep2(e.currentTarget.form)}
                        className={`inline-flex w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap btn-gradient px-4 text-sm font-semibold text-white shadow-md sm:text-base ${loanTabs ? "min-h-12 rounded-full py-3" : "min-h-[44px] rounded-xl py-2.5 sm:rounded-2xl sm:py-3"}`}
                      >
                        {isCreditCard ? "Continue" : lockVehicleCategory ? "Get Loan Offer" : "Check Eligibility"}
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                          <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmittingForm}
                        className={`inline-flex w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap btn-gradient px-4 text-sm font-semibold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${loanTabs ? "min-h-12 rounded-full py-3" : "min-h-[44px] rounded-xl py-2.5 sm:rounded-2xl sm:py-3"}`}
                      >
                        {isSubmittingForm
                          ? "Submitting…"
                          : lockVehicleCategory
                            ? "Get Loan Offer"
                            : loanTabs
                              ? "Check Eligibility"
                              : "Apply Now"}
                        {!isSubmittingForm && loanTabs ? (
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : null}
                      </button>
                    )}
                    {showLoanAmount ? (
                      <LeadCreditDisclaimer className="mt-2 text-xs" />
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
            {aboveForm ? <div className="mt-8 w-full min-w-0 sm:mt-10 lg:hidden">{aboveForm}</div> : null}
          </div>

          <div className="flex min-w-0 order-2 lg:order-2 w-full items-center justify-center lg:col-span-5" data-aos="fade-left">
            <Image
              src={`${imageSrc}${imageSrc.includes("?") ? "&" : "?"}v=2`}
              alt={title}
              width={640}
              height={480}
              className={
                imageClassName ??
                "block h-auto w-full max-w-[560px] object-contain lg:max-w-none"
              }
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
