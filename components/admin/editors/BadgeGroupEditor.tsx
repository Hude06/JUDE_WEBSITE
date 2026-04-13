'use client';

import type { BadgeGroupBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface BadgeGroupEditorProps {
  block: BadgeGroupBlock;
  onChange: (block: BadgeGroupBlock) => void;
}

export function BadgeGroupEditor({ block, onChange }: BadgeGroupEditorProps) {
  function updateBadge(index: number, value: string) {
    const badges = [...block.badges];
    badges[index] = value;
    onChange({ ...block, badges });
  }

  function removeBadge(index: number) {
    const badges = block.badges.filter((_, i) => i !== index);
    onChange({ ...block, badges });
  }

  function addBadge() {
    onChange({ ...block, badges: [...block.badges, ''] });
  }

  return (
    <div className="space-y-2">
      <Label>Badges</Label>
      {block.badges.map((badge, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={badge}
            onChange={(e) => updateBadge(i, e.target.value)}
            placeholder="Badge label"
          />
          <Button variant="ghost" size="sm" onClick={() => removeBadge(i)}>
            &times;
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addBadge}>
        + Add Badge
      </Button>
    </div>
  );
}
