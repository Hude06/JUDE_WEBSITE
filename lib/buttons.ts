/**
 * Unified button system for the site.
 * Two variants only — primary (filled black) and secondary (underlined link).
 * Use these directly in any component that needs a CTA.
 */

export const primaryButton =
  'inline-block bg-[color:var(--color-fg)] text-white px-8 py-4 text-sm tracking-wide rounded-lg transition-colors hover:bg-[color:var(--color-fg)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-fg)]';

export const secondaryLink =
  'link-underline inline-block text-base text-[color:var(--color-fg)]';
