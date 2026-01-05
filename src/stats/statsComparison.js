/**
 * Comparison Calculations
 * Calculates percentiles and comparisons between user stats and community stats
 */

/**
 * Calculate percentile (0-100) where user value sits in distribution
 * @param {number} userValue - User's value
 * @param {number} p25 - 25th percentile
 * @param {number} median - 50th percentile (median)
 * @param {number} p75 - 75th percentile
 * @returns {number} Percentile (0-100)
 */
export function calculatePercentile(userValue, p25, median, p75) {
    if (userValue <= p25) {
        // Below 25th percentile - estimate position between 0-25
        // Assume linear distribution from 0 to p25
        return Math.max(0, Math.min(25, (userValue / p25) * 25));
    } else if (userValue <= median) {
        // Between 25th and median - estimate position between 25-50
        const range = median - p25;
        const position = ((userValue - p25) / range) * 25;
        return 25 + position;
    } else if (userValue <= p75) {
        // Between median and 75th - estimate position between 50-75
        const range = p75 - median;
        const position = ((userValue - median) / range) * 25;
        return 50 + position;
    } else {
        // Above 75th percentile - estimate position between 75-100
        // Assume linear distribution from p75 to some max (estimate 2x p75)
        const estimatedMax = p75 * 2;
        const range = estimatedMax - p75;
        if (range <= 0) return 100;
        const position = ((userValue - p75) / range) * 25;
        return Math.min(100, 75 + position);
    }
}

/**
 * Calculate percentile for time (lower is better)
 */
export function calculateTimePercentile(userTime, communityStats) {
    if (!communityStats || !communityStats.medianTime) {
        return null;
    }

    // For time, lower is better, so we invert the calculation
    const p25 = communityStats.p25Time || communityStats.medianTime * 0.8;
    const median = communityStats.medianTime;
    const p75 = communityStats.p75Time || communityStats.medianTime * 1.3;

    // Invert: if user is faster (lower time), they're in a higher percentile
    const invertedPercentile = calculatePercentile(userTime, p25, median, p75);
    return 100 - invertedPercentile; // Invert so faster = higher percentile
}

/**
 * Calculate percentile for moves (lower is better)
 */
export function calculateMovesPercentile(userMoves, communityStats) {
    if (!communityStats || !communityStats.medianMoves) {
        return null;
    }

    const p25 = communityStats.p25Moves || communityStats.medianMoves * 0.85;
    const median = communityStats.medianMoves;
    const p75 = communityStats.p75Moves || communityStats.medianMoves * 1.2;

    // Invert: if user has fewer moves, they're in a higher percentile
    const invertedPercentile = calculatePercentile(userMoves, p25, median, p75);
    return 100 - invertedPercentile;
}

/**
 * Calculate percentile for spins (lower is better)
 */
export function calculateSpinsPercentile(userSpins, communityStats) {
    if (!communityStats || communityStats.medianSpins === undefined) {
        return null;
    }

    // Spins are typically 0-3, so use simpler calculation
    const median = communityStats.medianSpins;
    
    if (userSpins < median) {
        // Better than median - estimate top 25-50%
        return 75 - (userSpins / median) * 25;
    } else if (userSpins === median) {
        return 50;
    } else {
        // Worse than median - estimate bottom 25-50%
        const excess = userSpins - median;
        return Math.max(0, 50 - excess * 15);
    }
}

/**
 * Calculate percentile for moves-per-block (lower is better)
 */
export function calculateMovesPerBlockPercentile(userMovesPerBlock, communityStats) {
    if (!communityStats || communityStats.medianMovesPerBlock === undefined) return null;
    const p25 = communityStats.p25MovesPerBlock ?? communityStats.medianMovesPerBlock * 0.85;
    const median = communityStats.medianMovesPerBlock;
    const p75 = communityStats.p75MovesPerBlock ?? communityStats.medianMovesPerBlock * 1.2;
    const invertedPercentile = calculatePercentile(userMovesPerBlock, p25, median, p75);
    return 100 - invertedPercentile;
}

/**
 * Calculate percentile for time-per-move (lower is better)
 */
export function calculateTimePerMovePercentile(userTimePerMove, communityStats) {
    if (!communityStats || communityStats.medianTimePerMove === undefined) return null;
    const p25 = communityStats.p25TimePerMove ?? communityStats.medianTimePerMove * 0.8;
    const median = communityStats.medianTimePerMove;
    const p75 = communityStats.p75TimePerMove ?? communityStats.medianTimePerMove * 1.3;
    const invertedPercentile = calculatePercentile(userTimePerMove, p25, median, p75);
    return 100 - invertedPercentile;
}

/**
 * Calculate percentile for blocks-per-spin (higher is better)
 */
export function calculateBlocksPerSpinPercentile(userBlocksPerSpin, communityStats) {
    if (!communityStats || communityStats.medianBlocksPerSpin === undefined) return null;
    const p25 = communityStats.p25BlocksPerSpin ?? communityStats.medianBlocksPerSpin * 0.8;
    const median = communityStats.medianBlocksPerSpin;
    const p75 = communityStats.p75BlocksPerSpin ?? communityStats.medianBlocksPerSpin * 1.3;
    return calculatePercentile(userBlocksPerSpin, p25, median, p75);
}

/**
 * Get comparison text for a metric
 * @param {number} userValue - User's value
 * @param {number} medianValue - Community median
 * @param {boolean} lowerIsBetter - Whether lower values are better (true for time, moves, spins)
 * @returns {object} Comparison data
 */
export function getComparison(userValue, medianValue, lowerIsBetter = true) {
    if (!medianValue) {
        return {
            better: null,
            percentDiff: null,
            text: 'No comparison data',
            badge: null
        };
    }

    const diff = userValue - medianValue;
    const percentDiff = Math.abs((diff / medianValue) * 100);
    const better = lowerIsBetter ? diff < 0 : diff > 0;

    let text, badge;
    if (Math.abs(diff) < 0.01) {
        text = 'Same as median';
        badge = 'equal';
    } else if (better) {
        text = `${percentDiff.toFixed(0)}% ${lowerIsBetter ? 'better' : 'better'}`;
        badge = 'better';
    } else {
        text = `${percentDiff.toFixed(0)}% ${lowerIsBetter ? 'slower' : 'worse'}`;
        badge = 'worse';
    }

    return {
        better,
        percentDiff: percentDiff.toFixed(1),
        text,
        badge
    };
}

/**
 * Get overall performance rating
 * @param {object} userStats - User's stats
 * @param {object} communityStats - Community stats
 * @returns {object} Overall rating
 */
export function getOverallRating(userStats, communityStats) {
    if (!communityStats) {
        return {
            rating: 'unavailable',
            percentile: null,
            badges: []
        };
    }

    const timePercentile = calculateTimePercentile(userStats.time, communityStats);
    const movesPercentile = calculateMovesPercentile(userStats.moves, communityStats);
    const spinsPercentile = calculateSpinsPercentile(userStats.spins, communityStats);

    // Average percentile (weighted: time 40%, moves 40%, spins 20%)
    const avgPercentile = (
        (timePercentile || 50) * 0.4 +
        (movesPercentile || 50) * 0.4 +
        (spinsPercentile || 50) * 0.2
    );

    let rating, badges = [];

    if (avgPercentile >= 90) {
        rating = 'elite';
        badges.push('elite');
    } else if (avgPercentile >= 75) {
        rating = 'excellent';
        badges.push('excellent');
    } else if (avgPercentile >= 50) {
        rating = 'good';
    } else if (avgPercentile >= 25) {
        rating = 'average';
    } else {
        rating = 'below_average';
    }

    // Add specific badges
    if (timePercentile && timePercentile >= 75) badges.push('speed_demon');
    if (movesPercentile && movesPercentile >= 75) badges.push('precision_master');
    if (spinsPercentile && spinsPercentile >= 75) badges.push('efficient');
    if (timePercentile >= 75 && movesPercentile >= 75) badges.push('perfect_run');

    return {
        rating,
        percentile: Math.round(avgPercentile),
        badges
    };
}

/**
 * Format percentile as text
 */
export function formatPercentile(percentile) {
    if (percentile === null || percentile === undefined) {
        return 'N/A';
    }

    if (percentile >= 90) return 'Top 10%';
    if (percentile >= 75) return 'Top 25%';
    if (percentile >= 50) return 'Top 50%';
    if (percentile >= 25) return 'Top 75%';
    return 'Top 100%';
}

