# Post-Deploy Health Check

Run these checks immediately after deploy to confirm the site and admin runtime are healthy.

## 1. Public Health Endpoint

```bash
curl -fsS https://YOUR_DOMAIN/api/health | jq
```

Expected:

- `ok: true`
- `version` is set (or `dev` if not injected)
- `uptime_s` is non-negative

## 2. Fleet Stats Endpoint (Authenticated)

Requires `FLEET_TOKEN` to be configured on the server and passed by caller:

```bash
curl -fsS \
  -H "Authorization: Bearer $FLEET_TOKEN" \
  https://YOUR_DOMAIN/api/fleet/stats | jq
```

Expected:

- `ok: true`
- `data.pages_count` is greater than 0
- `data.blocks_count` is greater than 0

## 3. Admin Surface Reachability

```bash
curl -I https://YOUR_DOMAIN/admin
curl -I https://YOUR_DOMAIN/api/admin/pages
```

Expected:

- Both endpoints return `401 Unauthorized` without credentials.
- With valid Basic Auth, they should return success responses.

## 4. Build Artifact Sanity

Check that build metadata is visible after deploy:

```bash
curl -fsS https://YOUR_DOMAIN/api/health | jq '.version, .built_at'
```

Expected:

- `version` matches deployed commit SHA (if configured).
- `built_at` matches deployment timestamp (if configured).
