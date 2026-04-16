import type { Metadata } from 'next';
import { BlockRenderer } from '@/components/BlockRenderer';
import { getAllSamples, ALL_BLOCK_TYPES } from '@/lib/block-samples';
import { listThemes } from '@/lib/themes';
import { UiShowcase } from './ui-showcase';

export const metadata: Metadata = {
  title: 'Block Gallery',
  description: 'Every block type rendered with sample data — a visual reference for AI agents and designers.',
};

export default function GalleryPage() {
  const samples = getAllSamples();
  const themes = listThemes();

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Framework reference
          </p>
          <h1 className="font-heading text-5xl leading-[0.95] tracking-tight md:text-6xl">
            Block gallery
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Every block type in the framework rendered with sample data. Open this page under any
            theme preset by setting <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">theme.preset</code> in{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">content/site.json</code>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border bg-background px-3 py-1">
              {samples.length} blocks
            </span>
            <span className="rounded-full border border-border bg-background px-3 py-1">
              {themes.length} themes
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <ol className="space-y-24">
          {samples.map((block, i) => (
            <li key={block.id} className="scroll-mt-8" id={ALL_BLOCK_TYPES[i]}>
              <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <h2 className="font-heading text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {ALL_BLOCK_TYPES[i]}
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  #{ALL_BLOCK_TYPES[i]}
                </span>
              </div>
              <div className="rounded-xl border border-dashed border-border p-6 md:p-10">
                <BlockRenderer blocks={[block]} />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="mb-12 border-t-2 border-border pt-12">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            UI primitives
          </p>
          <h2 className="font-heading text-4xl leading-[0.95] tracking-tight md:text-5xl">
            Components
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The token-driven primitives that every block composes with. Switch
            theme preset and everything below rerenders in character.
          </p>
        </div>
        <UiShowcase />
      </div>
    </main>
  );
}
