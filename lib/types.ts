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

export type Block = HeadingBlock | ParagraphBlock | ImageBlock;

export interface PageContent {
  title: string;
  slug: string;
  blocks: Block[];
}

export interface NavLink {
  label: string;
  href: string;
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
