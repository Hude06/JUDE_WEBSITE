import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadPage, listPages, loadSiteConfig } from '@/lib/content';
import { resolveReveal } from '@/lib/motion-engine';
import { resolveThemeStructure } from '@/lib/themes';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { buildFaqSchema } from '@/lib/faq-schema';
import { clientBlocks } from '@client/registry';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const blockRegistry = { ...frameworkBlocks, ...clientBlocks };
const config = loadSiteConfig();

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listPages()
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const page = loadPage(slug);
    const canonicalPath = `/${slug}`;
    const description =
      page.description ??
      `${page.title} — custom website design and development by Jude Hill in Eugene, Oregon.`;
    const shareImage = '/uploads/seo-share-image.png';

    return {
      title: page.title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title: page.title,
        description,
        url: canonicalPath,
        type: 'website',
        siteName: config.siteName,
        locale: 'en_US',
        images: [
          {
            url: shareImage,
            width: 1200,
            height: 630,
            alt: `${page.title} — Jude Hill`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: page.title,
        description,
        images: [shareImage],
      },
    };
  } catch {
    return {
      title: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  let page;
  try {
    page = loadPage(slug);
  } catch {
    notFound();
  }
  const faqSchema = buildFaqSchema(page.blocks, `${siteUrl}/${slug}`);
  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlockRenderer
        blocks={page.blocks}
        registry={blockRegistry}
        reveal={resolveReveal(config)}
        dna={resolveThemeStructure(config.theme?.preset, config.theme?.system)}
      />
    </>
  );
}
