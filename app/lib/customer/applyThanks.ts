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
