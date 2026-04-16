import type { StepsBlock as StepsBlockType } from '@/lib/types';

interface StepsBlockProps {
  block: StepsBlockType;
}

export function StepsBlock({ block }: StepsBlockProps) {
  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-8 md:py-12 scroll-reveal">
      {(block.eyebrow || block.heading) && (
        <header className="mb-16 max-w-2xl">
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

      <ol>
        {block.steps.map((step, i) => (
          <li
            key={i}
            className="grid gap-4 border-t border-[color:var(--color-hairline)] py-10 md:grid-cols-[auto_1fr_2fr] md:gap-16 md:py-14 md:items-baseline"
          >
            <span
              className="font-display leading-none tabular-nums text-[color:var(--color-subtle)]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3
              className="font-display leading-tight text-[color:var(--color-fg)]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              {step.title}
            </h3>
            <p className="max-w-xl text-base md:text-lg leading-relaxed text-[color:var(--color-muted)]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
