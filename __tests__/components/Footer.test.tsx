import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders site name', () => {
    render(<Footer siteName="My Site" />);
    expect(screen.getByText(/My Site/)).toBeInTheDocument();
  });

  it('renders copyright year', () => {
    render(<Footer siteName="My Site" />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
