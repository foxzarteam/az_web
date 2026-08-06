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
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // Host-level www → apex is handled in middleware.ts (308).
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
      // Legacy soft URLs → trailing-slash product routes
      {
        source: "/personal-loan",
        destination: "/products/personal-loan/",
        permanent: true,
      },
      {
        source: "/insurance",
        destination: "/products/insurance/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/city/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/vdo/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /** Keep in sync with any `quality={…}` props — mismatch causes hydration srcSet diffs. */
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
