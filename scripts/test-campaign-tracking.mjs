function shouldFireAdsGtag(input) {
  if (input.gtmId) return false;
  return Boolean(input.adsId && input.label && input.gtagReady);
}

function shouldFireMetaLead(input) {
  if (input.gtmId) return false;
  return Boolean(input.pixelId && input.fbqReady);
}

function claimApplyConversion(product, storage) {
  const key = String(product ?? "").trim();
  if (!key) return false;
  const prev = storage.getItem("az_apply_conv") ?? "";
  const seen = prev ? prev.split("|") : [];
  if (seen.includes(key)) return false;
  storage.setItem("az_apply_conv", [...seen, key].join("|"));
  return true;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(
  shouldFireAdsGtag({ gtmId: "GTM-X", adsId: "AW-1", label: "lab", gtagReady: true }) === false,
  "GTM path must not also fire gtag conversion",
);
assert(
  shouldFireAdsGtag({ gtmId: "", adsId: "AW-1", label: "lab", gtagReady: true }) === true,
  "Ads-only gtag conversion",
);
assert(
  shouldFireMetaLead({ gtmId: "GTM-X", pixelId: "123456789", fbqReady: true }) === false,
  "GTM path must not also fire Meta Lead",
);
assert(
  shouldFireMetaLead({ gtmId: "", pixelId: "123456789", fbqReady: true }) === true,
  "Meta-only Lead",
);

const mem = (() => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
  };
})();
assert(claimApplyConversion("Personal Loan", mem) === true, "first conversion");
assert(claimApplyConversion("Personal Loan", mem) === false, "duplicate blocked");
assert(claimApplyConversion("Insurance", mem) === true, "other product allowed");

console.log("test-campaign-tracking: ok");
