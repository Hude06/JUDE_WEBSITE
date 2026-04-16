import type { StatsBlock as StatsBlockType } from '@/lib/types';

interface StatsBlockProps {
  block: StatsBlockType;
}

export function StatsBlock({ block }: StatsBlockProps) {
  return (
    <section className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-10 md:py-16 scroll-reveal">
      {(block.eyebrow || block.heading) && (
        <header className="mb-12 max-w-2xl">
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
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[color:var(--color-hairline)] bg-[color:var(--color-hairline)] lg:grid-cols-4">
        {block.items.map((item, i) => (
          <div key={i} className="flex flex-col bg-[color:var(--color-bg)] p-8 md:p-10">
            <div
              className="font-display leading-none tracking-[-0.025em] text-[color:var(--color-fg)]"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)' }}
            >
              {item.value}
            </div>
            <div className="mt-5 text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--color-fg)]">
              {item.label}
            </div>
            {item.caption && (
              <div className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
