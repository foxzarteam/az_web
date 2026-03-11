import { MOBILE_VALIDATION } from "@/app/config/constants";

export function validateMobileNumber(mobile: string): { isValid: boolean; error?: string } {
  const digits = mobile.replace(/\D/g, "");
  
  if (digits.length !== MOBILE_VALIDATION.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Please enter a valid ${MOBILE_VALIDATION.MIN_LENGTH}-digit mobile number.`,
    };
  }
  
  return { isValid: true };
}

export function sanitizeMobileInput(input: string): string {
  return input.replace(/\D/g, "").slice(0, MOBILE_VALIDATION.MAX_LENGTH);
}
