import type { ThemePreset } from '@/lib/themes';

/**
 * Client-owned theme presets. Merged into the framework theme registry.
 * Client themes of the same name as a framework theme will override it.
 *
 * Example:
 *   import acme from './themes/acme.json';
 *   export const clientThemes: Record<string, ThemePreset> = {
 *     acme: acme as ThemePreset,
 *   };
 *
 * This file is edited by clients. The framework MUST NOT modify it after the initial stub.
 */
export const clientThemes: Record<string, ThemePreset> = {};
