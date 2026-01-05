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
        blocksRemoved: currentLevelStats.blocksRemoved
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
            timestamp: Date.now()
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

/**
 * Get comparison data for completed level
 */
export async function getLevelComparison(userStats) {
    const communityStats = await loadCommunityStats(userStats.level);

    if (!communityStats) {
        const badgeEval = evaluateBadges({ userStats, comparison: { available: false } });
        if (badgeEval.earned.length) {
            persistBadges({ level: userStats.level, badgeIds: badgeEval.earned });
        }
        // Offline-safe rule: do not update streaks when community comparison isn't available.
        return {
            available: false,
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

