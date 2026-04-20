import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';

export interface ClientEditorProps<T extends Block = Block> {
  block: T;
  onChange: (updated: T) => void;
}

/**
 * Client-owned admin editors. Merged into the admin editor registry at runtime.
 * Keys are block `type` strings; values are the editor component.
 *
 * Adding a custom block? See client/README.md.
 * This file is edited by clients. The framework MUST NOT modify it after the initial stub.
 */
export const clientEditors: Record<string, ComponentType<ClientEditorProps>> = {};

/**
 * Display labels for custom block types in the admin sidebar.
 */
export const clientTypeLabels: Record<string, string> = {};
