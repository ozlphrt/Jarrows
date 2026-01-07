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

function computeAllLevelMedians() {
    const levels = getLocalRunsByLevel();
    const all = [];
    for (const { runs } of levels) all.push(...runs);
    const tm = [];
    const mb = [];
    const bs = [];
    for (const r of all) {
        const moves = Number(r?.moves || 0);
        const time = Number(r?.time || 0);
        const spins = Number(r?.spins || 0);
        const blocksRemoved = Number(r?.blocksRemoved || 0);
        tm.push(moves > 0 ? time / moves : time);
        mb.push(blocksRemoved > 0 ? moves / blocksRemoved : moves);
        bs.push(spins > 0 ? blocksRemoved / spins : blocksRemoved);
    }
    tm.sort((a, b) => a - b);
    mb.sort((a, b) => a - b);
    bs.sort((a, b) => a - b);
    const mid = (arr) => {
        if (!arr.length) return null;
        const m = Math.floor(arr.length / 2);
        if (arr.length % 2 === 1) return arr[m];
        return (arr[m - 1] + arr[m]) / 2;
    };
    return { tm: mid(tm), mb: mid(mb), bs: mid(bs), count: all.length, levels: levels.length };
}

export function showProfileModal() {
    // Reuse the same full-screen modal style as History.
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
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 60px rgba(0,0,0,0.35);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        color: rgba(255,255,255,0.92);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        position: relative;
    `;
    
    // Add colored top accent
    const accent = document.createElement('div');
    accent.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, rgba(96, 165, 250, 0.9), rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9));
        opacity: 0.9;
    `;
    panel.appendChild(accent);

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
        margin-top: 6px;
    `;

    const titleWrap = document.createElement('div');
    titleWrap.style.cssText = `display: flex; align-items: center; gap: 10px;`;
    
    const icon = document.createElement('span');
    icon.textContent = '👤';
    icon.style.cssText = `font-size: 24px;`;
    
    const title = document.createElement('div');
    title.textContent = 'Profile';
    title.style.cssText = `font-size: 16px; font-weight: 900; letter-spacing: 0.4px;`;
    
    titleWrap.appendChild(icon);
    titleWrap.appendChild(title);

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
    `;
    closeBtn.addEventListener('click', () => overlay.remove());

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);

    const med = computeAllLevelMedians();

    const card = document.createElement('div');
    card.style.cssText = `
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        margin-bottom: 12px;
    `;

    const desc = document.createElement('div');
    desc.textContent = 'All-level medians (normalized)';
    desc.style.cssText = `font-weight: 900; font-size: 13px; margin-bottom: 8px;`;

    const grid = document.createElement('div');
    grid.style.cssText = `display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;`;

    const mini = (label, value) => {
        const c = document.createElement('div');
        c.style.cssText = `
            padding: 10px 10px;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(0,0,0,0.10);
            text-align: center;
        `;
        const l = document.createElement('div');
        l.textContent = label;
        l.style.cssText = `font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 6px;`;
        const v = document.createElement('div');
        v.textContent = value;
        v.style.cssText = `font-size: 16px; font-weight: 900; color: rgba(255,255,255,0.95);`;
        c.appendChild(l);
        c.appendChild(v);
        return c;
    };

    grid.appendChild(mini('T/M', typeof med.tm === 'number' ? formatSeconds(med.tm) : '—'));
    grid.appendChild(mini('M/B', typeof med.mb === 'number' ? formatRatio(med.mb) : '—'));
    grid.appendChild(mini('B/S', typeof med.bs === 'number' ? formatRatio(med.bs) : '—'));

    const footer = document.createElement('div');
    footer.textContent = `${med.count || 0} runs • ${med.levels || 0} levels`;
    footer.style.cssText = `margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.65);`;

    card.appendChild(desc);
    card.appendChild(grid);
    card.appendChild(footer);

    panel.appendChild(header);
    panel.appendChild(card);

    overlay.appendChild(panel);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    window.addEventListener(
        'keydown',
        (e) => {
            if (e.key === 'Escape') overlay.remove();
        },
        { once: true },
    );

    document.body.appendChild(overlay);
}

function closeHistoryModal() {
    const existing = document.getElementById('personal-history-modal');
    if (existing) existing.remove();
}

export function showPersonalHistoryModal({ focusLevel = null } = {}) {
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
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 60px rgba(0,0,0,0.35);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        color: rgba(255,255,255,0.92);
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        position: relative;
    `;
    
    // Add colored top accent
    const accent = document.createElement('div');
    accent.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, rgba(96, 165, 250, 0.9), rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9));
        opacity: 0.9;
    `;
    panel.appendChild(accent);

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
        margin-top: 6px;
    `;

    const titleWrap = document.createElement('div');
    titleWrap.style.cssText = `display: flex; align-items: center; gap: 10px;`;
    
    const icon = document.createElement('span');
    icon.textContent = '📊';
    icon.style.cssText = `font-size: 24px;`;
    
    const title = document.createElement('div');
    title.textContent = 'History';
    title.style.cssText = `
        font-size: 16px;
        font-weight: 900;
        letter-spacing: 0.4px;
    `;
    
    titleWrap.appendChild(icon);
    titleWrap.appendChild(title);

    const controls = document.createElement('div');
    controls.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
    `;

    function makeSelect(options) {
        const sel = document.createElement('select');
        sel.style.cssText = `
            border: 1px solid rgba(255,255,255,0.18);
            background: rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.92);
            border-radius: 10px;
            padding: 8px 10px;
            font-size: 12px;
            font-weight: 800;
            outline: none;
        `;
        for (const { value, label } of options) {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = label;
            sel.appendChild(opt);
        }
        return sel;
    }

    const filterSelect = makeSelect([
        { value: 'this', label: 'This level' },
        { value: 'all', label: 'All levels' },
    ]);

    const sortSelect = makeSelect([
        { value: 'newest', label: 'Newest' },
        { value: 'best_tm', label: 'Best T/M' },
        { value: 'best_mb', label: 'Best M/B' },
        { value: 'best_bs', label: 'Best B/S' },
    ]);

    if (focusLevel === null || focusLevel === undefined) {
        filterSelect.value = 'all';
    } else {
        filterSelect.value = 'this';
    }

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = `
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.9);
        border-radius: 10px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
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

    controls.appendChild(filterSelect);
    controls.appendChild(sortSelect);
    controls.appendChild(clearBtn);
    controls.appendChild(closeBtn);

    header.appendChild(titleWrap);
    header.appendChild(controls);

    const body = document.createElement('div');

    const summary = document.createElement('div');
    summary.style.cssText = `
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        margin-bottom: 12px;
    `;
    body.appendChild(summary);

    const listWrap = document.createElement('div');
    body.appendChild(listWrap);

    function medianFromSorted(sorted) {
        if (!sorted.length) return null;
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 1) return sorted[mid];
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    function fmt(val, kind) {
        if (typeof val !== 'number' || !Number.isFinite(val)) return '—';
        if (kind === 'seconds') return formatSeconds(val);
        return formatRatio(val);
    }

    function computeMedians(runs) {
        const tm = [];
        const mb = [];
        const bs = [];
        for (const r of runs) {
            const moves = Number(r?.moves || 0);
            const time = Number(r?.time || 0);
            const spins = Number(r?.spins || 0);
            const blocksRemoved = Number(r?.blocksRemoved || 0);
            tm.push(moves > 0 ? time / moves : time);
            mb.push(blocksRemoved > 0 ? moves / blocksRemoved : moves);
            bs.push(spins > 0 ? blocksRemoved / spins : blocksRemoved);
        }
        tm.sort((a, b) => a - b);
        mb.sort((a, b) => a - b);
        bs.sort((a, b) => a - b);
        return {
            tm: medianFromSorted(tm),
            mb: medianFromSorted(mb),
            bs: medianFromSorted(bs),
            count: runs.length,
        };
    }

    function clearHistory() {
        const ok = window.confirm('Clear all local history? This cannot be undone.');
        if (!ok) return;
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (!k) continue;
                if (k.startsWith('jarrows_level_') && k.endsWith('_stats')) keys.push(k);
            }
            for (const k of keys) localStorage.removeItem(k);
        } catch {
            // ignore
        }
        render();
    }

    clearBtn.addEventListener('click', clearHistory);

    function flatten(levels) {
        const out = [];
        for (const { level, runs } of levels) {
            for (const r of runs) out.push({ level, ...r });
        }
        return out;
    }

    function render() {
        const levels = getLocalRunsByLevel();
        const allRuns = flatten(levels).filter((r) => typeof r?.timestamp === 'number');

        const activeRuns =
            filterSelect.value === 'this' && Number.isFinite(focusLevel)
                ? allRuns.filter((r) => r.level === focusLevel)
                : allRuns;

        // Summary
        const med = computeMedians(activeRuns);
        summary.innerHTML = '';

        const sumTitle = document.createElement('div');
        sumTitle.textContent =
            filterSelect.value === 'this' && Number.isFinite(focusLevel) ? `Level ${focusLevel} medians` : 'All-level medians (normalized)';
        sumTitle.style.cssText = `
            font-weight: 900;
            font-size: 13px;
            margin-bottom: 8px;
        `;

        const sumBody = document.createElement('div');
        sumBody.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
        `;

        function mini(label, value) {
            const c = document.createElement('div');
            c.style.cssText = `
                padding: 10px 10px;
                border-radius: 14px;
                border: 1px solid rgba(255,255,255,0.12);
                background: rgba(0,0,0,0.10);
                text-align: center;
            `;
            const l = document.createElement('div');
            l.textContent = label;
            l.style.cssText = `
                font-size: 10px;
                font-weight: 800;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: rgba(255,255,255,0.55);
                margin-bottom: 6px;
            `;
            const v = document.createElement('div');
            v.textContent = value;
            v.style.cssText = `
                font-size: 16px;
                font-weight: 900;
                color: rgba(255,255,255,0.95);
            `;
            c.appendChild(l);
            c.appendChild(v);
            return c;
        }

        sumBody.appendChild(mini('T/M', fmt(med.tm, 'seconds')));
        sumBody.appendChild(mini('M/B', fmt(med.mb, 'ratio')));
        sumBody.appendChild(mini('B/S', fmt(med.bs, 'ratio')));

        const sumFooter = document.createElement('div');
        sumFooter.textContent = med.count ? `${med.count} run${med.count === 1 ? '' : 's'}` : 'No runs yet';
        sumFooter.style.cssText = `
            margin-top: 8px;
            font-size: 11px;
            color: rgba(255,255,255,0.65);
        `;

        summary.appendChild(sumTitle);
        summary.appendChild(sumBody);
        summary.appendChild(sumFooter);

        // List
        listWrap.innerHTML = '';
        if (!activeRuns.length) {
            const empty = document.createElement('div');
            empty.textContent =
                filterSelect.value === 'this' && Number.isFinite(focusLevel)
                    ? 'No runs yet for this level. Complete it once to populate.'
                    : 'No local runs yet. Complete a level once to populate this history.';
            empty.style.cssText = `
                padding: 12px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.12);
                background: rgba(255,255,255,0.05);
                color: rgba(255,255,255,0.78);
                font-size: 12px;
            `;
            listWrap.appendChild(empty);
            return;
        }

        const sorted = [...activeRuns].sort((a, b) => {
            const movesA = Number(a.moves || 0);
            const timeA = Number(a.time || 0);
            const spinsA = Number(a.spins || 0);
            const blocksA = Number(a.blocksRemoved || 0);
            const tmA = movesA > 0 ? timeA / movesA : timeA;
            const mbA = blocksA > 0 ? movesA / blocksA : movesA;
            const bsA = spinsA > 0 ? blocksA / spinsA : blocksA;

            const movesB = Number(b.moves || 0);
            const timeB = Number(b.time || 0);
            const spinsB = Number(b.spins || 0);
            const blocksB = Number(b.blocksRemoved || 0);
            const tmB = movesB > 0 ? timeB / movesB : timeB;
            const mbB = blocksB > 0 ? movesB / blocksB : movesB;
            const bsB = spinsB > 0 ? blocksB / spinsB : blocksB;

            switch (sortSelect.value) {
                case 'best_tm':
                    return tmA - tmB;
                case 'best_mb':
                    return mbA - mbB;
                case 'best_bs':
                    return bsB - bsA; // higher is better
                default:
                    return (b.timestamp || 0) - (a.timestamp || 0);
            }
        });

        const list = document.createElement('div');
        list.style.cssText = `
            display: grid;
            grid-template-columns: 1fr;
            gap: 6px;
        `;

        for (const r of sorted.slice(0, 50)) {
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
                grid-template-columns: 70px 62px 1fr ${filterSelect.value === 'all' ? '56px' : ''};
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

            if (filterSelect.value === 'all') {
                const lvl = document.createElement('div');
                lvl.textContent = `L${r.level}`;
                lvl.style.cssText = `opacity: 0.75; text-align: right; font-weight: 800;`;
                row.appendChild(lvl);
            }

            list.appendChild(row);
        }

        listWrap.appendChild(list);
    }

    filterSelect.addEventListener('change', render);
    sortSelect.addEventListener('change', render);
    render();

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

function showMetricInfoModal({ label, currentValue, baselineValue, scope = null, sampleSize = null }) {
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

    if (scope === 'all') {
        const scopeLine = document.createElement('div');
        const n = typeof sampleSize === 'number' ? sampleSize : null;
        scopeLine.textContent = n ? `Baseline: all levels (normalized) • ${n} runs` : 'Baseline: all levels (normalized)';
        scopeLine.style.cssText = `
            margin-top: 8px;
            font-size: 11px;
            color: rgba(255,255,255,0.70);
        `;
        titleWrap.appendChild(scopeLine);
    }

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
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    `;

    section.appendChild(title);
    section.appendChild(grid);

    return section;
}

/**
 * Update comparison display with data
 */
function updateComparisonDisplay(section, userStats, comparison) {
    const grid = section.querySelector('.comparison-grid');
    if (!grid) return;

    // Remove title completely - no personal/community labels
    const title = section.querySelector('.comparison-title');
    if (title) {
        title.remove();
    }

    // Clear existing comparisons
    grid.innerHTML = '';

    // No baseline message or personal median row - removed per request

    // Time Challenge specific stats - show formula: unused + collected - lost = carried over (in mm:ss)
    if (userStats.timeUnusedLevel !== undefined && userStats.timeCollectedLevel !== undefined && userStats.timeCarriedOverLevel !== undefined) {
        // Make grid full width (1 column) for time challenge stats
        grid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            width: 100%;
        `;
        
        const timeUnused = userStats.timeUnusedLevel || 0;
        const timeCollected = userStats.timeCollectedLevel || 0;
        const timeLost = userStats.timeLostLevel || 0;
        const timeCarriedOver = userStats.timeCarriedOverLevel || 0;
        
        grid.appendChild(createTimeChallengeCard(
            `unused + collected - lost = carried over`,
            timeUnused,
            timeCollected,
            timeLost,
            timeCarriedOver
        ));
    }
}

function createTimeChallengeCard(label, timeUnused, timeCollected, timeLost, timeCarriedOver) {
    const card = document.createElement('div');
    card.style.cssText = `
        padding: 14px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 100%;
        box-sizing: border-box;
    `;
    
    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.cssText = `
        font-size: 11px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
    `;
    
    // Create colored formula display
    const valueEl = document.createElement('div');
    valueEl.style.cssText = `
        font-size: 18px;
        font-weight: 900;
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
    `;
    
    // unused (yellow)
    const unusedSpan = document.createElement('span');
    unusedSpan.textContent = formatTime(timeUnused);
    unusedSpan.style.cssText = `color: #FFE66D; text-shadow: 0 0 8px rgba(255, 230, 109, 0.4);`;
    
    // plus sign (white)
    const plusSpan = document.createElement('span');
    plusSpan.textContent = '+';
    plusSpan.style.cssText = `color: rgba(255, 255, 255, 0.8);`;
    
    // collected (green)
    const collectedSpan = document.createElement('span');
    collectedSpan.textContent = formatTime(timeCollected);
    collectedSpan.style.cssText = `color: #4ECDC4; text-shadow: 0 0 8px rgba(78, 205, 196, 0.4);`;
    
    // minus sign (white)
    const minusSpan = document.createElement('span');
    minusSpan.textContent = '-';
    minusSpan.style.cssText = `color: rgba(255, 255, 255, 0.8);`;
    
    // lost (red)
    const lostSpan = document.createElement('span');
    lostSpan.textContent = formatTime(timeLost);
    lostSpan.style.cssText = `color: #FF6B6B; text-shadow: 0 0 8px rgba(255, 107, 107, 0.4);`;
    
    // equals sign (white)
    const equalsSpan = document.createElement('span');
    equalsSpan.textContent = '=';
    equalsSpan.style.cssText = `color: rgba(255, 255, 255, 0.8);`;
    
    // carried over (green if positive, red if negative/zero)
    const carriedOverSpan = document.createElement('span');
    carriedOverSpan.textContent = formatTime(timeCarriedOver);
    const carriedOverColor = timeCarriedOver > 0 ? '#4ECDC4' : '#FF6B6B';
    carriedOverSpan.style.cssText = `color: ${carriedOverColor}; text-shadow: 0 0 8px ${timeCarriedOver > 0 ? 'rgba(78, 205, 196, 0.4)' : 'rgba(255, 107, 107, 0.4)'};`;
    
    valueEl.appendChild(unusedSpan);
    valueEl.appendChild(plusSpan);
    valueEl.appendChild(collectedSpan);
    valueEl.appendChild(minusSpan);
    valueEl.appendChild(lostSpan);
    valueEl.appendChild(equalsSpan);
    valueEl.appendChild(carriedOverSpan);
    
    card.appendChild(labelEl);
    card.appendChild(valueEl);
    return card;
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
                scope: comparison?.scope || null,
                sampleSize: comparison?.sampleSize || null,
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

