import Script from 'next/script';

// Superview analytics. Silent when SUPERVIEW_SITE or SUPERVIEW_SRC unset —
// same opt-in-by-env pattern as PlausibleScript.
export function SuperviewScript() {
  const site = process.env.SUPERVIEW_SITE;
  const src = process.env.SUPERVIEW_SRC;
  if (!site || !src) return null;
  return <Script defer data-site={site} src={src} strategy="afterInteractive" />;
}
