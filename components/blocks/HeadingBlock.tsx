import type { HeadingBlock as HeadingBlockType } from '@/lib/types';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const level = block.level ?? 1;

  switch (level) {
    case 1: return <h1 className="text-4xl font-bold mb-4 leading-tight">{block.text}</h1>;
    case 2: return <h2 className="text-3xl font-bold mb-3 mt-8 leading-tight">{block.text}</h2>;
    case 3: return <h3 className="text-2xl font-semibold mb-2 mt-6 leading-tight">{block.text}</h3>;
    case 4: return <h4 className="text-xl font-semibold mb-2 mt-4">{block.text}</h4>;
    case 5: return <h5 className="text-lg font-medium mb-1 mt-4">{block.text}</h5>;
    case 6: return <h6 className="text-base font-medium mb-1 mt-4">{block.text}</h6>;
    default: return <h1 className="text-4xl font-bold mb-4 leading-tight">{block.text}</h1>;
  }
}
