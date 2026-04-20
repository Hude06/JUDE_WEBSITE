/**
 * Client-owned block types. Merged into the framework `Block` union via `lib/types.ts`.
 *
 * To add a custom block type, define its interface here and add it to the `ClientBlock` union.
 * Example:
 *
 *   export interface AcmeHeroBlock {
 *     id: string;
 *     type: 'acme-hero';
 *     headline: string;
 *   }
 *
 *   export type ClientBlock = AcmeHeroBlock;
 *
 * When there are no custom blocks, leave ClientBlock as `never`. The framework handles it.
 * This file is edited by clients. The framework MUST NOT modify it after the initial stub.
 */
export type ClientBlock = never;
