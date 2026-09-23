#!/usr/bin/env bash
# Fixes the /uploads redirect loop on judemakes.com.
#
# WHY THIS CAN'T BE FIXED IN THE APP:
#   public/uploads/ is a real directory, so nginx 301s /uploads -> /uploads/
#   before the request ever reaches Next. Next (trailingSlash:false) then 308s
#   /uploads/ -> /uploads, and the two bounce forever.
#
#   The sibling /portfolio loop had the same cause and IS fixed in the app:
#   public/portfolio/ was deleted (the PNGs were unused), so nginx no longer
#   sees a directory there. public/uploads/ has to stay, so it needs this rule.
#
# Unlike judemakes-www-and-headers.sh this does NOT depend on the www DNS
# change — it can be run today.
#
# Run:  ssh -t jude@judemakes.com 'sudo bash ~/deploy/fix-uploads-loop.sh'

set -euo pipefail

CONF=/etc/nginx/sites-available/judemakes.com
SNIPPET='    # Serve nothing at the bare /uploads directory (see fix-uploads-loop.sh).
    location = /uploads { return 404; }
    location = /uploads/ { return 404; }'

[ -f "$CONF" ] || { echo "✗ $CONF not found — check the nginx site filename." >&2; exit 1; }

if grep -q 'location = /uploads' "$CONF"; then
  echo "✓ Rule already present in $CONF — nothing to do."
  exit 0
fi

cp -a "$CONF" "${CONF}.bak.$(date +%Y%m%d%H%M%S)"
echo "→ Backed up to ${CONF}.bak.*"

# Insert just inside the first server block that listens on 443.
awk -v snip="$SNIPPET" '
  /listen .*443/ && !done { print; inblock=1; next }
  inblock && /^\s*server_name/ { print; print ""; print snip; done=1; inblock=0; next }
  { print }
' "$CONF" > "${CONF}.new"

mv "${CONF}.new" "$CONF"

if nginx -t; then
  systemctl reload nginx
  echo "✓ Rule added and nginx reloaded."
  echo
  echo "Verify:"
  echo "  curl -sI https://judemakes.com/uploads  | head -1   # expect 404, not 301"
else
  echo "✗ nginx config test failed — restoring backup." >&2
  cp -a "$(ls -t ${CONF}.bak.* | head -1)" "$CONF"
  exit 1
fi
