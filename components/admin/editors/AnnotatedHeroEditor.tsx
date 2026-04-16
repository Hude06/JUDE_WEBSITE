'use client';

import type {
  Annotation,
  AnnotatedHeroBlock,
  AnnotationVariant,
  AnnotatedHeroImageAspect,
} from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AnnotatedHeroEditorProps {
  block: AnnotatedHeroBlock;
  onChange: (block: AnnotatedHeroBlock) => void;
}

const VARIANTS: AnnotationVariant[] = [
  'note',
  'chip',
  'callout',
  'popover',
  'tag',
];

const ASPECTS: AnnotatedHeroImageAspect[] = ['landscape', 'square', 'portrait'];

function makeId(): string {
  return `ann-${Math.random().toString(36).slice(2, 9)}`;
}

export function AnnotatedHeroEditor({
  block,
  onChange,
}: AnnotatedHeroEditorProps) {
  const annotations = block.annotations ?? [];

  function updateAnnotation(index: number, patch: Partial<Annotation>) {
    const next = annotations.map((a, i) => (i === index ? { ...a, ...patch } : a));
    onChange({ ...block, annotations: next });
  }

  function addAnnotation() {
    const next: Annotation[] = [
      ...annotations,
      {
        id: makeId(),
        text: 'New note',
        x: 50,
        y: 50,
        variant: 'note',
      },
    ];
    onChange({ ...block, annotations: next });
  }

  function removeAnnotation(index: number) {
    const next = annotations.filter((_, i) => i !== index);
    onChange({ ...block, annotations: next });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Eyebrow</Label>
        <Input
          value={block.eyebrow ?? ''}
          onChange={(e) =>
            onChange({ ...block, eyebrow: e.target.value || undefined })
          }
          placeholder="Small label above headline"
        />
      </div>

      <div>
        <Label>Headline (use \n for line breaks)</Label>
        <Textarea
          value={block.headline}
          onChange={(e) => onChange({ ...block, headline: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label>Subheadline</Label>
        <Textarea
          value={block.subheadline ?? ''}
          onChange={(e) =>
            onChange({ ...block, subheadline: e.target.value || undefined })
          }
          rows={2}
        />
      </div>

      <div>
        <Label>Caption (small text under CTA)</Label>
        <Input
          value={block.caption ?? ''}
          onChange={(e) =>
            onChange({ ...block, caption: e.target.value || undefined })
          }
          placeholder="$4.99 · One-time purchase"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Primary CTA text</Label>
          <Input
            value={block.primaryCta?.text ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                primaryCta: e.target.value
                  ? {
                      text: e.target.value,
                      href: block.primaryCta?.href ?? '',
                    }
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <Label>Primary CTA link</Label>
          <Input
            value={block.primaryCta?.href ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                primaryCta: block.primaryCta
                  ? { ...block.primaryCta, href: e.target.value }
                  : { text: '', href: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Secondary CTA text</Label>
          <Input
            value={block.secondaryCta?.text ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                secondaryCta: e.target.value
                  ? {
                      text: e.target.value,
                      href: block.secondaryCta?.href ?? '',
                    }
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <Label>Secondary CTA link</Label>
          <Input
            value={block.secondaryCta?.href ?? ''}
            onChange={(e) =>
              onChange({
                ...block,
                secondaryCta: block.secondaryCta
                  ? { ...block.secondaryCta, href: e.target.value }
                  : { text: '', href: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>Image URL</Label>
        <Input
          value={block.image}
          onChange={(e) => onChange({ ...block, image: e.target.value })}
        />
      </div>

      <div>
        <Label>Image alt</Label>
        <Input
          value={block.imageAlt ?? ''}
          onChange={(e) =>
            onChange({ ...block, imageAlt: e.target.value || undefined })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Image position</Label>
          <select
            value={block.imagePosition ?? 'left'}
            onChange={(e) =>
              onChange({
                ...block,
                imagePosition: e.target.value as 'left' | 'right',
              })
            }
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <Label>Image aspect</Label>
          <select
            value={block.imageAspect ?? 'landscape'}
            onChange={(e) =>
              onChange({
                ...block,
                imageAspect: e.target.value as AnnotatedHeroImageAspect,
              })
            }
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {ASPECTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Annotations ({annotations.length})</Label>
          <Button variant="outline" size="sm" onClick={addAnnotation}>
            Add
          </Button>
        </div>
        {annotations.map((ann, i) => (
          <Card key={ann.id} size="sm">
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  #{i + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAnnotation(i)}
                >
                  Remove
                </Button>
              </div>
              <div>
                <Label>Text</Label>
                <Input
                  value={ann.text}
                  onChange={(e) =>
                    updateAnnotation(i, { text: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>X %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={ann.x}
                    onChange={(e) =>
                      updateAnnotation(i, { x: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Y %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={ann.y}
                    onChange={(e) =>
                      updateAnnotation(i, { y: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Rotate</Label>
                  <Input
                    type="number"
                    min={-6}
                    max={6}
                    value={ann.rotate ?? 0}
                    onChange={(e) =>
                      updateAnnotation(i, {
                        rotate: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Variant</Label>
                  <select
                    value={ann.variant ?? 'note'}
                    onChange={(e) =>
                      updateAnnotation(i, {
                        variant: e.target.value as AnnotationVariant,
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    {VARIANTS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Emoji (optional)</Label>
                  <Input
                    value={ann.emoji ?? ''}
                    onChange={(e) =>
                      updateAnnotation(i, {
                        emoji: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Delay (s)</Label>
                <Input
                  type="number"
                  step={0.05}
                  min={0}
                  value={ann.delay ?? 0}
                  onChange={(e) =>
                    updateAnnotation(i, { delay: Number(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
