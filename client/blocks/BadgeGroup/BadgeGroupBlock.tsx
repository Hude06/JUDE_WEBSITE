import type { BadgeGroupBlock as BadgeGroupBlockType } from '@/client/types';

interface BadgeGroupBlockProps {
  block: BadgeGroupBlockType;
}

export function BadgeGroupBlock({ block }: BadgeGroupBlockProps) {
  return (
    <div className="jude-container badge-group-block">
      <ul className="badge-group-block__list">
        {block.badges.map((badge, i) => (
          <li
            key={i}
            className="badge-group-block__item"
          >
            {i === 0 && <span className="pulse-dot" aria-hidden />}
            <span>{badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
