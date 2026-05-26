import type { Block } from '@/lib/types';

export interface ClientBlockTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  create: (id: string) => Block;
}

/*
  Framework-only mode: no client-specific gallery templates.
*/
export const clientTemplates: ClientBlockTemplate[] = [];
