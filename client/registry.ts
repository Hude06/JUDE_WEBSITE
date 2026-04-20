import type { ComponentType } from 'react';

/**
 * Client-owned block renderers. Merged into the framework block registry at runtime.
 * Keys are block `type` strings; values are the block component.
 *
 * Adding a custom block? See client/README.md.
 * This file is edited by clients. The framework MUST NOT modify it after the initial stub.
 */
export const clientBlocks: Record<string, ComponentType<{ block: never }>> = {};
