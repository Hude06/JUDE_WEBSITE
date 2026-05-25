import type { Block } from '@/lib/types';

export interface ClientBlockTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  create: (id: string) => Block;
}

export const clientTemplates: ClientBlockTemplate[] = [
  {
    type: 'jude-hero',
    label: 'Jude Hero',
    description: 'Large masthead hero used on the home page.',
    icon: '✦',
    create: (id: string) => ({
      id,
      type: 'jude-hero',
      eyebrow: 'Jude Hill — Designer & Developer',
      headline: 'Websites, made simple.',
      subheadline: 'Fast, beautiful sites built by hand.',
      primaryCta: { text: 'Start a project', href: '/contact' },
      secondaryCta: { text: 'See selected work', href: '/#work' },
    }),
  },
  {
    type: 'jude-heading',
    label: 'Jude Heading',
    description: 'Section heading with optional anchor.',
    icon: 'H',
    create: (id: string) => ({ id, type: 'jude-heading', text: 'New heading', level: 2 }),
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    description: 'Body copy paragraph.',
    icon: 'P',
    create: (id: string) => ({ id, type: 'paragraph', text: 'New paragraph.' }),
  },
  {
    type: 'jude-button',
    label: 'Jude Button',
    description: 'Primary/ghost CTA button.',
    icon: '→',
    create: (id: string) => ({ id, type: 'jude-button', text: 'Click me', href: '/', variant: 'default' }),
  },
  {
    type: 'separator',
    label: 'Separator',
    description: 'Horizontal divider.',
    icon: '—',
    create: (id: string) => ({ id, type: 'separator' }),
  },
  {
    type: 'feature-grid',
    label: 'Feature Grid',
    description: 'Grid of feature cards.',
    icon: '▦',
    create: (id: string) => ({
      id,
      type: 'feature-grid',
      columns: 3,
      items: [
        { title: 'First', description: 'Describe first feature.' },
        { title: 'Second', description: 'Describe second feature.' },
        { title: 'Third', description: 'Describe third feature.' },
      ],
    }),
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    description: 'List/grid of linked cards.',
    icon: '□',
    create: (id: string) => ({ id, type: 'card-grid', cards: [{ title: 'Card', description: 'Description' }] }),
  },
  {
    type: 'badge-group',
    label: 'Badge Group',
    description: 'Inline status badges.',
    icon: '◉',
    create: (id: string) => ({ id, type: 'badge-group', badges: ['Available now'] }),
  },
  {
    type: 'steps',
    label: 'Steps',
    description: 'Ordered process steps.',
    icon: '①',
    create: (id: string) => ({
      id,
      type: 'steps',
      steps: [
        { title: 'Step one', description: 'Describe step one.' },
        { title: 'Step two', description: 'Describe step two.' },
      ],
    }),
  },
  {
    type: 'case-study',
    label: 'Case Study',
    description: 'Featured project spotlight.',
    icon: '◎',
    create: (id: string) => ({
      id,
      type: 'case-study',
      client: 'Client Name',
      tagline: 'Short project summary.',
      year: '2026',
      role: 'Design + Build',
      image: '',
      status: 'live',
    }),
  },
  {
    type: 'cta',
    label: 'CTA',
    description: 'Call-to-action band.',
    icon: '⚑',
    create: (id: string) => ({
      id,
      type: 'cta',
      title: 'Got an idea worth building?',
      description: 'If you are building something, get in touch.',
      primaryCta: { text: 'Start a conversation', href: '/contact' },
    }),
  },
];
