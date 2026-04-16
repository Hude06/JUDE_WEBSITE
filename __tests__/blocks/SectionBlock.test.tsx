import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import type { Block } from '@/lib/types';

describe('SectionBlock rendering', () => {
  it('renders child blocks inside a section element', () => {
    const blocks: Block[] = [
      {
        id: 's1',
        type: 'section',
        blocks: [
          { id: 'h1', type: 'heading', text: 'Section Heading' },
          { id: 'p1', type: 'paragraph', text: 'Section paragraph.' },
        ],
      },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Section Heading' })).toBeInTheDocument();
    expect(screen.getByText('Section paragraph.')).toBeInTheDocument();
  });

  it('applies the muted background data attribute', () => {
    const blocks: Block[] = [
      {
        id: 's1',
        type: 'section',
        background: 'muted',
        blocks: [{ id: 'h1', type: 'heading', text: 'Muted' }],
      },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-section-bg', 'muted');
    expect(section?.className).toContain('bg-muted');
  });

  it('applies narrow width', () => {
    const blocks: Block[] = [
      {
        id: 's1',
        type: 'section',
        width: 'narrow',
        blocks: [{ id: 'h1', type: 'heading', text: 'Narrow' }],
      },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-section-width', 'narrow');
  });

  it('renders multiple sections in order', () => {
    const blocks: Block[] = [
      { id: 's1', type: 'section', blocks: [{ id: 'h1', type: 'heading', text: 'First' }] },
      { id: 's2', type: 'section', blocks: [{ id: 'h2', type: 'heading', text: 'Second' }] },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveTextContent('First');
    expect(sections[1]).toHaveTextContent('Second');
  });

  it('handles a page with a mix of flat blocks and sections', () => {
    const blocks: Block[] = [
      { id: 'h0', type: 'heading', text: 'Flat Heading' },
      {
        id: 's1',
        type: 'section',
        background: 'muted',
        blocks: [{ id: 'h1', type: 'heading', text: 'Section Heading' }],
      },
      { id: 'p0', type: 'paragraph', text: 'Flat paragraph.' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText('Flat Heading')).toBeInTheDocument();
    expect(screen.getByText('Section Heading')).toBeInTheDocument();
    expect(screen.getByText('Flat paragraph.')).toBeInTheDocument();
  });
});

describe('BlockRenderer backwards compatibility', () => {
  it('still renders a flat-block page identically to before', () => {
    const blocks: Block[] = [
      { id: 'h1', type: 'heading', text: 'Legacy Heading' },
      { id: 'p1', type: 'paragraph', text: 'Legacy paragraph.' },
      { id: 'img1', type: 'image', src: '/legacy.jpg', alt: 'Legacy' },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Legacy Heading');
    expect(screen.getByText('Legacy paragraph.')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/legacy.jpg');
  });
});
