import * as React from 'react';
import { cn } from '@/lib/utils';

export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type="radio"
        data-slot="radio"
        className={cn(
          'peer size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-background shadow-xs transition-colors',
          'checked:border-primary checked:bg-primary',
          'checked:shadow-[inset_0_0_0_3px_var(--color-background)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
