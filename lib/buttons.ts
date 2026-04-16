/**
 * Unified CTA system.
 * primaryButton  — filled pill with subtle micro-interaction
 * secondaryLink  — animated underline link with arrow affordance
 * ghostButton    — outlined variant
 */

export const primaryButton = [
  'group inline-flex items-center gap-2.5 rounded-full',
  'bg-[color:var(--color-fg)] text-[color:var(--color-bg)]',
  'pl-6 pr-5 py-3.5 text-[0.95rem] font-medium tracking-tight',
  'transition-all duration-300 ease-[var(--ease-out-soft)]',
  'hover:pl-7 hover:pr-4 hover:shadow-[0_6px_24px_-8px_oklch(0_0_0/0.35)]',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--color-fg)]',
  'will-change-[padding,box-shadow]',
].join(' ');

export const primaryButtonArrow =
  'inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1';

export const secondaryLink =
  'group inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-tight text-[color:var(--color-fg)]';

export const secondaryLinkUnderline =
  'link-underline inline-block text-[0.95rem] font-medium tracking-tight text-[color:var(--color-fg)]';

export const ghostButton = [
  'group inline-flex items-center gap-2.5 rounded-full',
  'border border-[color:var(--color-hairline-strong)] bg-transparent text-[color:var(--color-fg)]',
  'pl-6 pr-5 py-3.5 text-[0.95rem] font-medium tracking-tight',
  'transition-all duration-300 ease-[var(--ease-out-soft)]',
  'hover:border-[color:var(--color-fg)] hover:bg-[color:var(--color-fg)] hover:text-[color:var(--color-bg)]',
].join(' ');
