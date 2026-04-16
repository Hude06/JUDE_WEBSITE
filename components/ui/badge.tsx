import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

const BASE =
  'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background [&>svg]:pointer-events-none [&>svg]:size-3';

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:
    'bg-destructive/10 text-destructive focus-visible:ring-destructive/40',
  outline: 'border-border text-foreground hover:bg-muted',
  ghost: 'text-muted-foreground hover:bg-muted',
  link: 'text-primary underline-offset-4 hover:underline',
};

interface BadgeVariantOptions {
  variant?: BadgeVariant;
  className?: string;
}

export function badgeVariants({
  variant = 'default',
  className,
}: BadgeVariantOptions = {}): string {
  return cn(BASE, VARIANTS[variant], className);
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ className, variant, ...props }, ref) {
    return (
      <span
        ref={ref}
        data-slot="badge"
        className={badgeVariants({ variant, className })}
        {...props}
      />
    );
  },
);
