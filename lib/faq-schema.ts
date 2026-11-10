import type { BaseBlock } from './types';

interface FaqItem {
  title: string;
  description: string;
}

/* A feature-grid block flagged `"faq": true` in page content doubles as an
   FAQPage for search engines. Every question emitted here is visible on the
   page, which is what Google requires for the rich result. */
export function buildFaqSchema(blocks: BaseBlock[], pageUrl: string): object | null {
  const items: FaqItem[] = [];

  for (const block of blocks) {
    const candidate = block as BaseBlock & { faq?: boolean; items?: FaqItem[] };
    if (candidate.type !== 'feature-grid' || candidate.faq !== true) continue;
    for (const item of candidate.items ?? []) {
      if (item?.title && item?.description) {
        items.push({ title: item.title, description: item.description });
      }
    }
  }

  if (items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.description,
      },
    })),
  };
}
