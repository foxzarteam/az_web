import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const res = NextResponse.next();

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
