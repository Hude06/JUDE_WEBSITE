import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';

export interface ClientEditorProps<T extends Block = Block> {
  block: T;
  onChange: (updated: T) => void;
}

/*
  Framework-only mode: no client-specific block editors.
*/
export const clientEditors: Record<string, ComponentType<ClientEditorProps>> = {};

export const clientTypeLabels: Record<string, string> = {};
