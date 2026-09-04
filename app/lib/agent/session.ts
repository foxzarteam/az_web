import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { AgentSession } from "./types";

export type { AgentSession } from "./types";

const COOKIE_NAME = "agent_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

type SessionPayload = AgentSession & { exp: number };

const DEFAULT_SECRET = "az-agent-session-dev-secret-16";

function getSecret(): string {
  const fromEnv = (process.env.CUSTOMER_SESSION_SECRET ?? "").trim();
  if (fromEnv.length >= 16) return `${fromEnv}:agent`;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CUSTOMER_SESSION_SECRET is required in production");
  }
  return DEFAULT_SECRET;
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

export async function getAgentSession(): Promise<AgentSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const p = verifyToken(token);
  if (!p) return null;
  return { sub: p.sub, name: p.name, mobile: p.mobile, code: p.code };
}

export async function setAgentSessionCookie(payload: AgentSession) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const token = signPayload({ ...payload, exp });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SEC,
    path: "/",
  });
}

export async function clearAgentSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
