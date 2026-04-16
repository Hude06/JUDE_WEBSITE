import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { BadgeGroupBlock } from './blocks/BadgeGroupBlock';
import { CardGridBlock } from './blocks/CardGridBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { SeparatorBlock } from './blocks/SeparatorBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { AnnotatedHeroBlock } from './blocks/AnnotatedHeroBlock';
import { FeatureGridBlock } from './blocks/FeatureGridBlock';
import { CtaBlock } from './blocks/CtaBlock';
import { FaqBlock } from './blocks/FaqBlock';
import { StatsBlock } from './blocks/StatsBlock';
import { PricingBlock } from './blocks/PricingBlock';
import { StepsBlock } from './blocks/StepsBlock';
import { TeamBlock } from './blocks/TeamBlock';
import { RichTextBlock } from './blocks/RichTextBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ContactFormBlock } from './blocks/ContactFormBlock';
import { TwoColumnBlock } from './blocks/TwoColumnBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { CaseStudyBlock } from './blocks/CaseStudyBlock';
import { SectionBlock } from './blocks/SectionBlock';

const blockRegistry: Record<string, ComponentType<{ block: never }>> = {
  heading: HeadingBlock as ComponentType<{ block: never }>,
  paragraph: ParagraphBlock as ComponentType<{ block: never }>,
  image: ImageBlock as ComponentType<{ block: never }>,
  'badge-group': BadgeGroupBlock as ComponentType<{ block: never }>,
  'card-grid': CardGridBlock as ComponentType<{ block: never }>,
  button: ButtonBlock as ComponentType<{ block: never }>,
  separator: SeparatorBlock as ComponentType<{ block: never }>,
  hero: HeroBlock as ComponentType<{ block: never }>,
  'annotated-hero': AnnotatedHeroBlock as ComponentType<{ block: never }>,
  'feature-grid': FeatureGridBlock as ComponentType<{ block: never }>,
  cta: CtaBlock as ComponentType<{ block: never }>,
  faq: FaqBlock as ComponentType<{ block: never }>,
  stats: StatsBlock as ComponentType<{ block: never }>,
  pricing: PricingBlock as ComponentType<{ block: never }>,
  steps: StepsBlock as ComponentType<{ block: never }>,
  team: TeamBlock as ComponentType<{ block: never }>,
  'rich-text': RichTextBlock as ComponentType<{ block: never }>,
  video: VideoBlock as ComponentType<{ block: never }>,
  'contact-form': ContactFormBlock as ComponentType<{ block: never }>,
  'two-column': TwoColumnBlock as ComponentType<{ block: never }>,
  quote: QuoteBlock as ComponentType<{ block: never }>,
  'case-study': CaseStudyBlock as ComponentType<{ block: never }>,
  section: SectionBlock as ComponentType<{ block: never }>,
};

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div>
      {blocks.map((block) => {
        const Component = blockRegistry[block.type];
        if (!Component) return null;
        return <Component key={block.id} block={block as never} />;
      })}
    </div>
  );
}
