import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';
import { JudeHeadingEditor } from './blocks/JudeHeading/JudeHeadingEditor';
import { JudeHeroEditor } from './blocks/JudeHero/JudeHeroEditor';
import { JudeButtonEditor } from './blocks/JudeButton/JudeButtonEditor';
import { ParagraphEditor } from './blocks/Paragraph/ParagraphEditor';
import { SeparatorEditor } from './blocks/Separator/SeparatorEditor';
import { FeatureGridEditor } from './blocks/FeatureGrid/FeatureGridEditor';
import { CardGridEditor } from './blocks/CardGrid/CardGridEditor';
import { BadgeGroupEditor } from './blocks/BadgeGroup/BadgeGroupEditor';
import { StepsEditor } from './blocks/Steps/StepsEditor';
import { CaseStudyEditor } from './blocks/CaseStudy/CaseStudyEditor';
import { CtaEditor } from './blocks/Cta/CtaEditor';

export interface ClientEditorProps<T extends Block = Block> {
  block: T;
  onChange: (updated: T) => void;
}

export const clientEditors: Record<string, ComponentType<ClientEditorProps>> = {
  'jude-heading': JudeHeadingEditor as unknown as ComponentType<ClientEditorProps>,
  'jude-hero': JudeHeroEditor as unknown as ComponentType<ClientEditorProps>,
  'jude-button': JudeButtonEditor as unknown as ComponentType<ClientEditorProps>,
  paragraph: ParagraphEditor as unknown as ComponentType<ClientEditorProps>,
  separator: SeparatorEditor as unknown as ComponentType<ClientEditorProps>,
  'feature-grid': FeatureGridEditor as unknown as ComponentType<ClientEditorProps>,
  'card-grid': CardGridEditor as unknown as ComponentType<ClientEditorProps>,
  'badge-group': BadgeGroupEditor as unknown as ComponentType<ClientEditorProps>,
  steps: StepsEditor as unknown as ComponentType<ClientEditorProps>,
  'case-study': CaseStudyEditor as unknown as ComponentType<ClientEditorProps>,
  cta: CtaEditor as unknown as ComponentType<ClientEditorProps>,
};

export const clientTypeLabels: Record<string, string> = {
  'jude-heading': 'Jude Heading',
  'jude-hero': 'Jude Hero',
  'jude-button': 'Jude Button',
  paragraph: 'Paragraph',
  separator: 'Separator',
  'feature-grid': 'Feature Grid',
  'card-grid': 'Card Grid',
  'badge-group': 'Badge Group',
  steps: 'Steps',
  'case-study': 'Case Study',
  cta: 'Call to Action',
};
