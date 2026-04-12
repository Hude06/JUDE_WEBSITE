import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { BadgeGroupBlock } from './blocks/BadgeGroupBlock';
import { CardGridBlock } from './blocks/CardGridBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { SeparatorBlock } from './blocks/SeparatorBlock';

const blockRegistry: Record<string, ComponentType<{ block: never }>> = {
  heading: HeadingBlock as ComponentType<{ block: never }>,
  paragraph: ParagraphBlock as ComponentType<{ block: never }>,
  image: ImageBlock as ComponentType<{ block: never }>,
  'badge-group': BadgeGroupBlock as ComponentType<{ block: never }>,
  'card-grid': CardGridBlock as ComponentType<{ block: never }>,
  button: ButtonBlock as ComponentType<{ block: never }>,
  separator: SeparatorBlock as ComponentType<{ block: never }>,
};

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div>
      {blocks.map((block) => {
        const Component = blockRegistry[block.type];
        if (!Component) return null;
        return <Component key={block.id} block={block as never} />;
      })}
    </div>
  );
}
