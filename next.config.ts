import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPE_CHECK,
  },
};

export default nextConfig;
