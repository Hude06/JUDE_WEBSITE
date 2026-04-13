import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import type { Block } from '@/lib/types';

describe('BlockRenderer', () => {
  it('renders a heading block', () => {
    const blocks: Block[] = [
      { id: 'h1', type: 'heading', text: 'Test Heading' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Test Heading');
  });

  it('renders a paragraph block', () => {
    const blocks: Block[] = [
      { id: 'p1', type: 'paragraph', text: 'Test paragraph.' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText('Test paragraph.')).toBeInTheDocument();
  });

  it('renders an image block', () => {
    const blocks: Block[] = [
      { id: 'img1', type: 'image', src: '/test.jpg', alt: 'Test' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
  });

  it('renders multiple blocks in order', () => {
    const blocks: Block[] = [
      { id: 'h1', type: 'heading', text: 'First' },
      { id: 'p1', type: 'paragraph', text: 'Second' },
      { id: 'p2', type: 'paragraph', text: 'Third' },
    ];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    const children = container.firstElementChild?.children;
    expect(children).toHaveLength(3);
  });

  it('skips unknown block types', () => {
    const blocks = [
      { id: 'u1', type: 'unknown', text: 'Nope' },
    ] as unknown as Block[];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container.firstElementChild?.children).toHaveLength(0);
  });

  it('renders empty for no blocks', () => {
    const { container } = render(<BlockRenderer blocks={[]} />);
    expect(container.firstElementChild?.children).toHaveLength(0);
  });
});
