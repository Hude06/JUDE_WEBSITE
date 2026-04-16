import type { FaqBlock as FaqBlockType } from '@/lib/types';
import { Plus } from 'lucide-react';

interface FaqBlockProps {
  block: FaqBlockType;
}

export function FaqBlock({ block }: FaqBlockProps) {
  return (
    <section className="my-16 grid gap-10 lg:grid-cols-[1fr_2fr]">
      {(block.eyebrow || block.heading) && (
        <div className="lg:sticky lg:top-24 lg:self-start">
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
      <div className="divide-y divide-border border-y border-border">
        {block.items.map((item, i) => (
          <details
            key={i}
            className="group py-6 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
              <span className="font-heading text-xl leading-snug md:text-2xl">
                {item.question}
              </span>
              <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300 group-open:rotate-45">
                <Plus className="size-4" strokeWidth={1.75} />
              </span>
            </summary>
            <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
