import { z } from 'zod';

const safeUrl = z
  .string()
  .max(2048)
  .refine((s) => {
    if (s.startsWith('/') && !s.startsWith('//')) return true;
    if (s.startsWith('#')) return true;
    if (s.startsWith('mailto:') || s.startsWith('tel:')) return true;
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Invalid URL: must be relative, http(s), mailto:, tel:, or fragment');

const imageSrc = z
  .string()
  .max(2048)
  .refine((s) => {
    if (s.startsWith('/') && !s.startsWith('//')) return true;
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'data:';
    } catch {
      return false;
    }
  }, 'Invalid image src: must be relative or http(s)/data:');

const shortText = z.string().max(500);
const mediumText = z.string().max(2000);
const longText = z.string().max(20000);
const hexColor = z.string().regex(/^#([0-9a-fA-F]{3,8})$/, 'Must be a hex color');
const fontFamily = z.string().max(200);

const cta = z.object({
  text: shortText,
  href: safeUrl,
});

const id = z.string().min(1).max(200);

const HeadingBlockSchema = z.object({
  id, type: z.literal('heading'),
  text: shortText,
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]).optional(),
});

const ParagraphBlockSchema = z.object({
  id, type: z.literal('paragraph'),
  text: longText,
});

const ImageBlockSchema = z.object({
  id, type: z.literal('image'),
  src: imageSrc,
  alt: shortText,
});

const BadgeGroupBlockSchema = z.object({
  id, type: z.literal('badge-group'),
  badges: z.array(shortText).max(50),
});

const CardBlockSchema = z.object({
  id, type: z.literal('card'),
  title: shortText,
  description: mediumText,
  image: imageSrc.optional(),
  link: safeUrl.optional(),
});

const CardGridBlockSchema = z.object({
  id, type: z.literal('card-grid'),
  cards: z.array(z.object({
    title: shortText,
    description: mediumText,
    image: imageSrc.optional(),
    link: safeUrl.optional(),
  })).max(100),
});

const ButtonBlockSchema = z.object({
  id, type: z.literal('button'),
  text: shortText,
  href: safeUrl,
  variant: z.enum(['default', 'secondary', 'outline', 'ghost']).optional(),
});

const SeparatorBlockSchema = z.object({ id, type: z.literal('separator') });

const HeroBlockSchema = z.object({
  id, type: z.literal('hero'),
  eyebrow: shortText.optional(),
  headline: shortText,
  subheadline: mediumText.optional(),
  primaryCta: cta.optional(),
  secondaryCta: cta.optional(),
  image: imageSrc.optional(),
  align: z.enum(['left', 'center']).optional(),
});

const FeatureGridBlockSchema = z.object({
  id, type: z.literal('feature-grid'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  items: z.array(z.object({
    icon: shortText.optional(),
    title: shortText,
    description: mediumText,
  })).max(50),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});

const CtaBlockSchema = z.object({
  id, type: z.literal('cta'),
  eyebrow: shortText.optional(),
  title: shortText,
  description: mediumText.optional(),
  primaryCta: cta.optional(),
  secondaryCta: cta.optional(),
  tone: z.enum(['default', 'bold', 'quiet']).optional(),
});

const FaqBlockSchema = z.object({
  id, type: z.literal('faq'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  items: z.array(z.object({ question: shortText, answer: longText })).max(100),
});

const StatsBlockSchema = z.object({
  id, type: z.literal('stats'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  items: z.array(z.object({
    value: shortText,
    label: shortText,
    caption: shortText.optional(),
  })).max(50),
});

const PricingBlockSchema = z.object({
  id, type: z.literal('pricing'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  tiers: z.array(z.object({
    name: shortText,
    price: shortText,
    period: shortText.optional(),
    description: mediumText.optional(),
    features: z.array(shortText).max(50),
    ctaText: shortText,
    ctaHref: safeUrl,
    featured: z.boolean().optional(),
  })).max(20),
});

const StepsBlockSchema = z.object({
  id, type: z.literal('steps'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  steps: z.array(z.object({ title: shortText, description: mediumText })).max(50),
});

const TeamBlockSchema = z.object({
  id, type: z.literal('team'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  members: z.array(z.object({
    name: shortText,
    role: shortText,
    bio: mediumText.optional(),
    image: imageSrc.optional(),
    link: safeUrl.optional(),
  })).max(100),
});

const RichTextBlockSchema = z.object({
  id, type: z.literal('rich-text'),
  content: longText,
});

const VideoBlockSchema = z.object({
  id, type: z.literal('video'),
  src: imageSrc,
  title: shortText.optional(),
  provider: z.enum(['youtube', 'vimeo', 'file']).optional(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1', '21:9']).optional(),
});

const ContactFormBlockSchema = z.object({
  id, type: z.literal('contact-form'),
  eyebrow: shortText.optional(),
  heading: shortText.optional(),
  description: mediumText.optional(),
  submitLabel: shortText.optional(),
  action: safeUrl.optional(),
  fields: z.array(z.enum(['name', 'email', 'subject', 'message'])).optional(),
});

const TwoColumnBlockSchema = z.object({
  id, type: z.literal('two-column'),
  left: z.object({ heading: shortText.optional(), text: mediumText, image: imageSrc.optional() }),
  right: z.object({ heading: shortText.optional(), text: mediumText, image: imageSrc.optional() }),
  reverse: z.boolean().optional(),
});

const QuoteBlockSchema = z.object({
  id, type: z.literal('quote'),
  quote: mediumText,
  author: shortText,
  role: shortText.optional(),
  avatar: imageSrc.optional(),
});

const AnnotationSchema = z.object({
  id,
  text: shortText,
  x: z.number(),
  y: z.number(),
  variant: z.enum(['note', 'chip', 'callout', 'popover', 'tag']).optional(),
  emoji: shortText.optional(),
  rotate: z.number().optional(),
  delay: z.number().optional(),
  arrow: z.object({
    targetX: z.number(),
    targetY: z.number(),
    curvature: z.number().optional(),
  }).optional(),
});

const AnnotatedHeroBlockSchema = z.object({
  id, type: z.literal('annotated-hero'),
  eyebrow: shortText.optional(),
  headline: shortText,
  subheadline: mediumText.optional(),
  caption: mediumText.optional(),
  primaryCta: cta.optional(),
  secondaryCta: cta.optional(),
  image: imageSrc,
  imageAlt: shortText.optional(),
  imagePosition: z.enum(['left', 'right']).optional(),
  imageAspect: z.enum(['landscape', 'square', 'portrait']).optional(),
  annotations: z.array(AnnotationSchema).max(100).optional(),
  align: z.enum(['left', 'center']).optional(),
});

const LeafBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  ParagraphBlockSchema,
  ImageBlockSchema,
  BadgeGroupBlockSchema,
  CardBlockSchema,
  CardGridBlockSchema,
  ButtonBlockSchema,
  SeparatorBlockSchema,
  HeroBlockSchema,
  AnnotatedHeroBlockSchema,
  FeatureGridBlockSchema,
  CtaBlockSchema,
  FaqBlockSchema,
  StatsBlockSchema,
  PricingBlockSchema,
  StepsBlockSchema,
  TeamBlockSchema,
  RichTextBlockSchema,
  VideoBlockSchema,
  ContactFormBlockSchema,
  TwoColumnBlockSchema,
  QuoteBlockSchema,
]);

const SectionBlockSchema = z.object({
  id, type: z.literal('section'),
  background: z.enum(['default', 'muted', 'foreground', 'accent', 'card']).optional(),
  width: z.enum(['narrow', 'standard', 'wide', 'full']).optional(),
  padding: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  reveal: z.boolean().optional(),
  blocks: z.array(LeafBlockSchema).max(200),
});

export const BlockSchema = z.union([LeafBlockSchema, SectionBlockSchema]);

export const PageContentSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(100),
  blocks: z.array(BlockSchema).max(500),
});

const navLinkSchema = z.object({ label: shortText.min(1), href: safeUrl });

export const SiteConfigSchema = z.object({
  siteName: z.string().min(1).max(200),
  nav: z.array(navLinkSchema).max(50),
  fonts: z.object({
    heading: fontFamily,
    body: fontFamily,
    pair: z.enum(['editorial', 'studio', 'tech', 'warm', 'monochrome']).optional(),
  }),
  colors: z.object({
    primary: hexColor,
    secondary: hexColor,
    background: hexColor,
    text: hexColor,
  }),
  theme: z.object({
    preset: z.enum(['editorial', 'studio', 'tech', 'warm', 'monochrome']).optional(),
    appearance: z.enum(['light', 'dark', 'auto']).optional(),
    accent: hexColor.optional(),
  }).optional(),
  motion: z.object({
    intensity: z.enum(['none', 'subtle', 'rich']).optional(),
  }).optional(),
});
