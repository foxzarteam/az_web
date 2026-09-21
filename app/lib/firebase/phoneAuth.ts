import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseWebConfig, isFirebaseWebConfigured } from "./config";

const RECAPTCHA_CONTAINER_ID = "lead-recaptcha-container";

const OTP_DAILY_LIMIT = 5;
const MSG_OTP_DAILY_LIMIT =
  `Daily OTP limit reached for this mobile number (max ${OTP_DAILY_LIMIT} OTPs per day). Please try again tomorrow.`;

let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaVerifierContainerId: string | null = null;
/** True after a verifier was used — next send needs a short DOM settle. */
let recaptchaNeedsSettle = false;
let prefetchPromise: Promise<RecaptchaVerifier | null> | null = null;

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
  "auth/missing-web-app-id": "OTP is temporarily unavailable. Please try again later.",
  "auth/unauthorized-domain": "OTP is temporarily unavailable. Please try again later.",
  "auth/operation-not-allowed": "OTP is temporarily unavailable. Please try again later.",
  "auth/invalid-app-credential": "OTP is temporarily unavailable. Please try again later.",
  "auth/captcha-check-failed": "Security check failed. Refresh the page and try again.",
  "auth/quota-exceeded": "Daily SMS limit reached. Please try again tomorrow.",
  "auth/billing-not-enabled": "OTP is temporarily unavailable. Please try again later.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes.",
  "auth/invalid-phone-number": "Invalid mobile number.",
};

function formatOtpError(error: unknown, hints: Record<string, string>, fallback: string): string {
  const { code } = parseFirebaseError(error);
  const hint = code ? hints[code] : "";
  if (hint) return hint;
  return fallback;
}

export function getFirebaseOtpSendErrorMessage(error: unknown): string {
  if (!isFirebaseWebConfigured()) {
    return OTP_SEND_HINTS["auth/missing-web-app-id"];
  }
  if (error != null && typeof error === "object") {
    const e = error as { code?: string; message?: string };
    const msg = (e.message ?? "").trim();
    if (
      e.code === "otp/daily-limit" ||
      /otp limit reached|daily otp limit|try again tomorrow/i.test(msg)
    ) {
      return msg || MSG_OTP_DAILY_LIMIT;
    }
    if (e.code === "otp/send-blocked" && msg) {
      return msg;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.trim();
    if (/otp limit reached|daily otp limit|try again tomorrow/i.test(msg)) {
      return msg || MSG_OTP_DAILY_LIMIT;
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

function ensureRecaptchaHost(containerId: string): HTMLElement {
  let el = document.getElementById(containerId);
  if (el) return el;
  el = document.createElement("div");
  el.id = containerId;
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;left:0;top:0;height:1px;width:1px;overflow:hidden;opacity:0;pointer-events:none;";
  document.body.appendChild(el);
  return el;
}

/** Warm Firebase Auth + invisible reCAPTCHA so Apply Now can send SMS immediately. */
export function warmFirebaseAuth(containerId = RECAPTCHA_CONTAINER_ID): void {
  try {
    if (!isFirebaseWebConfigured()) return;
    getFirebaseAuth();
    if (typeof document === "undefined") return;
    ensureRecaptchaHost(containerId);
    void prefetchRecaptchaVerifier(containerId);
  } catch {
    /* ignore */
  }
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
  recaptchaVerifierContainerId = null;
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = "";
}

/** Replace the container node so Firebase cannot reuse a half-cleared widget. */
function replaceRecaptchaContainer(containerId: string): HTMLElement {
  ensureRecaptchaHost(containerId);
  const el = document.getElementById(containerId);
  if (!el || !el.parentNode) {
    throw new Error("auth/missing-recaptcha Recaptcha container is not in the page.");
  }
  const next = el.cloneNode(false) as HTMLElement;
  next.id = containerId;
  el.parentNode.replaceChild(next, el);
  return next;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function bindVerifier(containerId: string, el: HTMLElement): RecaptchaVerifier {
  const auth = getFirebaseAuth();
  recaptchaVerifier = new RecaptchaVerifier(auth, el, {
    size: "invisible",
    callback: () => {
      /* solved — signInWithPhoneNumber continues */
    },
    "expired-callback": () => {
      resetRecaptcha(containerId);
      recaptchaNeedsSettle = true;
    },
  });
  recaptchaVerifierContainerId = containerId;
  return recaptchaVerifier;
}

/**
 * Fresh invisible reCAPTCHA for each send/resend.
 * Always clears + replaces the DOM node to avoid "already been rendered".
 */
async function createRecaptchaVerifier(containerId: string): Promise<RecaptchaVerifier> {
  resetRecaptcha(containerId);
  replaceRecaptchaContainer(containerId);

  if (recaptchaNeedsSettle) {
    await delay(50);
  } else {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  const el = document.getElementById(containerId);
  if (!el) {
    throw new Error("auth/missing-recaptcha Recaptcha container is not in the page.");
  }

  recaptchaVerifier = bindVerifier(containerId, el);

  try {
    await recaptchaVerifier.render();
  } catch {
    resetRecaptcha(containerId);
    const fresh = replaceRecaptchaContainer(containerId);
    await delay(80);
    recaptchaVerifier = bindVerifier(containerId, fresh);
    await recaptchaVerifier.render();
  }

  return recaptchaVerifier;
}

async function prefetchRecaptchaVerifier(
  containerId: string,
): Promise<RecaptchaVerifier | null> {
  if (typeof document === "undefined" || !isFirebaseWebConfigured()) return null;
  if (recaptchaVerifier && recaptchaVerifierContainerId === containerId) {
    return recaptchaVerifier;
  }
  if (prefetchPromise) return prefetchPromise;
  prefetchPromise = createRecaptchaVerifier(containerId)
    .then((v) => v)
    .catch(() => null)
    .finally(() => {
      prefetchPromise = null;
    });
  return prefetchPromise;
}

async function takeRecaptchaVerifier(containerId: string): Promise<RecaptchaVerifier> {
  if (recaptchaVerifier && recaptchaVerifierContainerId === containerId) {
    return recaptchaVerifier;
  }
  if (prefetchPromise) {
    const primed = await prefetchPromise;
    if (primed && recaptchaVerifierContainerId === containerId) return primed;
  }
  return createRecaptchaVerifier(containerId);
}

export async function requestOtpSendSlot(
  mobileDigits: string,
): Promise<{ allowed: boolean; message?: string; remainingSends?: number; dailyLimit?: boolean }> {
  const mobile = mobileDigits.replace(/\D/g, "");
  if (mobile.length !== 10) {
    return { allowed: false, message: "Invalid mobile number." };
  }

  const endpoint = "/api/otp/request-send";

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
          /otp limit reached|daily otp limit|try again tomorrow/i.test(msg)));

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

  const auth = getFirebaseAuth();
  ensureRecaptchaHost(containerId);

  if (auth.currentUser) {
    try {
      await auth.signOut();
    } catch {
      /* ignore */
    }
  }

  const [slot, verifier] = await Promise.all([
    requestOtpSendSlot(mobileDigits),
    takeRecaptchaVerifier(containerId),
  ]);
  if (!slot.allowed) {
    const err = new Error(slot.message || MSG_OTP_DAILY_LIMIT) as Error & { code?: string };
    err.code = slot.dailyLimit ? "otp/daily-limit" : "otp/send-blocked";
    throw err;
  }

  try {
    const confirmation = await signInWithPhoneNumber(
      auth,
      `+91${mobileDigits}`,
      verifier,
    );
    recaptchaNeedsSettle = true;
    recaptchaVerifier = null;
    recaptchaVerifierContainerId = null;
    void prefetchRecaptchaVerifier(containerId);
    return confirmation;
  } catch (error) {
    resetRecaptcha(containerId);
    recaptchaNeedsSettle = true;
    throw error;
  }
}

export type VerifyPhoneOtpOptions = {
  /**
   * When false, only Firebase confirm runs (no Nest /otp/verify-firebase).
   * Use when the next call (e.g. customer login) already verifies the idToken.
   */
  syncServer?: boolean;
};

export async function verifyPhoneOtp(
  confirmation: ConfirmationResult,
  otp: string,
  mobileDigits: string,
  options: VerifyPhoneOtpOptions = {},
): Promise<{ success: boolean; message?: string; idToken?: string }> {
  const syncServer = options.syncServer !== false;
  try {
    const result = await confirmation.confirm(otp);
    // Prefer cached token right after confirm — avoids an extra network round-trip.
    const idToken = await result.user.getIdToken(/* forceRefresh */ false);

    if (syncServer) {
      void fetch("/api/otp/verify-firebase", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobileNumber: mobileDigits, idToken }),
        credentials: "same-origin",
        keepalive: true,
      }).catch(() => undefined);
    }

    return { success: true, idToken };
  } catch (error) {
    console.error("[Firebase OTP verify failed]", error);
    return {
      success: false,
      message: "Invalid OTP. Please try again.",
    };
  }
}

/** Current Firebase user idToken after a recent phone OTP (e.g. chat → skipOtp apply). */
export async function getCurrentFirebaseIdToken(): Promise<string | null> {
  try {
    if (!isFirebaseWebConfigured()) return null;
    const user = getFirebaseAuth().currentUser;
    if (!user) return null;
    return await user.getIdToken(false);
  } catch {
    return null;
  }
}

export { RECAPTCHA_CONTAINER_ID };
