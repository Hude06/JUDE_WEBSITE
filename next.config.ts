import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPE_CHECK,
  },
  // Summer Money's static mini-site lives in public/summer-money (mounted
  // into the container at runtime); public/ has no directory-index handling,
  // so map the clean URL to its index.html.
  async rewrites() {
    return [
      { source: '/summer-money', destination: '/summer-money/index.html' },
      { source: '/summer-money/', destination: '/summer-money/index.html' },
    ];
  },
};

export default nextConfig;
