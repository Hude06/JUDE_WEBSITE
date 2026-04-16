import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders as a span by default', () => {
    render(<Badge data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').tagName).toBe('SPAN');
  });

  it('applies default variant classes', () => {
    render(<Badge data-testid="b">x</Badge>);
    expect(screen.getByTestId('b').className).toMatch(/bg-primary/);
  });

  it('applies secondary variant classes', () => {
    render(
      <Badge variant="secondary" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').className).toMatch(/bg-secondary/);
  });

  it('applies outline variant classes', () => {
    render(
      <Badge variant="outline" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b').className).toMatch(/border/);
  });

  it('forwards className', () => {
    render(
      <Badge className="custom" data-testid="b">
        x
      </Badge>,
    );
    expect(screen.getByTestId('b')).toHaveClass('custom');
  });

  it('badgeVariants returns a class string', () => {
    const cls = badgeVariants({ variant: 'destructive' });
    expect(typeof cls).toBe('string');
    expect(cls).toMatch(/destructive/);
  });
});
