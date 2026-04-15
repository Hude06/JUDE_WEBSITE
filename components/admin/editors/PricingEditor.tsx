'use client';

import type { PricingBlock, PricingTier } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PricingEditorProps {
  block: PricingBlock;
  onChange: (block: PricingBlock) => void;
}

export function PricingEditor({ block, onChange }: PricingEditorProps) {
  function updateTier(i: number, updates: Partial<PricingTier>) {
    const tiers = block.tiers.map((tier, idx) => (idx === i ? { ...tier, ...updates } : tier));
    onChange({ ...block, tiers });
  }

  function removeTier(i: number) {
    onChange({ ...block, tiers: block.tiers.filter((_, idx) => idx !== i) });
  }

  function addTier() {
    onChange({
      ...block,
      tiers: [
        ...block.tiers,
        { name: 'New tier', price: '$0', features: [], ctaText: 'Get started', ctaHref: '/' },
      ],
    });
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
      <Label>Tiers</Label>
      {block.tiers.map((tier, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <Input
              value={tier.name}
              onChange={(e) => updateTier(i, { name: e.target.value })}
              placeholder="Tier name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={tier.price}
                onChange={(e) => updateTier(i, { price: e.target.value })}
                placeholder="Price (e.g. $29)"
              />
              <Input
                value={tier.period ?? ''}
                onChange={(e) => updateTier(i, { period: e.target.value || undefined })}
                placeholder="Period (e.g. month)"
              />
            </div>
            <Textarea
              value={tier.description ?? ''}
              onChange={(e) => updateTier(i, { description: e.target.value || undefined })}
              placeholder="Short description"
              rows={2}
            />
            <Textarea
              value={tier.features.join('\n')}
              onChange={(e) =>
                updateTier(i, {
                  features: e.target.value.split('\n').filter((f) => f.trim().length > 0),
                })
              }
              placeholder="Features (one per line)"
              rows={4}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={tier.ctaText}
                onChange={(e) => updateTier(i, { ctaText: e.target.value })}
                placeholder="CTA text"
              />
              <Input
                value={tier.ctaHref}
                onChange={(e) => updateTier(i, { ctaHref: e.target.value })}
                placeholder="CTA link"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tier.featured ?? false}
                onChange={(e) => updateTier(i, { featured: e.target.checked })}
              />
              Featured tier
            </label>
            <Button variant="ghost" size="sm" onClick={() => removeTier(i)}>
              Remove Tier
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addTier}>
        + Add Tier
      </Button>
    </div>
  );
}
