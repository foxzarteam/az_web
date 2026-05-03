import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  /** Static hosts (Apache/cPanel e.g. Verpex) serve `/about/` as `about/index.html`; without this, `/about/` refresh can 404. */
  trailingSlash: true,
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
