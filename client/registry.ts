import type { ComponentType } from 'react';
import { JudeHeadingBlock } from './blocks/JudeHeading/JudeHeadingBlock';
import { JudeHeroBlock } from './blocks/JudeHero/JudeHeroBlock';
import { JudeButtonBlock } from './blocks/JudeButton/JudeButtonBlock';
import { ParagraphBlock } from './blocks/Paragraph/ParagraphBlock';
import { SeparatorBlock } from './blocks/Separator/SeparatorBlock';
import { FeatureGridBlock } from './blocks/FeatureGrid/FeatureGridBlock';
import { CardGridBlock } from './blocks/CardGrid/CardGridBlock';
import { BadgeGroupBlock } from './blocks/BadgeGroup/BadgeGroupBlock';
import { StepsBlock } from './blocks/Steps/StepsBlock';
import { CaseStudyBlock } from './blocks/CaseStudy/CaseStudyBlock';
import { CtaBlock } from './blocks/Cta/CtaBlock';

export const clientBlocks: Record<string, ComponentType<{ block: never }>> = {
  'jude-heading': JudeHeadingBlock as ComponentType<{ block: never }>,
  'jude-hero': JudeHeroBlock as ComponentType<{ block: never }>,
  'jude-button': JudeButtonBlock as ComponentType<{ block: never }>,
  paragraph: ParagraphBlock as ComponentType<{ block: never }>,
  separator: SeparatorBlock as ComponentType<{ block: never }>,
  'feature-grid': FeatureGridBlock as ComponentType<{ block: never }>,
  'card-grid': CardGridBlock as ComponentType<{ block: never }>,
  'badge-group': BadgeGroupBlock as ComponentType<{ block: never }>,
  steps: StepsBlock as ComponentType<{ block: never }>,
  'case-study': CaseStudyBlock as ComponentType<{ block: never }>,
  cta: CtaBlock as ComponentType<{ block: never }>,
};
