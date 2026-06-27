import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { PUBLIC_API_BASE_URL } from "@/app/config/constants";
import { firebaseWebConfig } from "./config";

const RECAPTCHA_CONTAINER_ID = "lead-recaptcha-container";

let recaptchaVerifier: RecaptchaVerifier | null = null;

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
