import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseWebConfig, isFirebaseConfigured } from "./config";

let recaptchaVerifier: RecaptchaVerifier | null = null;

function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured");
  }
  if (getApps().length === 0) {
    initializeApp(firebaseWebConfig);
  }
  return getAuth();
}

export function resetRecaptcha(containerId = "lead-recaptcha-container"): void {
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
  containerId = "lead-recaptcha-container",
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  const verifier = ensureRecaptcha(containerId);
  return signInWithPhoneNumber(auth, `+91${mobileDigits}`, verifier);
}

export async function confirmFirebasePhoneOtp(
  confirmation: ConfirmationResult,
  otp: string,
): Promise<string> {
  const result = await confirmation.confirm(otp);
  const token = await result.user.getIdToken();
  return token;
}
