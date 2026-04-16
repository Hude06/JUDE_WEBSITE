import { render, screen } from '@testing-library/react';
import { Reveal, Stagger, StaggerItem, Parallax } from '@/lib/motion';

describe('Reveal', () => {
  it('renders children', () => {
    render(<Reveal>hello world</Reveal>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('accepts a className prop', () => {
    const { container } = render(<Reveal className="custom-class">x</Reveal>);
    expect(container.firstElementChild?.className).toContain('custom-class');
  });

  it('renders with direction="up" default', () => {
    render(<Reveal>default direction</Reveal>);
    expect(screen.getByText('default direction')).toBeInTheDocument();
  });

  it('renders with direction="none"', () => {
    render(<Reveal direction="none">no direction</Reveal>);
    expect(screen.getByText('no direction')).toBeInTheDocument();
  });

  it('renders with a delay', () => {
    render(<Reveal delay={0.5}>delayed</Reveal>);
    expect(screen.getByText('delayed')).toBeInTheDocument();
  });
});

describe('Stagger', () => {
  it('renders all children', () => {
    render(
      <Stagger>
        <StaggerItem>one</StaggerItem>
        <StaggerItem>two</StaggerItem>
        <StaggerItem>three</StaggerItem>
      </Stagger>,
    );
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('accepts custom stagger timing', () => {
    render(
      <Stagger stagger={0.2}>
        <StaggerItem>item</StaggerItem>
      </Stagger>,
    );
    expect(screen.getByText('item')).toBeInTheDocument();
  });
});

describe('StaggerItem', () => {
  it('renders children', () => {
    render(<StaggerItem>solo</StaggerItem>);
    expect(screen.getByText('solo')).toBeInTheDocument();
  });

  it('accepts direction', () => {
    render(<StaggerItem direction="left">left item</StaggerItem>);
    expect(screen.getByText('left item')).toBeInTheDocument();
  });
});

describe('Parallax', () => {
  it('renders children', () => {
    render(<Parallax>parallax content</Parallax>);
    expect(screen.getByText('parallax content')).toBeInTheDocument();
  });

  it('accepts an offset', () => {
    render(<Parallax offset={100}>offset content</Parallax>);
    expect(screen.getByText('offset content')).toBeInTheDocument();
  });
});
