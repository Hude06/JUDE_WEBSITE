import type { Metadata } from 'next';
import { loadPage } from '@/lib/content';
import { BlockRenderer } from '@/components/BlockRenderer';

const page = loadPage('home');

export const metadata: Metadata = {
  title: page.title,
};

export default function HomePage() {
  return <BlockRenderer blocks={page.blocks} />;
}
