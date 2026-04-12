import { render, screen } from '@testing-library/react';
import { HeadingBlock } from '@/components/blocks/HeadingBlock';

describe('HeadingBlock', () => {
  it('renders text in an h1 by default', () => {
    render(<HeadingBlock block={{ id: 'h1', type: 'heading', text: 'Hello World' }} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello World');
  });

  it('renders the correct heading level', () => {
    render(<HeadingBlock block={{ id: 'h2', type: 'heading', text: 'Sub Heading', level: 2 }} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Sub Heading');
  });

  it('renders level 3 heading', () => {
    render(<HeadingBlock block={{ id: 'h3', type: 'heading', text: 'Small', level: 3 }} />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});
