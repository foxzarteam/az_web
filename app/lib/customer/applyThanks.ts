import {
  PUBLIC_ADS_CONVERSION_LABEL,
  PUBLIC_GOOGLE_ADS_ID,
} from "@/app/config/publicEnv";

const KEY = "az_apply_thanks";

export type ApplyThanksPayload = {
  name: string;
  product: string;
};

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "ji";
}

export function stashApplyThanks(payload: ApplyThanksPayload): void {
  if (typeof sessionStorage === "undefined") return;
  const name = payload.name.trim();
  const product = payload.product.trim();
  if (!product) return;
  sessionStorage.setItem(KEY, JSON.stringify({ name, product }));
  trackApplyConversion(product);
}

function trackApplyConversion(product: string): void {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "apply_success", product });
  const ads = PUBLIC_GOOGLE_ADS_ID;
  const label = PUBLIC_ADS_CONVERSION_LABEL;
  if (ads && label && typeof w.gtag === "function") {
    w.gtag("event", "conversion", { send_to: `${ads}/${label}` });
  }
}

export function takeApplyThanks(): ApplyThanksPayload | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ApplyThanksPayload>;
    const name = String(parsed.name ?? "").trim();
    const product = String(parsed.product ?? "").trim();
    if (!product) return null;
    return { name, product };
  } catch {
    return null;
  }
}

export function applyThanksCopy(payload: ApplyThanksPayload): { title: string; body: string } {
  const who = firstName(payload.name);
  return {
    title: `Thank you, ${who}!`,
    body: `Your ${payload.product} application has been submitted successfully. You can check your application status on your dashboard.`,
  };
}
