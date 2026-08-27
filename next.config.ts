import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  // Use webpack for production build — Turbopack has issues with Tailwind v4 @layer properties
  experimental: {},
};

export default nextConfig;