# Production Readiness Checklist

This checklist tracks what must be true for the framework to be considered production-ready and safe to roll out for client-site generation.

## 1. Quality Gates

- [x] `npm run verify` exists and runs lint, typecheck, tests, and production build.
- [x] CI runs verification on push/PR.
- [x] Next.js build warnings from deprecated `middleware` convention are resolved (migrated to `proxy.ts`).

## 2. Core Architecture Contract

- [x] Framework/client zone boundaries are enforced by hooks and tool guardrails.
- [x] Documentation states immutable-core model and client extension paths.
- [x] Upload path docs align with runtime (`public/uploads` served at `/uploads/*`).

## 3. Deployment Baseline

- [x] Docker build path exists and builds standalone Next output.
- [x] Nginx template aligns with reverse-proxy + `/admin` auth architecture.
- [x] Add an environment-variable reference document for deploys (`ADMIN_ALLOWED_HOST`, `FLEET_TOKEN`, `PLAUSIBLE_*`, etc.) — see `docs/deployment-env.md`.
- [x] Add scripted post-deploy health check docs/commands — see `docs/post-deploy-healthcheck.md`.

## 4. Security and Operations

- [x] CSRF protection applied to mutating admin API calls in `proxy.ts`.
- [x] Admin rebuild endpoint has lock + cooldown.
- [x] Add rate-limit strategy for admin APIs at proxy layer (`proxy.ts`, per-IP best effort).
- [x] Add backup/restore runbook for content JSON and uploads — see `docs/backup-restore.md`.

## 5. npm Publishing Track

The repo is currently a framework application repo. Publishing to npm requires choosing the distribution model:

1. **Template package**: publish files for scaffold tools to copy.
2. **CLI package**: publish `create-*` command that scaffolds repos.
3. **Library package**: publish reusable runtime modules consumed by apps.

Before publish:

- [x] License file present.
- [x] Decide distribution model (`CLI package`).
- [x] Finalize CLI package publish metadata (`@judemakes/create-website-framework` with `bin`, `files`, and `publishConfig`).
- [x] Add changelog/release versioning flow — see `docs/releasing-create-cli.md`.
- [x] Run `npm pack --dry-run` and validate package contents (validated for `@judemakes/create-website-framework`).
