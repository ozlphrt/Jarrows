/**
 * API Communication for Stats
 * Handles submission and fetching of community stats
 */

// API base URL - will be configured based on backend choice
// For now, using a placeholder that can be easily changed
const API_BASE_URL = import.meta.env.VITE_STATS_API_URL || 'https://api.jarrows.stats/v1';
// Default to local mode since API server is not yet deployed
const STATS_MODE = (import.meta.env.VITE_STATS_MODE || 'local').toLowerCase(); // 'remote' | 'local'

export function isLocalOnlyMode() {
    return STATS_MODE === 'local';
}

/**
 * Check if online
 */
export function isOnline() {
    // Strict local-only mode: never attempt network calls, regardless of actual connectivity.
    if (isLocalOnlyMode()) return false;
    return navigator.onLine;
}

/**
 * Submit stats for a completed level
 */
export async function submitStats(stats) {
    if (isLocalOnlyMode()) {
        throw new Error('Local-only mode: network submission disabled');
    }
    if (!isOnline()) {
        throw new Error('Offline - stats will be queued');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                level: stats.level,
                time: stats.time,
                moves: stats.moves,
                spins: stats.spins,
                blocksRemoved: stats.blocksRemoved,
                // NO user ID, IP, or fingerprint
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to submit stats:', error);
        throw error;
    }
}

/**
 * Get aggregated stats for a specific level
 */
export async function getLevelStats(level) {
    if (isLocalOnlyMode()) {
        // No community stats in local-only mode.
        return null;
    }
    if (!isOnline()) {
        throw new Error('Offline - will use cached stats');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/stats/${level}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                // Level has no stats yet (first player)
                return null;
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const stats = await response.json();
        return stats;
    } catch (error) {
        console.error('Failed to fetch level stats:', error);
        throw error;
    }
}

/**
 * Get stats for all levels (for preloading)
 */
export async function getAllLevelStats() {
    if (isLocalOnlyMode()) {
        // No community stats in local-only mode.
        return [];
    }
    if (!isOnline()) {
        throw new Error('Offline - will use cached stats');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/stats/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const stats = await response.json();
        return stats;
    } catch (error) {
        console.error('Failed to fetch all level stats:', error);
        throw error;
    }
}

/**
 * Retry submission with exponential backoff
 */
export async function retrySubmission(submission, maxRetries = 3) {
    let retryCount = submission.retryCount || 0;

    if (retryCount >= maxRetries) {
        console.warn('Max retries reached for submission:', submission);
        return false;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
        await submitStats(submission);
        return true;
    } catch (error) {
        console.warn(`Retry ${retryCount + 1} failed:`, error);
        submission.retryCount = retryCount + 1;
        return false;
    }
}

