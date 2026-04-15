export interface HeadingBlock {
  id: string;
  type: 'heading';
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  src: string;
  alt: string;
}

export interface BadgeGroupBlock {
  id: string;
  type: 'badge-group';
  badges: string[];
}

export interface CardBlock {
  id: string;
  type: 'card';
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export interface CardGridBlock {
  id: string;
  type: 'card-grid';
  cards: Omit<CardBlock, 'id' | 'type'>[];
}

export interface ButtonBlock {
  id: string;
  type: 'button';
  text: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export interface SeparatorBlock {
  id: string;
  type: 'separator';
}

export interface HeroBlock {
  id: string;
  type: 'hero';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  image?: string;
  align?: 'left' | 'center';
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeatureGridBlock {
  id: string;
  type: 'feature-grid';
  eyebrow?: string;
  heading?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export interface CtaBlock {
  id: string;
  type: 'cta';
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  tone?: 'default' | 'bold' | 'quiet';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqBlock {
  id: string;
  type: 'faq';
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
}

export interface StatItem {
  value: string;
  label: string;
  caption?: string;
}

export interface StatsBlock {
  id: string;
  type: 'stats';
  eyebrow?: string;
  heading?: string;
  items: StatItem[];
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  featured?: boolean;
}

export interface PricingBlock {
  id: string;
  type: 'pricing';
  eyebrow?: string;
  heading?: string;
  tiers: PricingTier[];
}

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsBlock {
  id: string;
  type: 'steps';
  eyebrow?: string;
  heading?: string;
  steps: StepItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  link?: string;
}

export interface TeamBlock {
  id: string;
  type: 'team';
  eyebrow?: string;
  heading?: string;
  members: TeamMember[];
}

export interface RichTextBlock {
  id: string;
  type: 'rich-text';
  content: string;
}

export interface VideoBlock {
  id: string;
  type: 'video';
  src: string;
  title?: string;
  provider?: 'youtube' | 'vimeo' | 'file';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
}

export interface ContactFormBlock {
  id: string;
  type: 'contact-form';
  eyebrow?: string;
  heading?: string;
  description?: string;
  submitLabel?: string;
  action?: string;
  fields?: Array<'name' | 'email' | 'subject' | 'message'>;
}

export interface TwoColumnBlock {
  id: string;
  type: 'two-column';
  left: { heading?: string; text: string; image?: string };
  right: { heading?: string; text: string; image?: string };
  reverse?: boolean;
}

export interface QuoteBlock {
  id: string;
  type: 'quote';
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

export type SectionBackground = 'default' | 'muted' | 'foreground' | 'accent' | 'card';
export type SectionWidth = 'narrow' | 'standard' | 'wide' | 'full';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface SectionBlock {
  id: string;
  type: 'section';
  background?: SectionBackground;
  width?: SectionWidth;
  padding?: SectionPadding;
  reveal?: boolean;
  blocks: LeafBlock[];
}

export type LeafBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | BadgeGroupBlock
  | CardBlock
  | CardGridBlock
  | ButtonBlock
  | SeparatorBlock
  | HeroBlock
  | FeatureGridBlock
  | CtaBlock
  | FaqBlock
  | StatsBlock
  | PricingBlock
  | StepsBlock
  | TeamBlock
  | RichTextBlock
  | VideoBlock
  | ContactFormBlock
  | TwoColumnBlock
  | QuoteBlock;

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | BadgeGroupBlock
  | CardBlock
  | CardGridBlock
  | ButtonBlock
  | SeparatorBlock
  | HeroBlock
  | FeatureGridBlock
  | CtaBlock
  | FaqBlock
  | StatsBlock
  | PricingBlock
  | StepsBlock
  | TeamBlock
  | RichTextBlock
  | VideoBlock
  | ContactFormBlock
  | TwoColumnBlock
  | QuoteBlock
  | SectionBlock;

export interface PageContent {
  title: string;
  slug: string;
  blocks: Block[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SiteConfig {
  siteName: string;
  nav: NavLink[];
  fonts: {
    heading: string;
    body: string;
    pair?: 'editorial' | 'studio' | 'tech' | 'warm' | 'monochrome';
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  theme?: {
    preset?: 'editorial' | 'studio' | 'tech' | 'warm' | 'monochrome';
    appearance?: 'light' | 'dark' | 'auto';
    accent?: string;
  };
  motion?: {
    intensity?: 'none' | 'subtle' | 'rich';
  };
}
