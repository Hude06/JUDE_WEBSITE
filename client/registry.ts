import type { ComponentType } from 'react';
import { JudeHeroBlock } from '@/client/blocks/JudeHero/JudeHeroBlock';
import { JudeHeadingBlock } from '@/client/blocks/JudeHeading/JudeHeadingBlock';
import { ParagraphBlock } from '@/client/blocks/Paragraph/ParagraphBlock';
import { JudeButtonBlock } from '@/client/blocks/JudeButton/JudeButtonBlock';
import { SeparatorBlock } from '@/client/blocks/Separator/SeparatorBlock';
import { CaseStudyBlock } from '@/client/blocks/CaseStudy/CaseStudyBlock';
import { FeatureGridBlock } from '@/client/blocks/FeatureGrid/FeatureGridBlock';
import { StepsBlock } from '@/client/blocks/Steps/StepsBlock';
import { CardGridBlock } from '@/client/blocks/CardGrid/CardGridBlock';
import { BadgeGroupBlock } from '@/client/blocks/BadgeGroup/BadgeGroupBlock';
import { CtaBlock } from '@/client/blocks/Cta/CtaBlock';
import { TestimonialBlock } from '@/client/blocks/Testimonial/TestimonialBlock';
import { PhotoBlock } from '@/client/blocks/Photo/PhotoBlock';
import { WorkGridBlock } from '@/client/blocks/WorkGrid/WorkGridBlock';
import { PhotoStripBlock } from '@/client/blocks/PhotoStrip/PhotoStripBlock';
import { ContactFormBlock } from '@/client/blocks/ContactForm/ContactFormBlock';

export const clientBlocks: Record<string, ComponentType<{ block: never }>> = {
  'jude-hero': JudeHeroBlock as ComponentType<{ block: never }>,
  'jude-heading': JudeHeadingBlock as ComponentType<{ block: never }>,
  paragraph: ParagraphBlock as ComponentType<{ block: never }>,
  'jude-button': JudeButtonBlock as ComponentType<{ block: never }>,
  separator: SeparatorBlock as ComponentType<{ block: never }>,
  'case-study': CaseStudyBlock as ComponentType<{ block: never }>,
  'feature-grid': FeatureGridBlock as ComponentType<{ block: never }>,
  steps: StepsBlock as ComponentType<{ block: never }>,
  'card-grid': CardGridBlock as ComponentType<{ block: never }>,
  'badge-group': BadgeGroupBlock as ComponentType<{ block: never }>,
  cta: CtaBlock as ComponentType<{ block: never }>,
  testimonial: TestimonialBlock as ComponentType<{ block: never }>,
  photo: PhotoBlock as ComponentType<{ block: never }>,
  'work-grid': WorkGridBlock as ComponentType<{ block: never }>,
  'photo-strip': PhotoStripBlock as ComponentType<{ block: never }>,
  'contact-form': ContactFormBlock as ComponentType<{ block: never }>,
};
