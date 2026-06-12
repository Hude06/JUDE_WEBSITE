import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';
import { AtelierPageEditor } from '@/client/blocks/AtelierPage/AtelierPageEditor';
import { JudeHeroEditor } from '@/client/blocks/JudeHero/JudeHeroEditor';
import { JudeHeadingEditor } from '@/client/blocks/JudeHeading/JudeHeadingEditor';
import { ParagraphEditor } from '@/client/blocks/Paragraph/ParagraphEditor';
import { JudeButtonEditor } from '@/client/blocks/JudeButton/JudeButtonEditor';
import { SeparatorEditor } from '@/client/blocks/Separator/SeparatorEditor';
import { CaseStudyEditor } from '@/client/blocks/CaseStudy/CaseStudyEditor';
import { FeatureGridEditor } from '@/client/blocks/FeatureGrid/FeatureGridEditor';
import { StepsEditor } from '@/client/blocks/Steps/StepsEditor';
import { CardGridEditor } from '@/client/blocks/CardGrid/CardGridEditor';
import { BadgeGroupEditor } from '@/client/blocks/BadgeGroup/BadgeGroupEditor';
import { CtaEditor } from '@/client/blocks/Cta/CtaEditor';

export interface ClientEditorProps<T extends Block = Block> {
  block: T;
  onChange: (updated: T) => void;
}

export const clientEditors: Record<string, ComponentType<ClientEditorProps>> = {
  'atelier-page': AtelierPageEditor as unknown as ComponentType<ClientEditorProps>,
  'atelier-download': AtelierPageEditor as unknown as ComponentType<ClientEditorProps>,
  'jude-hero': JudeHeroEditor as unknown as ComponentType<ClientEditorProps>,
  'jude-heading': JudeHeadingEditor as unknown as ComponentType<ClientEditorProps>,
  paragraph: ParagraphEditor as unknown as ComponentType<ClientEditorProps>,
  'jude-button': JudeButtonEditor as unknown as ComponentType<ClientEditorProps>,
  separator: SeparatorEditor as unknown as ComponentType<ClientEditorProps>,
  'case-study': CaseStudyEditor as unknown as ComponentType<ClientEditorProps>,
  'feature-grid': FeatureGridEditor as unknown as ComponentType<ClientEditorProps>,
  steps: StepsEditor as unknown as ComponentType<ClientEditorProps>,
  'card-grid': CardGridEditor as unknown as ComponentType<ClientEditorProps>,
  'badge-group': BadgeGroupEditor as unknown as ComponentType<ClientEditorProps>,
  cta: CtaEditor as unknown as ComponentType<ClientEditorProps>,
};

export const clientTypeLabels: Record<string, string> = {
  'atelier-page': 'Atelier Page',
  'atelier-download': 'Atelier Download',
  'jude-hero': 'Jude Hero',
  'jude-heading': 'Jude Heading',
  paragraph: 'Paragraph',
  'jude-button': 'Jude Button',
  separator: 'Separator',
  'case-study': 'Case Study',
  'feature-grid': 'Feature Grid',
  steps: 'Steps',
  'card-grid': 'Card Grid',
  'badge-group': 'Badge Group',
  cta: 'CTA',
};
