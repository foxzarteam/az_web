import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AFFILIATE_COOKIE, normalizeAffiliateCode } from "@/app/lib/affiliate/code";

/** Drop legacy `az_ref` cookie — attribution is URL-only now. */
function clearAffiliateCookie(res: NextResponse) {
  res.cookies.set(AFFILIATE_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Force single SEO host: www → apex (https://apnizaroorat.com).
 * Partner `/r/:code` rewrites to products hub — browser URL stays `/r/:code`.
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
    if (!code) {
      const bad = NextResponse.redirect(new URL("/", request.url));
      clearAffiliateCookie(bad);
      return bad;
    }
    // Rewrite keeps address bar as `/r/CODE` while serving products hub content.
    // trailingSlash: true → destination must be `/products/`.
    const dest = request.nextUrl.clone();
    dest.pathname = "/products/";
    dest.search = "";
    const res = NextResponse.rewrite(dest);
    clearAffiliateCookie(res);
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const res = NextResponse.next();
  clearAffiliateCookie(res);

  const isPrivate =
    path.startsWith("/admin") ||
    path.startsWith("/partner") ||
    path.startsWith("/api") ||
    path.startsWith("/customer");

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
