import "server-only";
import { signAdminActor } from "@/app/lib/admin/adminActor";
import { getAdminSession, isCrmAdminRole } from "@/app/lib/admin/session";

/** Local-only placeholder — must match Nest DEV key. Set ADMIN_INTERNAL_KEY in .env.local. */
const DEV_PLACEHOLDER_KEY = "local-dev-admin-internal-not-for-prod";

export type AdminActorInput = {
  sub: string;
  email: string;
  role: string;
};

export function adminInternalKey(): string {
  const fromEnv = (process.env.ADMIN_INTERNAL_KEY ?? "").trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_INTERNAL_KEY is required in production");
  }
  return DEV_PLACEHOLDER_KEY;
}

export function adminInternalHeaders(
  json = false,
  actor?: AdminActorInput | null,
): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-admin-internal-key": adminInternalKey(),
  };
  if (json) headers["Content-Type"] = "application/json";
  if (actor?.sub && actor.role) {
    headers["x-admin-actor"] = signAdminActor({
      sub: actor.sub,
      email: actor.email ?? "",
      role: actor.role,
    });
  }
  return headers;
}

/** Headers with actor from current admin session (any role). Null if no session. */
export async function adminInternalHeadersFromSession(
  json = false,
): Promise<HeadersInit | null> {
  const session = await getAdminSession();
  if (!session) return null;
  return adminInternalHeaders(json, {
    sub: session.sub,
    email: session.email,
    role: session.role,
  });
}

/** CRM admin/staff fetches — requires signed actor. */
export async function adminCrmHeaders(json = false): Promise<HeadersInit | null> {
  const session = await getAdminSession();
  if (!session || !isCrmAdminRole(session.role)) return null;
  return adminInternalHeaders(json, {
    sub: session.sub,
    email: session.email,
    role: session.role,
  });
}
