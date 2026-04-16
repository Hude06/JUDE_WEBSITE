import type { Metadata } from 'next';
import Link from 'next/link';
import { BlockRenderer } from '@/components/BlockRenderer';
import { getAllSamples, ALL_BLOCK_TYPES } from '@/lib/block-samples';
import { UiShowcase } from '@/app/gallery/ui-showcase';
import { listThemes, loadTheme } from '@/lib/themes';
import {
  listExamples,
  listExamplePages,
  loadExampleSiteConfig,
} from '@/lib/example-content';
import type { Block } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Framework reference',
  description:
    'Every block, every UI primitive, every theme preset — rendered live under the active theme.',
};

interface ExampleEntry {
  name: string;
  siteName: string;
  themePreset?: string;
  pageCount: number;
  pageSlugs: string[];
}

function loadExampleEntries(): ExampleEntry[] {
  return listExamples().flatMap((name): ExampleEntry[] => {
    try {
      const config = loadExampleSiteConfig(name);
      const pageSlugs = listExamplePages(name);
      return [
        {
          name,
          siteName: config.siteName,
          themePreset: config.theme?.preset,
          pageCount: pageSlugs.length,
          pageSlugs,
        },
      ];
    } catch {
      return [];
    }
  });
}

export default function HomePage() {
  const allSamples = getAllSamples();
  const blockSamples: Block[] = allSamples.filter((b) => b.type !== 'section');
  const blockTypes = ALL_BLOCK_TYPES.filter((t) => t !== 'section');
  const themeNames = listThemes();
  const themes = themeNames.map((name) => loadTheme(name));
  const examples = loadExampleEntries();

  return (
    <div className="relative left-1/2 right-1/2 -my-8 -ml-[50vw] -mr-[50vw] w-screen bg-background text-foreground">
      <Hero
        blockCount={blockTypes.length}
        primitiveCount={6}
        themeCount={themes.length}
      />
      <ChapterBlocks samples={blockSamples} types={blockTypes} />
      <ChapterPrimitives />
      <ChapterThemes themes={themes} />
      <ChapterExamples examples={examples} />
      <Coda />
    </div>
  );
}

function Hero({
  blockCount,
  primitiveCount,
  themeCount,
}: {
  blockCount: number;
  primitiveCount: number;
  themeCount: number;
}) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-16 px-4 py-24 md:grid-cols-[1.4fr_1fr] md:px-8 md:py-32">
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            <span className="mr-3 inline-block h-px w-6 translate-y-[-0.2em] bg-muted-foreground align-middle" />
            Framework Reference · Rev. 01
          </p>
          <h1 className="font-heading text-6xl leading-[0.88] tracking-tight text-foreground md:text-7xl lg:text-[8.5rem]">
            Every block.
            <br />
            Every primitive.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A living catalogue of what this framework ships with. Change{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              theme.preset
            </code>{' '}
            in{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              content/site.json
            </code>{' '}
            and every exhibit below reshapes in character.
          </p>
        </div>

        <aside className="flex flex-col justify-end">
          <dl className="grid grid-cols-3 divide-x divide-border border-y border-border">
            <Stat label="Blocks" value={blockCount} />
            <Stat label="Primitives" value={primitiveCount} />
            <Stat label="Themes" value={themeCount} />
          </dl>
          <nav className="mt-10 flex flex-col gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <TocLink href="#chapter-blocks" chapter="I" label="Blocks" />
            <TocLink
              href="#chapter-primitives"
              chapter="II"
              label="Primitives"
            />
            <TocLink href="#chapter-themes" chapter="III" label="Themes" />
            <TocLink href="#chapter-examples" chapter="IV" label="Examples" />
          </nav>
        </aside>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-5 py-4">
      <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-heading text-4xl font-medium leading-none tracking-tight">
        {String(value).padStart(2, '0')}
      </dd>
    </div>
  );
}

function TocLink({
  href,
  chapter,
  label,
}: {
  href: string;
  chapter: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-baseline gap-4 border-b border-border/50 pb-2 transition-colors hover:text-foreground"
    >
      <span className="w-8 text-muted-foreground/60">{chapter}.</span>
      <span className="flex-1">{label}</span>
      <span className="text-muted-foreground/60 transition-transform group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function ChapterHeader({
  numeral,
  title,
  count,
  countLabel,
}: {
  numeral: string;
  title: string;
  count: number;
  countLabel: string;
}) {
  return (
    <div className="mb-20 flex items-baseline justify-between gap-6 border-b border-border pb-6">
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Chapter {numeral}
        </p>
        <h2 className="font-heading text-5xl leading-[0.92] tracking-tight md:text-7xl">
          {title}
        </h2>
      </div>
      <span className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:block">
        {String(count).padStart(2, '0')} {countLabel}
      </span>
    </div>
  );
}

function ChapterBlocks({
  samples,
  types,
}: {
  samples: Block[];
  types: readonly string[];
}) {
  return (
    <section
      id="chapter-blocks"
      className="scroll-mt-8 border-b border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <ChapterHeader
          numeral="I"
          title="Blocks"
          count={samples.length}
          countLabel="entries"
        />
        <ol className="space-y-24">
          {samples.map((block, i) => (
            <li
              key={block.id}
              id={types[i]}
              className="scroll-mt-8"
            >
              <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-heading text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {types[i]}
                  </h3>
                </div>
                <a
                  href={`#${types[i]}`}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  #{types[i]}
                </a>
              </header>
              <div className="rounded-xl border border-dashed border-border p-6 md:p-10">
                <BlockRenderer blocks={[block]} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ChapterPrimitives() {
  return (
    <section
      id="chapter-primitives"
      className="scroll-mt-8 border-b border-border bg-muted/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <ChapterHeader
          numeral="II"
          title="Primitives"
          count={6}
          countLabel="groups"
        />
        <UiShowcase />
      </div>
    </section>
  );
}

function ChapterThemes({
  themes,
}: {
  themes: ReturnType<typeof loadTheme>[];
}) {
  return (
    <section
      id="chapter-themes"
      className="scroll-mt-8 border-b border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <ChapterHeader
          numeral="III"
          title="Themes"
          count={themes.length}
          countLabel="presets"
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {themes.map((theme, i) => (
            <article
              key={theme.name}
              className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground"
            >
              <header className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Preset · {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 font-heading text-3xl leading-tight tracking-tight">
                    {theme.label}
                  </h3>
                </div>
              </header>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {theme.description}
              </p>
              <dl className="mt-auto space-y-2 text-xs">
                <MetaRow label="Font pair" value={theme.fontPair} />
                <MetaRow label="Radius" value={theme.radius} />
                <MetaRow
                  label="Motion"
                  value={`${theme.motion.character} · ${theme.motion.duration}s`}
                />
                {theme.atmosphere && (
                  <MetaRow label="Atmosphere" value={theme.atmosphere} />
                )}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/40 pb-1.5 font-mono">
      <dt className="uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="truncate text-right">{value}</dd>
    </div>
  );
}

function ChapterExamples({ examples }: { examples: ExampleEntry[] }) {
  if (examples.length === 0) return null;

  return (
    <section
      id="chapter-examples"
      className="scroll-mt-8 border-b border-border bg-muted/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <ChapterHeader
          numeral="IV"
          title="Examples"
          count={examples.length}
          countLabel="sites"
        />
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Full template sites assembled from the block library. Each one
          commits to a different theme preset and a different slice of the
          blocks. Click through to see the framework rendering an actual site,
          not a sample grid.
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {examples.map((example, i) => (
            <ExampleCard key={example.name} example={example} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExampleCard({
  example,
  index,
}: {
  example: ExampleEntry;
  index: number;
}) {
  const href = `/examples/${example.name}`;
  return (
    <Link
      href={href}
      className="group flex flex-col gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground transition-colors hover:border-foreground/40"
    >
      <header className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Example · {String(index).padStart(2, '0')}
          </p>
          <h3 className="mt-1 font-heading text-3xl leading-tight tracking-tight">
            {example.siteName}
          </h3>
        </div>
      </header>
      <p className="text-sm leading-relaxed text-muted-foreground">
        A full template site rendered under its own theme preset. {example.pageCount} pages composed entirely from the block library.
      </p>
      <dl className="space-y-2 text-xs">
        <MetaRow
          label="Theme"
          value={example.themePreset ?? 'framework default'}
        />
        <MetaRow label="Pages" value={String(example.pageCount).padStart(2, '0')} />
        <MetaRow label="Slugs" value={example.pageSlugs.join(' · ')} />
      </dl>
      <div className="mt-auto flex items-baseline justify-between border-t border-border/60 pt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
        <span>View site</span>
        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function Coda() {
  return (
    <footer className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex flex-col items-baseline justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            End of reference
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Further reading:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              AI_PLAYBOOK.md
            </code>
            ,{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              DESIGN_TOOLKITS.md
            </code>
            ,{' '}
            <a
              href="/gallery"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              /gallery
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
