import type { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
  diamondColor?: string;
}

export function AtelierMark({ size = 20, diamondColor = '#c24b2c', ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      {...props}
    >
      <rect x="2.5"  y="3.5" width="4" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8"    y="3.5" width="4" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="13.5" y="3.5" width="4" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="7.5" y="7.5" width="5" height="5" rx="0.9" fill={diamondColor} transform="rotate(45 10 10)"/>
    </svg>
  );
}
