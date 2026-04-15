'use client';

import { useRef, useState } from 'react';
import type { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface BlockTemplate {
  type: Block['type'];
  label: string;
  description: string;
  icon: string;
  create: (id: string) => Block;
}

const blockTemplates: BlockTemplate[] = [
  {
    type: 'section',
    label: 'Section',
    description: 'Wrap blocks with background, width, and padding',
    icon: '▭',
    create: (id) => ({
      id,
      type: 'section',
      background: 'default',
      width: 'standard',
      padding: 'md',
      blocks: [],
    }),
  },
  {
    type: 'hero',
    label: 'Hero',
    description: 'Large headline section with CTA',
    icon: '✦',
    create: (id) => ({
      id,
      type: 'hero',
      eyebrow: 'Introducing',
      headline: 'A bold, beautiful headline',
      subheadline: 'One sentence that explains the value clearly.',
      primaryCta: { text: 'Get started', href: '/' },
      secondaryCta: { text: 'Learn more', href: '/about' },
      align: 'left',
    }),
  },
  {
    type: 'heading',
    label: 'Heading',
    description: 'Section title or page heading',
    icon: 'H',
    create: (id) => ({ id, type: 'heading', text: 'New Heading', level: 2 }),
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    description: 'A block of text content',
    icon: 'P',
    create: (id) => ({ id, type: 'paragraph', text: 'New paragraph...' }),
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    description: 'Long-form markdown content',
    icon: '¶',
    create: (id) => ({
      id,
      type: 'rich-text',
      content: '## A heading\n\nStart writing with **bold** and *italic* text.',
    }),
  },
  {
    type: 'feature-grid',
    label: 'Feature Grid',
    description: 'Icon + title + description grid',
    icon: '▦',
    create: (id) => ({
      id,
      type: 'feature-grid',
      eyebrow: 'Features',
      heading: 'What you get',
      columns: 3,
      items: [
        { icon: 'zap', title: 'Fast', description: 'Performant by default.' },
        { icon: 'shield', title: 'Secure', description: 'Safe from day one.' },
        { icon: 'sparkles', title: 'Elegant', description: 'Designed with care.' },
      ],
    }),
  },
  {
    type: 'stats',
    label: 'Stats',
    description: 'Key metrics or numbers',
    icon: '№',
    create: (id) => ({
      id,
      type: 'stats',
      eyebrow: 'By the numbers',
      heading: 'Built to scale',
      items: [
        { value: '99.9%', label: 'Uptime' },
        { value: '2M+', label: 'Requests/day' },
        { value: '150ms', label: 'Median latency' },
        { value: '24/7', label: 'Support' },
      ],
    }),
  },
  {
    type: 'steps',
    label: 'Steps',
    description: 'Numbered process or how-it-works',
    icon: '①',
    create: (id) => ({
      id,
      type: 'steps',
      eyebrow: 'How it works',
      heading: 'Three simple steps',
      steps: [
        { title: 'Sign up', description: 'Create your account in seconds.' },
        { title: 'Configure', description: 'Bring your brand and content.' },
        { title: 'Launch', description: 'Publish and share with the world.' },
      ],
    }),
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Expandable questions list',
    icon: '?',
    create: (id) => ({
      id,
      type: 'faq',
      eyebrow: 'Answers',
      heading: 'Frequently asked questions',
      items: [
        { question: 'How does it work?', answer: 'A clear explanation here.' },
        { question: 'Is there a free plan?', answer: 'Yes — no credit card required.' },
      ],
    }),
  },
  {
    type: 'pricing',
    label: 'Pricing',
    description: 'Pricing tiers with features',
    icon: '$',
    create: (id) => ({
      id,
      type: 'pricing',
      eyebrow: 'Pricing',
      heading: 'Simple, transparent pricing',
      tiers: [
        {
          name: 'Starter',
          price: 'Free',
          description: 'For individuals getting started.',
          features: ['Up to 3 projects', 'Community support', 'Basic analytics'],
          ctaText: 'Start free',
          ctaHref: '/',
        },
        {
          name: 'Pro',
          price: '$29',
          period: 'month',
          description: 'For growing teams and projects.',
          features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom domain'],
          ctaText: 'Go pro',
          ctaHref: '/',
          featured: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          description: 'For organizations with custom needs.',
          features: ['Everything in Pro', 'SSO & audit logs', 'Dedicated account manager', 'SLA'],
          ctaText: 'Contact sales',
          ctaHref: '/contact',
        },
      ],
    }),
  },
  {
    type: 'team',
    label: 'Team',
    description: 'Grid of team members',
    icon: '☺',
    create: (id) => ({
      id,
      type: 'team',
      eyebrow: 'People',
      heading: 'Meet the team',
      members: [
        { name: 'Alex Rivers', role: 'Founder & CEO' },
        { name: 'Sam Chen', role: 'Lead Designer' },
        { name: 'Jordan Kim', role: 'Head of Engineering' },
      ],
    }),
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Large pull quote or testimonial',
    icon: '"',
    create: (id) => ({
      id,
      type: 'quote',
      quote: 'The best product in its category — it changed how we work.',
      author: 'Happy Customer',
      role: 'CEO, Company',
    }),
  },
  {
    type: 'video',
    label: 'Video',
    description: 'YouTube, Vimeo, or file embed',
    icon: '▶',
    create: (id) => ({
      id,
      type: 'video',
      src: '',
      provider: 'youtube',
      aspectRatio: '16:9',
    }),
  },
  {
    type: 'two-column',
    label: 'Two Column',
    description: 'Side-by-side text or image',
    icon: '◫',
    create: (id) => ({
      id,
      type: 'two-column',
      left: { heading: 'Left heading', text: 'Left column content.' },
      right: { heading: 'Right heading', text: 'Right column content.' },
    }),
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'Banner with action buttons',
    icon: '→',
    create: (id) => ({
      id,
      type: 'cta',
      eyebrow: 'Ready?',
      title: 'Start building today',
      description: 'Join thousands of teams shipping faster.',
      primaryCta: { text: 'Get started', href: '/' },
      tone: 'bold',
    }),
  },
  {
    type: 'contact-form',
    label: 'Contact Form',
    description: 'Name, email, message form',
    icon: '✉',
    create: (id) => ({
      id,
      type: 'contact-form',
      eyebrow: 'Get in touch',
      heading: 'Let us know',
      description: 'Send a message and we will respond within one business day.',
      submitLabel: 'Send message',
      fields: ['name', 'email', 'message'],
    }),
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload and display an image',
    icon: 'I',
    create: (id) => ({ id, type: 'image', src: '', alt: '' }),
  },
  {
    type: 'badge-group',
    label: 'Badges',
    description: 'Group of tags or labels',
    icon: 'B',
    create: (id) => ({ id, type: 'badge-group', badges: ['Badge 1', 'Badge 2'] }),
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    description: 'Grid of cards with titles and descriptions',
    icon: 'G',
    create: (id) => ({
      id,
      type: 'card-grid',
      cards: [{ title: 'Card Title', description: 'Card description' }],
    }),
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action link button',
    icon: '⟶',
    create: (id) => ({ id, type: 'button', text: 'Click me', href: '/', variant: 'default' }),
  },
  {
    type: 'separator',
    label: 'Separator',
    description: 'Horizontal divider between sections',
    icon: '—',
    create: (id) => ({ id, type: 'separator' }),
  },
];

interface BlockGalleryProps {
  onAddBlock: (block: Block) => void;
  slug: string;
  blockCount: number;
}

export function BlockGallery({ onAddBlock, slug, blockCount }: BlockGalleryProps) {
  const [open, setOpen] = useState(false);
  const counterRef = useRef(0);

  function handleSelect(template: BlockTemplate) {
    counterRef.current += 1;
    const id = `${slug}-${blockCount}-${counterRef.current}`;
    onAddBlock(template.create(id));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="w-full border-dashed" />}
      >
        + Add Block
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a Block</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto pr-1">
          {blockTemplates.map((template) => (
            <Card
              key={template.type}
              size="sm"
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => handleSelect(template)}
            >
              <CardContent className="flex items-start gap-3 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted font-bold">
                  {template.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{template.label}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
