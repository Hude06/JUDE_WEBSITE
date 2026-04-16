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
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-8 md:py-12 scroll-reveal">
      {(block.eyebrow || block.heading) && (
        <header className="mb-12 max-w-2xl">
          {block.eyebrow && (
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[color:var(--color-muted)]">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2
              className="font-display leading-[1.0] tracking-[-0.02em] text-[color:var(--color-fg)]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              {block.heading}
            </h2>
          )}
        </header>
      )}

      <div className={cn('grid gap-12 md:gap-16', colClass)}>
        {block.items.map((item, i) => (
          <article key={i} className="flex flex-col">
            <span
              className="font-display text-[color:var(--color-subtle)] leading-none"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="mt-8 border-t border-[color:var(--color-hairline)] pt-6">
              <h3
                className="font-display leading-tight text-[color:var(--color-fg)]"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[color:var(--color-muted)] max-w-sm">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
