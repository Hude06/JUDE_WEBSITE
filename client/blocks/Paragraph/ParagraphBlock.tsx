import type { ParagraphBlock as ParagraphBlockType } from '@/client/types';
import { cn } from '@/lib/utils';

interface ParagraphBlockProps {
  block: ParagraphBlockType;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <div className="jude-container paragraph-block">
      <p
        className={cn(
          'paragraph-block__text',
          block.dropCap && 'drop-cap',
        )}
      >
        {block.text}
      </p>
    </div>
  );
}
