import type { FeatureGridBlock as FeatureGridBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FeatureGridBlockProps {
  block: FeatureGridBlockType;
}

export function FeatureGridBlock({ block }: FeatureGridBlockProps) {
  const columns = block.columns ?? 3;
  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-12 md:py-20 scroll-reveal">
      {(block.eyebrow || block.heading) && (
        <header className="mb-14 max-w-2xl">
          {block.eyebrow && (
            <p className="mb-5 text-[0.72rem] uppercase tracking-[0.26em] text-[color:var(--color-muted)]">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2
              className="font-display leading-[1.0] tracking-[-0.025em] text-[color:var(--color-fg)]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {block.heading}
            </h2>
          )}
        </header>
      )}

      <ul className={cn('grid gap-px bg-[color:var(--color-hairline)] border border-[color:var(--color-hairline)] rounded-xl overflow-hidden', colClass)}>
        {block.items.map((item, i) => (
          <li
            key={i}
            className="group relative flex flex-col bg-[color:var(--color-bg)] p-8 md:p-10 transition-colors duration-300 hover:bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="font-display italic text-[color:var(--color-subtle)] tabular-nums text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="block h-px w-8 bg-[color:var(--color-hairline-strong)]" />
            </div>

            <h3
              className="mt-8 font-display leading-[1.1] tracking-[-0.02em] text-[color:var(--color-fg)]"
              style={{ fontSize: 'clamp(1.35rem, 2vw, 1.75rem)' }}
            >
              {item.title}
            </h3>
            <p className="mt-4 text-[0.95rem] md:text-base leading-[1.6] text-[color:var(--color-muted)]">
              {item.description}
            </p>

            <span
              aria-hidden
              className="absolute bottom-8 right-8 text-[color:var(--color-subtle)] opacity-0 translate-x-[-6px] transition-all duration-400 ease-[var(--ease-out-soft)] group-hover:opacity-100 group-hover:translate-x-0"
            >
              →
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
