import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "customer_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  name: string;
  exp: number;
};

/** Dev-only default. Production requires CUSTOMER_SESSION_SECRET (fail-closed). */
const DEFAULT_CUSTOMER_SESSION_SECRET =
  "a91c7e2f4b6d8e0a1c3f5b7d9e2a4c6f8b0d2e4a6c8f0b2d4e6a8c0f2b4d6e8a";

function getSecret(): string {
  const fromEnv = (process.env.CUSTOMER_SESSION_SECRET ?? "").trim();
  if (fromEnv) {
    if (fromEnv.length < 16) {
      throw new Error("CUSTOMER_SESSION_SECRET must be at least 16 characters");
    }
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("CUSTOMER_SESSION_SECRET is required in production");
  }
  return DEFAULT_CUSTOMER_SESSION_SECRET;
}

function signPayload(payload: SessionPayload): string {
  const body = JSON.stringify(payload);
  const sig = createHmac("sha256", getSecret()).update(body).digest("hex");
  return Buffer.from(`${body}::${sig}`, "utf8").toString("base64url");
}

function verifyToken(token: string): SessionPayload | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const idx = raw.lastIndexOf("::");
    if (idx === -1) return null;
    const body = raw.slice(0, idx);
    const sig = raw.slice(idx + 2);
    const expected = createHmac("sha256", getSecret()).update(body).digest("hex");
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(body) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<{ sub: string; name: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const p = verifyToken(token);
  if (!p) return null;
  return { sub: p.sub, name: p.name };
}

export function createCustomerSessionToken(payload: { sub: string; name: string }): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  return signPayload({ ...payload, exp });
}

export async function setCustomerSessionCookie(payload: { sub: string; name: string }) {
  const token = createCustomerSessionToken(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SEC,
    path: "/",
  });
}

export async function clearCustomerSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
