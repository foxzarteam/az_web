import {
  PUBLIC_ADS_CONVERSION_LABEL,
  PUBLIC_GOOGLE_ADS_ID,
  PUBLIC_GTM_ID,
  PUBLIC_META_PIXEL_ID,
} from "@/app/config/publicEnv";
import {
  claimApplyConversion,
  shouldFireAdsGtag,
  shouldFireMetaLead,
} from "@/app/lib/campaignTracking";

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
  if (!claimApplyConversion(product, window.sessionStorage)) return;
  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "apply_success", product });
  if (
    shouldFireAdsGtag({
      gtmId: PUBLIC_GTM_ID,
      adsId: PUBLIC_GOOGLE_ADS_ID,
      label: PUBLIC_ADS_CONVERSION_LABEL,
      gtagReady: typeof w.gtag === "function",
    })
  ) {
    w.gtag?.("event", "conversion", { send_to: `${PUBLIC_GOOGLE_ADS_ID}/${PUBLIC_ADS_CONVERSION_LABEL}` });
  }
  if (
    shouldFireMetaLead({
      gtmId: PUBLIC_GTM_ID,
      pixelId: PUBLIC_META_PIXEL_ID,
      fbqReady: typeof w.fbq === "function",
    })
  ) {
    w.fbq?.("track", "Lead");
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
