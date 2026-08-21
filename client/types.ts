/**
 * Client-owned legacy block types for Jude's migrated site.
 */

export interface JudeHeadingBlock {
  id: string;
  type: 'jude-heading';
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  anchorId?: string;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
  dropCap?: boolean;
}

export interface JudeButtonBlock {
  id: string;
  type: 'jude-button';
  text: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export interface JudeHeroBlock {
  id: string;
  type: 'jude-hero';
  eyebrow?: string;
  headline: string;
  /** Rendered after the headline in the accent color (e.g. "by hand."). */
  headlineAccent?: string;
  subheadline?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  image?: string;
  align?: 'left' | 'center';
  /** Portrait photo shown in the right column; omitted when absent. */
  photo?: string;
  photoAlt?: string;
  photoCaption?: string;
  /** Load/location/price/reply ledger under the CTAs. Defaults to true. */
  showFacts?: boolean;
}

export interface BadgeGroupBlock {
  id: string;
  type: 'badge-group';
  badges: string[];
}

export interface CardGridCard {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export interface CardGridBlock {
  id: string;
  type: 'card-grid';
  cards: CardGridCard[];
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeatureGridBlock {
  id: string;
  type: 'feature-grid';
  eyebrow?: string;
  heading?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsBlock {
  id: string;
  type: 'steps';
  eyebrow?: string;
  heading?: string;
  steps: StepItem[];
}

export interface CaseStudyBlock {
  id: string;
  type: 'case-study';
  client: string;
  tagline: string;
  year: string;
  role: string;
  image: string;
  /** Display ordinal shown as "01 / Case study". Explicit so numbering never
   *  depends on the block id or document order. */
  index?: string;
  link?: string;
  status?: 'live' | 'archived';
  reverse?: boolean;
}

export interface CaseStudyHeaderBlock {
  id: string;
  type: 'case-study-header';
  /** Small mono kicker, e.g. "Case study / 01". */
  eyebrow?: string;
  client: string;
  tagline?: string;
  role?: string;
  year?: string;
  services?: string[];
  link?: string;
  /** Renders a back link above the title; omitted when absent. */
  backHref?: string;
  backLabel?: string;
}

export interface StatItem {
  label: string;
  value: string;
  note?: string;
}

export interface StatRowBlock {
  id: string;
  type: 'stat-row';
  eyebrow?: string;
  heading?: string;
  stats: StatItem[];
  /** Footnote for sourcing, e.g. "Measured with PageSpeed Insights". */
  note?: string;
}

export interface CtaBlock {
  id: string;
  type: 'cta';
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  tone?: 'default' | 'bold' | 'quiet';
}

export interface SeparatorBlock {
  id: string;
  type: 'separator';
}

export interface TestimonialBlock {
  id: string;
  type: 'testimonial';
  quote: string;
  name: string;
  business?: string;
  link?: string;
}

export interface PhotoBlock {
  id: string;
  type: 'photo';
  /** Renders a visible placeholder frame until an image is set. */
  image?: string;
  alt?: string;
  caption?: string;
  /** Optional copy column beside the image. When either is set the image
   *  narrows to make room, and the column sticks while a tall image scrolls. */
  title?: string;
  text?: string;
}

export interface WorkGridItem {
  name: string;
  tagline: string;
  year: string;
  image: string;
  /** Shown in the browser-frame bar; derived from link when absent. */
  domain?: string;
  link?: string;
  status?: 'live' | 'archived';
}

export interface WorkGridBlock {
  id: string;
  type: 'work-grid';
  heading?: string;
  /** Small mono counter next to the heading, e.g. "03 shipped". */
  countLabel?: string;
  anchorId?: string;
  items: WorkGridItem[];
  /** Appends a dashed "Your site here" card linking to /contact. */
  showEmptyCard?: boolean;
}

export interface ProjectListItem {
  name: string;
  /** One line. The block gives it a single column, not a card. */
  description: string;
  link?: string;
  /** Shown in place of the domain when there is no link, e.g. "in progress". */
  status?: string;
}

export interface ProjectListBlock {
  id: string;
  type: 'project-list';
  heading?: string;
  /** Small mono counter next to the heading, e.g. "02 building". */
  countLabel?: string;
  anchorId?: string;
  items: ProjectListItem[];
}

export interface PhotoStripPhoto {
  image: string;
  alt?: string;
}

export interface ContactFormFact {
  label: string;
  value: string;
}

export interface ContactFormBlock {
  id: string;
  type: 'contact-form';
  /** Hosted form-to-email endpoint, e.g. https://formsubmit.co/you@example.com */
  action: string;
  /** Optional intro column: eyebrow, page heading, short pitch, fact ledger. */
  eyebrow?: string;
  heading?: string;
  intro?: string;
  facts?: ContactFormFact[];
  subject?: string;
  placeholder?: string;
  submitLabel?: string;
  note?: string;
  /** Urgency qualifier: question label + pill options. Defaults in the block. */
  timelineLabel?: string;
  timelineOptions?: string[];
}

export interface PhotoStripBlock {
  id: string;
  type: 'photo-strip';
  title?: string;
  text?: string;
  photos: PhotoStripPhoto[];
}

export type ClientBlock =
  | JudeHeadingBlock
  | ParagraphBlock
  | JudeButtonBlock
  | JudeHeroBlock
  | BadgeGroupBlock
  | CardGridBlock
  | FeatureGridBlock
  | StepsBlock
  | CaseStudyBlock
  | CaseStudyHeaderBlock
  | StatRowBlock
  | CtaBlock
  | SeparatorBlock
  | TestimonialBlock
  | PhotoBlock
  | WorkGridBlock
  | ProjectListBlock
  | PhotoStripBlock
  | ContactFormBlock;
