import type { Block } from '@/lib/types';

export interface ClientBlockTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  create: (id: string) => Block;
}

/**
 * Client-owned gallery entries. Appended to the framework gallery in the admin "Add Block" dialog.
 *
 * Adding a custom block? See client/README.md.
 * This file is edited by clients. The framework MUST NOT modify it after the initial stub.
 */
export const clientTemplates: ClientBlockTemplate[] = [];
