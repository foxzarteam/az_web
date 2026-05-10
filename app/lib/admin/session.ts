import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (at least 16 characters)");
  }
  return s;
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

export async function getAdminSession(): Promise<{ sub: string; email: string; role: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const p = verifyToken(token);
  if (!p) return null;
  return { sub: p.sub, email: p.email, role: p.role };
}

export function createSessionToken(payload: { sub: string; email: string; role: string }): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  return signPayload({ ...payload, exp });
}

export async function setAdminSessionCookie(payload: { sub: string; email: string; role: string }) {
  const token = createSessionToken(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SEC,
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
