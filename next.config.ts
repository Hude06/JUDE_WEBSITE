import type { NextConfig } from "next";

// Sent on every response. nginx proxies these through untouched, so they do
// not depend on the server-side header snippet in ops/server/.
const securityHeaders = [
  // 1 year. Deliberately no includeSubDomains — blog and other subdomains are
  // not all HTTPS-only yet.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPE_CHECK,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // /portfolio was the old projects URL. It previously fell into a redirect
  // loop: nginx appended a trailing slash because public/portfolio/ existed as
  // a real directory, and Next stripped it straight back off. The directory is
  // gone now; this redirect sends the old URL (and any inbound links to it)
  // somewhere useful instead of 404ing.
  async redirects() {
    return [
      { source: '/portfolio', destination: '/projects', permanent: true },
      { source: '/portfolio/:path*', destination: '/projects', permanent: true },
    ];
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
