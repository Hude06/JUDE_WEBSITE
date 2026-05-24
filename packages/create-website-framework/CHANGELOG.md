# Changelog

## 0.1.4 - 2026-05-24

- Preserve shared git history when scaffolding by cloning directly into the target directory.
- Rename `origin` to `framework` and configure full branch fetch refs for update sync compatibility.
- Add smoke-test assertion that scaffolded sites can merge from `framework/main` without unrelated-history errors.

## 0.1.3 - 2026-05-23

- Stamp `contractVersion: 1` into scaffolded content JSON files.

## 0.1.2 - 2026-05-23

- Add `repository.url` metadata for npm provenance validation in GitHub Actions publish.

## 0.1.1 - 2026-05-23

- Change package scope to `@judemakesthings/create-website-framework` for npm publish alignment.

## 0.1.0 - 2026-05-23

- Initial release of `@judemakesthings/create-website-framework`.
- Local scaffold flow:
  - clone selected framework ref
  - copy clean template files
  - create `.client-site` marker
  - initialize git and add `framework` remote
  - optional dependency install
