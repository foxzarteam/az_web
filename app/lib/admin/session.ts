import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const REVOKED_COOKIE = "admin_session_revoked";
const MAX_AGE_SEC = 60 * 60 * 12;
const MAX_REVOKED = 30;

export type AdminSession = {
  sub: string;
  email: string;
  role: string;
  name?: string;
  mobile?: string;
  code?: string;
};

type SessionPayload = AdminSession & { exp: number; iat: number; jti: string };

/** Local-only placeholder — never use in production. Set ADMIN_SESSION_SECRET in .env.local. */
const DEV_PLACEHOLDER_SECRET = "local-dev-admin-session-not-for-prod";

function getSecret(): string {
  const fromEnv = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
  if (fromEnv) {
    if (fromEnv.length < 16) {
      throw new Error("ADMIN_SESSION_SECRET must be at least 16 characters");
    }
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production");
  }
  return DEV_PLACEHOLDER_SECRET;
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
    if (!payload.jti || typeof payload.iat !== "number") return null;
    return payload;
  } catch {
    return null;
  }
}

function signRevokedList(jtis: string[]): string {
  const body = JSON.stringify(jtis);
  const sig = createHmac("sha256", getSecret()).update(`revoked:${body}`).digest("hex");
  return Buffer.from(`${body}::${sig}`, "utf8").toString("base64url");
}

function verifyRevokedList(token: string): string[] {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const idx = raw.lastIndexOf("::");
    if (idx === -1) return [];
    const body = raw.slice(0, idx);
    const sig = raw.slice(idx + 2);
    const expected = createHmac("sha256", getSecret()).update(`revoked:${body}`).digest("hex");
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return [];
    const list = JSON.parse(body) as unknown;
    if (!Array.isArray(list)) return [];
    return list.filter((j): j is string => typeof j === "string" && j.length > 0);
  } catch {
    return [];
  }
}

async function readRevokedJtis(): Promise<string[]> {
  const store = await cookies();
  const raw = store.get(REVOKED_COOKIE)?.value;
  if (!raw) return [];
  return verifyRevokedList(raw);
}

async function writeRevokedJtis(jtis: string[]) {
  const store = await cookies();
  const trimmed = jtis.slice(0, MAX_REVOKED);
  store.set(REVOKED_COOKIE, signRevokedList(trimmed), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SEC * 2,
    path: "/",
  });
}

export function isAgentRole(role: string | undefined | null): boolean {
  return String(role ?? "").trim().toLowerCase() === "agent";
}

export function isCrmAdminRole(role: string | undefined | null): boolean {
  const r = String(role ?? "").trim().toLowerCase();
  return r === "admin" || r === "staff";
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const p = verifyToken(token);
  if (!p) return null;
  const revoked = await readRevokedJtis();
  if (revoked.includes(p.jti)) return null;
  return {
    sub: p.sub,
    email: p.email,
    role: p.role,
    ...(p.name ? { name: p.name } : {}),
    ...(p.mobile ? { mobile: p.mobile } : {}),
    ...(p.code ? { code: p.code } : {}),
  };
}

export function createSessionToken(payload: AdminSession): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    ...payload,
    exp: now + MAX_AGE_SEC,
    iat: now,
    jti: randomBytes(12).toString("hex"),
  });
}

export async function setAdminSessionCookie(payload: AdminSession) {
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
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    const p = verifyToken(token);
    if (p?.jti) {
      const revoked = await readRevokedJtis();
      const next = [p.jti, ...revoked.filter((j) => j !== p.jti)].slice(0, MAX_REVOKED);
      await writeRevokedJtis(next);
    }
  }
  store.delete(COOKIE_NAME);
}
