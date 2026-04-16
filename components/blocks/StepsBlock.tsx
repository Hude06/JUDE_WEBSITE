import type { StepsBlock as StepsBlockType } from '@/lib/types';

interface StepsBlockProps {
  block: StepsBlockType;
}

export function StepsBlock({ block }: StepsBlockProps) {
  return (
    <section className="my-16">
      {(block.eyebrow || block.heading) && (
        <div className="mb-12 max-w-2xl">
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
      <ol className="space-y-10">
        {block.steps.map((step, i) => (
          <li
            key={i}
            className="relative grid gap-4 border-t border-border pt-8 md:grid-cols-[auto_1fr_2fr] md:items-start md:gap-12 md:pt-10"
          >
            <span className="font-heading text-5xl leading-none tracking-tight text-muted-foreground/40 md:text-7xl">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-2xl leading-tight md:text-3xl">{step.title}</h3>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
