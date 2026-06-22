import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Dependency-free, Node-20-safe pageview store. The framework has no database
// by design, so this is an in-memory ring buffer of recent events plus a
// best-effort JSON snapshot. Mission-control polls /api/analytics and is the
// durable system of record — this only has to hold events between polls.
//
// Durability: if ANALYTICS_DATA_PATH points at a mounted volume, the snapshot
// (including bootId + lastId) survives restarts and the poller continues
// seamlessly. Without a volume each boot gets a fresh bootId and the poller
// re-syncs from zero (losing at most one poll interval of un-pulled events).

export type TrackEvent = {
  id: number;
  ts: number;
  path: string;
  ref: string | null;
  referrerHost: string | null;
  visitor: string | null;
};

type StoreState = { bootId: string; lastId: number; events: TrackEvent[] };

const MAX_EVENTS = 10_000;
const SNAPSHOT_DEBOUNCE_MS = 5_000;
const DATA_PATH = process.env.ANALYTICS_DATA_PATH || null;

declare global {
  // survive Next dev-mode HMR re-imports
  var __fwAnalytics: StoreState | undefined;
  var __fwAnalyticsTimer: ReturnType<typeof setTimeout> | null | undefined;
}

function load(): StoreState {
  if (globalThis.__fwAnalytics) return globalThis.__fwAnalytics;
  let state: StoreState | null = null;
  if (DATA_PATH) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as StoreState;
      if (parsed && typeof parsed.bootId === 'string' && Array.isArray(parsed.events)) {
        state = {
          bootId: parsed.bootId,
          lastId: typeof parsed.lastId === 'number' ? parsed.lastId : 0,
          events: parsed.events.slice(-MAX_EVENTS),
        };
      }
    } catch {
      // no snapshot or unreadable — start fresh
    }
  }
  if (!state) state = { bootId: crypto.randomUUID(), lastId: 0, events: [] };
  globalThis.__fwAnalytics = state;
  return state;
}

function scheduleSnapshot(): void {
  if (!DATA_PATH || globalThis.__fwAnalyticsTimer) return;
  const timer = setTimeout(() => {
    globalThis.__fwAnalyticsTimer = null;
    const state = globalThis.__fwAnalytics;
    if (!state || !DATA_PATH) return;
    try {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      const tmp = `${DATA_PATH}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(state));
      fs.renameSync(tmp, DATA_PATH);
    } catch {
      // best-effort; mission-control is the durable store
    }
  }, SNAPSHOT_DEBOUNCE_MS);
  timer.unref?.();
  globalThis.__fwAnalyticsTimer = timer;
}

export function recordEvent(input: {
  path: string;
  ref: string | null;
  referrerHost: string | null;
  visitor: string | null;
  ts?: number;
}): void {
  const state = load();
  state.events.push({
    id: ++state.lastId,
    ts: input.ts ?? Date.now(),
    path: input.path,
    ref: input.ref,
    referrerHost: input.referrerHost,
    visitor: input.visitor,
  });
  if (state.events.length > MAX_EVENTS) {
    state.events.splice(0, state.events.length - MAX_EVENTS);
  }
  scheduleSnapshot();
}

export function readSince(
  sinceId: number,
  limit = 5_000
): { bootId: string; maxId: number; events: TrackEvent[] } {
  const state = load();
  const events = state.events.filter((e) => e.id > sinceId).slice(0, limit);
  return { bootId: state.bootId, maxId: state.lastId, events };
}
