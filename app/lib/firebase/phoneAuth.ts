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

const MSG_OTP_DAILY_LIMIT =
  "OTP limit reached for this mobile number. Please try again tomorrow.";

let recaptchaVerifier: RecaptchaVerifier | null = null;

function parseFirebaseError(error: unknown): { code: string; message: string } {
  if (error == null) return { code: "", message: "Unknown error" };
  if (typeof error === "object") {
    const e = error as { code?: string; message?: string };
    const code = e.code?.trim() ?? "";
    const message = (e.message?.trim() || (error instanceof Error ? error.message : "")).trim();
    if (code) return { code, message };
    if (message.startsWith("auth/")) {
      const space = message.indexOf(" ");
      return {
        code: space === -1 ? message : message.slice(0, space),
        message: space === -1 ? "" : message.slice(space + 1).trim(),
      };
    }
    return { code: "", message: message || "Unknown error" };
  }
  return { code: "", message: String(error) };
}

const OTP_SEND_HINTS: Record<string, string> = {
  "auth/missing-web-app-id":
    "Firebase Web app ID missing. Set NEXT_PUBLIC_FIREBASE_APP_ID on az_web and redeploy.",
  "auth/unauthorized-domain":
    "Add your site in Firebase → Authentication → Settings → Authorized domains.",
  "auth/operation-not-allowed":
    "Enable Phone sign-in in Firebase Console → Authentication → Sign-in method.",
  "auth/invalid-app-credential":
    "Check NEXT_PUBLIC_FIREBASE_* env vars on az_web match your Firebase Web app.",
  "auth/captcha-check-failed":
    "Security check failed. Refresh the page and disable ad-blockers.",
  "auth/quota-exceeded":
    "Daily SMS limit reached (new projects: 10/day). Try tomorrow or add billing.",
  "auth/billing-not-enabled":
    "Firebase billing is not enabled. Console → ⚙️ Project settings → Usage and billing → Upgrade to Blaze plan (pay-as-you-go). Phone OTP SMS requires Blaze.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes.",
  "auth/invalid-phone-number": "Invalid mobile number.",
};

function formatOtpError(error: unknown, hints: Record<string, string>, fallback: string): string {
  const { code, message } = parseFirebaseError(error);
  const hint = code ? hints[code] : "";
  const technical = [code, message].filter(Boolean).join(": ");
  if (hint && technical) return `${hint} [${technical}]`;
  if (hint) return hint;
  if (technical) return `${fallback} [${technical}]`;
  return fallback;
}

export function getFirebaseOtpSendErrorMessage(error: unknown): string {
  if (!isFirebaseWebConfigured()) {
    return OTP_SEND_HINTS["auth/missing-web-app-id"];
  }
  if (error != null && typeof error === "object") {
    const e = error as { code?: string; message?: string };
    if (e.code === "otp/daily-limit") {
      return e.message?.trim() || MSG_OTP_DAILY_LIMIT;
    }
  }
  console.error("[Firebase OTP send failed]", error);
  return formatOtpError(error, OTP_SEND_HINTS, "Failed to send OTP. Please try again.");
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

export async function requestOtpSendSlot(
  mobileDigits: string,
): Promise<{ allowed: boolean; message?: string; remainingSends?: number; dailyLimit?: boolean }> {
  const mobile = mobileDigits.replace(/\D/g, "");
  if (mobile.length !== 10) {
    return { allowed: false, message: "Invalid mobile number." };
  }

  const endpoint = `${PUBLIC_API_BASE_URL}/api/otp/request-send`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobileNumber: mobile }),
    });

    let data: {
      success?: boolean;
      message?: string;
      remainingSends?: number;
      retryNextDay?: boolean;
      error?: string;
      statusCode?: number;
    } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      data = {};
    }

    const msg = (data.message ?? data.error ?? "").toString().trim();

    // Endpoint missing on old deploy only
    if (
      res.status === 404 ||
      /cannot post/i.test(msg) ||
      data.error === "Not Found"
    ) {
      console.warn("[OTP request-send] endpoint missing:", endpoint);
      return {
        allowed: false,
        message: "OTP service is updating. Please try again in a minute.",
      };
    }

    if (res.ok && data.success === true) {
      return {
        allowed: true,
        message: data.message,
        remainingSends: data.remainingSends,
      };
    }

    const isDailyLimit =
      data.retryNextDay === true ||
      (data.success === false &&
        (data.remainingSends === 0 ||
          /otp limit reached|try again tomorrow/i.test(msg)));

    if (isDailyLimit) {
      return {
        allowed: false,
        dailyLimit: true,
        message: msg || MSG_OTP_DAILY_LIMIT,
        remainingSends: 0,
      };
    }

    console.warn("[OTP request-send] blocked", res.status, msg || data);
    return {
      allowed: false,
      message: msg || "Could not send OTP. Please try again.",
    };
  } catch (err) {
    console.warn("[OTP request-send network]", err);
    return {
      allowed: false,
      message: "Network error while starting OTP. Please try again.",
    };
  }
}

export async function sendFirebasePhoneOtp(
  mobileDigits: string,
  containerId = RECAPTCHA_CONTAINER_ID,
): Promise<ConfirmationResult> {
  if (!isFirebaseWebConfigured()) {
    throw new Error("auth/missing-web-app-id Firebase Web app ID is not configured.");
  }

  const slot = await requestOtpSendSlot(mobileDigits);
  if (!slot.allowed) {
    const err = new Error(slot.message || MSG_OTP_DAILY_LIMIT) as Error & { code?: string };
    err.code = slot.dailyLimit ? "otp/daily-limit" : "otp/send-blocked";
    throw err;
  }

  const auth = getFirebaseAuth();
  const verifier = ensureRecaptcha(containerId);
  await verifier.render();
  return signInWithPhoneNumber(auth, `+91${mobileDigits}`, verifier);
}

export async function verifyPhoneOtp(
  confirmation: ConfirmationResult,
  otp: string,
  mobileDigits: string,
): Promise<{ success: boolean; message?: string; idToken?: string }> {
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
    if (!res.ok || data.success !== true) {
      return {
        success: false,
        message: data.message || `Verification failed (HTTP ${res.status}).`,
      };
    }
    return { success: true, message: data.message, idToken };
  } catch (error) {
    console.error("[Firebase OTP verify failed]", error);
    return {
      success: false,
      message: formatOtpError(error, OTP_SEND_HINTS, "Invalid OTP. Please try again."),
    };
  }
}

/** Current Firebase user idToken after a recent phone OTP (e.g. chat → skipOtp apply). */
export async function getCurrentFirebaseIdToken(): Promise<string | null> {
  try {
    if (!isFirebaseWebConfigured()) return null;
    const user = getFirebaseAuth().currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

export { RECAPTCHA_CONTAINER_ID };
