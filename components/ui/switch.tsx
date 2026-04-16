import * as React from 'react';
import { cn } from '@/lib/utils';

export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>;

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ className, ...props }, ref) {
    return (
      <label
        data-slot="switch"
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-input bg-muted transition-colors',
          'has-[:checked]:bg-primary has-[:checked]:border-primary',
          'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-0.5 size-4 rounded-full bg-background shadow-sm transition-transform peer-checked:translate-x-4"
        />
      </label>
    );
  },
);
