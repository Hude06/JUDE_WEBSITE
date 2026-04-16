'use client';

import type { TeamBlock, TeamMember } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TeamEditorProps {
  block: TeamBlock;
  onChange: (block: TeamBlock) => void;
}

export function TeamEditor({ block, onChange }: TeamEditorProps) {
  function updateMember(i: number, updates: Partial<TeamMember>) {
    const members = block.members.map((m, idx) => (idx === i ? { ...m, ...updates } : m));
    onChange({ ...block, members });
  }

  function removeMember(i: number) {
    onChange({ ...block, members: block.members.filter((_, idx) => idx !== i) });
  }

  function addMember() {
    onChange({ ...block, members: [...block.members, { name: '', role: '' }] });
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>Eyebrow</Label>
        <Input
          value={block.eyebrow ?? ''}
          onChange={(e) => onChange({ ...block, eyebrow: e.target.value || undefined })}
        />
      </div>
      <div>
        <Label>Heading</Label>
        <Input
          value={block.heading ?? ''}
          onChange={(e) => onChange({ ...block, heading: e.target.value || undefined })}
        />
      </div>
      <Label>Members</Label>
      {block.members.map((member, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <Input
              value={member.name}
              onChange={(e) => updateMember(i, { name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={member.role}
              onChange={(e) => updateMember(i, { role: e.target.value })}
              placeholder="Role"
            />
            <Input
              value={member.image ?? ''}
              onChange={(e) => updateMember(i, { image: e.target.value || undefined })}
              placeholder="Image URL (optional)"
            />
            <Input
              value={member.link ?? ''}
              onChange={(e) => updateMember(i, { link: e.target.value || undefined })}
              placeholder="Link (optional)"
            />
            <Textarea
              value={member.bio ?? ''}
              onChange={(e) => updateMember(i, { bio: e.target.value || undefined })}
              placeholder="Short bio (optional)"
              rows={2}
            />
            <Button variant="ghost" size="sm" onClick={() => removeMember(i)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addMember}>
        + Add Member
      </Button>
    </div>
  );
}
