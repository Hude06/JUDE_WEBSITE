# Deployment Environment Variables

This framework is designed to run with minimal required environment configuration. Most variables are optional and add security or observability.

## Variables

| Variable | Required | Used by | Purpose |
|---|---|---|---|
| `ADMIN_ALLOWED_HOST` | Optional | `proxy.ts` | Extra allowed host for CSRF origin checks on mutating `/api/admin/*` requests. |
| `FLEET_TOKEN` | Required for fleet stats + analytics | `app/api/fleet/stats/route.ts`, `app/api/analytics/route.ts` | Bearer token required to read `/api/fleet/stats` and `/api/analytics`. Set the same value in mission-control's `MC_FLEET_TOKEN`. |
| `ANALYTICS_DATA_PATH` | Optional | `lib/analytics-store.ts` | File path for the pageview snapshot (e.g. `/data/analytics.json` on a mounted volume). Gives durability across restarts; if unset, events are in-memory only and mission-control re-syncs after a restart. |
| `MC_TRACK_DISABLED` | Optional | `app/layout.tsx` | Set to `1` to disable the first-party pageview beacon for a site. |
| `BUILD_SHA` | Optional | `app/api/health/route.ts` | Build identifier returned in health endpoint output. |
| `BUILD_TIME` | Optional | `app/api/health/route.ts`, `app/api/fleet/stats/route.ts` | Build timestamp surfaced in health/stats output. |
| `PLAUSIBLE_DOMAIN` | Optional | `components/PlausibleScript.tsx` | Enables Plausible script injection when set with `PLAUSIBLE_SRC`. |
| `PLAUSIBLE_SRC` | Optional | `components/PlausibleScript.tsx` | Full script URL for Plausible script injection. |
| `SKIP_TYPE_CHECK` | Optional | `next.config.ts` | Skips TypeScript errors during `next build` when truthy. Use sparingly. |
| `NODE_ENV` | Recommended | runtime | Standard Node runtime mode (`production` in deploy). |
| `PORT` | Recommended | runtime | Next.js server listen port. |
| `HOSTNAME` | Recommended | runtime | Bind host for Next.js server (typically `0.0.0.0`). |

## Quick Start

1. Copy `.env.example` to `.env` in your deployment environment.
2. Set `FLEET_TOKEN` if you will call `/api/fleet/stats`.
3. Set `BUILD_SHA` and `BUILD_TIME` in CI/CD before starting the server.
4. Set `PLAUSIBLE_DOMAIN` and `PLAUSIBLE_SRC` only if analytics is needed.
