import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Force single SEO host: www → apex (https://apnizaroorat.com).
 * Matches sitemap, canonicals, and GSC property.
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

  return NextResponse.next();
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
