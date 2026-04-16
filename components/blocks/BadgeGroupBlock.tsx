import type { BadgeGroupBlock as BadgeGroupBlockType } from '@/lib/types';

interface BadgeGroupBlockProps {
  block: BadgeGroupBlockType;
}

export function BadgeGroupBlock({ block }: BadgeGroupBlockProps) {
  return (
    <div className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-6">
      <ul className="flex flex-wrap gap-2.5">
        {block.badges.map((badge, i) => (
          <li
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/60 px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-[color:var(--color-fg)]"
          >
            {i === 0 && <span className="pulse-dot" aria-hidden />}
            <span>{badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
