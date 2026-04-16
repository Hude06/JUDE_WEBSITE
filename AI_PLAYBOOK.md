# AI Playbook

Written for AI agents scaffolding or editing sites built on this framework. Read this before writing any JSX or JSON.

**What this framework is.** A content-as-JSON website framework on Next.js 16 + Tailwind v4 + shadcn/ui. Pages are JSON files (`content/pages/*.json`) composed of typed blocks. A `BlockRenderer` maps `block.type` to a React component. You never hand-roll JSX in `app/(site)/` pages — you add blocks, compose sections, and pick a theme.

## Your menu

1. **21 block types** — primitives + rich sections, all in one catalogue
2. **5 theme presets** — each with its own aesthetic POV, font pair, and motion character
3. **Motion primitives** — `<Reveal>`, `<Stagger>`, `<Parallax>`, all reduced-motion aware
4. **Section composition** — wrap blocks with background / width / padding
5. **5 font pairs** — preloaded, picked by name in site.json
6. **Placeholder image library** — curated Unsplash URLs by category
7. **Public gallery** — `/gallery` renders every block with sample data

---

## 1. Block catalogue

Every block lives in `components/blocks/` and has a typed interface in `lib/types.ts`. To add a block to a page, append it to the `blocks` array in a `content/pages/*.json` file.

| Type | Purpose | Use when |
|---|---|---|
| `hero` | Big headline section with CTAs and optional image | Top of a landing page |
| `annotated-hero` | Product image + floating callout chips (notes, popovers, callouts, tags) | Premium app landings, Keeby-style launches |
| `feature-grid` | Icon + title + description grid (2/3/4 cols) | Selling features or capabilities |
| `stats` | Metric grid with oversized numerals | Credibility, social proof |
| `steps` | Numbered process with oversized serif numerals | How-it-works, onboarding |
| `faq` | Expandable question list with sticky heading | Objection handling |
| `pricing` | Up to 3 tiers with featured highlight | SaaS landing pages |
| `team` | Member grid with photo, role, optional link | About pages, agency sites |
| `cta` | Banner with default/bold/quiet tones | Conversion section |
| `quote` | Large centered pullquote with author | Testimonials, epigraphs |
| `video` | YouTube/Vimeo/file embed with aspect ratio | Demos, backgrounds |
| `contact-form` | Name/email/subject/message native form | Contact pages |
| `two-column` | Generic split — text + text or text + image | Narrative composition |
| `rich-text` | Markdown-ish long-form body | Blog posts, essays |
| `card-grid` | Grid of cards with titles and descriptions | Project grids |
| `image` | Single image with alt | Standalone imagery |
| `heading` | H1-H6 text | Section titles outside sections |
| `paragraph` | Single paragraph | Short text blocks |
| `badge-group` | Horizontal tag list | Skills, tech stack |
| `button` | CTA link with 4 variants | Standalone calls to action |
| `separator` | Horizontal divider | Between sections |
| `section` | **Wrapper** — bg + width + padding + child blocks | Compose pages cleanly (see §4) |

Every block requires an `id` and `type`. All other fields are documented in `lib/types.ts`. See `lib/block-samples.ts` for a complete reference example per type.

Example — adding a hero to a page:
```json
{
  "id": "home-hero",
  "type": "hero",
  "eyebrow": "Issue No. 01",
  "headline": "A headline that wants to be read.",
  "subheadline": "Supporting copy.",
  "primaryCta": { "text": "Start reading", "href": "/blog" },
  "align": "left"
}
```

---

## 2. Theme presets

5 presets ship in `content/themes/`. Each commits to a distinct aesthetic POV. Activate by setting `theme.preset` in `content/site.json`.

| Preset | Aesthetic | Fonts | Motion | Best for |
|---|---|---|---|---|
| `editorial` | NYT Magazine meets Linear. Warm paper, terracotta accent, hairline rules. | Instrument Serif + Inter | Smooth (0.8s) | Blogs, magazines, personal sites |
| `studio` | Swiss brutalism. Pure black/white, lime accent, zero radius, hard offset shadows. | Bricolage Grotesque + JetBrains Mono | Elastic (0.25s) | Agencies, portfolios, design studios |
| `tech` | Terminal precision. Deep slate, cyan accent, dot-grid, scanlines. | Geist Mono + Geist | Snappy (0.15s) | Developer tools, technical products |
| `warm` | Organic apothecary. Cream bg, burnt umber, clay accent, generous radii. | Fraunces + Lora | Spring (0.7s) | Wellness, restaurants, lifestyle |
| `monochrome` | Razor restraint, Braun-adjacent. No color — hierarchy via weight alone. | Geist only | Linear (0.4s) | Minimalist portfolios, concept sites |

Activate in `content/site.json`:
```json
{
  "theme": {
    "preset": "editorial",
    "appearance": "auto"
  },
  "fonts": {
    "heading": "",
    "body": "",
    "pair": "editorial"
  }
}
```

`appearance` accepts `light`, `dark`, or `auto`. Each preset ships with a matching dark palette.

---

## 3. Motion primitives

Three reusable client components in `lib/motion.tsx`. All respect `prefers-reduced-motion` automatically.

**`<Reveal>`** — scroll-triggered fade + slide for any child.
```tsx
import { Reveal } from '@/lib/motion';

<Reveal direction="up" delay={0.1}>
  <h2>Appears on scroll</h2>
</Reveal>
```
Props: `direction` (`up`/`down`/`left`/`right`/`none`, default `up`), `delay` (seconds), `duration` (seconds), `distance` (px), `once` (bool), `className`.

**`<Stagger>` + `<StaggerItem>`** — orchestrated children reveal.
```tsx
import { Stagger, StaggerItem } from '@/lib/motion';

<Stagger stagger={0.08}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</Stagger>
```
Use for grids where each cell should enter in sequence.

**`<Parallax>`** — smooth scroll-based vertical offset.
```tsx
import { Parallax } from '@/lib/motion';

<Parallax offset={80}>
  <img src="/hero.jpg" alt="" />
</Parallax>
```

**Wrap the app in `MotionProvider`** once (at `app/(site)/layout.tsx` or a parent client boundary) to enable LazyMotion bundle savings:
```tsx
import { MotionProvider } from '@/components/motion/MotionProvider';

<MotionProvider>{children}</MotionProvider>
```

**Do not motion-wrap every block.** Reach for motion at hero, feature reveal, stat counters, and scroll-driven image backgrounds. Everything else should be CSS transitions only.

---

## 4. Section composition

A `section` block wraps other blocks with background color, max-width, and padding. This is how you structure a page with alternating band backgrounds without touching CSS.

```json
{
  "blocks": [
    {
      "id": "sec-hero",
      "type": "section",
      "background": "default",
      "width": "wide",
      "padding": "xl",
      "blocks": [{ "id": "h", "type": "hero", "headline": "..." }]
    },
    {
      "id": "sec-features",
      "type": "section",
      "background": "muted",
      "width": "standard",
      "padding": "lg",
      "blocks": [{ "id": "fg", "type": "feature-grid", "items": [] }]
    },
    {
      "id": "sec-cta",
      "type": "section",
      "background": "foreground",
      "width": "wide",
      "padding": "lg",
      "blocks": [{ "id": "cta", "type": "cta", "title": "Ready?" }]
    }
  ]
}
```

**`background`:** `default` | `muted` | `foreground` (inverted) | `accent` | `card`
**`width`:** `narrow` (max-w-2xl) | `standard` (max-w-5xl) | `wide` (max-w-7xl) | `full` (full bleed)
**`padding`:** `none` | `sm` | `md` | `lg` | `xl`

Sections cannot be nested inside sections. Flat-block pages (no sections) still work — backwards compatible.

---

## 5. Font pairs

5 pairs preloaded in `app/layout.tsx`. Pick by name via `fonts.pair` in site.json. Each pair matches a theme preset by default.

- `editorial` → Instrument Serif + Inter
- `studio` → Bricolage Grotesque + JetBrains Mono
- `tech` → Geist Mono + Geist
- `warm` → Fraunces + Lora
- `monochrome` → Geist only

To use a custom font pair, leave `fonts.pair` unset and provide raw `fonts.heading` / `fonts.body` strings instead (legacy path). Mixing a theme preset with a different font pair is allowed: set `theme.preset: "studio"` and `fonts.pair: "warm"` to combine Studio colors with Warm typography.

---

## 6. Placeholder images

`content/placeholders.json` lists curated Unsplash URLs by category (`hero`, `portrait`, `team`, `product`, `texture`). Reference them in block JSON during drafting, then swap for real assets before launch.

```json
{
  "type": "image",
  "id": "hero-img",
  "src": "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1600&q=80",
  "alt": "Replace me"
}
```

---

## 7. Gallery route

Visit `/gallery` in dev to see every block AND every UI primitive rendered with sample data under the active theme. Change `theme.preset` in site.json and refresh to compare visuals. No admin auth required.

```bash
npm run dev
# open http://localhost:3000/gallery
```

---

## 8. UI primitives

Thin, token-driven presentational components in `components/ui/`. Every primitive reads theme CSS variables — no hardcoded colors, radii, or shadows. Switch `theme.preset` in site.json and every primitive reshapes in character.

**When to use:** inside blocks, inside admin editors, inside custom pages. Import from `@/components/ui/<name>`.

**When NOT to use:** in flat-block content JSON. Blocks are the authoring surface; primitives are the implementation layer blocks compose with.

| Primitive | Purpose | Variants |
|---|---|---|
| `Button` | Clickable interaction | `default` / `outline` / `ghost` / `secondary` / `destructive` / `link` × `sm` / `default` / `lg` / `icon-xs` / `icon-sm` / `icon` / `icon-lg` |
| `Card` | Surface container | `default` / `sm` + slot subcomponents (Header/Title/Description/Content/Footer/Action) |
| `Badge` | Label, tag, status | `default` / `secondary` / `outline` / `destructive` / `ghost` / `link` |
| `Input` | Single-line text field | native `type` prop |
| `Textarea` | Multi-line text field | native `rows` |
| `Label` | Form field label | — |
| `Separator` | Horizontal/vertical rule | `horizontal` / `vertical` |
| `Checkbox` | Boolean input | — |
| `Radio` | One-of-many input | — |
| `Switch` | On/off toggle | — |
| `Kbd` | Keyboard shortcut glyph | — |

Every primitive is ≤80 lines, forwards refs, and uses plain React — no runtime dependencies beyond Tailwind and `cn()`. Accessibility-heavy components (Dialog, Select, NavigationMenu) still come from Base UI.

**`buttonVariants({ variant, size, className })`** — exported helper for applying button classes to a non-button element like `<a>`:
```tsx
import { buttonVariants } from '@/components/ui/button';
<a href="/foo" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
  Link that looks like a button
</a>
```

Same pattern available for `badgeVariants()`.

---

## Recipe: Dark editorial landing page

```json
{
  "title": "Dark Editorial Landing",
  "slug": "home",
  "blocks": [
    {
      "id": "s1",
      "type": "section",
      "background": "default",
      "width": "wide",
      "padding": "xl",
      "blocks": [
        {
          "id": "hero",
          "type": "hero",
          "eyebrow": "Issue No. 01",
          "headline": "A headline built for quiet afternoons.",
          "subheadline": "A magazine for people who still read carefully.",
          "primaryCta": { "text": "Begin reading", "href": "/issue-01" },
          "align": "left"
        }
      ]
    },
    {
      "id": "s2",
      "type": "section",
      "background": "muted",
      "width": "standard",
      "padding": "lg",
      "blocks": [
        {
          "id": "feat",
          "type": "feature-grid",
          "eyebrow": "What\u2019s inside",
          "heading": "This month",
          "columns": 3,
          "items": [
            { "icon": "sparkles", "title": "Long-form essays", "description": "Three pieces at 3000+ words each." },
            { "icon": "compass", "title": "Field notes", "description": "Dispatches from correspondents." },
            { "icon": "star", "title": "Interviews", "description": "Quiet conversations with makers." }
          ]
        }
      ]
    }
  ]
}
```

Paired with `site.json`:
```json
{ "theme": { "preset": "editorial", "appearance": "dark" }, "fonts": { "pair": "editorial" } }
```

## Recipe: Premium app landing (Keeby-style)

Use `annotated-hero` to pin sticky-note style callouts over a product image, then follow with a wide `feature-grid` and a simple `cta`.

```json
{
  "title": "Premium App",
  "slug": "home",
  "blocks": [
    {
      "id": "s1",
      "type": "section",
      "background": "default",
      "width": "wide",
      "padding": "xl",
      "blocks": [
        {
          "id": "ah",
          "type": "annotated-hero",
          "eyebrow": "0 thocks and counting",
          "headline": "Your keyboard,\nbut better.",
          "subheadline": "Mechanical keyboard sounds for Mac.",
          "caption": "$4.99 · One-time purchase",
          "primaryCta": { "text": "Download for Mac", "href": "#" },
          "image": "/images/laptop.jpg",
          "imageAlt": "Mac showing the app",
          "imagePosition": "left",
          "imageAspect": "landscape",
          "annotations": [
            { "id": "n1", "text": "try typing here to hear it yourself!", "x": 18, "y": 72, "variant": "note", "rotate": -3, "delay": 0.2 },
            { "id": "n2", "text": "select switches", "x": 56, "y": 34, "variant": "popover", "delay": 0.35 },
            { "id": "n3", "text": "click me!", "x": 40, "y": 12, "variant": "callout", "emoji": "👆", "rotate": 2, "delay": 0.5 }
          ]
        }
      ]
    },
    {
      "id": "s2",
      "type": "section",
      "background": "default",
      "width": "wide",
      "padding": "lg",
      "blocks": [
        {
          "id": "feat",
          "type": "feature-grid",
          "columns": 3,
          "items": [
            { "icon": "zap", "title": "Low latency", "description": "Lock-free audio engine." },
            { "icon": "radio", "title": "Real recordings", "description": "Captured from actual switches." },
            { "icon": "shield", "title": "Completely private", "description": "No data collected, fully offline." }
          ]
        }
      ]
    }
  ]
}
```

Chip variants available in `annotated-hero` annotations:
- `note` — warm sticky-note with italic body text
- `chip` — pill tag with optional emoji
- `callout` — dark speech bubble with tail
- `popover` — mac-style dropdown with accent dot
- `tag` — minimal label with leading dot

Annotations take `x`/`y` as 0-100 percent over the image container. On mobile (<md), they collapse automatically into a 2-col grid below the image.

---

## Recipe: Neo-brutalist agency portfolio

```json
{
  "title": "Studio",
  "slug": "home",
  "blocks": [
    {
      "id": "s1",
      "type": "section",
      "background": "default",
      "width": "full",
      "padding": "xl",
      "blocks": [
        { "id": "h", "type": "hero", "eyebrow": "STUDIO / 2026", "headline": "WE MAKE LOUD WORK FOR QUIET CLIENTS.", "primaryCta": { "text": "SEE THE WORK", "href": "/work" } }
      ]
    },
    {
      "id": "s2",
      "type": "section",
      "background": "foreground",
      "width": "standard",
      "padding": "lg",
      "blocks": [
        { "id": "stats", "type": "stats", "items": [{"value": "12", "label": "Clients"}, {"value": "48", "label": "Projects"}, {"value": "0", "label": "Compromises"}] }
      ]
    },
    {
      "id": "s3",
      "type": "section",
      "background": "accent",
      "width": "wide",
      "padding": "lg",
      "blocks": [
        { "id": "cta", "type": "cta", "title": "Start a project.", "primaryCta": { "text": "hello@studio.com", "href": "mailto:hello@studio.com" }, "tone": "bold" }
      ]
    }
  ]
}
```

Paired with `site.json`:
```json
{ "theme": { "preset": "studio" }, "fonts": { "pair": "studio" } }
```

---

## Do / Don't

**DO:**
- Use theme presets as your starting point — pick one and commit.
- Wrap pages in section blocks for alternating backgrounds.
- Use motion primitives on hero + first feature grid + cta. Leave everything else still.
- Read `lib/block-samples.ts` before inventing block JSON — the shapes are there.
- Visit `/gallery` during development to see every block under the active theme.
- Respect the Section backwards-compat guarantee: legacy flat-block pages still render.

**DON'T:**
- Hand-roll JSX inside `app/(site)/` pages. If the blocks don't cover it, add a new block type via the 6-file checklist in `CLAUDE.md`.
- Nest sections inside sections — it's blocked at the type level.
- Mix theme presets mid-page. Pick one for the site.
- Motion-wrap every block — reduced motion should still feel deliberate.
- Load your own fonts outside the preset system unless you're intentionally overriding `fonts.pair` with raw `fonts.heading`/`fonts.body`.

---

## Verification

Before considering a scaffolded site "done":

```bash
npm test              # all block and theme tests green
npx tsc --noEmit      # type check clean
npm run lint          # lint clean
npm run build         # prod build green
npm run dev           # eyeball /gallery and a real page under the chosen theme
```

Every block type has a sample at `/gallery` and a test in `__tests__/`. If you add a new block type, follow the 6-file checklist in `CLAUDE.md` and add a sample + test to match.

---

**Keep this file in sync with the code.** If you add a block type, a theme preset, a motion primitive, or a font pair, update the relevant section above.
