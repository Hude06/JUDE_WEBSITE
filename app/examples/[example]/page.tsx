import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/BlockRenderer';
import { listExamples, loadExamplePage } from '@/lib/example-content';

interface ExampleHomeProps {
  params: Promise<{ example: string }>;
}

export async function generateStaticParams() {
  return listExamples().map((example) => ({ example }));
}

export async function generateMetadata({
  params,
}: ExampleHomeProps): Promise<Metadata> {
  const { example } = await params;
  try {
    const page = loadExamplePage(example, 'home');
    return { title: page.title };
  } catch {
    return { title: 'Example not found' };
  }
}

export default async function ExampleHome({ params }: ExampleHomeProps) {
  const { example } = await params;

  try {
    const page = loadExamplePage(example, 'home');
    return <BlockRenderer blocks={page.blocks} />;
  } catch {
    notFound();
  }
}
