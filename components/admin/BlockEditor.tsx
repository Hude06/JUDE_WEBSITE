'use client';

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

interface BlockEditorProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  slug: string;
}

const typeLabels: Record<string, string> = {
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

    switch (block.type) {
      case 'heading':
        return <HeadingEditor block={block} onChange={onChange} />;
      case 'paragraph':
        return <ParagraphEditor block={block} onChange={onChange} />;
      case 'image':
        return <ImageEditor block={block} onChange={onChange} />;
      case 'badge-group':
        return <BadgeGroupEditor block={block} onChange={onChange} />;
      case 'card-grid':
        return <CardGridEditor block={block} onChange={onChange} />;
      case 'button':
        return <ButtonEditor block={block} onChange={onChange} />;
      case 'separator':
        return <p className="text-sm text-muted-foreground italic">Visual separator</p>;
      case 'hero':
        return <HeroEditor block={block} onChange={onChange} />;
      case 'annotated-hero':
        return <AnnotatedHeroEditor block={block} onChange={onChange} />;
      case 'feature-grid':
        return <FeatureGridEditor block={block} onChange={onChange} />;
      case 'cta':
        return <CtaEditor block={block} onChange={onChange} />;
      case 'faq':
        return <FaqEditor block={block} onChange={onChange} />;
      case 'stats':
        return <StatsEditor block={block} onChange={onChange} />;
      case 'pricing':
        return <PricingEditor block={block} onChange={onChange} />;
      case 'steps':
        return <StepsEditor block={block} onChange={onChange} />;
      case 'team':
        return <TeamEditor block={block} onChange={onChange} />;
      case 'rich-text':
        return <RichTextEditor block={block} onChange={onChange} />;
      case 'video':
        return <VideoEditor block={block} onChange={onChange} />;
      case 'contact-form':
        return <ContactFormEditor block={block} onChange={onChange} />;
      case 'two-column':
        return <TwoColumnEditor block={block} onChange={onChange} />;
      case 'quote':
        return <QuoteEditor block={block} onChange={onChange} />;
      case 'section':
        return <SectionEditor block={block} onChange={onChange} />;
      default:
        return <p className="text-sm text-muted-foreground">Unknown block type</p>;
    }
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
