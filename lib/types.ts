import type { ContentContractVersion } from './contract';

/* ============================================================
   Shared sub-types
   ============================================================ */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | 'display' | 'hero' | 'mega' | 'giant';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TextTone = 'default' | 'muted' | 'accent';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type Align = 'left' | 'center' | 'right';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ImageWidth = 'narrow' | 'default' | 'wide' | 'full';
export type SectionBackground = 'default' | 'muted' | 'card' | 'accent';
export type SectionPadding = 'sm' | 'md' | 'lg' | 'xl';
export type GridColumns = 2 | 3 | 4;
export type ColumnRatio = '50-50' | '60-40' | '40-60';
export type FormFieldType = 'text' | 'textarea' | 'email';
export type MotionEngine = 'motion' | 'gsap';

/* Structural layout variants (opt-in; omitting a field keeps the original
   layout). Shared with the theme layout DNA in lib/themes.ts. */
export type HeroLayout = 'stack' | 'split' | 'full-bleed' | 'offset';
export type GridStyle = 'cards' | 'bare' | 'bordered-list' | 'numbered' | 'feature';
export type SectionLayout = 'centered' | 'left' | 'wide' | 'aside';
export type QuoteStyle = 'centered' | 'display' | 'bordered';

export interface CtaLink {
  label: string;
  href: string;
  variant?: ButtonVariant;
}

export interface GridItem {
  title: string;
  body?: string;
  image?: string;
}

export interface ColumnSide {
  title?: string;
  body?: string;
  image?: string;
  button?: CtaLink;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
}

/* ============================================================
   Block types — the 10 base blocks
   ============================================================ */
export interface BaseBlock {
  id: string;
  type: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  text: string;
  level?: HeadingLevel;
  size?: HeadingSize;
  tone?: TextTone;
  align?: Align;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  body: string;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: Align;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  width?: ImageWidth;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  label: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  align?: Align;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  title: string;
  subtitle?: string;
  buttons?: CtaLink[];
  image?: string;
  align?: Align;
  /** Structural variant. Omit to use the theme default (or classic `stack`). */
  layout?: HeroLayout;
  /** Small kicker/label above the title. */
  eyebrow?: string;
}

export interface SectionBlock extends BaseBlock {
  type: 'section';
  heading?: string;
  body?: string;
  background?: SectionBackground;
  padding?: SectionPadding;
  anchor?: string;
  /** Structural variant. Omit to use the theme default (or classic `centered`). */
  layout?: SectionLayout;
  /** Small kicker/label above the heading. */
  eyebrow?: string;
}

export interface GridBlock extends BaseBlock {
  type: 'grid';
  heading?: string;
  items: GridItem[];
  columns?: GridColumns;
  /** Item chrome variant. Omit to use the theme default (or classic `cards`). */
  style?: GridStyle;
  /** Small kicker/label above the heading. */
  eyebrow?: string;
}

export interface TwoColumnBlock extends BaseBlock {
  type: 'two-column';
  left: ColumnSide;
  right: ColumnSide;
  ratio?: ColumnRatio;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  quote: string;
  author?: string;
  role?: string;
  image?: string;
  /** Structural variant. Omit to use the theme default (or classic `centered`). */
  style?: QuoteStyle;
}

export interface FormBlock extends BaseBlock {
  type: 'form';
  heading?: string;
  fields: FormField[];
  submitLabel?: string;
  action?: string;
}

export type FrameworkBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | HeroBlock
  | SectionBlock
  | GridBlock
  | TwoColumnBlock
  | QuoteBlock
  | FormBlock;

/** A block in a page's JSON content. Framework code accepts this loose shape;
   individual block components narrow to their specific union member at render
   time. Consumers with custom blocks can declare a narrower local alias like
   `type Block = FrameworkBlock | MyCustomBlock`. */
export type Block = BaseBlock;

/* ============================================================
   Page + site config
   ============================================================ */
export interface PageContent {
  contractVersion: ContentContractVersion;
  title: string;
  slug: string;
  description?: string;
  blocks: Block[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  contractVersion: ContentContractVersion;
  siteName: string;
  nav: NavLink[];
  fonts: {
    heading: string;
    body: string;
    /** Font-pair preset name (classic or expressive). Free string so client
       sites can register their own pairs; unknown names fall back to heading/body. */
    pair?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  theme?: {
    /** Theme preset name (classic or expressive). Free string so client sites can
       register custom presets; selecting an expressive name activates the
       art-direction engine. */
    preset?: string;
    appearance?: 'light' | 'dark' | 'auto';
    accent?: string;
    /** Force the classic or expressive code path regardless of preset name. */
    system?: 'classic' | 'expressive';
  };
  motion?: {
    intensity?: 'none' | 'subtle' | 'rich';
    engine?: MotionEngine;
  };
  contact?: {
    email?: string;
  };
  plausible?: {
    domain?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
