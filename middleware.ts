import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AFFILIATE_COOKIE,
  AFFILIATE_MAX_AGE_SEC,
  normalizeAffiliateCode,
} from "@/app/lib/affiliate/code";

/**
 * Force single SEO host: www → apex (https://apnizaroorat.com).
 * Fresh HTML for public pages (short CDN cache) so re-deploys surface new meta.
 * Strong X-Robots-Tag for private routes (index only marketing).
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0];

  if (host === "www.apnizaroorat.com") {
    const url = request.nextUrl.clone();
    url.hostname = "apnizaroorat.com";
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const path = request.nextUrl.pathname;

  const pathRef = path.match(/^\/r\/([A-Za-z0-9]{6,12})\/?$/i);
  if (pathRef) {
    const code = normalizeAffiliateCode(pathRef[1]);
    const dest = request.nextUrl.clone();
    dest.pathname = code ? "/products/" : "/";
    dest.search = "";
    const res = NextResponse.redirect(dest);
    if (code) {
      res.cookies.set(AFFILIATE_COOKIE, code, {
        path: "/",
        maxAge: AFFILIATE_MAX_AGE_SEC,
        sameSite: "lax",
      });
    }
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const res = NextResponse.next();

  const refCode = normalizeAffiliateCode(request.nextUrl.searchParams.get("ref") ?? "");
  if (refCode) {
    res.cookies.set(AFFILIATE_COOKIE, refCode, {
      path: "/",
      maxAge: AFFILIATE_MAX_AGE_SEC,
      sameSite: "lax",
    });
  }

  const isPrivate =
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/customer") ||
    path.startsWith("/agent");

  if (isPrivate) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  // Public HTML / sitemap / robots — short edge cache, always revalidate at origin
  if (
    path === "/sitemap.xml" ||
    path === "/robots.txt" ||
    !path.includes(".") ||
    path.endsWith(".xml") ||
    path.endsWith(".txt")
  ) {
    res.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    );
    res.headers.set(
      "X-Robots-Tag",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * All paths except Next internals / static hashes.
     * Still redirects page + sitemap + robots under www.
     */
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
