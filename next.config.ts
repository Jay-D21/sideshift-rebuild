import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack for production build — Turbopack has issues with Tailwind v4 @layer properties
  experimental: {},
};

export default nextConfig;