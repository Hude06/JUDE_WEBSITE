'use client';

import type { StepsBlock, StepItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StepsEditorProps {
  block: StepsBlock;
  onChange: (block: StepsBlock) => void;
}

export function StepsEditor({ block, onChange }: StepsEditorProps) {
  function updateStep(i: number, updates: Partial<StepItem>) {
    const steps = block.steps.map((step, idx) => (idx === i ? { ...step, ...updates } : step));
    onChange({ ...block, steps });
  }

  function removeStep(i: number) {
    onChange({ ...block, steps: block.steps.filter((_, idx) => idx !== i) });
  }

  function addStep() {
    onChange({ ...block, steps: [...block.steps, { title: '', description: '' }] });
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
      <Label>Steps</Label>
      {block.steps.map((step, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <Input
              value={step.title}
              onChange={(e) => updateStep(i, { title: e.target.value })}
              placeholder={`Step ${i + 1} title`}
            />
            <Textarea
              value={step.description}
              onChange={(e) => updateStep(i, { description: e.target.value })}
              placeholder="Step description"
              rows={2}
            />
            <Button variant="ghost" size="sm" onClick={() => removeStep(i)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addStep}>
        + Add Step
      </Button>
    </div>
  );
}
