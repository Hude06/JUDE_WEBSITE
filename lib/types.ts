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

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | BadgeGroupBlock
  | CardBlock
  | CardGridBlock
  | ButtonBlock
  | SeparatorBlock;

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
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}
