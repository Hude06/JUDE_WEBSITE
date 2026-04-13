'use client';

import type { CardGridBlock, CardBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type CardData = Omit<CardBlock, 'id' | 'type'>;

interface CardGridEditorProps {
  block: CardGridBlock;
  onChange: (block: CardGridBlock) => void;
}

export function CardGridEditor({ block, onChange }: CardGridEditorProps) {
  function updateCard(index: number, updates: Partial<CardData>) {
    const cards = block.cards.map((card, i) =>
      i === index ? { ...card, ...updates } : card
    );
    onChange({ ...block, cards });
  }

  function removeCard(index: number) {
    const cards = block.cards.filter((_, i) => i !== index);
    onChange({ ...block, cards });
  }

  function addCard() {
    const cards = [...block.cards, { title: '', description: '' }];
    onChange({ ...block, cards });
  }

  return (
    <div className="space-y-3">
      <Label>Cards</Label>
      {block.cards.map((card, i) => (
        <Card key={i} size="sm">
          <CardContent className="space-y-2">
            <Input
              value={card.title}
              onChange={(e) => updateCard(i, { title: e.target.value })}
              placeholder="Card title"
            />
            <Textarea
              value={card.description}
              onChange={(e) => updateCard(i, { description: e.target.value })}
              placeholder="Card description"
              rows={2}
            />
            <Input
              value={card.link ?? ''}
              onChange={(e) => updateCard(i, { link: e.target.value || undefined })}
              placeholder="Link URL (optional)"
            />
            <Button variant="ghost" size="sm" onClick={() => removeCard(i)}>
              Remove Card
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={addCard}>
        + Add Card
      </Button>
    </div>
  );
}
