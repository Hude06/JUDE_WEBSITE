import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/BlockRenderer';
import {
  listExamples,
  listExamplePages,
  loadExamplePage,
} from '@/lib/example-content';

interface ExampleSlugProps {
  params: Promise<{ example: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { example: string; slug: string }[] = [];
  for (const example of listExamples()) {
    for (const slug of listExamplePages(example)) {
      if (slug === 'home') continue;
      params.push({ example, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: ExampleSlugProps): Promise<Metadata> {
  const { example, slug } = await params;
  try {
    const page = loadExamplePage(example, slug);
    return { title: page.title };
  } catch {
    return { title: 'Not found' };
  }
}

export default async function ExampleSlugPage({ params }: ExampleSlugProps) {
  const { example, slug } = await params;

  try {
    const page = loadExamplePage(example, slug);
    return <BlockRenderer blocks={page.blocks} />;
  } catch {
    notFound();
  }
}
