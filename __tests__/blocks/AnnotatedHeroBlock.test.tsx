import { render, screen } from '@testing-library/react';
import { AnnotatedHeroBlock } from '@/components/blocks/AnnotatedHeroBlock';
import type { AnnotatedHeroBlock as AnnotatedHeroBlockType } from '@/lib/types';

const baseBlock: AnnotatedHeroBlockType = {
  id: 'ah-1',
  type: 'annotated-hero',
  eyebrow: '0 thocks and counting',
  headline: 'Your keyboard,\nbut better.',
  subheadline: 'Mechanical keyboard sounds for Mac.',
  caption: '$4.99 · One-time',
  primaryCta: { text: 'Download', href: '#' },
  image: 'https://example.com/laptop.jpg',
  imageAlt: 'Laptop',
  annotations: [
    { id: 'a', text: 'try typing', x: 20, y: 70, variant: 'note' },
    { id: 'b', text: 'switches', x: 50, y: 30, variant: 'popover' },
    { id: 'c', text: 'click me', x: 40, y: 10, variant: 'callout' },
    { id: 'd', text: 'tag', x: 10, y: 85, variant: 'tag' },
    { id: 'e', text: 'chip', x: 80, y: 60, variant: 'chip' },
  ],
};

describe('AnnotatedHeroBlock', () => {
  it('renders the headline with line breaks preserved', () => {
    render(<AnnotatedHeroBlock block={baseBlock} />);
    expect(screen.getByText('Your keyboard,')).toBeInTheDocument();
    expect(screen.getByText('but better.')).toBeInTheDocument();
  });

  it('renders the eyebrow, subheadline, and caption', () => {
    render(<AnnotatedHeroBlock block={baseBlock} />);
    expect(screen.getByText('0 thocks and counting')).toBeInTheDocument();
    expect(
      screen.getByText('Mechanical keyboard sounds for Mac.'),
    ).toBeInTheDocument();
    expect(screen.getByText('$4.99 · One-time')).toBeInTheDocument();
  });

  it('renders the image with alt text', () => {
    render(<AnnotatedHeroBlock block={baseBlock} />);
    const img = screen.getByAltText('Laptop') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/laptop.jpg');
  });

  it('renders the primary CTA as a link', () => {
    render(<AnnotatedHeroBlock block={baseBlock} />);
    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
      'href',
      '#',
    );
  });

  it('renders each annotation variant with the correct data attribute', () => {
    const { container } = render(<AnnotatedHeroBlock block={baseBlock} />);
    const variants = ['note', 'popover', 'callout', 'tag', 'chip'] as const;
    for (const v of variants) {
      const found = container.querySelectorAll(`[data-variant="${v}"]`);
      expect(found.length).toBeGreaterThan(0);
    }
  });

  it('positions each annotation with inline left/top percent', () => {
    const { container } = render(<AnnotatedHeroBlock block={baseBlock} />);
    const layer = container.querySelector(
      '[data-slot="annotation-layer"]',
    );
    expect(layer).not.toBeNull();
    const anchors = layer?.querySelectorAll('div[style*="left:"]');
    expect(anchors?.length).toBeGreaterThanOrEqual(5);
  });

  it('renders an arrow svg when any annotation has an arrow', () => {
    const withArrow: AnnotatedHeroBlockType = {
      ...baseBlock,
      annotations: [
        {
          id: 'x',
          text: 'pointer',
          x: 10,
          y: 10,
          variant: 'note',
          arrow: { targetX: 80, targetY: 80 },
        },
      ],
    };
    const { container } = render(<AnnotatedHeroBlock block={withArrow} />);
    const svg = container.querySelector('[data-slot="annotation-arrows"]');
    expect(svg).not.toBeNull();
    expect(svg?.querySelectorAll('path').length).toBe(1);
  });

  it('does not render the arrow svg when no annotation has an arrow', () => {
    const { container } = render(<AnnotatedHeroBlock block={baseBlock} />);
    const svg = container.querySelector('[data-slot="annotation-arrows"]');
    expect(svg).toBeNull();
  });

  it('renders the mobile annotation list alongside the overlay', () => {
    const { container } = render(<AnnotatedHeroBlock block={baseBlock} />);
    const mobile = container.querySelector('[data-slot="annotation-mobile"]');
    expect(mobile).not.toBeNull();
    expect(mobile?.querySelectorAll('li').length).toBe(5);
  });

  it('sets data-image-position=left by default', () => {
    const { container } = render(<AnnotatedHeroBlock block={baseBlock} />);
    const section = container.querySelector('[data-slot="annotated-hero"]');
    expect(section).toHaveAttribute('data-image-position', 'left');
  });

  it('respects imagePosition=right', () => {
    const { container } = render(
      <AnnotatedHeroBlock
        block={{ ...baseBlock, imagePosition: 'right' }}
      />,
    );
    const section = container.querySelector('[data-slot="annotated-hero"]');
    expect(section).toHaveAttribute('data-image-position', 'right');
  });
});
