import type { ImageBlock as ImageBlockType } from '@/lib/types';

interface ImageBlockProps {
  block: ImageBlockType;
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <div className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-8">
      <div className="overflow-hidden rounded-2xl">
        <img src={block.src} alt={block.alt} className="w-full h-auto block" />
      </div>
    </div>
  );
}
