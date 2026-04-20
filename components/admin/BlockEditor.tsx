'use client';

import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeadingEditor } from './editors/HeadingEditor';
import { ParagraphEditor } from './editors/ParagraphEditor';
import { ImageEditor } from './editors/ImageEditor';
import { BadgeGroupEditor } from './editors/BadgeGroupEditor';
import { CardGridEditor } from './editors/CardGridEditor';
import { ButtonEditor } from './editors/ButtonEditor';
import { HeroEditor } from './editors/HeroEditor';
import { AnnotatedHeroEditor } from './editors/AnnotatedHeroEditor';
import { FeatureGridEditor } from './editors/FeatureGridEditor';
import { CtaEditor } from './editors/CtaEditor';
import { FaqEditor } from './editors/FaqEditor';
import { StatsEditor } from './editors/StatsEditor';
import { PricingEditor } from './editors/PricingEditor';
import { StepsEditor } from './editors/StepsEditor';
import { TeamEditor } from './editors/TeamEditor';
import { RichTextEditor } from './editors/RichTextEditor';
import { VideoEditor } from './editors/VideoEditor';
import { ContactFormEditor } from './editors/ContactFormEditor';
import { TwoColumnEditor } from './editors/TwoColumnEditor';
import { QuoteEditor } from './editors/QuoteEditor';
import { SectionEditor } from './editors/SectionEditor';
import { BlockGallery } from './BlockGallery';
import { clientEditors, clientTypeLabels } from '@client/editor-registry';

interface BlockEditorProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  slug: string;
}

type EditorComponent = ComponentType<{ block: Block; onChange: (updated: Block) => void }>;

const frameworkEditors: Record<string, EditorComponent> = {
  heading: HeadingEditor as EditorComponent,
  paragraph: ParagraphEditor as EditorComponent,
  image: ImageEditor as EditorComponent,
  'badge-group': BadgeGroupEditor as EditorComponent,
  'card-grid': CardGridEditor as EditorComponent,
  button: ButtonEditor as EditorComponent,
  hero: HeroEditor as EditorComponent,
  'annotated-hero': AnnotatedHeroEditor as EditorComponent,
  'feature-grid': FeatureGridEditor as EditorComponent,
  cta: CtaEditor as EditorComponent,
  faq: FaqEditor as EditorComponent,
  stats: StatsEditor as EditorComponent,
  pricing: PricingEditor as EditorComponent,
  steps: StepsEditor as EditorComponent,
  team: TeamEditor as EditorComponent,
  'rich-text': RichTextEditor as EditorComponent,
  video: VideoEditor as EditorComponent,
  'contact-form': ContactFormEditor as EditorComponent,
  'two-column': TwoColumnEditor as EditorComponent,
  quote: QuoteEditor as EditorComponent,
  section: SectionEditor as EditorComponent,
};

const editorRegistry: Record<string, EditorComponent> = {
  ...frameworkEditors,
  ...(clientEditors as Record<string, EditorComponent>),
};

const frameworkTypeLabels: Record<string, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  image: 'Image',
  'badge-group': 'Badges',
  'card-grid': 'Card Grid',
  button: 'Button',
  separator: 'Separator',
  hero: 'Hero',
  'annotated-hero': 'Annotated Hero',
  'feature-grid': 'Feature Grid',
  cta: 'Call to Action',
  faq: 'FAQ',
  stats: 'Stats',
  pricing: 'Pricing',
  steps: 'Steps',
  team: 'Team',
  'rich-text': 'Rich Text',
  video: 'Video',
  'contact-form': 'Contact Form',
  'two-column': 'Two Column',
  quote: 'Quote',
  section: 'Section',
};

const typeLabels: Record<string, string> = {
  ...frameworkTypeLabels,
  ...clientTypeLabels,
};

function moveBlock(blocks: Block[], index: number, direction: -1 | 1): Block[] {
  const target = index + direction;
  if (target < 0 || target >= blocks.length) return blocks;

  const result = [...blocks];
  [result[index], result[target]] = [result[target], result[index]];
  return result;
}

export function BlockEditor({ blocks, onBlocksChange, slug }: BlockEditorProps) {
  function handleBlockChange(index: number, updated: Block) {
    const newBlocks = blocks.map((b, i) => (i === index ? updated : b));
    onBlocksChange(newBlocks);
  }

  function handleDeleteBlock(index: number) {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onBlocksChange(newBlocks);
  }

  function handleAddBlock(block: Block) {
    onBlocksChange([...blocks, block]);
  }

  function renderEditor(block: Block, index: number) {
    const onChange = (updated: Block) => handleBlockChange(index, updated);

    if (block.type === 'separator') {
      return <p className="text-sm text-muted-foreground italic">Visual separator</p>;
    }

    const Editor = editorRegistry[block.type];
    if (!Editor) {
      return <p className="text-sm text-muted-foreground">Unknown block type</p>;
    }
    return <Editor block={block} onChange={onChange} />;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <Card key={block.id} size="sm">
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
              {typeLabels[block.type] ?? block.type}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onBlocksChange(moveBlock(blocks, index, -1))}
                disabled={index === 0}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onBlocksChange(moveBlock(blocks, index, 1))}
                disabled={index === blocks.length - 1}
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteBlock(index)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>{renderEditor(block, index)}</CardContent>
        </Card>
      ))}

      <BlockGallery onAddBlock={handleAddBlock} slug={slug} blockCount={blocks.length} />
    </div>
  );
}
