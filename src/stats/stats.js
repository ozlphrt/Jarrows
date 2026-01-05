/**
 * Main Stats Tracking Module
 * Tracks player stats and integrates with game systems
 */

import { queueSubmission, getPendingSubmissions, removeSubmission, clearPendingSubmissions, cacheLevelStats, getCachedLevelStats, initStatsDB } from './statsOffline.js';
import { submitStats, getLevelStats, isOnline, retrySubmission, isLocalOnlyMode } from './statsAPI.js';
import {
    calculateTimePercentile,
    calculateMovesPercentile,
    calculateSpinsPercentile,
    calculateMovesPerBlockPercentile,
    calculateTimePerMovePercentile,
    calculateBlocksPerSpinPercentile,
    getComparison,
    getOverallRating,
    formatPercentile
} from './statsComparison.js';
import { evaluateBadges, persistBadges } from './badges.js';
import { updateStreaksOnLevelComplete } from './streaks.js';

// Current level stats being tracked
let currentLevelStats = {
    level: 0,
    startTime: null,
    moves: 0,
    spins: 0,
    blocksRemoved: 0,
    initialSpins: 3
};

// Community stats cache (in-memory)
let communityStatsCache = {};

// Initialization flag
let initialized = false;

/**
 * Initialize stats tracking system
 */
export async function initStats() {
    if (initialized) {
        console.warn('Stats system already initialized');
        return;
    }

    try {
        // Initialize IndexedDB
        await initStatsDB();

        // Strict local-only mode: never attach online listeners or attempt sync.
        if (!isLocalOnlyMode()) {
            // Set up online/offline event listeners
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            // Sync pending submissions if online
            if (isOnline()) {
                await syncPendingSubmissions();
            }
        }

        initialized = true;
        console.log('Stats system initialized');
    } catch (error) {
        console.error('Failed to initialize stats system:', error);
        // Continue anyway - stats will work in degraded mode
        initialized = true;
    }
}

/**
 * Start tracking stats for a new level
 */
export function startLevelStats(level) {
    currentLevelStats = {
        level,
        startTime: performance.now() / 1000, // Convert to seconds
        moves: 0,
        spins: 3, // Starting spins
        blocksRemoved: 0,
        initialSpins: 3
    };

    // Preload community stats for this level
    loadCommunityStats(level).catch(err => {
        console.warn('Failed to preload community stats:', err);
    });
}

/**
 * Track a move
 */
export function trackMove() {
    currentLevelStats.moves++;
}

/**
 * Track a spin (when spin button is used)
 */
export function trackSpin() {
    if (currentLevelStats.spins > 0) {
        currentLevelStats.spins--;
    }
}

/**
 * Track a block removal
 */
export function trackBlockRemoved() {
    currentLevelStats.blocksRemoved++;
}

/**
 * Get current level stats
 */
export function getCurrentStats() {
    return { ...currentLevelStats };
}

/**
 * Complete level and submit stats
 */
export async function completeLevel(finalTime) {
    const stats = {
        level: currentLevelStats.level,
        time: finalTime || getElapsedTime(),
        moves: currentLevelStats.moves,
        spins: currentLevelStats.initialSpins - currentLevelStats.spins, // Spins used
        blocksRemoved: currentLevelStats.blocksRemoved,
        timestamp: Date.now(),
    };

    // Store locally
    storeLocalStats(stats);

    // Try to submit (will queue if offline)
    try {
        if (isOnline()) {
            await submitStats(stats);
            console.log('Stats submitted successfully:', stats);
        } else {
            await queueSubmission(stats);
            console.log('Stats queued for later submission:', stats);
        }
    } catch (error) {
        // Queue for later if submission fails
        await queueSubmission(stats);
        console.warn('Failed to submit stats, queued for later:', error);
    }

    // Return stats for UI display
    return stats;
}

/**
 * Get elapsed time for current level
 */
export function getElapsedTime() {
    if (!currentLevelStats.startTime) {
        return 0;
    }
    return (performance.now() / 1000) - currentLevelStats.startTime;
}

/**
 * Store stats locally (localStorage)
 */
function storeLocalStats(stats) {
    try {
        const key = `jarrows_level_${stats.level}_stats`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Add new completion
        existing.push({
            ...stats,
            // Keep provided timestamp if present; fall back for older callers.
            timestamp: typeof stats.timestamp === 'number' ? stats.timestamp : Date.now(),
        });

        // Keep only last 10 completions per level
        if (existing.length > 10) {
            existing.shift();
        }

        localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
        console.error('Failed to store local stats:', error);
    }
}

/**
 * Get local stats for a level
 */
export function getLocalStats(level) {
    try {
        const key = `jarrows_level_${level}_stats`;
        const stats = JSON.parse(localStorage.getItem(key) || '[]');
        return stats;
    } catch (error) {
        console.error('Failed to get local stats:', error);
        return [];
    }
}

/**
 * Load community stats for a level
 */
export async function loadCommunityStats(level) {
    // Check cache first
    if (communityStatsCache[level]) {
        return communityStatsCache[level];
    }

    // Check IndexedDB cache
    const cached = await getCachedLevelStats(level);
    if (cached) {
        communityStatsCache[level] = cached;
        return cached;
    }

    // Fetch from API if online
    if (isOnline()) {
        try {
            const stats = await getLevelStats(level);
            // Treat empty / not-yet-populated stats as unavailable.
            // (Mock backend returns { totalAttempts: 0 } instead of 404 to reduce console noise.)
            if (stats && typeof stats.totalAttempts === 'number' && stats.totalAttempts > 0) {
                // Cache it
                await cacheLevelStats(level, stats);
                communityStatsCache[level] = stats;
                return stats;
            }
            return null;
        } catch (error) {
            console.warn('Failed to fetch community stats:', error);
            return null;
        }
    }

    return null;
}

function quantile(sortedAsc, q) {
    if (!sortedAsc.length) return null;
    if (sortedAsc.length === 1) return sortedAsc[0];
    const pos = (sortedAsc.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    const a = sortedAsc[base];
    const b = sortedAsc[Math.min(base + 1, sortedAsc.length - 1)];
    return a + (b - a) * rest;
}

function median(sortedAsc) {
    return quantile(sortedAsc, 0.5);
}

function computePersonalAggregates(level, runs) {
    const times = runs.map((s) => s.time).filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
    const moves = runs.map((s) => s.moves).filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
    const spins = runs.map((s) => s.spins).filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
    const blocksRemoved = runs.map((s) => s.blocksRemoved).filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);

    const movesPerBlockArr = runs
        .map((s) => (s.blocksRemoved > 0 ? s.moves / s.blocksRemoved : s.moves))
        .filter((x) => typeof x === 'number' && Number.isFinite(x))
        .sort((a, b) => a - b);
    const timePerMoveArr = runs
        .map((s) => (s.moves > 0 ? s.time / s.moves : s.time))
        .filter((x) => typeof x === 'number' && Number.isFinite(x))
        .sort((a, b) => a - b);
    const blocksPerSpinArr = runs
        .map((s) => (s.spins > 0 ? s.blocksRemoved / s.spins : s.blocksRemoved))
        .filter((x) => typeof x === 'number' && Number.isFinite(x))
        .sort((a, b) => a - b);

    const avgMovesPerBlock = movesPerBlockArr.reduce((acc, v) => acc + v, 0) / (movesPerBlockArr.length || 1);
    const avgTimePerMove = timePerMoveArr.reduce((acc, v) => acc + v, 0) / (timePerMoveArr.length || 1);
    const avgBlocksPerSpin = blocksPerSpinArr.reduce((acc, v) => acc + v, 0) / (blocksPerSpinArr.length || 1);

    return {
        level,
        medianTime: median(times),
        medianMoves: median(moves),
        medianSpins: median(spins),
        medianBlocksRemoved: median(blocksRemoved),
        p25Time: quantile(times, 0.25),
        p75Time: quantile(times, 0.75),
        p25Moves: quantile(moves, 0.25),
        p75Moves: quantile(moves, 0.75),
        completionRate: 1,
        totalAttempts: runs.length,
        lastUpdated: Date.now(),
        avgMovesPerBlock,
        avgTimePerMove,
        avgBlocksPerSpin,
        medianMovesPerBlock: median(movesPerBlockArr),
        p25MovesPerBlock: quantile(movesPerBlockArr, 0.25),
        p75MovesPerBlock: quantile(movesPerBlockArr, 0.75),
        medianTimePerMove: median(timePerMoveArr),
        p25TimePerMove: quantile(timePerMoveArr, 0.25),
        p75TimePerMove: quantile(timePerMoveArr, 0.75),
        medianBlocksPerSpin: median(blocksPerSpinArr),
        p25BlocksPerSpin: quantile(blocksPerSpinArr, 0.25),
        p75BlocksPerSpin: quantile(blocksPerSpinArr, 0.75),
    };
}

function getAllLocalRuns() {
    const runs = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith('jarrows_level_') || !k.endsWith('_stats')) continue;
            const raw = localStorage.getItem(k);
            const arr = raw ? JSON.parse(raw) : [];
            if (Array.isArray(arr)) runs.push(...arr);
        }
    } catch {
        // best-effort
    }
    return runs;
}

function computeGlobalNormalizedBaseline(userStats) {
    const all = getAllLocalRuns();
    const baseline = Array.isArray(all)
        ? all.filter((r) => (typeof r?.timestamp === 'number' ? r.timestamp !== userStats.timestamp : true))
        : [];

    if (!baseline.length) return null;

    const baselineStats = computePersonalAggregates(-1, baseline);

    const movesPerBlock = userStats.blocksRemoved > 0 ? userStats.moves / userStats.blocksRemoved : userStats.moves;
    const timePerMove = userStats.moves > 0 ? userStats.time / userStats.moves : userStats.time;
    const blocksPerSpin = userStats.spins > 0 ? userStats.blocksRemoved / userStats.spins : userStats.blocksRemoved;

    const movesPerBlockComparison = getComparison(
        movesPerBlock,
        baselineStats.medianMovesPerBlock ?? baselineStats.avgMovesPerBlock,
        true,
    );
    movesPerBlockComparison.percentile = calculateMovesPerBlockPercentile(movesPerBlock, baselineStats);

    const timePerMoveComparison = getComparison(
        timePerMove,
        baselineStats.medianTimePerMove ?? baselineStats.avgTimePerMove,
        true,
    );
    timePerMoveComparison.percentile = calculateTimePerMovePercentile(timePerMove, baselineStats);

    const blocksPerSpinComparison = getComparison(
        blocksPerSpin,
        baselineStats.medianBlocksPerSpin ?? baselineStats.avgBlocksPerSpin,
        false,
    );
    blocksPerSpinComparison.percentile = calculateBlocksPerSpinPercentile(blocksPerSpin, baselineStats);

    return {
        available: true,
        sampleSize: baseline.length,
        baselineStats,
        efficiency: {
            movesPerBlock: { value: movesPerBlock, comparison: movesPerBlockComparison },
            timePerMove: { value: timePerMove, comparison: timePerMoveComparison },
            blocksPerSpin: { value: blocksPerSpin, comparison: blocksPerSpinComparison },
        },
    };
}

/**
 * Get comparison data for completed level
 */
export async function getLevelComparison(userStats) {
    const communityStats = await loadCommunityStats(userStats.level);
    const globalNormalized = computeGlobalNormalizedBaseline(userStats);

    if (!communityStats) {
        // Strict local-only / offline: fall back to personal comparison using local history.
        const history = getLocalStats(userStats.level);
        const baseline = Array.isArray(history)
            ? history.filter((r) => typeof r?.timestamp === 'number' ? r.timestamp !== userStats.timestamp : true)
            : [];

        if (baseline.length) {
            const personalStats = computePersonalAggregates(userStats.level, baseline);

            const timeComparison = getComparison(userStats.time, personalStats.medianTime, true);
            timeComparison.percentile = calculateTimePercentile(userStats.time, personalStats);

            const movesComparison = getComparison(userStats.moves, personalStats.medianMoves, true);
            movesComparison.percentile = calculateMovesPercentile(userStats.moves, personalStats);

            const spinsComparison = getComparison(userStats.spins, personalStats.medianSpins, true);
            spinsComparison.percentile = calculateSpinsPercentile(userStats.spins, personalStats);

            const movesPerBlock = userStats.blocksRemoved > 0 ? userStats.moves / userStats.blocksRemoved : userStats.moves;
            const timePerMove = userStats.moves > 0 ? userStats.time / userStats.moves : userStats.time;
            const blocksPerSpin = userStats.spins > 0 ? userStats.blocksRemoved / userStats.spins : userStats.blocksRemoved;

            const movesPerBlockComparison = getComparison(movesPerBlock, personalStats.medianMovesPerBlock ?? personalStats.avgMovesPerBlock, true);
            movesPerBlockComparison.percentile = calculateMovesPerBlockPercentile(movesPerBlock, personalStats);

            const timePerMoveComparison = getComparison(timePerMove, personalStats.medianTimePerMove ?? personalStats.avgTimePerMove, true);
            timePerMoveComparison.percentile = calculateTimePerMovePercentile(timePerMove, personalStats);

            const blocksPerSpinComparison = getComparison(blocksPerSpin, personalStats.medianBlocksPerSpin ?? personalStats.avgBlocksPerSpin, false);
            blocksPerSpinComparison.percentile = calculateBlocksPerSpinPercentile(blocksPerSpin, personalStats);

            const overall = getOverallRating(userStats, personalStats);

            const badgeEval = evaluateBadges({
                userStats,
                comparison: {
                    available: true,
                    source: 'personal',
                    time: timeComparison,
                    moves: movesComparison,
                    spins: spinsComparison,
                    overall,
                },
            });
            if (badgeEval.earned.length) {
                persistBadges({ level: userStats.level, badgeIds: badgeEval.earned });
            }

            return {
                available: true,
                source: 'personal',
                sampleSize: baseline.length,
                globalNormalized,
                time: timeComparison,
                moves: movesComparison,
                spins: spinsComparison,
                efficiency: {
                    movesPerBlock: { value: movesPerBlock, comparison: movesPerBlockComparison },
                    timePerMove: { value: timePerMove, comparison: timePerMoveComparison },
                    blocksPerSpin: { value: blocksPerSpin, comparison: blocksPerSpinComparison },
                },
                overall,
                communityStats: personalStats, // UI expects this shape
                badges: badgeEval.earned,
                badgesPending: true,
            };
        }

        const badgeEval = evaluateBadges({ userStats, comparison: { available: false, source: 'none' } });
        if (badgeEval.earned.length) {
            persistBadges({ level: userStats.level, badgeIds: badgeEval.earned });
        }
        // Offline-safe rule: do not update streaks when community comparison isn't available.
        return {
            available: false,
            source: 'none',
            reason: 'no_level_baseline',
            globalNormalized,
            time: null,
            moves: null,
            spins: null,
            overall: null,
            badges: badgeEval.earned,
            badgesPending: true,
        };
    }

    const timeComparison = getComparison(
        userStats.time,
        communityStats.medianTime,
        true // lower is better
    );
    timeComparison.percentile = calculateTimePercentile(userStats.time, communityStats);

    const movesComparison = getComparison(
        userStats.moves,
        communityStats.medianMoves,
        true // lower is better
    );
    movesComparison.percentile = calculateMovesPercentile(userStats.moves, communityStats);

    const spinsComparison = getComparison(
        userStats.spins,
        communityStats.medianSpins,
        true // lower is better
    );
    spinsComparison.percentile = calculateSpinsPercentile(userStats.spins, communityStats);

    // Efficiency metrics (derived)
    const movesPerBlock = userStats.blocksRemoved > 0 ? userStats.moves / userStats.blocksRemoved : userStats.moves;
    const timePerMove = userStats.moves > 0 ? userStats.time / userStats.moves : userStats.time;
    const blocksPerSpin = userStats.spins > 0 ? userStats.blocksRemoved / userStats.spins : userStats.blocksRemoved;

    const movesPerBlockComparison = getComparison(
        movesPerBlock,
        communityStats.medianMovesPerBlock ?? communityStats.avgMovesPerBlock,
        true // lower is better
    );
    movesPerBlockComparison.percentile = calculateMovesPerBlockPercentile(movesPerBlock, communityStats);

    const timePerMoveComparison = getComparison(
        timePerMove,
        communityStats.medianTimePerMove ?? communityStats.avgTimePerMove,
        true // lower is better
    );
    timePerMoveComparison.percentile = calculateTimePerMovePercentile(timePerMove, communityStats);

    const blocksPerSpinComparison = getComparison(
        blocksPerSpin,
        communityStats.medianBlocksPerSpin ?? communityStats.avgBlocksPerSpin,
        false // higher is better
    );
    blocksPerSpinComparison.percentile = calculateBlocksPerSpinPercentile(blocksPerSpin, communityStats);

    const overall = getOverallRating(userStats, communityStats);

    const badgeEval = evaluateBadges({
        userStats,
        comparison: {
            available: true,
            source: 'community',
            time: timeComparison,
            moves: movesComparison,
            spins: spinsComparison,
            overall,
        },
    });
    if (badgeEval.earned.length) {
        persistBadges({ level: userStats.level, badgeIds: badgeEval.earned });
    }

    // Streaks: only update when we have community comparison.
    // Define "beat median" as strictly better than median (not equal).
    updateStreaksOnLevelComplete({
        level: userStats.level,
        comparisonAvailable: true,
        beatMedianTime: !!timeComparison?.better,
        beatMedianMoves: !!movesComparison?.better,
        perfectRun: badgeEval.earned.includes('perfect_run') || (!!timeComparison?.better && !!movesComparison?.better),
    });

    return {
        available: true,
        source: 'community',
        globalNormalized,
        time: timeComparison,
        moves: movesComparison,
        spins: spinsComparison,
        efficiency: {
            movesPerBlock: { value: movesPerBlock, comparison: movesPerBlockComparison },
            timePerMove: { value: timePerMove, comparison: timePerMoveComparison },
            blocksPerSpin: { value: blocksPerSpin, comparison: blocksPerSpinComparison },
        },
        overall,
        communityStats,
        badges: badgeEval.earned,
        badgesPending: badgeEval.pendingCommunity,
    };
}

/**
 * Sync pending submissions when coming online
 */
async function syncPendingSubmissions() {
    try {
        const pending = await getPendingSubmissions();
        
        if (pending.length === 0) {
            return;
        }

        console.log(`Syncing ${pending.length} pending submissions...`);

        const successful = [];
        
        for (const submission of pending) {
            try {
                // Remove the ID and retryCount before submitting
                const { id, retryCount, timestamp, ...stats } = submission;
                
                await submitStats(stats);
                successful.push(submission.id || submission);
                console.log('Synced submission:', stats);
            } catch (error) {
                console.warn('Failed to sync submission:', error);
                // Will retry next time
            }
        }

        // Remove successful submissions
        for (const id of successful) {
            if (typeof id === 'number') {
                await removeSubmission(id);
            }
        }

        // Also clear localStorage fallback queue
        try {
            localStorage.removeItem('jarrows_stats_queue');
        } catch (e) {
            // Ignore
        }

        console.log(`Synced ${successful.length} of ${pending.length} submissions`);
    } catch (error) {
        console.error('Error syncing pending submissions:', error);
    }
}

/**
 * Handle coming online
 */
async function handleOnline() {
    if (isLocalOnlyMode()) return;
    console.log('Online - syncing pending submissions...');
    await syncPendingSubmissions();
    
    // Refresh community stats cache
    // (will happen naturally when levels are loaded)
}

/**
 * Handle going offline
 */
function handleOffline() {
    if (isLocalOnlyMode()) return;
    console.log('Offline - stats will be queued');
}

/**
 * Export comparison functions for use in UI
 */
export {
    calculateTimePercentile,
    calculateMovesPercentile,
    calculateSpinsPercentile,
    getComparison,
    getOverallRating,
    formatPercentile
};

