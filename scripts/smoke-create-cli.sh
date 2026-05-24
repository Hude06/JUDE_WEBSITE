#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(pwd)"
TMP_DIR="$(mktemp -d)"
TARGET_DIR="${TMP_DIR}/smoke-site"
PORT="${SMOKE_PORT:-4011}"
BASE_URL="http://127.0.0.1:${PORT}"
DEV_PID=""
TEMP_REF=""

cleanup() {
  if [[ -n "${DEV_PID}" ]]; then
    kill "${DEV_PID}" >/dev/null 2>&1 || true
    wait "${DEV_PID}" >/dev/null 2>&1 || true
  fi
  if [[ -n "${TEMP_REF}" ]]; then
    git -C "${ROOT_DIR}" branch -D "${TEMP_REF}" >/dev/null 2>&1 || true
  fi
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

if [[ "${SMOKE_USE_PUBLISHED_CREATE:-0}" == "1" ]]; then
  echo "→ scaffolding smoke site with published npm create package"
  CREATE_ARGS=(create @judemakesthings/website-framework "${TARGET_DIR}" -- --no-install)
  if [[ -n "${SMOKE_FRAMEWORK_REPO:-}" ]]; then
    CREATE_ARGS+=(--framework-repo "${SMOKE_FRAMEWORK_REPO}")
  fi
  if [[ -n "${SMOKE_FRAMEWORK_REF:-}" ]]; then
    CREATE_ARGS+=(--ref "${SMOKE_FRAMEWORK_REF}")
  fi
  npm "${CREATE_ARGS[@]}"
else
  echo "→ scaffolding smoke site with local create CLI source"
  LOCAL_REPO="${SMOKE_FRAMEWORK_REPO:-${ROOT_DIR}}"
  LOCAL_REF="${SMOKE_FRAMEWORK_REF:-}"
  if [[ -z "${LOCAL_REF}" ]]; then
    if [[ "${LOCAL_REPO}" == "${ROOT_DIR}" ]]; then
      TEMP_REF="smoke-ref-$$-$(date +%s)"
      git -C "${ROOT_DIR}" branch -f "${TEMP_REF}" HEAD >/dev/null
      LOCAL_REF="${TEMP_REF}"
    else
      LOCAL_REF="main"
    fi
  fi

  CREATE_ARGS=(
    "${ROOT_DIR}/packages/create-website-framework/bin/create-website-framework.js"
    "${TARGET_DIR}"
    --no-install
    --framework-repo "${LOCAL_REPO}"
    --ref "${LOCAL_REF}"
  )
  node "${CREATE_ARGS[@]}"
fi

test -f "${TARGET_DIR}/.client-site"
echo "✓ .client-site marker exists"

pushd "${TARGET_DIR}" >/dev/null

echo "→ validating framework git history linkage"
git fetch framework --tags >/dev/null
if ! git merge-base --is-ancestor "$(git rev-parse HEAD)" "framework/main"; then
  echo "✗ scaffolded repo does not share history with framework/main"
  exit 1
fi
echo "✓ scaffolded repo shares history with framework/main"

echo "→ installing scaffold dependencies"
npm install --no-audit --no-fund >/dev/null

echo "→ booting dev server on ${BASE_URL}"
npm run dev -- --port "${PORT}" >"${TMP_DIR}/dev.log" 2>&1 &
DEV_PID="$!"

for _ in $(seq 1 90); do
  if curl -fsS "${BASE_URL}/admin" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -fsS "${BASE_URL}/admin" >/dev/null 2>&1; then
  echo "✗ admin page failed to boot"
  cat "${TMP_DIR}/dev.log"
  exit 1
fi

echo "✓ admin page is reachable"

SMOKE_BASE_URL="${BASE_URL}" node <<'NODE'
const base = process.env.SMOKE_BASE_URL;

if (!base) {
  throw new Error('SMOKE_BASE_URL missing');
}

async function expectSuccess(res, label) {
  let payload;
  try {
    payload = await res.json();
  } catch {
    throw new Error(`${label}: failed to parse JSON response`);
  }

  if (!res.ok || !payload || payload.success !== true) {
    const message = payload && typeof payload.error === 'string' ? payload.error : `HTTP ${res.status}`;
    throw new Error(`${label}: ${message}`);
  }

  return payload.data;
}

const listData = await expectSuccess(await fetch(`${base}/api/admin/pages`), 'list pages');
if (!Array.isArray(listData) || listData.length === 0) {
  throw new Error('list pages: expected non-empty array');
}

const originHeaders = {
  'Content-Type': 'application/json',
  Origin: base,
};

const createData = await expectSuccess(
  await fetch(`${base}/api/admin/pages`, {
    method: 'POST',
    headers: originHeaders,
    body: JSON.stringify({
      title: 'Smoke Test Page',
      slug: 'smoke-test-page',
    }),
  }),
  'create page'
);

if (!createData || createData.slug !== 'smoke-test-page') {
  throw new Error('create page: unexpected response payload');
}

const updateBody = {
  ...createData,
  title: 'Smoke Test Page Updated',
};

const updateData = await expectSuccess(
  await fetch(`${base}/api/admin/pages/smoke-test-page`, {
    method: 'PUT',
    headers: originHeaders,
    body: JSON.stringify(updateBody),
  }),
  'update page'
);

if (!updateData || updateData.title !== 'Smoke Test Page Updated') {
  throw new Error('update page: title did not persist');
}

await expectSuccess(
  await fetch(`${base}/api/admin/pages/smoke-test-page`, {
    method: 'DELETE',
    headers: {
      Origin: base,
    },
  }),
  'delete page'
);

console.log('✓ admin content CRUD smoke checks passed');
NODE

popd >/dev/null

echo "✓ create CLI smoke test passed"
