import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { Kbd } from '@/components/ui/kbd';

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveAttribute('type', 'checkbox');
  });

  it('toggles checked state', () => {
    render(<Checkbox data-testid="c" />);
    const c = screen.getByTestId('c') as HTMLInputElement;
    fireEvent.click(c);
    expect(c.checked).toBe(true);
  });

  it('forwards className', () => {
    render(<Checkbox className="custom-check" data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveClass('custom-check');
  });

  it('can be disabled', () => {
    render(<Checkbox disabled data-testid="c" />);
    expect(screen.getByTestId('c')).toBeDisabled();
  });
});

describe('Radio', () => {
  it('renders a radio input', () => {
    render(<Radio data-testid="r" />);
    expect(screen.getByTestId('r')).toHaveAttribute('type', 'radio');
  });

  it('forwards className', () => {
    render(<Radio className="custom-radio" data-testid="r" />);
    expect(screen.getByTestId('r')).toHaveClass('custom-radio');
  });

  it('supports name prop for grouping', () => {
    render(
      <>
        <Radio name="g" value="a" data-testid="ra" />
        <Radio name="g" value="b" data-testid="rb" />
      </>,
    );
    expect(screen.getByTestId('ra')).toHaveAttribute('name', 'g');
    expect(screen.getByTestId('rb')).toHaveAttribute('name', 'g');
  });
});

describe('Switch', () => {
  it('renders a hidden checkbox input', () => {
    render(<Switch data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('type', 'checkbox');
  });

  it('toggles state on click', () => {
    render(<Switch data-testid="s" />);
    const input = screen.getByTestId('s') as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('can be disabled', () => {
    render(<Switch disabled data-testid="s" />);
    expect(screen.getByTestId('s')).toBeDisabled();
  });
});

describe('Kbd', () => {
  it('renders a kbd element', () => {
    render(<Kbd>⌘K</Kbd>);
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });

  it('forwards className', () => {
    render(<Kbd className="custom-kbd">K</Kbd>);
    expect(screen.getByText('K')).toHaveClass('custom-kbd');
  });
});
