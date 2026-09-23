import fs from 'node:fs';
import path from 'node:path';
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

/**
 * Real edit date for a page, taken from its JSON file's mtime.
 *
 * Using `new Date()` here would stamp every URL with the build time, which
 * makes all lastmod values identical on every deploy — a signal Google
 * discounts. Falls back to now only if the file can't be stat'd.
 */
function pageLastModified(slug: string): Date {
  try {
    return fs.statSync(path.join(process.cwd(), 'content', 'pages', `${slug}.json`)).mtime;
  } catch {
    return new Date();
  }
}

function staticFileLastModified(...segments: string[]): Date {
  try {
    return fs.statSync(path.join(process.cwd(), 'public', ...segments)).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveSiteUrl();

  const slugs = listPages();

  const pages: MetadataRoute.Sitemap = slugs.map((slug) => {
    const isHome = slug === 'home';
    const pathname = isHome ? '/' : `/${slug}`;

    return {
      url: `${baseUrl}${pathname}`,
      lastModified: pageLastModified(slug),
      changeFrequency: isHome ? 'weekly' : 'monthly',
      priority: isHome ? 1 : 0.8,
    };
  });

  // Static pages mounted into public/ at deploy time, invisible to listPages().
  pages.push({
    url: `${baseUrl}/summer-money`,
    lastModified: staticFileLastModified('summer-money', 'index.html'),
    changeFrequency: 'monthly',
    priority: 0.9,
  });

  // The blog is a separate app proxied at /blog/. It is not in listPages(),
  // so without this entry it is absent from the sitemap entirely.
  pages.push({
    url: `${baseUrl}/blog/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  return pages;
}
