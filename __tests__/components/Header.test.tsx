import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header', () => {
  const nav = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ];

  it('renders site name', () => {
    render(<Header siteName="My Site" nav={nav} />);
    expect(screen.getByText('My Site')).toBeInTheDocument();
  });

  it('renders nav links', () => {
    render(<Header siteName="My Site" nav={nav} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('site name links to home', () => {
    render(<Header siteName="My Site" nav={nav} />);
    const siteLink = screen.getByText('My Site').closest('a');
    expect(siteLink).toHaveAttribute('href', '/');
  });
});
