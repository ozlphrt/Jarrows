/**
 * Badge evaluation + persistence (privacy-first, local only).
 *
 * Badges come in two types:
 * - community: requires community comparison / percentiles
 * - local: can be awarded offline without community stats
 */

const BADGE_STORAGE_KEY = 'jarrows_badges_v1';

/**
 * @typedef {Object} Badge
 * @property {string} id
 * @property {string} label
 * @property {'community'|'local'} kind
 * @property {string} description
 * @property {number} priority - higher shows first
 */

/** @type {Badge[]} */
export const BADGES = [
    {
        id: 'perfect_run',
        label: 'Perfect Run',
        kind: 'community',
        description: 'Top 25% on time and moves (and solid spins).',
        priority: 100,
    },
    {
        id: 'speed_demon',
        label: 'Speed Demon',
        kind: 'community',
        description: 'Top 25% time for this level.',
        priority: 80,
    },
    {
        id: 'precision_master',
        label: 'Precision Master',
        kind: 'community',
        description: 'Top 25% moves for this level.',
        priority: 80,
    },
    {
        id: 'spin_saver',
        label: 'Spin Saver',
        kind: 'community',
        description: 'Top 25% spins usage for this level.',
        priority: 70,
    },
    {
        id: 'no_spins',
        label: 'No Spins',
        kind: 'local',
        description: 'Cleared the level without using spins.',
        priority: 60,
    },
    {
        id: 'no_spills',
        label: 'Clean Finish',
        kind: 'local',
        description: 'Cleared the level with very low move count.',
        priority: 40,
    },
];

function safeNum(n) {
    return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

/**
 * Decide which badges were earned.
 *
 * Inputs expect the shape produced by `getLevelComparison(...)`:
 * - comparison.time.percentile etc.
 */
export function evaluateBadges({ userStats, comparison }) {
    const earned = [];

    // Local (offline-safe) badges
    if (userStats.spins === 0) earned.push('no_spins');
    if (userStats.moves <= 3) earned.push('no_spills'); // early levels can be tiny

    if (!comparison?.available) {
        return {
            earned,
            pendingCommunity: true,
        };
    }

    const tp = safeNum(comparison?.time?.percentile);
    const mp = safeNum(comparison?.moves?.percentile);
    const sp = safeNum(comparison?.spins?.percentile);

    if (tp !== null && tp >= 75) earned.push('speed_demon');
    if (mp !== null && mp >= 75) earned.push('precision_master');
    if (sp !== null && sp >= 75) earned.push('spin_saver');

    // Perfect run: strong time + moves; spins is optional (if we have it)
    const spinsOk = sp === null ? true : sp >= 50;
    if (tp !== null && mp !== null && tp >= 75 && mp >= 75 && spinsOk) earned.push('perfect_run');

    // Sort by priority (stable)
    earned.sort((a, b) => (getBadgePriority(b) - getBadgePriority(a)) || a.localeCompare(b));

    return {
        earned,
        pendingCommunity: false,
    };
}

export function getBadgeMeta(id) {
    return BADGES.find((b) => b.id === id) || null;
}

function getBadgePriority(id) {
    return getBadgeMeta(id)?.priority ?? 0;
}

/**
 * Persist earned badges locally (no user identity).
 */
export function persistBadges({ level, badgeIds }) {
    try {
        const raw = localStorage.getItem(BADGE_STORAGE_KEY);
        const state = raw ? JSON.parse(raw) : {};

        const now = Date.now();
        const levelKey = `level_${level}`;
        const existingLevel = Array.isArray(state[levelKey]) ? state[levelKey] : [];

        // De-dupe per level
        const nextLevel = Array.from(new Set([...existingLevel, ...badgeIds]));
        state[levelKey] = nextLevel;

        // Track global counts
        if (!state.counts || typeof state.counts !== 'object') state.counts = {};
        for (const id of badgeIds) {
            state.counts[id] = (state.counts[id] || 0) + 1;
        }

        state.lastUpdated = now;
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // best-effort
    }
}

export function getBadgesForLevel(level) {
    try {
        const raw = localStorage.getItem(BADGE_STORAGE_KEY);
        if (!raw) return [];
        const state = JSON.parse(raw);
        const levelKey = `level_${level}`;
        return Array.isArray(state[levelKey]) ? state[levelKey] : [];
    } catch {
        return [];
    }
}


