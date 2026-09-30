// Ordered from best to cheapest. Frame rate goes first, resolution last, and never below 0.85
// so thin lines stay sharp instead of turning soft.
const LEVELS = [
  { fps: 60, scale: 1, detail: 1 },
  { fps: 30, scale: 1, detail: 1 },
  { fps: 30, scale: 1, detail: 0.65 },
  { fps: 30, scale: 0.85, detail: 0.65 },
  { fps: 30, scale: 0.85, detail: 0.4 },
];

const TIERS = {
  high: { tier: 'high', dprCap: 1.5, startLevel: 0 },
  mid: { tier: 'mid', dprCap: 1.25, startLevel: 1 },
  low: { tier: 'low', dprCap: 1, startLevel: 2 },
};

export function detectQuality() {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (cores <= 4 || memory <= 2) return TIERS.low;
  if (coarse || cores <= 6 || memory <= 4) return TIERS.mid;
  return TIERS.high;
}

const WINDOW_TICKS = 45;
const WARMUP_TICKS = 40;
const SLOW_MS = 21;
const FAST_MS = 17.4;
const STABLE_WINDOWS_TO_RAISE = 4;
const RETRY_AFTER_MS = 20000;
const MAX_RETRY_AFTER_MS = 160000;

// Watches raw frame deltas; two slow windows in a row step down, a long stable run steps back up.
// A level that failed is not retried right away: it waits out a cooldown that doubles each time it fails
// again, so a one-off hiccup (tab switch, page load) never costs quality forever and quality never oscillates.
export function createQualityController(startLevel) {
  let level = startLevel;
  const cooldown = new Map();
  let clock = 0;
  let ticks = 0;
  let total = 0;
  let count = 0;
  let slowStreak = 0;
  let stableStreak = 0;

  return {
    get level() {
      return LEVELS[level];
    },
    // Returns true when the level changed.
    sample(frameMs) {
      clock += frameMs;
      ticks += 1;
      if (ticks <= WARMUP_TICKS) return false;

      total += frameMs;
      count += 1;
      if (count < WINDOW_TICKS) return false;

      const average = total / count;
      total = 0;
      count = 0;

      if (average > SLOW_MS) {
        stableStreak = 0;
        slowStreak += 1;
        if (slowStreak < 2 || level >= LEVELS.length - 1) return false;
        const previous = cooldown.get(level);
        const wait = previous ? Math.min(previous.wait * 2, MAX_RETRY_AFTER_MS) : RETRY_AFTER_MS;
        cooldown.set(level, { until: clock + wait, wait });
        level += 1;
        slowStreak = 0;
        return true;
      }

      slowStreak = 0;
      stableStreak = average <= FAST_MS ? stableStreak + 1 : 0;
      if (stableStreak < STABLE_WINDOWS_TO_RAISE || level === 0) return false;
      const blocked = cooldown.get(level - 1);
      if (blocked && clock < blocked.until) return false;
      level -= 1;
      stableStreak = 0;
      return true;
    },
    // Frames measured while the canvas is not on screen (splash, hidden tab) must not count.
    reset() {
      ticks = 0;
      total = 0;
      count = 0;
      slowStreak = 0;
      stableStreak = 0;
    },
  };
}
