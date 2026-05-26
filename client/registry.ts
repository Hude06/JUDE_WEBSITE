import type { ComponentType } from 'react';

/*
  Framework-only mode: no client-specific render blocks.
*/
export const clientBlocks: Record<string, ComponentType<{ block: never }>> = {};
