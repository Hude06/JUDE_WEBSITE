import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

describe('Input', () => {
  it('renders with default type text', () => {
    render(<Input data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveAttribute('type', 'text');
  });

  it('accepts custom type', () => {
    render(<Input type="email" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveAttribute('type', 'email');
  });

  it('forwards className', () => {
    render(<Input className="custom-in" data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveClass('custom-in');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders placeholder', () => {
    render(<Input placeholder="type here" />);
    expect(screen.getByPlaceholderText('type here')).toBeInTheDocument();
  });

  it('supports disabled attribute', () => {
    render(<Input disabled data-testid="i" />);
    expect(screen.getByTestId('i')).toBeDisabled();
  });
});

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea data-testid="t" />);
    expect(screen.getByTestId('t').tagName).toBe('TEXTAREA');
  });

  it('accepts rows prop', () => {
    render(<Textarea rows={5} data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveAttribute('rows', '5');
  });

  it('forwards className', () => {
    render(<Textarea className="custom-ta" data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveClass('custom-ta');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});

describe('Label', () => {
  it('renders a label element', () => {
    render(<Label htmlFor="x">Name</Label>);
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'x');
  });

  it('forwards className', () => {
    render(<Label className="custom-lab">Field</Label>);
    expect(screen.getByText('Field')).toHaveClass('custom-lab');
  });
});

describe('Separator', () => {
  it('renders horizontal by default', () => {
    render(<Separator data-testid="s" />);
    const sep = screen.getByTestId('s');
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
    expect(sep.className).toMatch(/h-px/);
  });

  it('renders vertical when requested', () => {
    render(<Separator orientation="vertical" data-testid="s" />);
    const sep = screen.getByTestId('s');
    expect(sep).toHaveAttribute('data-orientation', 'vertical');
    expect(sep.className).toMatch(/w-px/);
  });

  it('decorative by default has role=none', () => {
    render(<Separator data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('role', 'none');
  });

  it('non-decorative has role=separator', () => {
    render(<Separator decorative={false} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('role', 'separator');
  });
});
