export const APPLY_CONVERSION_KEY = "az_apply_conv";

/** GTM container owns Ads/Meta tags. Direct pixels only when GTM is not used. */
export function shouldFireAdsGtag(input: {
  gtmId: string;
  adsId: string;
  label: string;
  gtagReady: boolean;
}): boolean {
  if (input.gtmId) return false;
  return Boolean(input.adsId && input.label && input.gtagReady);
}

export function shouldFireMetaLead(input: {
  gtmId: string;
  pixelId: string;
  fbqReady: boolean;
}): boolean {
  if (input.gtmId) return false;
  return Boolean(input.pixelId && input.fbqReady);
}

/** First apply per product per tab. Repeat stash must not send another conversion. */
export function claimApplyConversion(
  product: string,
  storage: Pick<Storage, "getItem" | "setItem">,
): boolean {
  const key = product.trim();
  if (!key) return false;
  const prev = storage.getItem(APPLY_CONVERSION_KEY) ?? "";
  const seen = prev ? prev.split("|") : [];
  if (seen.includes(key)) return false;
  storage.setItem(APPLY_CONVERSION_KEY, [...seen, key].join("|"));
  return true;
}
