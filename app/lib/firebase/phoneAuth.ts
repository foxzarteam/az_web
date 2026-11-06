/**
 * Firebase phone OTP is disabled site-wide.
 * Lead apply and customer login no longer send SMS — these stubs stay so old
 * imports do not crash, and never touch Firebase.
 */

const DISABLED = "OTP is disabled. Submit the form without OTP.";

export const RECAPTCHA_CONTAINER_ID = "lead-recaptcha-container";

export function getFirebaseOtpSendErrorMessage(_error: unknown): string {
  return DISABLED;
}

export function warmFirebaseAuth(_containerId = RECAPTCHA_CONTAINER_ID): void {}

export function resetRecaptcha(_containerId = RECAPTCHA_CONTAINER_ID): void {}

export function primeOtpRecaptcha(_containerId = RECAPTCHA_CONTAINER_ID): void {}

export async function requestOtpSendSlot(
  _mobileDigits: string,
): Promise<{ allowed: boolean; message?: string; remainingSends?: number; dailyLimit?: boolean }> {
  return { allowed: false, message: DISABLED, remainingSends: 0 };
}

export async function sendFirebasePhoneOtp(
  _mobileDigits: string,
  _containerId = RECAPTCHA_CONTAINER_ID,
): Promise<never> {
  const err = new Error(DISABLED) as Error & { code?: string };
  err.code = "otp/disabled";
  throw err;
}

export type VerifyPhoneOtpOptions = {
  syncServer?: boolean;
};

export async function verifyPhoneOtp(
  _confirmation: unknown,
  _otp: string,
  _mobileDigits: string,
  _options: VerifyPhoneOtpOptions = {},
): Promise<{ success: boolean; message?: string; idToken?: string }> {
  return { success: false, message: DISABLED };
}
