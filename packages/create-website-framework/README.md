# @judemakes/create-website-framework

Scaffold a new client website from the `Hude06/website-framework` repo.

## Usage

```bash
npm create @judemakes/website-framework my-client-site
```

Equivalent direct package call:

```bash
npx @judemakes/create-website-framework my-client-site
```

## Options

- `--ref <git-ref>`: framework branch or tag to scaffold from (default: `main`)
- `--framework-repo <git-url>`: override framework repository URL
- `--no-install`: skip `npm install` after scaffolding

## What it does

1. Clones the framework at the selected ref
2. Copies template files into your target directory
3. Creates `.client-site` marker
4. Initializes git in the generated site
5. Adds `framework` remote pointing at the framework repo
6. Installs dependencies (unless `--no-install` is set)
