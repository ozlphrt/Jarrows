/**
 * Stats UI Components
 * Handles display of comparison stats in the UI
 */

import { formatPercentile } from './statsComparison.js';
import { getBadgeMeta } from './badges.js';
// Streak logic remains internal, but the top-bar streak UI has been removed.

const METRIC_INFO = {
    'T/M': {
        title: 'T/M',
        name: 'Time per move',
        description: 'Average time spent per move.',
        better: 'lower',
        formula: 'time / moves',
        zeroNote: 'If moves is 0, we treat T/M as the total time.',
    },
    'M/B': {
        title: 'M/B',
        name: 'Moves per block removed',
        description: 'How many moves you used per block removed.',
        better: 'lower',
        formula: 'moves / blocksRemoved',
        zeroNote: 'If blocksRemoved is 0, we treat M/B as moves.',
    },
    'B/S': {
        title: 'B/S',
        name: 'Blocks per spin',
        description: 'How many blocks you removed per spin used.',
        better: 'higher',
        formula: 'blocksRemoved / spins',
        zeroNote: 'If spins is 0, we treat B/S as blocksRemoved.',
    },
};

function getLocalRunsByLevel() {
    const levels = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith('jarrows_level_') || !k.endsWith('_stats')) continue;
            const levelStr = k.slice('jarrows_level_'.length, -'_stats'.length);
            const level = Number(levelStr);
            if (!Number.isFinite(level)) continue;
            const raw = localStorage.getItem(k);
            const arr = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(arr)) continue;
            levels.push({ level, runs: arr });
        }
    } catch {
        // ignore
    }
    levels.sort((a, b) => a.level - b.level);
    return levels;
}

function closeHistoryModal() {
    const existing = document.getElementById('personal-history-modal');
    if (existing) existing.remove();
}

export function showPersonalHistoryModal() {
    closeHistoryModal();

    const overlay = document.createElement('div');
    overlay.id = 'personal-history-modal';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 2600;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: stretch;
        justify-content: stretch;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
        padding: calc(18px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(18px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));
        background: rgba(17, 24, 39, 0.55);
        border: 1px solid rgba(255,255,255,0.18);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        color: rgba(255,255,255,0.92);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
    `;

    const title = document.createElement('div');
    title.textContent = 'Your History';
    title.style.cssText = `
        font-size: 16px;
        font-weight: 900;
        letter-spacing: 0.4px;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.10);
        color: rgba(255,255,255,0.9);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        flex: 0 0 auto;
    `;
    closeBtn.addEventListener('click', closeHistoryModal);

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');

    const levels = getLocalRunsByLevel();
    if (!levels.length) {
        const empty = document.createElement('div');
        empty.textContent = 'No local runs yet. Complete a level once to populate this history.';
        empty.style.cssText = `
            padding: 12px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.78);
            font-size: 12px;
        `;
        body.appendChild(empty);
    } else {
        for (const { level, runs } of levels) {
            const card = document.createElement('div');
            card.style.cssText = `
                margin-bottom: 12px;
                padding: 12px;
                border-radius: 16px;
                border: 1px solid rgba(255,255,255,0.14);
                background: rgba(255,255,255,0.06);
            `;

            const h = document.createElement('div');
            h.textContent = `Level ${level}`;
            h.style.cssText = `
                font-weight: 900;
                font-size: 13px;
                margin-bottom: 8px;
            `;
            card.appendChild(h);

            const list = document.createElement('div');
            list.style.cssText = `
                display: grid;
                grid-template-columns: 1fr;
                gap: 6px;
            `;

            // show newest first
            const sorted = [...runs].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
            for (const r of sorted.slice(0, 10)) {
                const moves = Number(r.moves || 0);
                const time = Number(r.time || 0);
                const spins = Number(r.spins || 0);
                const blocksRemoved = Number(r.blocksRemoved || 0);
                const tm = moves > 0 ? time / moves : time;
                const mb = blocksRemoved > 0 ? moves / blocksRemoved : moves;
                const bs = spins > 0 ? blocksRemoved / spins : blocksRemoved;

                const row = document.createElement('div');
                row.style.cssText = `
                    display: grid;
                    grid-template-columns: 74px 62px 1fr;
                    gap: 10px;
                    align-items: center;
                    padding: 8px 10px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.10);
                    background: rgba(0,0,0,0.12);
                    font-size: 12px;
                    color: rgba(255,255,255,0.85);
                `;

                const left = document.createElement('div');
                left.textContent = formatTime(time);
                left.style.cssText = `font-weight: 900;`;

                const mid = document.createElement('div');
                mid.textContent = `${moves} mv`;
                mid.style.cssText = `opacity: 0.9;`;

                const right = document.createElement('div');
                right.textContent = `T/M ${formatSeconds(tm)}  •  M/B ${formatRatio(mb)}  •  B/S ${formatRatio(bs)}`;
                right.style.cssText = `opacity: 0.9;`;

                row.appendChild(left);
                row.appendChild(mid);
                row.appendChild(right);
                list.appendChild(row);
            }

            card.appendChild(list);
            body.appendChild(card);
        }
    }

    panel.appendChild(header);
    panel.appendChild(body);
    overlay.appendChild(panel);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHistoryModal();
    });
    window.addEventListener(
        'keydown',
        (e) => {
            if (e.key === 'Escape') closeHistoryModal();
        },
        { once: true },
    );

    document.body.appendChild(overlay);
}

function getMetricKey(label) {
    if (!label) return null;
    // Normalize variants (future-proof)
    if (label === 'All T/M') return 'T/M';
    if (label === 'All M/B') return 'M/B';
    if (label === 'All B/S') return 'B/S';
    return METRIC_INFO[label] ? label : null;
}

function closeMetricInfoModal() {
    const existing = document.getElementById('metric-info-modal');
    if (existing) existing.remove();
}

function showMetricInfoModal({ label, currentValue, baselineValue }) {
    const key = getMetricKey(label);
    const meta = key ? METRIC_INFO[key] : null;
    if (!meta) return;

    closeMetricInfoModal();

    const overlay = document.createElement('div');
    overlay.id = 'metric-info-modal';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 3000;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        width: min(520px, 100%);
        background: rgba(17, 24, 39, 0.55);
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 18px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14);
        padding: 18px 16px 16px;
        color: rgba(255,255,255,0.92);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
    `;

    const titleWrap = document.createElement('div');

    const title = document.createElement('div');
    title.textContent = `${meta.title} — ${meta.name}`;
    title.style.cssText = `
        font-weight: 800;
        font-size: 14px;
        letter-spacing: 0.3px;
        margin-bottom: 6px;
    `;

    const subtitle = document.createElement('div');
    subtitle.textContent = `${meta.description} (${meta.better} is better)`;
    subtitle.style.cssText = `
        font-size: 12px;
        color: rgba(255,255,255,0.75);
        line-height: 1.35;
    `;

    const formula = document.createElement('div');
    formula.textContent = `Formula: ${meta.formula}`;
    formula.style.cssText = `
        margin-top: 8px;
        font-size: 11px;
        color: rgba(255,255,255,0.65);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    `;

    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);
    titleWrap.appendChild(formula);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.10);
        color: rgba(255,255,255,0.9);
        border-radius: 10px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        flex: 0 0 auto;
    `;
    closeBtn.addEventListener('click', closeMetricInfoModal);

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);

    const values = document.createElement('div');
    values.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 12px;
    `;

    function valueCard(labelText, valueText) {
        const wrap = document.createElement('div');
        wrap.style.cssText = `
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 14px;
            padding: 10px;
        `;
        const l = document.createElement('div');
        l.textContent = labelText;
        l.style.cssText = `
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.55);
            margin-bottom: 6px;
        `;
        const v = document.createElement('div');
        v.textContent = valueText || '—';
        v.style.cssText = `
            font-size: 18px;
            font-weight: 900;
            color: rgba(255,255,255,0.95);
        `;
        wrap.appendChild(l);
        wrap.appendChild(v);
        return wrap;
    }

    values.appendChild(valueCard('Current', currentValue));
    values.appendChild(valueCard('Median baseline', baselineValue));

    const note = document.createElement('div');
    note.textContent = meta.zeroNote;
    note.style.cssText = `
        margin-top: 10px;
        font-size: 11px;
        color: rgba(255,255,255,0.65);
        line-height: 1.35;
    `;

    panel.appendChild(header);
    panel.appendChild(values);
    panel.appendChild(note);
    overlay.appendChild(panel);

    // Close behaviors
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMetricInfoModal();
    });
    window.addEventListener(
        'keydown',
        (e) => {
            if (e.key === 'Escape') closeMetricInfoModal();
        },
        { once: true },
    );

    document.body.appendChild(overlay);
}

/**
 * Update level complete modal with comparison stats
 */
export function updateLevelCompleteModal(userStats, comparison) {
    // Add comparison section to modal if it doesn't exist
    let comparisonSection = document.getElementById('stats-comparison-section');
    
    if (!comparisonSection) {
        comparisonSection = createComparisonSection();
        const modalContent = document.querySelector('.modal-content');
        const statsGrid = document.querySelector('.modal-stats-grid');
        
        if (modalContent && statsGrid) {
            // Insert after stats grid, before the modal actions container.
            // NOTE: insertBefore() requires the reference node to be a *direct child* of modalContent.
            const actions = document.querySelector('.modal-actions');
            if (actions && actions.parentElement === modalContent) {
                modalContent.insertBefore(comparisonSection, actions);
            } else {
                modalContent.appendChild(comparisonSection);
            }
        }
    }

    // Update comparison data
    updateComparisonDisplay(comparisonSection, userStats, comparison);

    const historyBtn = document.getElementById('history-button');
    if (historyBtn && !historyBtn.dataset.bound) {
        historyBtn.dataset.bound = '1';
        historyBtn.addEventListener('click', () => showPersonalHistoryModal());
    }
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

        // Update title based on comparison source
        if (comparison?.source === 'personal') {
            const n = typeof comparison.sampleSize === 'number' ? comparison.sampleSize : null;
            title.textContent = n ? `Personal (${n})` : 'Personal';
        } else if (comparison?.source === 'none') {
            title.textContent = 'Personal';
        } else {
            title.textContent = 'Community Comparison';
        }
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

    // No per-level baseline yet: show a clear helper message, but still show global baseline if available.
    if (!comparison?.available) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            grid-column: 1 / -1;
            padding: 10px 12px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.78);
            font-size: 12px;
            line-height: 1.35;
            margin-bottom: 10px;
        `;
        msg.textContent =
            comparison?.reason === 'no_level_baseline'
                ? 'No baseline yet for this level. Finish it again to compare against your own median.'
                : 'No baseline available yet.';
        grid.appendChild(msg);
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

    // Global normalized baseline across ALL levels (local history)
    if (comparison?.globalNormalized?.available && comparison.globalNormalized.efficiency && comparison.globalNormalized.baselineStats) {
        const gs = comparison.globalNormalized.baselineStats;
        const ge = comparison.globalNormalized.efficiency;

        // Spacer
        const spacer = document.createElement('div');
        spacer.style.cssText = `grid-column: 1 / -1; height: 8px;`;
        grid.appendChild(spacer);

        grid.appendChild(createComparisonCard(
            'All M/B',
            formatRatio(ge.movesPerBlock.value),
            formatRatio(gs.medianMovesPerBlock ?? gs.avgMovesPerBlock),
            ge.movesPerBlock.comparison,
            '🌐'
        ));
        grid.appendChild(createComparisonCard(
            'All T/M',
            formatSeconds(ge.timePerMove.value),
            formatSeconds(gs.medianTimePerMove ?? gs.avgTimePerMove),
            ge.timePerMove.comparison,
            '🌐'
        ));
        grid.appendChild(createComparisonCard(
            'All B/S',
            formatRatio(ge.blocksPerSpin.value),
            formatRatio(gs.medianBlocksPerSpin ?? gs.avgBlocksPerSpin),
            ge.blocksPerSpin.comparison,
            '🌐'
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

    // The main stats grid already shows the user's raw values (time/moves/etc).
    // To avoid duplicate info, comparison cards show only "delta" + baseline median.
    const deltaEl = document.createElement('div');
    deltaEl.textContent = comparison?.text || '—';
    deltaEl.style.cssText = `
        font-size: 16px;
        font-weight: 700;
        color: ${comparison.better ? 'rgba(74, 222, 128, 0.95)' : comparison.badge === 'equal' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 107, 107, 0.95)'};
        margin-bottom: 2px;
    `;

    const vsEl = document.createElement('div');
    vsEl.textContent = 'median';
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
    card.appendChild(deltaEl);
    card.appendChild(vsEl);
    card.appendChild(medianValueEl);
    if (percentileEl.textContent) {
        card.appendChild(percentileEl);
    }

    // Make specific metric cards tappable to open an explanation modal.
    // Only for the "hard-to-grasp" efficiency metrics.
    const metricKey = getMetricKey(label);
    if (metricKey) {
        card.style.cursor = 'pointer';
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.title = 'Tap for explanation';

        const open = () => {
            showMetricInfoModal({
                label,
                currentValue: userValue,
                baselineValue: medianValue,
            });
        };
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
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
// (streak UI removed)

