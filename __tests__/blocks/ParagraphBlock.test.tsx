import { render, screen } from '@testing-library/react';
import { ParagraphBlock } from '@/components/blocks/ParagraphBlock';

describe('ParagraphBlock', () => {
  it('renders paragraph text', () => {
    render(<ParagraphBlock block={{ id: 'p1', type: 'paragraph', text: 'Some text here.' }} />);
    expect(screen.getByText('Some text here.')).toBeInTheDocument();
  });

  it('renders inside a p tag', () => {
    const { container } = render(
      <ParagraphBlock block={{ id: 'p2', type: 'paragraph', text: 'Check tag.' }} />
    );
    expect(container.querySelector('p')).toHaveTextContent('Check tag.');
  });
});
