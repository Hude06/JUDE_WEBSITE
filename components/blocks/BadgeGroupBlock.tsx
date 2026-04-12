import type { BadgeGroupBlock as BadgeGroupBlockType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface BadgeGroupBlockProps {
  block: BadgeGroupBlockType;
}

export function BadgeGroupBlock({ block }: BadgeGroupBlockProps) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {block.badges.map((badge) => (
        <Badge key={badge} variant="secondary">{badge}</Badge>
      ))}
    </div>
  );
}
