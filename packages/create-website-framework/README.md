# @judemakesthings/create-website-framework

Scaffold a new client website from the `Hude06/website-framework` repo.

## Usage

```bash
npm create @judemakesthings/website-framework my-client-site
```

Equivalent direct package call:

```bash
npx @judemakesthings/create-website-framework my-client-site
```

## Options

- `--ref <git-ref>`: framework branch or tag to scaffold from (default: `main`)
- `--framework-repo <git-url>`: override framework repository URL
- `--no-install`: skip `npm install` after scaffolding

## What it does

1. Clones the framework at the selected ref
2. Keeps shared git history with the framework for clean update merges
3. Creates `.client-site` marker
4. Renames `origin` to `framework` for `npm run sync-framework`
5. Leaves tracked framework files unchanged so new repos start clean
6. Installs dependencies (unless `--no-install` is set)
