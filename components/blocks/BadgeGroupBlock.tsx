import type { BadgeGroupBlock as BadgeGroupBlockType } from '@/lib/types';

interface BadgeGroupBlockProps {
  block: BadgeGroupBlockType;
}

export function BadgeGroupBlock({ block }: BadgeGroupBlockProps) {
  return (
    <div className="mx-auto max-w-[var(--container-default)] px-6 md:px-10 py-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
        {block.badges.join(' · ')}
      </p>
    </div>
  );
}
