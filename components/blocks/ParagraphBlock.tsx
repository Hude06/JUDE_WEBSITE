import type { ParagraphBlock as ParagraphBlockType } from '@/lib/types';

interface ParagraphBlockProps {
  block: ParagraphBlockType;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return <p className="mb-4 leading-relaxed">{block.text}</p>;
}
