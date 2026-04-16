import Script from 'next/script';

// Fleet-wide analytics. Silent when PLAUSIBLE_DOMAIN or PLAUSIBLE_SRC unset —
// lets sites opt in by setting env vars on the server without any other change.
export function PlausibleScript() {
  const domain = process.env.PLAUSIBLE_DOMAIN;
  const src = process.env.PLAUSIBLE_SRC;
  if (!domain || !src) return null;
  return <Script defer data-domain={domain} src={src} strategy="afterInteractive" />;
}
