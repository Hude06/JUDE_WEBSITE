import type { ParagraphBlock as ParagraphBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ParagraphBlockProps {
  block: ParagraphBlockType;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <div className="mx-auto max-w-[var(--container-default)] px-6 md:px-10 py-4">
      <p
        className={cn(
          'max-w-[62ch] text-lg md:text-xl leading-[1.55] text-[color:var(--color-fg)]/90',
          block.dropCap && 'drop-cap',
        )}
      >
        {block.text}
      </p>
    </div>
  );
}
