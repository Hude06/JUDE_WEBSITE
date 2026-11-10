import type { PageContent } from '@/lib/types';

export const SITE_URL = 'https://judemakes.com';
const SITE_NAME = 'Jude Makes Things';

const defaultTitle = 'Web Designer & Developer in Eugene, Oregon — Jude Hill';
const defaultDescription =
  'Web designer and developer in Eugene, Oregon. Hand-coded sites for small businesses, no templates and no page builders. Fast, custom, built to last.';

const shareImage = {
  url: '/uploads/seo-share-image.png',
  width: 1200,
  height: 630,
  alt: 'Jude Hill — web designer & developer, Eugene, Oregon',
};

const keywords = [
  'web designer Eugene Oregon',
  'web developer Eugene Oregon',
  'freelance web designer',
  'small business website design',
  'custom website development',
  'hand-built websites',
  'Jude Hill',
];

function esc(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const meta = (name: string, content: string) => `<meta name="${name}" content="${esc(content)}">`;
const prop = (property: string, content: string | number) =>
  `<meta property="${property}" content="${esc(content)}">`;

/**
 * Everything that goes in <head> for one page: title, description, canonical,
 * Open Graph, Twitter, icons. `page` is null for the 404 page.
 */
export function renderHead(page: PageContent | null): string {
  if (!page) {
    return [
      `<title>Not Found · ${SITE_NAME}</title>`,
      meta('robots', 'noindex, nofollow'),
      ...icons(),
    ].join('\n    ');
  }

  const isHome = page.slug === 'home';
  const url = isHome ? SITE_URL : `${SITE_URL}/${page.slug}`;
  const title = isHome ? defaultTitle : page.title;
  const description = isHome
    ? defaultDescription
    : (page.description ??
      `${page.title} — custom website design and development by Jude Hill in Eugene, Oregon.`);
  const imageAlt = isHome ? shareImage.alt : `${page.title} — Jude Hill`;

  return [
    `<title>${esc(isHome ? defaultTitle : `${page.title} · ${SITE_NAME}`)}</title>`,
    meta('description', description),
    meta('application-name', SITE_NAME),
    `<link rel="author" href="${SITE_URL}">`,
    meta('author', 'Jude Hill'),
    meta('keywords', keywords.join(',')),
    meta('creator', 'Jude Hill'),
    meta('robots', 'index, follow'),
    meta('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1'),
    meta('category', 'design'),
    `<link rel="canonical" href="${url}">`,
    meta('google-site-verification', 'gg8Y1mXbu2qR1Zt32QPMIgbin-CLInFAh26sTCoHzHI'),
    prop('og:title', title),
    prop('og:description', description),
    prop('og:url', url),
    prop('og:site_name', SITE_NAME),
    prop('og:locale', 'en_US'),
    prop('og:image', SITE_URL + shareImage.url),
    prop('og:image:width', shareImage.width),
    prop('og:image:height', shareImage.height),
    prop('og:image:alt', imageAlt),
    prop('og:type', 'website'),
    meta('twitter:card', 'summary_large_image'),
    meta('twitter:title', title),
    meta('twitter:description', description),
    meta('twitter:image', SITE_URL + shareImage.url),
    ...icons(),
  ].join('\n    ');
}

function icons(): string[] {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="48x48 32x32 16x16">',
    '<link rel="icon" href="/uploads/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/uploads/apple-touch-icon.png">',
  ];
}
