# Releasing `@judemakes/create-website-framework`

This repo publishes the initializer package from `packages/create-website-framework/`.

## 1. Update Version + Changelog

Edit:

- `packages/create-website-framework/package.json` (`version`)
- `packages/create-website-framework/CHANGELOG.md`

## 2. Validate Package Contents

```bash
cd packages/create-website-framework
npm pack --dry-run --json
```

Confirm only expected files are included.

## 3. Commit and Push

```bash
git add packages/create-website-framework/package.json packages/create-website-framework/CHANGELOG.md
git commit -m "release(create): @judemakes/create-website-framework vX.Y.Z"
git push origin main
```

## 4. Tag the Release

```bash
git tag create-website-framework-vX.Y.Z
git push origin create-website-framework-vX.Y.Z
```

Tag format must match exactly: `create-website-framework-v<version>`.

## 5. Automated Publish

Pushing the tag triggers:

- `.github/workflows/publish-create-website-framework.yml`

The workflow validates tag/version alignment, runs `npm pack --dry-run`, and publishes to npm.

## Required Secret

Set this repo secret:

- `NPM_TOKEN`: npm automation token with publish access for `@judemakes/create-website-framework`.
