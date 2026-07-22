import type { MetadataRoute } from 'next';
import { listPages } from '@/lib/content';

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (raw) {
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveSiteUrl();
  const now = new Date();

  const slugs = listPages();

  const pages: MetadataRoute.Sitemap = slugs.map((slug) => {
    const isHome = slug === 'home';
    const pathname = isHome ? '/' : `/${slug}`;

    return {
      url: `${baseUrl}${pathname}`,
      lastModified: now,
      changeFrequency: isHome ? 'weekly' : 'monthly',
      priority: isHome ? 1 : 0.8,
    };
  });

  // Static pages mounted into public/ at deploy time, invisible to listPages().
  pages.push({
    url: `${baseUrl}/summer-money`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  });

  return pages;
}
