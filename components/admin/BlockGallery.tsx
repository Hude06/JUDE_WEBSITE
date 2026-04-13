'use client';

import { useState } from 'react';
import type { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface BlockTemplate {
  type: Block['type'];
  label: string;
  description: string;
  icon: string;
  create: (id: string) => Block;
}

const blockTemplates: BlockTemplate[] = [
  {
    type: 'heading',
    label: 'Heading',
    description: 'Section title or page heading',
    icon: 'H',
    create: (id) => ({ id, type: 'heading', text: 'New Heading', level: 2 }),
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    description: 'A block of text content',
    icon: 'P',
    create: (id) => ({ id, type: 'paragraph', text: 'New paragraph...' }),
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload and display an image',
    icon: 'I',
    create: (id) => ({ id, type: 'image', src: '', alt: '' }),
  },
  {
    type: 'badge-group',
    label: 'Badges',
    description: 'Group of tags or labels',
    icon: 'B',
    create: (id) => ({ id, type: 'badge-group', badges: ['Badge 1', 'Badge 2'] }),
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    description: 'Grid of cards with titles and descriptions',
    icon: 'G',
    create: (id) => ({
      id,
      type: 'card-grid',
      cards: [{ title: 'Card Title', description: 'Card description' }],
    }),
  },
  {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action link button',
    icon: '→',
    create: (id) => ({ id, type: 'button', text: 'Click me', href: '/', variant: 'default' }),
  },
  {
    type: 'separator',
    label: 'Separator',
    description: 'Horizontal divider between sections',
    icon: '—',
    create: (id) => ({ id, type: 'separator' }),
  },
];

interface BlockGalleryProps {
  onAddBlock: (block: Block) => void;
  slug: string;
  blockCount: number;
}

export function BlockGallery({ onAddBlock, slug, blockCount }: BlockGalleryProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(template: BlockTemplate) {
    const id = `${slug}-${Date.now()}`;
    onAddBlock(template.create(id));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="w-full border-dashed" />
        }
      >
        + Add Block
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a Block</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {blockTemplates.map((template) => (
            <Card
              key={template.type}
              size="sm"
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => handleSelect(template)}
            >
              <CardContent className="flex items-start gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold">
                  {template.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{template.label}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
