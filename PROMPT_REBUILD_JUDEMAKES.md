# Prompt — Rebuild judemakes.com from scratch

**Use this prompt by copy-pasting it into a fresh Claude Code session inside the directory where the website framework has already been cloned + installed + hooked to the production server.**

The agent running this prompt has no memory of any previous conversation. Everything below must be self-contained.

---

## Context — who you are, who the client is

You are a web developer rebuilding **judemakes.com** from scratch. The client is **Jude Hill**, a high school student in Eugene, OR who designs and builds websites. The current version of judemakes.com has real quality issues (detailed below) and we are replacing it cleanly.

## Your environment

You are inside a directory that contains the **website-framework** — a reusable Next.js + TypeScript + Tailwind v4 + shadcn/ui framework with a JSON-driven block system and admin panel. Assume:

- The framework is cloned locally (you're sitting inside the repo)
- `npm install` has already been run
- There is a git remote configured
- The site is already deployed to a production server (`/deploy-init` has been run in a previous session; deploy config exists at `deploy.json`)
- You do **not** need to run `/website-init`, `/deploy-init`, create a GitHub repo, set up Docker, or do any deployment plumbing

All infrastructure is done. Your job is exclusively content + blocks + maybe one new block type.

## Critical constraint — scrap the scaffolded starter content

The framework ships with placeholder demo content: `content/pages/home.json` with "Welcome to My Portfolio", an about page, a contact page, a card grid of fake projects ("Brand Redesign", "SaaS Dashboard", "Mobile App"), and a badge group listing generic tech ("React, Next.js, TypeScript, Tailwind CSS..."). **Delete all of it.** This site is Jude's real portfolio, not the framework's demo.

**Keep** (framework machinery — don't touch):
- The block system: `lib/types.ts`, `lib/content.ts`, `components/BlockRenderer.tsx`, all files under `components/blocks/`
- The admin panel: everything under `app/admin/` and `components/admin/` and `app/api/admin/`
- Site layout: `app/(site)/layout.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `app/layout.tsx`
- All shadcn primitives in `components/ui/`
- Infrastructure: `Dockerfile`, `next.config.ts`, `deploy.json`, `package.json`, tests, tsconfig, tailwind config
- The `.claude/skills/` directory

**Delete or replace**:
- `content/pages/home.json` — replace with real Jude content
- `content/pages/about.json` — replace with real Jude content
- `content/pages/contact.json` — replace with real Jude content
- `content/pages/test.json` — delete if it exists (leftover from development)
- `content/site.json` — replace with real Jude branding
- `public/images/hero.svg` and any other scaffolded demo imagery — replace or remove

## Required reading — do this in order before editing anything

1. **`CLAUDE.md`** — framework conventions, especially the "Breaks Admin Panel" section and "Adding a Block Type" checklist
2. **`AGENTS.md`** — this framework uses a Next.js version where APIs may differ from your training data. Read the note at the top.
3. **`DESIGN_TOOLKITS.md`** — the opinionated stack reference. Read in full. Pay special attention to:
   - Section 1: Quick chooser by website type. Find the row for "Personal portfolio".
   - Section 6: Fonts. Find the "Pairings that work" table.
   - Section 10: How Claude should use this file.
4. **`ARCHITECTURE.md`** — read the content flow section (how a JSON file becomes a rendered page)
5. **`lib/types.ts`** — the actual block type definitions currently available
6. **`components/BlockRenderer.tsx`** — the registry mapping block types to components
7. **`components/ui/button.tsx`** — check whether this shadcn build uses the `render` prop or the `asChild` prop. This framework uses Base UI (not classic Radix) and the API is `render`, not `asChild`. Verify before writing any Button code.
8. **`package.json`** — note whether `motion` and `@next/font` / `next/font` are installed. If Motion is not installed and you need animation, `npm install motion` (not `framer-motion` — it was renamed).
9. **The live source of the current judemakes.com** — run `curl -s https://judemakes.com > /tmp/old-site.html` so you can extract the existing **text content** (NOT the broken markup). You want the words, not the HTML patterns.

## The bugs on the current judemakes.com your rebuild must not repeat

The current site has these concrete failures. Your rebuild must fix all of them:

1. **Tripled hero heading.** The current DOM literally contains:
   ```
   <h1>Websites, made simple.</h1>
   <h2>Websites, made simple.</h2>
   <h1>Websites, made simple.</h1>
   ```
   Three copies of the same text, two of them as `<h1>`. This was a failed typography-layering trick (stacked copies for depth/shadow effects rendered as real DOM). Your rebuild has exactly **one** `<h1>` per page.

2. **Per-word `<span>` wrappers.** Current hero markup is `<h1><span>Websites,</span><span>made</span><span>simple.</span></h1>` — each word individually wrapped in a span. This is residue from a framer-motion tutorial pattern that splits text for staggered animation, except there is no animation, so it's just dead wrappers. Your rebuild: heading text is plain text inside the heading element, no decorative spans.

3. **Empty "Portfolio work" section.** Current site has a section heading "Portfolio work", a paragraph, and a "Send me an email" button — and **zero actual portfolio items**. A portfolio section with no items is worse than no section. In your rebuild, EITHER:
   - Include a portfolio section with at least 3 real project items (image, title, description, link) — only if Jude actually has real work, OR
   - Remove the portfolio section entirely and replace with something concrete (e.g. "What I'm working on now" with real current projects, or just skip it)

   **Do not ship an empty section.** If Jude has no real projects to show yet, ask him — don't assume.

4. **Zero images on the entire home page.** For a website *designer's* portfolio, no imagery at all is a credibility problem. Your rebuild must have at least one image somewhere on the home page: a hero illustration, a photo of Jude, a screenshot of real work, or a purposeful typographic treatment as the "visual" (not a decorative empty block).

5. **Abstract marketing-speak cards.** Current "How I work" section has three cards: "Clean and simple", "Continuous support", "Quick and fast." This is generic SaaS freelancer copy that could apply to anyone. In your rebuild, EITHER replace with concrete content (real client names, real screenshots, real testimonials) or replace with a single honest statement. Do not ship three abstract value cards.

6. **Decorative ornaments without meaning.** Current site has:
   - "01 — Index" label in the hero corner (index of what? there's one page visible)
   - Section dividers literally labeled "Section" (looks like TODO placeholder text left in)
   - "01 / Capability", "02 / Capability", "03 / Capability" numerals on the cards
   These are editorial-magazine ornaments used as decoration without the content that justifies them. Your rebuild uses none of them. Section headings are real text describing the section, not decorative numerals.

7. **Navigation rendered three times.** Current site has nav in the header, another nav block immediately below the header, and a third in the footer. Your rebuild has exactly one header nav and one footer nav. No middle-of-page nav.

8. **Hero section is nested 4+ divs deep before any content.** Current DOM is `<main><div><section><div><div><div><div><p>...`. Your hero should be at most 2 wrapping elements: `<section><div class="container">...</div></section>`.

## Design direction (from DESIGN_TOOLKITS.md and the client)

### Stack
The `DESIGN_TOOLKITS.md` chooser row for "Personal portfolio" is: **shadcn + Tailwind + Lucide + Motion + Instrument Serif**. The framework already has shadcn, Tailwind v4, and Lucide. Verify Motion (`motion` package) is installed — if not, `npm install motion`. Verify Instrument Serif is loaded via `next/font/google` — if not, add it.

### Fonts
- **Heading:** Instrument Serif (from Google Fonts)
- **Body:** Inter (from Google Fonts)
- Pair referenced in `DESIGN_TOOLKITS.md` Section 6, "Editorial-modern, like Stripe docs"
- Load via `next/font/google` in `app/layout.tsx` — **never more than 2 font families, never more than 4 weights total**
- Set CSS variables so Tailwind's `font-serif` and `font-sans` utilities resolve correctly

### Color palette — dark theme
Pick ONE of these two palettes (ask the user which they prefer):

**Editorial dark:**
- Background: `#0A0A0A` (near-black)
- Foreground text: `#F5F5F5` (off-white)
- Muted: `#A1A1AA` (zinc-400)
- Accent (links, CTAs): `#F59E0B` (amber-500) or `#FB923C` (orange-400)

**Muted dark:**
- Background: `#0F172A` (slate-900)
- Foreground text: `#E2E8F0` (slate-200)
- Muted: `#94A3B8` (slate-400)
- Accent (links, CTAs): `#38BDF8` (sky-400) or `#818CF8` (indigo-400)

Set the chosen palette in `content/site.json` via the existing `colors` object (whatever shape `SiteConfig` expects — check `lib/types.ts`).

### Tone of voice
Personal, specific, honest. Jude is a high school student — **do not write like a corporate agency**. Don't use phrases like "committed to creating fast, beautiful, and high-performing websites for everyone" or "dedicated to excellence." Write like a talented kid who's excited about what he builds. Read the live site for the original voice, then rewrite to be **more direct and less generic**.

Rule of thumb: if a sentence could appear on any freelancer's landing page, rewrite it until only Jude could have written it.

### Visual references (absorb, do not copy)
- **Stripe docs** (stripe.com/docs) — editorial typography, calm dark background
- **Vercel** (vercel.com) — restrained, one strong hero, no clutter
- **Paco Coursey** (paco.me) — personal developer portfolio with real voice
- **Rauno Freiberg** (rauno.me) — clean portfolio, real work up front

## Content to build

Three pages: `home`, `about`, `contact`. Optionally a `work` or `projects` page **only if** Jude has real work to show (ask first).

### Home page — `content/pages/home.json`

Required sections, in order. How many "blocks" each becomes depends on whether you add a hero block type (see "Allowed approaches" below).

1. **Hero**
   - Eyebrow text: short role/location, e.g. "Jude Hill · Website Designer · Eugene, OR"
   - ONE `<h1>` headline: short (3–6 words), not "Websites, made simple" again — give it a fresh line. Ask Jude for a new one, or suggest options like "I build websites that work." / "Fast websites, made by hand." / "Small sites. Real craft."
   - Subtitle: one sentence, max 20 words, specific
   - Two CTA buttons: primary "Get in touch" → `/contact`, secondary "About me" → `/about`. Do **not** include "See selected work" unless there is a work page.

2. **Intro / about teaser**
   - Heading (real text, not a numeral)
   - 1–2 paragraphs introducing Jude. Pull loose inspiration from the original: "I'm Jude Hill — a high school student who loves to build things. I build stunning websites that are fast and simple." but rewrite to be more specific and less filler-y.

3. **How it works OR equivalent** — CONCRETE content
   - If Jude has real clients/screenshots/testimonials → use card-grid with real images and descriptions
   - If he has no real proof yet → replace this section with a single honest paragraph, e.g. "I'm currently taking on my first three client projects. If you want one of them to be yours, email me." Do not ship three abstract value cards.

4. **(Optional) Current projects / work-in-progress**
   - Only if Jude has real projects. Card-grid block with real titles, real descriptions, real links. Otherwise skip this section entirely.

5. **Footer CTA**
   - "Let's make something" heading + email link button. Keep this from the original — it works.

**Do NOT include in the rebuild:**
- "01 — Index", "Scroll ↓", or any numbered ornaments
- Dividers with the literal label "Section"
- A Portfolio section with zero portfolio items
- Any nav that isn't in Header or Footer
- Stacked/layered heading copies
- Per-word span splitting in headings

### About page — `content/pages/about.json`

- One `<h1>` — specific, not "About me". E.g. "High school. Eugene. Websites."
- 2–4 paragraphs about Jude's background: what got him into web design, current skill set, what he's learning, what he wants to build
- Optional photo block (ask Jude)
- Optional badge-group listing real tech he uses — only include items he actually uses regularly
- A CTA at the bottom linking to `/contact`

### Contact page — `content/pages/contact.json`

- One `<h1>`
- One paragraph about how to get in touch
- A button block with `href="mailto:<jude's email>"` — verify the email with the user before coding it in
- **Do not** build a contact form unless the framework has form submission wired up (check `app/api/admin/` first — if there's no contact endpoint, stick with mailto)

### Site config — `content/site.json`

Fields to set (verify exact shape against `lib/types.ts` `SiteConfig` interface):

- `siteName`: "Jude Makes Things" OR "Jude Hill" — ask the user which one
- `nav`: exactly three items — `[{label: "Home", href: "/"}, {label: "About", href: "/about"}, {label: "Contact", href: "/contact"}]`. Add `{label: "Work", href: "/work"}` **only if** a work page exists.
- `fonts.heading`: `"Instrument Serif, serif"`
- `fonts.body`: `"Inter, system-ui, sans-serif"`
- `colors`: the chosen dark palette (editorial or muted), matching the exact shape of `SiteConfig['colors']`
- Any other fields the type requires

## Allowed approaches — pick one

### Option A — Use existing primitives only
Use only the blocks that currently exist: `heading`, `paragraph`, `image`, `badge-group`, `card-grid`, `button`, `separator`.

- **Pros:** zero new code, guaranteed admin-panel-compatible, fastest to ship
- **Cons:** can't express "hero with eyebrow + headline + subtitle + 2 CTAs" as one semantic unit — you'll have 4+ separate blocks stacked in a list
- **Accept this trade-off if:** shipping fast is more important than polish on the home page

### Option B (recommended) — Add ONE new block type: `hero`
Add a single new block called `hero` that encapsulates the entire top-of-page unit. Nothing else gets a new block type on this pass.

- **Pros:** clean semantics, one block = one section, fewer DOM wrappers, prevents the per-word-span problem from recurring
- **Cons:** 6-file update (per the CLAUDE.md checklist) — but only once
- **Required if:** you care that the home page feels designed, not listed

**If you pick Option B, follow the CLAUDE.md "Adding a Block Type" checklist EXACTLY:**

1. Add `HeroBlock` interface to `lib/types.ts` and add it to the `Block` union. Fields:
   ```ts
   interface HeroBlock {
     id: string;
     type: 'hero';
     eyebrow?: string;
     headline: string;
     subtitle?: string;
     primaryCta?: { label: string; href: string };
     secondaryCta?: { label: string; href: string };
   }
   ```

2. Create `components/blocks/HeroBlock.tsx`:
   ```tsx
   import type { HeroBlock as HeroBlockType } from '@/lib/types';
   import { Button } from '@/components/ui/button';

   export function HeroBlock({ block }: { block: HeroBlockType }) {
     return (
       <section className="py-24 md:py-32">
         <div className="container max-w-4xl mx-auto px-6">
           {block.eyebrow && (
             <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
               {block.eyebrow}
             </p>
           )}
           <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
             {block.headline}
           </h1>
           {block.subtitle && (
             <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
               {block.subtitle}
             </p>
           )}
           {(block.primaryCta || block.secondaryCta) && (
             <div className="flex flex-wrap gap-3">
               {block.primaryCta && (
                 <Button render={<a href={block.primaryCta.href} />}>
                   {block.primaryCta.label}
                 </Button>
               )}
               {block.secondaryCta && (
                 <Button variant="outline" render={<a href={block.secondaryCta.href} />}>
                   {block.secondaryCta.label}
                 </Button>
               )}
             </div>
           )}
         </div>
       </section>
     );
   }
   ```
   **Verify Button's API** before copy-pasting this. This framework uses Base UI which uses `render`, not `asChild`. If you see `asChild` in `components/ui/button.tsx`, swap it. If you see `render`, this code is correct.

   **Count the wrappers:** one `<section>`, one container `<div>`, then content. That's it. No nested 4-deep divs. No per-word spans. One `<h1>`.

3. Register in `components/BlockRenderer.tsx`:
   ```tsx
   import { HeroBlock } from './blocks/HeroBlock';
   // inside blockRegistry:
   hero: HeroBlock as ComponentType<{ block: never }>,
   ```

4. Create `components/admin/editors/HeroEditor.tsx` — simple form with inputs for eyebrow, headline, subtitle, and two CTA groups (label + href each). Follow the pattern of existing editors in `components/admin/editors/`.

5. Register the editor in `components/admin/BlockEditor.tsx` — add a case to the type switch and a label to `typeLabels`.

6. Add to `components/admin/BlockGallery.tsx` — add a template with sane defaults:
   ```tsx
   {
     type: 'hero',
     label: 'Hero',
     create: (id: string): HeroBlock => ({
       id,
       type: 'hero',
       eyebrow: 'Your role · Your location',
       headline: 'Your big headline',
       subtitle: 'A single sentence describing what you do.',
       primaryCta: { label: 'Get in touch', href: '/contact' },
     }),
   },
   ```

7. Write a test for `HeroBlock` in `__tests__/components/blocks/HeroBlock.test.tsx` matching the pattern of existing block tests. Verify it renders exactly one `<h1>`.

## Workflow (do in this order)

1. Read all required files listed in "Required reading" above
2. Check `components/ui/button.tsx` — confirm `render` vs `asChild`
3. Check `package.json` — confirm `motion` is installed, install if not
4. Fetch `curl -s https://judemakes.com > /tmp/old-site.html` and grep out the visible text
5. **Ask the user the clarifying questions below** — wait for answers before making changes
6. Delete `content/pages/home.json`, `about.json`, `contact.json`, and `test.json` (if present)
7. Delete `public/images/hero.svg` and any other demo imagery under `public/images/`
8. Decide Option A or Option B (recommended B — hero block only)
9. If Option B: add the `hero` block type following the 6-file checklist above, including a test
10. Update `app/layout.tsx` (or the appropriate font-loading file) to use `next/font/google` for Instrument Serif + Inter, with at most 4 total weights
11. Update `tailwind.config.ts` (or the Tailwind v4 equivalent `@theme` block in CSS) to point `font-serif` at the Instrument Serif CSS variable and `font-sans` at Inter
12. Write new `content/pages/home.json` using hero block + primitives for the rest
13. Write new `content/pages/about.json`
14. Write new `content/pages/contact.json`
15. Update `content/site.json` with new branding (siteName, nav, fonts, colors)
16. Run `npm run build` locally — must pass cleanly
17. Run `npm run test` — all existing tests plus your new HeroBlock test must pass
18. Run `npm run dev` and verify in a browser:
    - Exactly one `<h1>` in view-source of `/`
    - No `<span>` wrappers inside headings
    - No empty sections with headings but no real content
    - At least one image rendered on home
    - Nav only in header + footer
    - Home, About, Contact all load without errors
19. Visit `/admin` and verify the admin panel still loads and can edit the new pages (the new hero block must be editable)
20. **Show the user what you built before deploying** — tell them the home page is ready, describe the structure, and wait for approval
21. If approved, run `/deploy` to ship. **Do not** run `/deploy-init`.

## Success criteria

- [ ] Home page has **exactly one** `<h1>` (verify via `view-source:`)
- [ ] No heading contains per-word `<span>` wrappers
- [ ] Every section heading is followed by real content (no empty "Portfolio work" sections)
- [ ] At least one image renders on the home page (or a purposeful typographic visual)
- [ ] Nav appears only in the header and footer, not mid-page
- [ ] Zero decorative numerals or "Section" labels remain
- [ ] `content/site.json` has Jude's real branding, no defaults
- [ ] `content/pages/*.json` contains real content, no "Welcome to My Portfolio" or scaffolded placeholder
- [ ] `npm run build` succeeds with no warnings
- [ ] `npm run test` passes — all previous tests + any new HeroBlock test
- [ ] `/admin` loads and the new pages are editable through it
- [ ] The HeroBlock (if added) has at most 2 wrapper elements between `<section>` and the content
- [ ] No more than 2 font families and 4 weights loaded via `next/font`
- [ ] Dark palette applied via `content/site.json`, not hardcoded in components
- [ ] Deployed successfully via `/deploy` after user approval

## Clarifying questions to ask the user BEFORE making changes

Do not guess on any of these. Wait for answers.

1. **Real projects:** "Do you have real portfolio projects with screenshots and descriptions? If yes, send me the list (name, description, link, ideally image). If no, I'll skip the portfolio section entirely."
2. **Photo:** "Do you have a photo of yourself to put on the About page? If no, I'll use a typographic treatment instead."
3. **Email:** "What email should the contact button use? Is `Jude@micah77.org` still correct or do you want a different one?"
4. **Palette:** "Editorial dark (near-black + warm amber accent) or muted dark (slate navy + cool sky accent)?"
5. **Site name:** "Should the site name be 'Jude Makes Things' or 'Jude Hill'?"
6. **Headline:** "The current hero headline is 'Websites, made simple.' — do you want to keep it, or pick a fresh one? Here are three options: (a) 'I build websites that work.' (b) 'Small sites. Real craft.' (c) 'Fast websites, made by hand.' — or you can give me your own."
7. **Block approach:** "I recommend adding one new `hero` block type so the top of the page is a single semantic section instead of 4+ stacked primitives. This is ~6 files of code but makes the home page materially better. OK to proceed?"

## What to NOT do

- **Don't** run `/website-init` — the framework is already scaffolded
- **Don't** run `/deploy-init` — deployment is already configured
- **Don't** touch `Dockerfile`, `next.config.ts`, `deploy.json`, or anything under `.claude/skills/` unless there's a specific reason
- **Don't** hand-write custom JSX inside any `app/(site)/page.tsx` — the only page files should be the framework's existing ones that read JSON. All your new work lives in JSON + new block components.
- **Don't** add more than one new block type on this pass. If you're tempted to add `feature-list`, `split`, or `testimonial`, resist — ship hero first, add more in a second pass.
- **Don't** copy decorative patterns from the existing judemakes.com site (numbered ornaments, "Section" labels, stacked headings, per-word spans)
- **Don't** install new UI libraries — the framework already has shadcn + Tailwind + Lucide. If you want Motion and it's not installed, install only `motion`.
- **Don't** ship placeholder content. If you don't know a value, ask.
- **Don't** deploy without showing the user first.
- **Don't** commit anything sensitive — no secrets, no keys, nothing under `public/uploads/` that shouldn't be public.

## When in doubt

- Re-read `DESIGN_TOOLKITS.md` Section 1 and Section 10
- Re-read `CLAUDE.md` "Breaks Admin Panel" section — it tells you which changes require updating multiple files in sync
- If the user's instructions conflict with anything in `DESIGN_TOOLKITS.md`, the user wins

Good luck. Ship clean.
