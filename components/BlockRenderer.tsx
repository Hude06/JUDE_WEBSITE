import type { ComponentType } from 'react';
import type { BaseBlock } from '../lib/types';

/* The `block: never` typing is intentional. Each block component is invariant
   in its own narrow type, and BlockRenderer narrows at runtime via `block.type`. */
export type BlockComponent = ComponentType<{ block: never }>;
export type BlockRegistry = Record<string, BlockComponent>;

export interface BlockRendererProps {
  blocks: BaseBlock[];
  registry: BlockRegistry;
}

export function BlockRenderer({ blocks, registry }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const Component = registry[block.type];
        if (!Component) return null;
        return <Component key={block.id} block={block as never} />;
      })}
    </>
  );
}
