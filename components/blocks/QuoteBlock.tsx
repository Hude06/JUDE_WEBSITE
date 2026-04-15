import type { QuoteBlock as QuoteBlockType } from '@/lib/types';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
  block: QuoteBlockType;
}

export function QuoteBlock({ block }: QuoteBlockProps) {
  return (
    <figure className="relative mx-auto my-16 max-w-3xl text-center">
      <Quote
        className="mx-auto mb-6 size-10 text-foreground/20"
        strokeWidth={1}
        aria-hidden
      />
      <blockquote className="font-heading text-3xl leading-tight tracking-tight md:text-4xl lg:text-5xl">
        &ldquo;{block.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-8 flex items-center justify-center gap-4">
        {block.avatar && (
          <img
            src={block.avatar}
            alt={block.author}
            className="size-12 rounded-full object-cover"
          />
        )}
        <div className="text-left">
          <div className="font-medium text-foreground">{block.author}</div>
          {block.role && <div className="text-sm text-muted-foreground">{block.role}</div>}
        </div>
      </figcaption>
    </figure>
  );
}
