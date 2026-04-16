import type { StatsBlock as StatsBlockType } from '@/lib/types';

interface StatsBlockProps {
  block: StatsBlockType;
}

export function StatsBlock({ block }: StatsBlockProps) {
  return (
    <section className="my-16">
      {(block.eyebrow || block.heading) && (
        <div className="mb-10 max-w-2xl">
          {block.eyebrow && (
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="font-heading text-4xl leading-tight tracking-tight md:text-5xl">
              {block.heading}
            </h2>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border lg:grid-cols-4">
        {block.items.map((item, i) => (
          <div key={i} className="flex flex-col bg-background p-8">
            <div className="font-heading text-5xl leading-none tracking-tight md:text-6xl">
              {item.value}
            </div>
            <div className="mt-4 text-sm font-medium uppercase tracking-wider text-foreground">
              {item.label}
            </div>
            {item.caption && (
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
