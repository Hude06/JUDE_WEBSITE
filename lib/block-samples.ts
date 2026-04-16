import type { Block, LeafBlock } from './types';

function sample(id: string, type: Block['type']): Block {
  switch (type) {
    case 'heading':
      return { id, type: 'heading', text: 'Typography that breathes', level: 1 };
    case 'paragraph':
      return {
        id,
        type: 'paragraph',
        text: 'A single paragraph demonstrates how body copy flows through the active theme. Notice the line height, the tracking, the way quotes and emphasis land.',
      };
    case 'image':
      return {
        id,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80',
        alt: 'Sample hero image',
      };
    case 'badge-group':
      return { id, type: 'badge-group', badges: ['React', 'TypeScript', 'Tailwind v4', 'Motion'] };
    case 'card':
      return {
        id,
        type: 'card',
        title: 'Sample card',
        description: 'A description that illustrates the card style.',
      };
    case 'card-grid':
      return {
        id,
        type: 'card-grid',
        cards: [
          {
            title: 'Project Alpha',
            description: 'A brief description of the first project.',
            image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80',
            link: '/projects/alpha',
          },
          {
            title: 'Project Beta',
            description: 'A brief description of the second project.',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
          },
          {
            title: 'Project Gamma',
            description: 'A brief description of the third project.',
          },
        ],
      };
    case 'button':
      return { id, type: 'button', text: 'View the work', href: '#', variant: 'default' };
    case 'separator':
      return { id, type: 'separator' };
    case 'hero':
      return {
        id,
        type: 'hero',
        eyebrow: 'Issue No. 01',
        headline: 'A headline that wants to be read.',
        subheadline: 'Supporting copy that earns its place on the page and pulls the reader in without shouting.',
        primaryCta: { text: 'Start reading', href: '#' },
        secondaryCta: { text: 'About the work', href: '#' },
        align: 'left',
      };
    case 'annotated-hero':
      return {
        id,
        type: 'annotated-hero',
        eyebrow: '0 thocks and counting',
        headline: 'Your keyboard,\nbut better.',
        subheadline: 'Mechanical keyboard sounds for Mac.',
        caption: '$4.99 · One-time purchase',
        primaryCta: { text: 'Download for Mac', href: '#' },
        image:
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&q=80',
        imageAlt: 'Laptop mockup on a warm background',
        imagePosition: 'left',
        imageAspect: 'landscape',
        annotations: [],
      };
    case 'feature-grid':
      return {
        id,
        type: 'feature-grid',
        eyebrow: 'Capabilities',
        heading: 'What we build',
        columns: 3,
        items: [
          { icon: 'zap', title: 'Fast', description: 'Performance-first architecture from the ground up.' },
          { icon: 'shield', title: 'Secure', description: 'Hardened defaults and thoughtful boundaries.' },
          { icon: 'sparkles', title: 'Elegant', description: 'A level of polish you can feel in every interaction.' },
          { icon: 'layers', title: 'Composable', description: 'Small pieces that fit together cleanly.' },
          { icon: 'compass', title: 'Opinionated', description: 'Sensible defaults you can override.' },
          { icon: 'target', title: 'Focused', description: 'Each component does one thing and does it well.' },
        ],
      };
    case 'cta':
      return {
        id,
        type: 'cta',
        eyebrow: 'Ready?',
        title: 'Start building today',
        description: 'Join thousands of teams shipping faster.',
        primaryCta: { text: 'Get started', href: '#' },
        secondaryCta: { text: 'Talk to us', href: '#' },
        tone: 'bold',
      };
    case 'faq':
      return {
        id,
        type: 'faq',
        eyebrow: 'Questions',
        heading: 'Frequently asked',
        items: [
          { question: 'How does this framework work?', answer: 'It ships content as JSON files and renders them through a block system with theme presets and motion primitives.' },
          { question: 'Can I use it without writing code?', answer: 'Yes — the admin panel lets non-technical users edit content, and AI agents can scaffold sites from the playbook.' },
          { question: 'What about dark mode?', answer: 'Each theme preset ships with a dark palette. Toggle via the theme picker in site.json or the admin settings.' },
        ],
      };
    case 'stats':
      return {
        id,
        type: 'stats',
        eyebrow: 'By the numbers',
        heading: 'Built to scale',
        items: [
          { value: '99.9%', label: 'Uptime', caption: 'Measured over 12 months' },
          { value: '2M+', label: 'Requests/day' },
          { value: '150ms', label: 'Median latency' },
          { value: '24/7', label: 'On-call support' },
        ],
      };
    case 'pricing':
      return {
        id,
        type: 'pricing',
        eyebrow: 'Pricing',
        heading: 'Simple, honest pricing',
        tiers: [
          {
            name: 'Starter',
            price: 'Free',
            description: 'For individuals getting started.',
            features: ['Up to 3 projects', 'Community support', 'Basic analytics'],
            ctaText: 'Start free',
            ctaHref: '#',
          },
          {
            name: 'Pro',
            price: '$29',
            period: 'month',
            description: 'For growing teams.',
            features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom domain'],
            ctaText: 'Go pro',
            ctaHref: '#',
            featured: true,
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For organizations.',
            features: ['SSO & audit logs', 'Dedicated account manager', 'SLA'],
            ctaText: 'Contact sales',
            ctaHref: '#',
          },
        ],
      };
    case 'steps':
      return {
        id,
        type: 'steps',
        eyebrow: 'How it works',
        heading: 'Three steps to launch',
        steps: [
          { title: 'Scaffold', description: 'Run /website-init in an empty directory and answer a few questions.' },
          { title: 'Customize', description: 'Edit content JSON or use the admin panel to refine pages, theme, and motion.' },
          { title: 'Deploy', description: 'Run /deploy-init once, then /deploy for every subsequent push.' },
        ],
      };
    case 'team':
      return {
        id,
        type: 'team',
        eyebrow: 'People',
        heading: 'Meet the team',
        members: [
          { name: 'Alex Rivers', role: 'Founder & CEO' },
          { name: 'Sam Chen', role: 'Lead Designer' },
          { name: 'Jordan Kim', role: 'Head of Engineering' },
          { name: 'Riley Okafor', role: 'Creative Director' },
        ],
      };
    case 'rich-text':
      return {
        id,
        type: 'rich-text',
        content:
          '## Long-form reads here\n\nA rich text block is the right choice for essays, blog posts, and case studies where a single narrative flows through paragraphs, **bold accents**, and *italic asides*.\n\n### Sub-sections\n\nUse ### for supporting headings within the article.\n\n- Bulleted lists work\n- And so do [inline links](#)\n\n> A blockquote stands out for pull quotes and epigraphs.',
      };
    case 'video':
      return {
        id,
        type: 'video',
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Sample video caption',
        provider: 'youtube',
        aspectRatio: '16:9',
      };
    case 'contact-form':
      return {
        id,
        type: 'contact-form',
        eyebrow: 'Get in touch',
        heading: 'Let\u2019s talk',
        description: 'Send a message and we\u2019ll respond within one business day.',
        submitLabel: 'Send message',
        fields: ['name', 'email', 'subject', 'message'],
      };
    case 'two-column':
      return {
        id,
        type: 'two-column',
        left: {
          heading: 'Left column heading',
          text: 'A paragraph of content sits on the left of the page. This layout is ideal for "text + image" compositions or for contrasting two ideas side by side.',
        },
        right: {
          heading: 'Right column heading',
          text: 'The right side can hold another block of text or, by setting an image URL, a visual counterpart that anchors the composition.',
        },
      };
    case 'quote':
      return {
        id,
        type: 'quote',
        quote: 'A well-chosen quote can carry more weight than a page of prose.',
        author: 'Someone wise',
        role: 'Author of something',
      };
    case 'section':
      return {
        id,
        type: 'section',
        background: 'muted',
        width: 'wide',
        padding: 'lg',
        blocks: [sample(`${id}-h`, 'heading') as LeafBlock],
      };
    default:
      throw new Error(`No sample for block type: ${type}`);
  }
}

export function getSample(type: Block['type']): Block {
  return sample(`sample-${type}`, type);
}

export const ALL_BLOCK_TYPES: Block['type'][] = [
  'hero',
  'annotated-hero',
  'heading',
  'paragraph',
  'rich-text',
  'feature-grid',
  'stats',
  'steps',
  'faq',
  'pricing',
  'team',
  'quote',
  'video',
  'two-column',
  'cta',
  'contact-form',
  'card-grid',
  'image',
  'badge-group',
  'button',
  'separator',
  'section',
];

export function getAllSamples(): Block[] {
  return ALL_BLOCK_TYPES.map((type) => getSample(type));
}
