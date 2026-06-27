import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { PUBLIC_API_BASE_URL } from "@/app/config/constants";
import { firebaseWebConfig, isFirebaseWebConfigured } from "./config";

const RECAPTCHA_CONTAINER_ID = "lead-recaptcha-container";

let recaptchaVerifier: RecaptchaVerifier | null = null;

function firebaseAuthErrorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code: string }).code);
  }
  return "";
}

export function getFirebaseOtpSendErrorMessage(error: unknown): string {
  if (!isFirebaseWebConfigured()) {
    return "OTP setup incomplete. Add NEXT_PUBLIC_FIREBASE_APP_ID on az_web and redeploy.";
  }

  switch (firebaseAuthErrorCode(error)) {
    case "auth/unauthorized-domain":
      return "This website domain is not allowed in Firebase. Add it under Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Phone sign-in is disabled in Firebase Console. Enable it under Authentication → Sign-in method → Phone.";
    case "auth/invalid-app-credential":
    case "auth/app-not-authorized":
      return "Firebase web app config is wrong. Check NEXT_PUBLIC_FIREBASE_APP_ID on az_web (create a Web app in Firebase Console).";
    case "auth/captcha-check-failed":
      return "Security check failed. Refresh the page and try again.";
    case "auth/too-many-requests":
      return "Too many OTP requests. Please wait a few minutes and try again.";
    case "auth/quota-exceeded":
      return "SMS limit reached for today. Try again later.";
    case "auth/invalid-phone-number":
      return "Invalid mobile number. Enter a valid 10-digit Indian number.";
    default:
      return "Failed to send OTP. Please try again.";
  }
}

function getFirebaseAuth() {
  if (getApps().length === 0) {
    initializeApp(firebaseWebConfig);
  }
  return getAuth();
}

export function resetRecaptcha(containerId = RECAPTCHA_CONTAINER_ID): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      /* ignore */
    }
    recaptchaVerifier = null;
  }
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = "";
}

function ensureRecaptcha(containerId: string): RecaptchaVerifier {
  resetRecaptcha(containerId);
  const auth = getFirebaseAuth();
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
  return recaptchaVerifier;
}

export async function sendFirebasePhoneOtp(
  mobileDigits: string,
  containerId = RECAPTCHA_CONTAINER_ID,
): Promise<ConfirmationResult> {
  if (!isFirebaseWebConfigured()) {
    throw new Error("auth/missing-web-app-id");
  }
  const auth = getFirebaseAuth();
  const verifier = ensureRecaptcha(containerId);
  return signInWithPhoneNumber(auth, `+91${mobileDigits}`, verifier);
}

export async function verifyPhoneOtp(
  confirmation: ConfirmationResult,
  otp: string,
  mobileDigits: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await confirmation.confirm(otp);
    const idToken = await result.user.getIdToken();
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/otp/verify-firebase`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber: mobileDigits, idToken }),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    return { success: data.success === true, message: data.message };
  } catch {
    return { success: false, message: "Invalid OTP. Please try again." };
  }
}

export { RECAPTCHA_CONTAINER_ID };
