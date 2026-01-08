/**
 * Streak tracking (privacy-first, local-only).
 *
 * Tracks consecutive level clears where the player beat community median for:
 * - speed (time)
 * - moves
 * - perfect (both speed+moves, optionally spins)
 *
 * Offline-safe rule:
 * - If community comparison isn't available, we DO NOT advance or break streaks.
 */

const STREAK_STORAGE_KEY = 'jarrows_streaks_v1';

function defaultState() {
    return {
        lastLevel: null,
        speed: { current: 0, best: 0 },
        moves: { current: 0, best: 0 },
        perfect: { current: 0, best: 0 },
        updatedAt: Date.now(),
    };
}

export function loadStreakState() {
    try {
        const raw = localStorage.getItem(STREAK_STORAGE_KEY);
        if (!raw) return defaultState();
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return defaultState();
        return {
            ...defaultState(),
            ...parsed,
            speed: { ...defaultState().speed, ...(parsed.speed || {}) },
            moves: { ...defaultState().moves, ...(parsed.moves || {}) },
            perfect: { ...defaultState().perfect, ...(parsed.perfect || {}) },
        };
    } catch {
        return defaultState();
    }
}

function saveStreakState(state) {
    try {
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // best-effort
    }
}

function bumpBucket(bucket, shouldContinue, isNextLevel) {
    if (!isNextLevel) {
        bucket.current = shouldContinue ? 1 : 0;
    } else {
        bucket.current = shouldContinue ? bucket.current + 1 : 0;
    }
    bucket.best = Math.max(bucket.best, bucket.current);
}

/**
 * Update streaks based on a completed level + its comparison.
 *
 * Rules:
 * - Only update when `comparisonAvailable === true`
 * - Ignore repeats/rewinds: if level <= lastLevel, do nothing
 * - If level isn't consecutive (lastLevel+1), streak resets to 1/0 depending on condition
 */
export function updateStreaksOnLevelComplete({
    level,
    comparisonAvailable,
    beatMedianTime,
    beatMedianMoves,
    perfectRun,
}) {
    const state = loadStreakState();

    if (!comparisonAvailable) {
        return state;
    }

    if (!Number.isInteger(level) || level < 0) {
        return state;
    }

    if (state.lastLevel !== null && level <= state.lastLevel) {
        return state;
    }

    const isNextLevel = state.lastLevel === null ? true : level === state.lastLevel + 1;

    bumpBucket(state.speed, !!beatMedianTime, isNextLevel);
    bumpBucket(state.moves, !!beatMedianMoves, isNextLevel);
    bumpBucket(state.perfect, !!perfectRun, isNextLevel);

    state.lastLevel = level;
    state.updatedAt = Date.now();

    saveStreakState(state);
    return state;
}

/**
 * Compact display in the stats bar.
 */
export function formatStreakShort(state) {
    const s = state?.speed?.current ?? 0;
    const m = state?.moves?.current ?? 0;
    const p = state?.perfect?.current ?? 0;
    return `S${s} M${m} P${p}`;
}



