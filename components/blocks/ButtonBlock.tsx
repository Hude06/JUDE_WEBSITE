import type { ButtonBlock as ButtonBlockType } from '@/lib/types';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonBlockProps {
  block: ButtonBlockType;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
  return (
    <div className="my-4">
      <a
        href={block.href}
        className={cn(buttonVariants({ variant: block.variant ?? 'default' }))}
      >
        {block.text}
      </a>
    </div>
  );
}
