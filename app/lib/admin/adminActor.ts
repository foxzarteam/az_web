import "server-only";
import { createHmac, randomBytes } from "crypto";

const DEV_FALLBACK = "local-dev-admin-actor-not-for-prod";

function actorSecret(): string {
  const fromEnv = (
    process.env.ADMIN_ACTOR_SECRET ??
    process.env.ADMIN_INTERNAL_KEY ??
    ""
  ).trim();
  if (fromEnv) {
    if (fromEnv.length < 16 && process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_ACTOR_SECRET / ADMIN_INTERNAL_KEY must be at least 16 characters");
    }
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_ACTOR_SECRET or ADMIN_INTERNAL_KEY is required in production");
  }
  return DEV_FALLBACK;
}

/** Sign BFF CRM actor identity for Nest AdminCrmGuard (HMAC SHA256, base64url body::sig). */
export function signAdminActor(input: {
  sub: string;
  email: string;
  role: string;
  ttlSec?: number;
}): string {
  const ttl = input.ttlSec ?? 60 * 10;
  const payload = {
    sub: String(input.sub).trim(),
    email: String(input.email).trim().toLowerCase(),
    role: String(input.role).trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ttl,
    jti: randomBytes(12).toString("hex"),
  };
  const body = JSON.stringify(payload);
  const sig = createHmac("sha256", actorSecret()).update(body).digest("hex");
  return Buffer.from(`${body}::${sig}`, "utf8").toString("base64url");
}
