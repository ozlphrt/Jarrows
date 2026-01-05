/**
 * Stats UI Components
 * Handles display of comparison stats in the UI
 */

import { formatPercentile } from './statsComparison.js';
import { getBadgeMeta } from './badges.js';
import { loadStreakState, formatStreakShort } from './streaks.js';

/**
 * Update level complete modal with comparison stats
 */
export function updateLevelCompleteModal(userStats, comparison) {
    if (!comparison || !comparison.available) {
        // No comparison data available - show user stats only
        // (Includes strict local-only mode where community stats are disabled.)
        updateStreakStatsBar();
        return;
    }

    // Add comparison section to modal if it doesn't exist
    let comparisonSection = document.getElementById('stats-comparison-section');
    
    if (!comparisonSection) {
        comparisonSection = createComparisonSection();
        const modalContent = document.querySelector('.modal-content');
        const statsGrid = document.querySelector('.modal-stats-grid');
        
        if (modalContent && statsGrid) {
            // Insert after stats grid, before button
            const button = document.querySelector('.modal-button');
            if (button) {
                modalContent.insertBefore(comparisonSection, button);
            } else {
                modalContent.appendChild(comparisonSection);
            }
        }
    }

    // Update comparison data
    updateComparisonDisplay(comparisonSection, userStats, comparison);
    updateStreakStatsBar();
}

/**
 * Create comparison section element
 */
function createComparisonSection() {
    const section = document.createElement('div');
    section.id = 'stats-comparison-section';
    section.className = 'modal-comparison-section';
    section.style.cssText = `
        margin: 20px 0;
        padding: 16px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.12);
    `;

    const title = document.createElement('div');
    title.className = 'comparison-title';
    title.textContent = 'Community Comparison';
    title.style.cssText = `
        font-size: 14px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;

    const grid = document.createElement('div');
    grid.className = 'comparison-grid';
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
    `;

    section.appendChild(title);

    const badgeRow = document.createElement('div');
    badgeRow.className = 'comparison-badges';
    badgeRow.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 10px 0 12px;
    `;
    section.appendChild(badgeRow);

    section.appendChild(grid);

    return section;
}

/**
 * Update comparison display with data
 */
function updateComparisonDisplay(section, userStats, comparison) {
    const grid = section.querySelector('.comparison-grid');
    if (!grid) return;

    // Ensure the title doesn't accumulate multiple overall badges across updates.
    const title = section.querySelector('.comparison-title');
    if (title) {
        // Remove any previously-added overall badge(s)
        const existingBadges = title.querySelectorAll('[data-stats-overall-badge=\"1\"]');
        existingBadges.forEach((b) => b.remove());
    }

    // Clear existing comparisons
    grid.innerHTML = '';

    // Update badge row
    const badgeRow = section.querySelector('.comparison-badges');
    if (badgeRow) {
        badgeRow.innerHTML = '';
        const ids = Array.isArray(comparison.badges) ? comparison.badges : [];
        for (const id of ids) {
            const meta = getBadgeMeta(id);
            if (!meta) continue;
            badgeRow.appendChild(createBadgePill(meta));
        }
        if (comparison.badgesPending && ids.length === 0) {
            badgeRow.appendChild(createPendingPill());
        }
    }

    // Time comparison
    if (comparison.time) {
        grid.appendChild(createComparisonCard(
            'Time',
            formatTime(userStats.time),
            formatTime(comparison.communityStats.medianTime),
            comparison.time,
            '⚡'
        ));
    }

    // Moves comparison
    if (comparison.moves) {
        grid.appendChild(createComparisonCard(
            'Moves',
            userStats.moves.toString(),
            comparison.communityStats.medianMoves.toString(),
            comparison.moves,
            '🎯'
        ));
    }

    // Spins comparison
    if (comparison.spins) {
        grid.appendChild(createComparisonCard(
            'Spins',
            userStats.spins.toString(),
            comparison.communityStats.medianSpins.toFixed(1),
            comparison.spins,
            '💫'
        ));
    }

    // Efficiency comparisons (derived metrics)
    if (comparison.efficiency?.movesPerBlock) {
        const v = comparison.efficiency.movesPerBlock.value;
        const c = comparison.efficiency.movesPerBlock.comparison;
        grid.appendChild(createComparisonCard(
            'M/B',
            formatRatio(v),
            formatRatio(comparison.communityStats.medianMovesPerBlock ?? comparison.communityStats.avgMovesPerBlock),
            c,
            '🧱'
        ));
    }
    if (comparison.efficiency?.timePerMove) {
        const v = comparison.efficiency.timePerMove.value;
        const c = comparison.efficiency.timePerMove.comparison;
        grid.appendChild(createComparisonCard(
            'T/M',
            formatSeconds(v),
            formatSeconds(comparison.communityStats.medianTimePerMove ?? comparison.communityStats.avgTimePerMove),
            c,
            '⏱'
        ));
    }
    if (comparison.efficiency?.blocksPerSpin) {
        const v = comparison.efficiency.blocksPerSpin.value;
        const c = comparison.efficiency.blocksPerSpin.comparison;
        grid.appendChild(createComparisonCard(
            'B/S',
            formatRatio(v),
            formatRatio(comparison.communityStats.medianBlocksPerSpin ?? comparison.communityStats.avgBlocksPerSpin),
            c,
            '🌀'
        ));
    }

    // Overall rating badge
    if (comparison.overall) {
        const overallBadge = createOverallBadge(comparison.overall);
        if (title && overallBadge) title.appendChild(overallBadge);
    }
}

function createBadgePill(meta) {
    const pill = document.createElement('span');
    pill.textContent = meta.label;
    pill.title = meta.description || meta.label;
    pill.style.cssText = `
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.92);
        background: ${meta.kind === 'community' ? 'rgba(96,165,250,0.22)' : 'rgba(74,222,128,0.18)'};
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.10);
    `;
    return pill;
}

function createPendingPill() {
    const pill = document.createElement('span');
    pill.textContent = 'Badges pending';
    pill.title = 'Complete more runs (or go online) to unlock community-based badges.';
    pill.style.cssText = `
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.7);
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.12);
    `;
    return pill;
}

/**
 * Create a comparison card
 */
function createComparisonCard(label, userValue, medianValue, comparison, icon) {
    const card = document.createElement('div');
    card.className = 'comparison-card';
    card.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 10px;
        text-align: center;
    `;

    const iconEl = document.createElement('div');
    iconEl.textContent = icon;
    iconEl.style.cssText = `font-size: 18px; margin-bottom: 4px;`;

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.cssText = `
        font-size: 10px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
    `;

    const userValueEl = document.createElement('div');
    userValueEl.textContent = userValue;
    userValueEl.style.cssText = `
        font-size: 16px;
        font-weight: 700;
        color: ${comparison.better ? 'rgba(74, 222, 128, 0.95)' : comparison.badge === 'equal' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 107, 107, 0.95)'};
        margin-bottom: 2px;
    `;

    const vsEl = document.createElement('div');
    vsEl.textContent = 'vs';
    vsEl.style.cssText = `
        font-size: 9px;
        color: rgba(255, 255, 255, 0.4);
        margin: 2px 0;
    `;

    const medianValueEl = document.createElement('div');
    medianValueEl.textContent = medianValue;
    medianValueEl.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 4px;
    `;

    const percentileEl = document.createElement('div');
    if (comparison.percentile !== null && comparison.percentile !== undefined) {
        percentileEl.textContent = formatPercentile(comparison.percentile);
        percentileEl.style.cssText = `
            font-size: 9px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 4px;
        `;
    }

    card.appendChild(iconEl);
    card.appendChild(labelEl);
    card.appendChild(userValueEl);
    card.appendChild(vsEl);
    card.appendChild(medianValueEl);
    if (percentileEl.textContent) {
        card.appendChild(percentileEl);
    }

    return card;
}

/**
 * Create overall badge
 */
function createOverallBadge(overall) {
    if (!overall || !overall.rating) return null;

    const badge = document.createElement('span');
    badge.dataset.statsOverallBadge = '1';
    badge.style.cssText = `
        margin-left: 8px;
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 700;
        background: ${getRatingColor(overall.rating)};
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `;

    badge.textContent = getRatingText(overall.rating);

    return badge;
}

/**
 * Get rating color
 */
function getRatingColor(rating) {
    switch (rating) {
        case 'elite': return 'rgba(168, 85, 247, 0.8)';
        case 'excellent': return 'rgba(96, 165, 250, 0.8)';
        case 'good': return 'rgba(74, 222, 128, 0.8)';
        case 'average': return 'rgba(251, 191, 36, 0.8)';
        default: return 'rgba(255, 107, 107, 0.8)';
    }
}

/**
 * Get rating text
 */
function getRatingText(rating) {
    switch (rating) {
        case 'elite': return 'Elite';
        case 'excellent': return 'Excellent';
        case 'good': return 'Good';
        case 'average': return 'Average';
        default: return 'Below Avg';
    }
}

/**
 * Format time as MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatSeconds(seconds) {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return '—';
    // show as 0.0s (keep compact)
    if (seconds < 10) return `${seconds.toFixed(1)}s`;
    return `${seconds.toFixed(0)}s`;
}

function formatRatio(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    if (value < 10) return value.toFixed(2);
    if (value < 100) return value.toFixed(1);
    return value.toFixed(0);
}

/**
 * Show offline indicator
 */
export function showOfflineIndicator() {
    let indicator = document.getElementById('stats-offline-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'stats-offline-indicator';
        indicator.textContent = '📡 Offline - Stats will sync when online';
        indicator.style.cssText = `
            position: fixed;
            top: 60px;
            left: 10px;
            z-index: 999;
            background: rgba(251, 191, 36, 0.9);
            color: rgba(0, 0, 0, 0.9);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(indicator);
    }

    indicator.style.opacity = '1';
}

/**
 * Show local-only indicator (strict mode: no network calls at all)
 */
export function showLocalOnlyIndicator() {
    let indicator = document.getElementById('stats-offline-indicator');

    if (!indicator) {
        // Reuse the same element id/styles as offline indicator for simplicity.
        showOfflineIndicator();
        indicator = document.getElementById('stats-offline-indicator');
    }
    if (!indicator) return;

    indicator.textContent = '🗃 Local-only stats (no online sync)';
    indicator.style.background = 'rgba(96, 165, 250, 0.9)';
    indicator.style.color = 'rgba(0, 0, 0, 0.9)';
    indicator.style.opacity = '1';
}

/**
 * Hide offline indicator
 */
export function hideOfflineIndicator() {
    const indicator = document.getElementById('stats-offline-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
    }
}

/**
 * Update the top-left stats bar streak display from local storage.
 */
export function updateStreakStatsBar() {
    const el = document.getElementById('streak-value');
    if (!el) return;
    const state = loadStreakState();
    el.textContent = formatStreakShort(state);
    el.title = `Speed best: ${state.speed.best} | Moves best: ${state.moves.best} | Perfect best: ${state.perfect.best}`;
}

