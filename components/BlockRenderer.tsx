import type { ComponentType } from 'react';
import type { BaseBlock } from '../lib/types';
import type { ThemeStructure } from '../lib/themes';
import type { RevealSettings } from '../lib/motion-engine';
import { Reveal } from '../lib/motion';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { SectionBlock } from './blocks/SectionBlock';
import { GridBlock } from './blocks/GridBlock';
import { TwoColumnBlock } from './blocks/TwoColumnBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { FormBlock } from './blocks/FormBlock';

/* The `block: never` typing is intentional. It lets framework, client, and merged
   registries share one Record type — each block component is invariant in its
   own narrow type, and BlockRenderer narrows at runtime via `block.type`.
   `dna` carries the active expressive theme's layout DNA so blocks can pick a
   default variant; it is undefined for classic themes (no behavior change). */
export type BlockComponent = ComponentType<{ block: never; dna?: ThemeStructure }>;
export type BlockRegistry = Record<string, BlockComponent>;

/** Framework-provided block render components. Consumers merge with their own
   custom blocks before passing to BlockRenderer. */
export const frameworkBlocks: BlockRegistry = {
  heading: HeadingBlock as BlockComponent,
  text: TextBlock as BlockComponent,
  image: ImageBlock as BlockComponent,
  button: ButtonBlock as BlockComponent,
  hero: HeroBlock as BlockComponent,
  section: SectionBlock as BlockComponent,
  grid: GridBlock as BlockComponent,
  'two-column': TwoColumnBlock as BlockComponent,
  quote: QuoteBlock as BlockComponent,
  form: FormBlock as BlockComponent,
};

export interface BlockRendererProps {
  blocks: BaseBlock[];
  /** Optional registry. Defaults to `frameworkBlocks`.
     Consumers with custom blocks pass `{ ...frameworkBlocks, ...clientBlocks }`. */
  registry?: BlockRegistry;
  /** When enabled, each block reveals on scroll (expressive themes / rich intensity). */
  reveal?: RevealSettings;
  /** Active expressive theme's layout DNA, forwarded to each block. */
  dna?: ThemeStructure;
}

export function BlockRenderer({ blocks, registry = frameworkBlocks, reveal, dna }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const Component = registry[block.type];
        if (!Component) return null;
        // Classic path renders the bare component (unchanged DOM). `dna` is
        // undefined for classic themes, so passing it is a no-op there.
        if (reveal?.enabled) {
          return (
            <Reveal key={block.id} duration={reveal.duration} distance={reveal.distance} direction="up">
              <Component block={block as never} dna={dna} />
            </Reveal>
          );
        }
        return <Component key={block.id} block={block as never} dna={dna} />;
      })}
    </>
  );
}
