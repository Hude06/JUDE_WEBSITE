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
    description: 'Signature hero with availability and CTA pair.',
    icon: '✦',
    create: (id) =>
      ({
        id,
        type: 'jude-hero',
        eyebrow: 'Jude Hill — Designer & Developer',
        headline: 'Websites, made simple.',
        subheadline: 'Fast, beautiful sites built by hand for small businesses and creatives.',
        primaryCta: { text: 'Start a project', href: '/contact' },
        secondaryCta: { text: 'See selected work', href: '/#work' },
        align: 'left',
      }) as Block,
  },
  {
    type: 'jude-heading',
    label: 'Jude Heading',
    description: 'Editorial heading with optional anchor marker.',
    icon: '§',
    create: (id) =>
      ({
        id,
        type: 'jude-heading',
        text: 'New heading',
        level: 2,
      }) as Block,
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    description: 'Long-form paragraph with optional drop cap.',
    icon: '¶',
    create: (id) =>
      ({
        id,
        type: 'paragraph',
        text: 'Write your paragraph here.',
        dropCap: false,
      }) as Block,
  },
  {
    type: 'jude-button',
    label: 'Jude Button',
    description: 'Rounded CTA button or ghost link button.',
    icon: '→',
    create: (id) =>
      ({
        id,
        type: 'jude-button',
        text: 'Read more',
        href: '/about',
        variant: 'outline',
      }) as Block,
  },
  {
    type: 'separator',
    label: 'Separator',
    description: 'Section divider rule.',
    icon: '—',
    create: (id) =>
      ({
        id,
        type: 'separator',
      }) as Block,
  },
  {
    type: 'case-study',
    label: 'Case Study',
    description: 'Image + meta case-study row.',
    icon: '▣',
    create: (id) =>
      ({
        id,
        type: 'case-study',
        index: '01',
        client: 'New Client',
        tagline: 'Short project summary',
        year: '2026',
        role: 'Design + Build',
        image: '/portfolio/rosales-designs.png',
        link: 'https://example.com',
        status: 'live',
      }) as Block,
  },
  {
    type: 'feature-grid',
    label: 'Feature Grid',
    description: 'Three-column process or feature highlight grid.',
    icon: '◫',
    create: (id) =>
      ({
        id,
        type: 'feature-grid',
        columns: 3,
        items: [
          { title: 'First feature', description: 'Describe the first feature.' },
          { title: 'Second feature', description: 'Describe the second feature.' },
          { title: 'Third feature', description: 'Describe the third feature.' },
        ],
      }) as Block,
  },
  {
    type: 'steps',
    label: 'Steps',
    description: 'Numbered process rows.',
    icon: '1·2·3',
    create: (id) =>
      ({
        id,
        type: 'steps',
        steps: [
          { title: 'Step one', description: 'Describe step one.' },
          { title: 'Step two', description: 'Describe step two.' },
          { title: 'Step three', description: 'Describe step three.' },
        ],
      }) as Block,
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    description: 'List rows or card grid for links and resources.',
    icon: '▦',
    create: (id) =>
      ({
        id,
        type: 'card-grid',
        cards: [{ title: 'New card', description: 'Card description', link: '' }],
      }) as Block,
  },
  {
    type: 'badge-group',
    label: 'Badge Group',
    description: 'Compact status chips.',
    icon: '◉',
    create: (id) =>
      ({
        id,
        type: 'badge-group',
        badges: ['Available now', 'Eugene, Oregon'],
      }) as Block,
  },
  {
    type: 'work-grid',
    label: 'Work Grid',
    description: 'Two-up project grid with browser frames and a sales slot.',
    icon: '▦',
    create: (id) =>
      ({
        id,
        type: 'work-grid',
        heading: 'Selected work',
        items: [{ name: 'New project', tagline: 'One-line summary', year: '2026', image: '' }],
        showEmptyCard: true,
      }) as Block,
  },
  {
    type: 'photo-strip',
    label: 'Photo Strip',
    description: 'Tilted photos with an optional caption column.',
    icon: '▤',
    create: (id) =>
      ({
        id,
        type: 'photo-strip',
        photos: [{ image: '', alt: '' }],
      }) as Block,
  },
  {
    type: 'contact-form',
    label: 'Contact Form',
    description: 'Name/email/message form posting to a form-to-email endpoint.',
    icon: '✉',
    create: (id) =>
      ({
        id,
        type: 'contact-form',
        action: 'https://formsubmit.co/jude@micah77.org',
        subject: 'New project inquiry — judemakes.com',
      }) as Block,
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    description: 'A client quote set large, with ledger attribution.',
    icon: '“',
    create: (id) =>
      ({
        id,
        type: 'testimonial',
        quote: 'What the client said, in their own words.',
        name: 'Client Name',
        business: 'Their business',
      }) as Block,
  },
  {
    type: 'photo',
    label: 'Photo',
    description: 'A single framed photograph with a mono caption.',
    icon: '▢',
    create: (id) =>
      ({
        id,
        type: 'photo',
        caption: '',
      }) as Block,
  },
  {
    type: 'cta',
    label: 'CTA Band',
    description: 'Large call-to-action section.',
    icon: '✉',
    create: (id) =>
      ({
        id,
        type: 'cta',
        title: 'Got an idea worth building?',
        description: 'If you are working on something, let’s talk.',
        primaryCta: { text: 'Start a conversation', href: '/contact' },
      }) as Block,
  },
];
