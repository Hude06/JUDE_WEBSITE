# Design Toolkits Reference

**Purpose:** A curated, opinionated reference to free UI toolkits, component libraries, icon sets, animation libraries, fonts, and copy-paste component galleries. Claude should read this during `/website-init` (and whenever adding visual elements) to pick the right tools for the site type being built.

**Last curated:** 2026-04. Toolkit popularity shifts fast — if something here seems stale or a better option has emerged, update this file.

**Framework default:** This website framework ships with **Next.js + Tailwind v4 + shadcn/ui + Lucide icons + Motion**. Motion ships as a hard dependency — use `<Reveal>`, `<Stagger>`, and `<Parallax>` from `lib/motion.tsx` (see `AI_PLAYBOOK.md` for examples). The framework also ships **5 theme presets** (Editorial, Studio, Tech, Warm, Monochrome) with paired fonts — see `content/themes/`. That stack is the answer for 80% of sites. This document is about **what to layer on top**, **what to pull inspiration from**, and **when to break glass and use a different stack entirely**.

---

## Section 1 — Quick chooser by website type

Pick the row that matches the site, use the Primary stack, layer in the Add-ons if relevant. "Break glass" means the default Next.js framework is not the right tool — use the alternative listed.

| Site type | Primary stack | Add-ons | Break-glass alternative |
|---|---|---|---|
| **Personal portfolio** (designer, dev, writer) | shadcn + Tailwind + Lucide + Motion | Aceternity UI effects, Instrument Serif font | — |
| **Marketing / landing page** | shadcn + Tailwind + Lucide + Motion | Preline blocks, Flowbite blocks for hero/pricing sections | — |
| **SaaS app dashboard** | shadcn + Tailwind + Lucide + Tremor | TanStack Table for data tables, Recharts for custom charts | Mantine (if you need batteries-included forms/tables) |
| **Admin panel** (internal tools) | Mantine or Ant Design | TanStack Table, Zod for forms | Retool / Refine if you want scaffolding over building |
| **Blog / content site** | shadcn + Tailwind Typography plugin + Lucide | MDX (via Contentlayer or Velite), reading-time, next-sitemap | Astro + Starlight if docs-heavy |
| **Documentation site** | — | — | **Nextra** (Next.js-native), **Starlight** (Astro), or **Docusaurus** (React) — don't build docs from scratch |
| **E-commerce storefront** | shadcn + Tailwind + Lucide | Snipcart, Shopify Hydrogen, or Medusa for cart/checkout | Hydrogen if you're already on Shopify |
| **Agency / studio site** | shadcn + Tailwind + Lucide + Motion + GSAP | Aceternity UI, Magic UI for big scroll effects | — |
| **Editorial / magazine** | shadcn + Tailwind + Instrument Serif + Motion | Custom typography, no component library beyond layout primitives | — |
| **Restaurant / local business** | shadcn + Tailwind + Lucide | Warm serif fonts, large hero photography, map embed | DaisyUI if you want a faster warm-theme starter |
| **Community / forum** | Mantine | TanStack Query, Zustand | Discourse (not React — full platform) |
| **Landing page MVP** (< 1 day build) | DaisyUI or Flowbite (Tailwind plugins) | — | — |
| **Design-system / style-guide site** | Storybook or Ladle | — | Zeroheight (paid, non-code) |
| **Online store (1–100 products)** | shadcn + Tailwind + Stripe Checkout | Next.js Commerce (Vercel template) | Shopify if non-technical owner |
| **Event / one-off promo page** | Tailwind only (no component lib) + Motion | — | — |
| **Blog + newsletter** | — | — | **Beehiiv**, **Substack**, or **Ghost** — don't build |
| **Link-in-bio page** | — | — | **Linktree**, **Bento.me**, or **Beacons** — don't build |

---

## Section 2 — React component libraries (ranked)

All ranked on a 5-star scale with opinionated commentary. License and cost noted for each.

### Tier 1 — Pick one of these for almost any React site

#### ⭐⭐⭐⭐⭐ shadcn/ui — `https://ui.shadcn.com`
- **License:** MIT · **Cost:** Free · **Base:** Radix / Base UI primitives + Tailwind
- **Install model:** Copy-paste components into your repo. You own the code. No npm dependency.
- **Best for:** Any site where you want to customize components deeply. The framework default.
- **Avoid for:** Rapid prototyping where you don't want to think about components at all (use Mantine or DaisyUI).
- **Why rank 5:** Becomes your own code on day one. Trivial to customize. Huge ecosystem of extensions (see Tier 2). Works with any Tailwind-based site.
- **Note:** Is migrating from Radix to Base UI (`@base-ui/react`). Uses `render` prop instead of `asChild`. Watch for breaking changes when updating.

#### ⭐⭐⭐⭐⭐ Mantine — `https://mantine.dev`
- **License:** MIT · **Cost:** Free
- **Install model:** npm dependency. 100+ components, 50+ hooks, batteries-included.
- **Best for:** Admin panels, dashboards, internal tools, any site with heavy forms/tables/modals. The "I want to ship in a day" option.
- **Avoid for:** Marketing sites (feels too utilitarian), sites with strong custom branding (theming is good but not as free as shadcn).
- **Why rank 5:** The most complete React component library by a wide margin. Date pickers, rich text editor, file upload, notifications, command palette — all built-in and accessible.

#### ⭐⭐⭐⭐ Radix UI Primitives — `https://www.radix-ui.com/primitives`
- **License:** MIT · **Cost:** Free
- **Install model:** Unstyled, accessible primitives. You bring the CSS.
- **Best for:** Building your own component system from scratch. Powers shadcn under the hood.
- **Avoid for:** Teams that don't want to write CSS. Use shadcn instead for 90% of cases.
- **Why rank 4 (not 5):** Being replaced by Base UI as the next generation. Still stable and excellent but picked shadcn first.

#### ⭐⭐⭐⭐ Base UI — `https://base-ui.com`
- **License:** MIT · **Cost:** Free
- **Install model:** Unstyled primitives from the Radix and MUI teams. The successor to Radix.
- **Best for:** Same as Radix but newer API. shadcn is migrating here.
- **Why rank 4:** Still maturing — some components not yet stable. Watch this space.

### Tier 2 — shadcn ecosystem (extensions, not replacements)

These are copy-paste components built on top of shadcn. You add them alongside shadcn — they don't replace it.

#### ⭐⭐⭐⭐⭐ Aceternity UI — `https://ui.aceternity.com`
- **License:** Free (MIT-ish, copy-paste)
- **Best for:** Landing pages, agency sites, portfolio sites that need "wow" moments — spotlight effects, meteor trails, card hover animations, 3D card tilts, infinite-moving logo carousels.
- **Avoid for:** Utility-heavy apps — it's decoration, not UI.

#### ⭐⭐⭐⭐⭐ Magic UI — `https://magicui.design`
- **License:** Free
- **Best for:** Same niche as Aceternity — animated marketing components. Many free animated number tickers, marquee scrollers, animated gradients, word rotators.

#### ⭐⭐⭐⭐ Origin UI — `https://originui.com`
- **License:** Free
- **Best for:** Extended shadcn components — more input types, more button variants, more table patterns. Less flashy than Aceternity, more "here's the form field you wish shadcn had."

#### ⭐⭐⭐⭐ Kokonut UI — `https://kokonutui.com`
- **License:** Free
- **Best for:** Modern, trendy landing page components. Heavy on gradients and blur effects.

#### ⭐⭐⭐ Cult UI — `https://www.cult-ui.com`
- **License:** Free
- **Best for:** Animated shadcn extensions with a focus on micro-interactions.

#### ⭐⭐⭐⭐ Tremor — `https://tremor.so`
- **License:** Apache 2.0 · **Cost:** Free
- **Best for:** SaaS dashboards. Prebuilt KPI cards, charts, tables, date pickers for analytics UIs. Uses Recharts under the hood. Pair with shadcn for the non-chart parts.
- **Note:** Now Tremor Raw (v4) — copy-paste instead of npm. Follow the new approach.

### Tier 3 — Mature, comprehensive alternatives

#### ⭐⭐⭐⭐ Ant Design — `https://ant.design`
- **License:** MIT · **Cost:** Free
- **Best for:** Enterprise admin panels, CRUD-heavy internal tools, anything with complex tables/filters/forms. Used heavily in Chinese tech and fintech.
- **Avoid for:** Marketing sites, landing pages, anything where visual taste matters — looks very "enterprise." Bundle size is large.

#### ⭐⭐⭐⭐ Chakra UI — `https://chakra-ui.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Teams that want accessible components with style props (prop-based styling instead of className). Good middle ground between Mantine and shadcn.
- **Why rank 4 (not 5):** Lost momentum as shadcn/Mantine took over. Still fine, just not the leading choice anymore.

#### ⭐⭐⭐ Material UI (MUI) — `https://mui.com`
- **License:** MIT · **Cost:** Free (Pro/Premium tiers for advanced data grid, date picker)
- **Best for:** Google Material Design aesthetic. Admin panels. Teams transitioning from Android/Flutter.
- **Avoid for:** Sites where you don't want to look like every other Material site. Heavy bundle. Styling is fighty once you diverge from Material defaults.

#### ⭐⭐⭐⭐ HeroUI (formerly NextUI) — `https://heroui.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Modern, rounded, slightly-playful aesthetic. Next.js-optimized. Good alternative to shadcn if you want batteries-included.

#### ⭐⭐⭐ Park UI — `https://park-ui.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Teams that want Ark UI (headless primitives) + Panda CSS (style engine). Niche but well-built.

#### ⭐⭐⭐⭐ React Aria Components — `https://react-spectrum.adobe.com/react-aria/components.html`
- **License:** Apache 2.0 · **Cost:** Free
- **Best for:** Maximum accessibility. Adobe's team built it. Handles every a11y edge case.
- **Avoid for:** Quick projects — API is more verbose than shadcn.

### Tier 4 — Tailwind-based component packs (non-React-specific)

These are HTML + Tailwind templates. Works with React if you translate to JSX. Great for copy-paste.

#### ⭐⭐⭐⭐ DaisyUI — `https://daisyui.com`
- **License:** MIT · **Cost:** Free · **Install:** Tailwind plugin
- **Best for:** Fastest landing page starter. Class-based components (`btn`, `card`, `alert`) via Tailwind plugin. 35+ prebuilt themes (dark, cyberpunk, retro, valentine).
- **Avoid for:** Sites with strong custom branding — themes make it recognizable. Not ideal for highly-interactive React apps (no real component state).

#### ⭐⭐⭐⭐ Flowbite — `https://flowbite.com`
- **License:** MIT (open core) · **Cost:** Free tier + paid Pro
- **Best for:** Free section blocks for landing pages — hero, pricing, features, testimonials, contact. Copy-paste the Tailwind markup into your shadcn page.
- **Variants:** Flowbite React (npm-installed React components) is the npm version.

#### ⭐⭐⭐⭐ Preline UI — `https://preline.co`
- **License:** MIT · **Cost:** Free (with paid upgrade)
- **Best for:** Same niche as Flowbite — free copy-paste Tailwind blocks for marketing sites. Good dark/light balance.

#### ⭐⭐⭐⭐ HyperUI — `https://www.hyperui.dev`
- **License:** MIT · **Cost:** Free
- **Best for:** Simple Tailwind components, no npm install, pure copy-paste. Best for teams that just want the markup.

#### ⭐⭐⭐ Meraki UI — `https://merakiui.com`
- **License:** Free
- **Best for:** RTL-friendly Tailwind components. Weaker selection than Flowbite/Preline but supports Arabic/Hebrew layouts well.

#### ⭐⭐⭐ TailGrids — `https://tailgrids.com`
- **License:** Freemium
- **Best for:** Similar to Flowbite with a different design sensibility.

---

## Section 3 — CSS frameworks (the styling layer)

#### ⭐⭐⭐⭐⭐ Tailwind CSS v4 — `https://tailwindcss.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Everything. The framework default. v4 is much faster than v3 and uses CSS variables for theming.
- **Why rank 5:** Ubiquitous. Every modern component library assumes you're on it. Stop shopping.

#### ⭐⭐⭐⭐ UnoCSS — `https://unocss.dev`
- **License:** MIT · **Cost:** Free
- **Best for:** Projects that need instant HMR, atomic CSS with attributes, or non-Tailwind presets (Windi, Mini). Power users.
- **Avoid for:** Projects using shadcn — it's designed for Tailwind.

#### ⭐⭐⭐ Open Props — `https://open-props.style`
- **License:** MIT · **Cost:** Free
- **Best for:** Projects that want design tokens as pure CSS variables with no build step. Great for classless sites and pairing with web components.

#### ⭐⭐⭐⭐ Pico.css — `https://picocss.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Classless styling — just semantic HTML, looks good. Perfect for personal blogs, docs, and "I don't want to think about CSS" projects.
- **Avoid for:** Anything with real UI complexity.

#### ⭐⭐⭐ Bootstrap 5 — `https://getbootstrap.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Teams with Bootstrap muscle memory. Still the most widely-known CSS framework. Legacy projects.
- **Avoid for:** Any new React project — Tailwind + shadcn is simply better in 2026. Every Bootstrap site looks like a Bootstrap site.

#### ⭐⭐⭐ Bulma — `https://bulma.io`
- **License:** MIT · **Cost:** Free
- **Best for:** Teams that want a Bootstrap alternative with nicer defaults and no JS dependency.

---

## Section 4 — Icon libraries (ranked)

#### ⭐⭐⭐⭐⭐ Lucide — `https://lucide.dev`
- **License:** ISC · **Cost:** Free · **Count:** 1,500+
- **Best for:** The framework default. shadcn's default icon set. Clean, consistent, tree-shakeable.
- **Why rank 5:** Best balance of coverage, consistency, and popularity. No reason to pick anything else unless you have a specific need below.

#### ⭐⭐⭐⭐ Heroicons — `https://heroicons.com`
- **License:** MIT · **Cost:** Free · **Count:** ~300
- **Best for:** Tailwind team's icons. Smaller set but very high quality. Perfect if you want Outline + Solid variants only.

#### ⭐⭐⭐⭐⭐ Phosphor Icons — `https://phosphoricons.com`
- **License:** MIT · **Cost:** Free · **Count:** 9,000+ (6 weights × 1,500)
- **Best for:** Sites that need visual variety — has Regular, Thin, Light, Bold, Fill, and Duotone weights of every icon. Perfect for editorial.

#### ⭐⭐⭐⭐ Tabler Icons — `https://tabler.io/icons`
- **License:** MIT · **Cost:** Free · **Count:** 5,000+
- **Best for:** The biggest free icon set. When Lucide doesn't have what you need.

#### ⭐⭐⭐⭐ Remix Icon — `https://remixicon.com`
- **License:** Apache 2.0 · **Cost:** Free · **Count:** 3,000+
- **Best for:** Outlined and filled pairs. Well-designed system icons.

#### ⭐⭐⭐ Radix Icons — `https://www.radix-ui.com/icons`
- **License:** MIT · **Cost:** Free · **Count:** ~300
- **Best for:** Tiny, 15×15px, Workbench-style icons. Good for dense UIs. Too small as general-purpose.

#### ⭐⭐⭐⭐ Iconify — `https://iconify.design`
- **License:** Mixed (per-icon) · **Cost:** Free
- **Best for:** Aggregator — 200,000+ icons from 200+ sets in one API. Use when you need an icon from a specific brand's icon set without installing the whole set.

#### ⭐⭐⭐⭐ Simple Icons — `https://simpleicons.org`
- **License:** CC0 · **Cost:** Free · **Count:** 3,000+
- **Best for:** **Brand logos** (GitHub, Slack, Figma, etc.). Don't use Lucide for brand logos — use this.

#### ⭐⭐ Font Awesome Free — `https://fontawesome.com/search?m=free`
- **License:** SIL OFL 1.1 · **Cost:** Free tier (~2k free, ~30k paid)
- **Best for:** Legacy projects. Avoid for new work — free tier is limited and the per-icon CSS approach is outdated.

---

## Section 5 — Animation libraries

#### ⭐⭐⭐⭐⭐ Motion (formerly Framer Motion) — `https://motion.dev`
- **License:** MIT · **Cost:** Free
- **Best for:** React animation. The standard. Declarative, works with Framer's design team's expertise.
- **Avoid for:** Very heavy scroll-timeline effects — GSAP is still better for that.

#### ⭐⭐⭐⭐⭐ GSAP — `https://gsap.com`
- **License:** Standard License (now **fully free** including all premium plugins as of 2024, owned by Webflow)
- **Best for:** Timeline-based animation, scroll-triggered effects, complex sequences. SplitText, ScrollTrigger, MorphSVG all free now.
- **Why rank 5 (was 3 before the license change):** Now genuinely free. Industry standard for scroll-heavy sites.

#### ⭐⭐⭐⭐ Anime.js v4 — `https://animejs.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Lightweight animation when you don't want GSAP's size. Works great outside React.

#### ⭐⭐⭐⭐ AutoAnimate — `https://auto-animate.formkit.com`
- **License:** MIT · **Cost:** Free
- **Best for:** Drop-in auto-animation for list reordering, add/remove. `useAutoAnimate()` and you're done. Lowest effort animation library in existence.

#### ⭐⭐⭐ React Spring — `https://www.react-spring.dev`
- **License:** MIT · **Cost:** Free
- **Best for:** Physics-based animation. Spring-driven motion. Alternative to Motion if you prefer spring semantics.

#### ⭐⭐⭐ Lottie (lottie-react) — `https://lottiefiles.com`
- **License:** MIT · **Cost:** Free (files on LottieFiles can be free or paid)
- **Best for:** Playing After Effects exports. Great for hero animations designed by motion designers.

#### ⭐⭐⭐ Theatre.js — `https://www.theatrejs.com`
- **License:** Apache 2.0 · **Cost:** Free
- **Best for:** Timeline editing inside the browser. Niche but powerful for cinematic sites.

---

## Section 6 — Fonts (where to get them, what to pick)

### Sources

#### ⭐⭐⭐⭐⭐ Google Fonts — `https://fonts.google.com`
- 1,700+ free fonts. Served via Google CDN or self-hosted.
- **Next.js integration:** Use `next/font/google` — no layout shift, zero config.

#### ⭐⭐⭐⭐⭐ Fontsource — `https://fontsource.org`
- Every Google Font as an npm package. Self-hosted, no Google request.
- **Best for:** Privacy-conscious sites (avoid Google tracking) and offline-friendly builds.

#### ⭐⭐⭐⭐ Bunny Fonts — `https://fonts.bunny.net`
- Drop-in Google Fonts alternative. GDPR-compliant, no tracking.

#### ⭐⭐⭐⭐ Modern Font Stacks — `https://modernfontstacks.com`
- System font combos that work with zero downloads. `font-family: Seravek, 'Gill Sans Nova', ...`
- **Best for:** Zero-network fonts. Blog sites where speed matters more than precise typography.

#### ⭐⭐⭐⭐ Vercel Geist — `https://vercel.com/font`
- Vercel's custom sans and mono. Free. `next/font/local` or via `geist` npm package.
- **Best for:** Developer-facing sites. Very clean.

### Top free typefaces (curated picks)

**Display / editorial:**
- **Instrument Serif** — Elegant, high-contrast serif. Great for big hero headings.
- **Playfair Display** — Classic editorial serif. Overused but timeless.
- **Fraunces** — Variable serif with stylistic opsz axis. Extremely flexible.
- **Bricolage Grotesque** — Variable sans with playful "wiggle" axes. Trendy.
- **Anton** — Condensed tall display. Big impact.
- **Unbounded** — Geometric display. Editorial-modern.

**Sans body text:**
- **Inter** — The React default. Excellent on screens.
- **Geist Sans** — Vercel's. Cleaner than Inter.
- **Manrope** — Warmer than Inter, slightly more personality.
- **Space Grotesk** — A Monument Grotesk derivative. Distinctive.
- **Plus Jakarta Sans** — Good alternative to Inter with a bit more character.
- **Outfit** — Rounded geometric sans. Friendly.

**Serif body text:**
- **Lora** — Best free body serif. Reads well at any size.
- **Crimson Pro** — Book-quality serif. For long-form content.
- **Source Serif 4** — Adobe's free serif. High quality.
- **Merriweather** — Slab-ish, very readable. Classic blog choice.

**Monospace:**
- **JetBrains Mono** — IDE-grade mono. Ligatures. The default.
- **Geist Mono** — Vercel's. Clean, slightly geometric.
- **IBM Plex Mono** — Part of the Plex family. Distinctive, warm.
- **Fira Code** — Ligature-heavy, popular in code snippets.

### Pairings that work (copy-paste this)

| Heading font | Body font | Vibe |
|---|---|---|
| Instrument Serif | Inter | Editorial-modern, like Stripe docs |
| Fraunces | Geist Sans | Variable-serif with a clean tech partner |
| Bricolage Grotesque | Inter | Trendy, playful |
| Playfair Display | Lora | Classic magazine |
| Anton | Inter | Bold, stark, designer portfolio |
| Geist Sans | Geist Sans | All-in-one, Vercel-style |
| Space Grotesk | Inter | Agency / studio |
| Unbounded | Space Grotesk | Editorial-modern with personality |

### Rules Claude must follow

1. **Never load more than 2 font families per site** (heading + body, or all-in-one).
2. **Never load more than 4 weights total.** Every extra weight is a network request.
3. **Always use `next/font`** — it handles preloading, subset optimization, and zero layout shift.
4. **Use variable fonts where available** — one request, multiple weights.

---

## Section 7 — Component galleries (copy-paste inspiration)

When Claude needs a specific section (hero, pricing table, testimonial row), these are where to pull from. These are **not** libraries to install — they're places to copy patterns from.

| Gallery | URL | Best for |
|---|---|---|
| **Tailwind Plus** (formerly Tailwind UI) | tailwindcss.com/plus | Paid but the gold standard. Worth the license if building for clients. |
| **Flowbite Blocks** | flowbite.com/blocks | Free section blocks |
| **Preline Examples** | preline.co/examples.html | Free section blocks |
| **HyperUI Components** | hyperui.dev | Free Tailwind components |
| **Cruip** | cruip.com | Freemium landing page templates |
| **Aceternity UI** | ui.aceternity.com | Flashy animated sections |
| **Magic UI** | magicui.design | Animated marketing components |
| **Meraki UI** | merakiui.com | Free Tailwind components |
| **Lukas Moro's gallery** | ui.aceternity.com + similar | Visual inspiration |
| **Dribbble** | dribbble.com | Design inspiration only — not code |
| **Godly** | godly.website | Award-winning site inspiration |
| **SiteInspire** | siteinspire.com | Curated inspiration |
| **Awwwards** | awwwards.com | Award-winning experimental sites |

---

## Section 8 — Full-site starters and templates (when to not start from scratch)

Sometimes starting from this framework is the wrong call. These are alternatives:

| Starter | URL | When to use |
|---|---|---|
| **Next.js Commerce** (Vercel) | vercel.com/templates/next.js/nextjs-commerce | E-commerce with Shopify backend |
| **Taxonomy** (shadcn) | github.com/shadcn-ui/taxonomy | SaaS starter with auth, Stripe, MDX |
| **Nextra** | nextra.site | Documentation sites |
| **Starlight** (Astro) | starlight.astro.build | Documentation sites, simpler than Nextra |
| **Docusaurus** | docusaurus.io | Documentation, React-based, Meta's |
| **Astro** | astro.build | Content-heavy sites, blog, docs, marketing. Lighter than Next.js for static content. |
| **Portfolio Starters** (shadcn examples) | ui.shadcn.com/examples | Starting points for common layouts |
| **Payload CMS** | payloadcms.com | Full CMS when JSON files aren't enough |
| **Sanity** | sanity.io | Headless CMS when content team wants rich editing |

---

## Section 9 — What to skip (anti-recommendations)

These get brought up but Claude should NOT pick them for new work in 2026:

- **Bootstrap 4** — Legacy. Use Bootstrap 5 if forced, Tailwind otherwise.
- **Semantic UI** — Unmaintained. Fomantic UI is the community fork but both are outdated vs Tailwind.
- **Foundation** — Declining usage. No reason over Tailwind.
- **Material UI v4** — Legacy. If Material Design is needed, use MUI v5/v6.
- **Styled Components** — Still works but ecosystem has moved on. Runtime CSS-in-JS is slower than Tailwind. Use Tailwind or Panda CSS for new projects.
- **Emotion** — Same as Styled Components. Fine for existing projects, don't add to new ones.
- **jQuery UI / Bootstrap JS components** — Don't. Use Radix / shadcn / Base UI instead.
- **Font Awesome Pro** (paid) — Lucide is better and free.
- **Framer Motion (old name)** — It's just called "Motion" now. Package is `motion`, not `framer-motion`, for new installs.
- **Blueprint.js** — Niche, fine for data-dense apps, but Mantine is better for most cases now.
- **Grommet** — Unclear future, ecosystem moved to shadcn/Mantine.
- **Evergreen** — Unmaintained.
- **Reakit** — Became Ariakit, which is good but niche vs Radix/Base UI.

---

## Section 10 — How Claude should use this file

**During `/website-init`:**

1. Ask the user (or infer from context) what kind of site it is — portfolio, marketing, SaaS, blog, etc.
2. Open Section 1 "Quick chooser by website type" and find the matching row.
3. Check the Primary stack — if it's the framework default (Tailwind + shadcn + Lucide + Motion), proceed.
4. If the chooser says "break glass" (e.g., for docs use Nextra), **stop and tell the user**: "This framework is Next.js-based, but for a docs site I'd recommend Nextra instead. Do you want me to use that, or force-fit this framework?"
5. Note any Add-ons that apply (Aceternity, Tremor, GSAP) and install them explicitly as part of scaffolding.

**When adding a visual element:**

1. If it's a common UI component — use shadcn first.
2. If shadcn doesn't have it — check Tier 2 extensions (Origin UI, Aceternity, Magic UI) before writing custom.
3. If it's an icon — always Lucide unless it's a brand logo (then Simple Icons).
4. If it's animation — Motion for component-level, GSAP for scroll-timeline-heavy.
5. If it's a section block (hero, pricing, features) — copy from Flowbite, Preline, or HyperUI rather than hand-roll.

**When the framework's primitives aren't enough:**

- Don't hand-roll JSX inside `app/` — that produced the over-decomposed mess on judemakes.com.
- Add a new block type following the 6-file checklist in `CLAUDE.md`.
- Source the pattern from one of the galleries in Section 7 so it comes pre-designed.

**When in doubt:**

- Default stack: **Next.js + Tailwind v4 + shadcn/ui + Lucide + Motion**
- Default fonts: **Instrument Serif (headings) + Inter (body)** via `next/font/google`
- Default icon: **Lucide**
- Default animation: **Motion** for components, **GSAP** when scroll-triggered

If this file's recommendations ever conflict with the user's explicit instructions, the user wins. This is a default, not a constraint.
