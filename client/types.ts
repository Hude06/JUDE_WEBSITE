/**
 * Client-owned legacy block types for Jude's migrated site.
 */

export interface JudeHeadingBlock {
  id: string;
  type: 'jude-heading';
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  anchorId?: string;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
  dropCap?: boolean;
}

export interface JudeButtonBlock {
  id: string;
  type: 'jude-button';
  text: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export interface JudeHeroBlock {
  id: string;
  type: 'jude-hero';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  image?: string;
  align?: 'left' | 'center';
}

export interface BadgeGroupBlock {
  id: string;
  type: 'badge-group';
  badges: string[];
}

export interface CardGridCard {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export interface CardGridBlock {
  id: string;
  type: 'card-grid';
  cards: CardGridCard[];
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

export interface CaseStudyBlock {
  id: string;
  type: 'case-study';
  client: string;
  tagline: string;
  year: string;
  role: string;
  image: string;
  link?: string;
  status?: 'live' | 'archived';
  reverse?: boolean;
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

export interface SeparatorBlock {
  id: string;
  type: 'separator';
}

export type ClientBlock =
  | JudeHeadingBlock
  | ParagraphBlock
  | JudeButtonBlock
  | JudeHeroBlock
  | BadgeGroupBlock
  | CardGridBlock
  | FeatureGridBlock
  | StepsBlock
  | CaseStudyBlock
  | CtaBlock
  | SeparatorBlock;
