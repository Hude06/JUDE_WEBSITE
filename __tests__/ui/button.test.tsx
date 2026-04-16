import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Button, buttonVariants } from '@/components/ui/button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Button className="custom-class">Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('defaults type to button', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows overriding type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button').className).toMatch(/destructive/);
  });

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toMatch(/h-8/);
  });

  it('handles disabled state', () => {
    render(<Button disabled>Go</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('sets data-slot attribute', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
  });

  it('buttonVariants returns class string with size and variant', () => {
    const cls = buttonVariants({ variant: 'outline', size: 'lg' });
    expect(typeof cls).toBe('string');
    expect(cls).toMatch(/h-10/);
    expect(cls).toMatch(/border/);
  });

  it('buttonVariants defaults to default variant + default size', () => {
    const cls = buttonVariants();
    expect(cls).toMatch(/h-9/);
    expect(cls).toMatch(/bg-primary/);
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
