import type { StepsBlock as StepsBlockType } from '@/lib/types';

interface StepsBlockProps {
  block: StepsBlockType;
}

export function StepsBlock({ block }: StepsBlockProps) {
  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-10 md:py-16 scroll-reveal">
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

      <ol className="border-t border-[color:var(--color-hairline-strong)]">
        {block.steps.map((step, i) => (
          <li
            key={i}
            className="group grid gap-3 border-b border-[color:var(--color-hairline)] py-8 md:grid-cols-[6rem_1fr_2fr] md:gap-14 md:py-12 md:items-baseline transition-colors hover:bg-white/60"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display italic text-[color:var(--color-accent-ink)] leading-none tabular-nums text-lg">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--color-subtle)]">
                Step
              </span>
            </div>
            <h3
              className="font-display leading-[1.05] tracking-[-0.02em] text-[color:var(--color-fg)]"
              style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)' }}
            >
              {step.title}
            </h3>
            <p className="max-w-xl text-base md:text-lg leading-[1.55] text-[color:var(--color-muted)]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
