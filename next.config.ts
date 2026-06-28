import type { NextConfig } from "next";

/**
 * Do not use `output: "export"` while `/admin` exists: admin needs Route Handlers (`/api/admin/*`)
 * and `cookies()` for sessions, which static export cannot provide.
 * Deploy with `next build && next start` (Node), or Vercel / similar. For static-only hosting,
 * use a separate deployment for the marketing site or drop the admin app from that build.
 */
const nextConfig: NextConfig = {
  /** Helps hosts that expect `/about/` → `about/index.html` style URLs. */
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/services/:path*",
        destination: "/products/:path*",
        permanent: true,
      },
      {
        source: "/admin/dashboard/services/:path*",
        destination: "/admin/dashboard/products/:path*",
        permanent: true,
      },
      {
        source: "/products/credit-card/:path*",
        destination: "/products/personal-loan/",
        permanent: true,
      },
      {
        source: "/products/home-loan/:path*",
        destination: "/products/personal-loan/",
        permanent: true,
      },
      {
        source: "/products/business-loan/:path*",
        destination: "/products/personal-loan/",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;
