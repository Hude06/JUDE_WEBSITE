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
