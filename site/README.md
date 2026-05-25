# `site/` Customization Zone

Use this folder for client-specific site chrome and global presentation without
editing framework-owned files.

## Files

- `shell.tsx` — site-level layout wrapper (header, footer, main container)
- `metadata.ts` — metadata overrides (title/description/open graph/twitter/etc.)
- `not-found.tsx` — custom 404 component
- `styles.css` — global CSS loaded after framework `app/globals.css`

## Why this exists

Editing `app/**`, `components/**`, or `lib/**` in a client site increases the
chance of merge conflicts during `npm run sync-framework`.

By keeping chrome/styling overrides in `site/**`, framework updates stay much
cleaner while still allowing strong visual customization.
