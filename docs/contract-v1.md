# Content Contract v1

The framework runtime is treated as immutable core logic. Client sites pass content and settings data into that core through JSON files and admin APIs.

This document defines **Contract v1** for that input boundary.

## Version Field

- New client content files should include:
  - `"contractVersion": 1`
- Current supported value: `1`
- Legacy files with no `contractVersion` are treated as `1` when loaded and are normalized to include it on the next admin save.

## Page Content (`content/pages/<slug>.json`)

Allowed top-level fields:

- `contractVersion`
- `title`
- `slug`
- `description` (optional)
- `blocks`

Rules:

- `slug` must be lowercase letters/numbers/hyphens.
- Framework block types are strictly validated by schema.
- Client custom blocks are allowed via `type` + passthrough fields.

### Optional structural fields (additive, still Contract v1)

These optional block fields were added without bumping the contract. Omitting them
reproduces the original layout, so existing content is unaffected:

- `hero.layout`: `stack` (default) | `split` | `full-bleed` | `offset`; `hero.eyebrow` (string)
- `grid.style`: `cards` (default) | `bare` | `bordered-list` | `numbered` | `feature`; `grid.eyebrow` (string)
- `section.layout`: `centered` | `left` | `wide` | `aside`; `section.eyebrow` (string)
- `quote.style`: `centered` (default) | `display` | `bordered`
- `heading.size` / `Heading` primitive: adds `mega` and `giant` display sizes

When a block omits its variant field, an *expressive* theme supplies the default via its
layout DNA; classic themes keep the original layout.

## Site Config (`content/site.json`)

Allowed top-level fields:

- `contractVersion`
- `siteName`
- `nav`
- `fonts`
- `colors`
- `theme` (optional)
- `motion` (optional)
- `contact` (optional)
- `plausible` (optional)

Rules:

- Invalid or unexpected structures are rejected by admin save APIs.
- Runtime loads use the same schema contract as admin writes.
- `motion.engine` accepts:
  - `"motion"` (default)
  - `"gsap"`
- `theme.preset` / `fonts.pair` accept any registered preset/pair name — the 5 classic
  names (`editorial` / `studio` / `tech` / `warm` / `monochrome`) plus the 6 expressive
  names (`atelier` / `brutalist` / `console` / `almanac` / `kinetic` / `salon`), and any
  client-registered custom names. Unknown names fall back gracefully.
- `theme.accent` (optional hex) overrides the theme accent for that site.
- `theme.system` (optional) `"classic"` | `"expressive"` forces the render path regardless
  of preset name.
- Selecting an expressive preset activates the art-direction engine (atmosphere, per-theme
  shadows, scroll motion, structural block defaults). Classic presets render exactly as
  before, so deployed sites are unaffected by framework updates until they opt in.

## Enforcement Points

- Runtime reads: `lib/content.ts`
- Admin writes: `lib/admin.ts`
- API update endpoints:
  - `PUT /api/admin/pages/:slug`
  - `PUT /api/admin/site`

## Future Migration Path

When adding `contractVersion: 2`:

1. Add v2 schema(s).
2. Add read-time migration from v1 -> v2.
3. Keep writer output pinned to latest supported version.
4. Update this document and release notes.
