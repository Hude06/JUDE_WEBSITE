import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card data-testid="card">Body</Card>);
    expect(screen.getByTestId('card')).toHaveTextContent('Body');
  });

  it('applies default size data attribute', () => {
    render(<Card data-testid="card">x</Card>);
    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'default');
  });

  it('applies sm size data attribute', () => {
    render(
      <Card size="sm" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'sm');
  });

  it('forwards className on Card', () => {
    render(
      <Card data-testid="card" className="custom-card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass('custom-card');
  });

  it('renders subcomponents in order', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('subcomponents expose data-slot attributes', () => {
    render(
      <Card>
        <CardHeader data-testid="h">
          <CardTitle data-testid="t">t</CardTitle>
          <CardDescription data-testid="d">d</CardDescription>
        </CardHeader>
        <CardContent data-testid="c">c</CardContent>
        <CardFooter data-testid="f">f</CardFooter>
      </Card>,
    );
    expect(screen.getByTestId('h')).toHaveAttribute('data-slot', 'card-header');
    expect(screen.getByTestId('t')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByTestId('d')).toHaveAttribute(
      'data-slot',
      'card-description',
    );
    expect(screen.getByTestId('c')).toHaveAttribute(
      'data-slot',
      'card-content',
    );
    expect(screen.getByTestId('f')).toHaveAttribute('data-slot', 'card-footer');
  });
});
