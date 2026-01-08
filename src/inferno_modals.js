/**
 * Inferno Mode Modals System
 * 
 * Handles explanation modals for Inferno mode features:
 * - Milestone modals (levels 10, 25, 50)
 * - Feature-specific modals (first encounter)
 * - General level updates (all modes)
 */

// General level update intervals - show meaningful messages at key levels
const LEVEL_UPDATE_INTERVALS = [1, 3, 5, 8, 12, 15, 20, 30, 40, 60, 75, 100];
const LEVEL_UPDATE_KEY_PREFIX = 'jarrows_level_update_';

const MILESTONE_KEYS = {
    10: 'jarrows_inferno_milestone_10_seen',
    25: 'jarrows_inferno_milestone_25_seen',
    50: 'jarrows_inferno_milestone_50_seen'
};

const FEATURE_KEYS = {
    directional: 'jarrows_inferno_feature_directional_seen',
    length: 'jarrows_inferno_feature_length_seen',
    vertical: 'jarrows_inferno_feature_vertical_seen',
    multilayer: 'jarrows_inferno_feature_multilayer_seen',
    spincost: 'jarrows_inferno_feature_spincost_seen',
    difficulty: 'jarrows_inferno_feature_difficulty_seen'
};

/**
 * Check if user has seen a milestone modal
 */
function hasSeenMilestone(milestoneLevel) {
    try {
        return localStorage.getItem(MILESTONE_KEYS[milestoneLevel]) === '1';
    } catch {
        return false;
    }
}

/**
 * Mark milestone as seen
 */
function markMilestoneSeen(milestoneLevel) {
    try {
        localStorage.setItem(MILESTONE_KEYS[milestoneLevel], '1');
    } catch {
        // ignore
    }
}

/**
 * Check if user has seen a feature modal
 */
function hasSeenFeature(featureName) {
    try {
        return localStorage.getItem(FEATURE_KEYS[featureName]) === '1';
    } catch {
        return false;
    }
}

/**
 * Mark feature as seen
 */
function markFeatureSeen(featureName) {
    try {
        localStorage.setItem(FEATURE_KEYS[featureName], '1');
    } catch {
        // ignore
    }
}

/**
 * Show milestone modal
 */
export function showMilestoneModal(level) {
    const modal = document.getElementById('inferno-milestone-modal');
    if (!modal) return;
    
    // Check if already seen
    if (hasSeenMilestone(level)) return;
    
    const titleEl = document.getElementById('inferno-milestone-title');
    const contentEl = document.getElementById('inferno-milestone-content');
    const okBtn = document.getElementById('inferno-milestone-ok');
    
    if (!titleEl || !contentEl || !okBtn) return;
    
    // Set content based on milestone level
    let title, content;
    if (level === 10) {
        title = '🔥 Level 10';
        content = `
            <p style="margin-bottom: 10px;"><b>Difficulty increases:</b></p>
            <ul style="margin: 0; padding-left: 20px;">
                <li>More <b>inward</b> blocks</li>
                <li>More <b>long</b> blocks</li>
                <li>Fewer vertical blocks</li>
                <li>Spins cost more</li>
            </ul>
        `;
    } else if (level === 25) {
        title = '🔥 Level 25';
        content = `
            <p style="margin-bottom: 10px;"><b>Difficulty increases:</b></p>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Most blocks point <b>inward</b></li>
                <li>Most blocks are <b>long</b> (2-3 cells)</li>
                <li>Few vertical blocks</li>
                <li>Layers can <b>block exits</b></li>
                <li>Spins are <b>very expensive</b></li>
            </ul>
        `;
    } else if (level === 50) {
        title = '🔥 Level 50';
        content = `
            <p style="margin-bottom: 10px;"><b>Maximum difficulty:</b></p>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Almost all blocks <b>inward</b></li>
                <li>Most blocks are <b>3 cells</b></li>
                <li>Vertical blocks <b>rare</b></li>
                <li>Complex multi-layer</li>
                <li>Spins cost <b>most time</b></li>
            </ul>
        `;
    } else {
        return; // Not a milestone level
    }
    
    titleEl.textContent = title;
    contentEl.innerHTML = content;
    
    // Freeze time if in time-based mode
    if (typeof setTimeFrozen === 'function') {
        setTimeFrozen('inferno_milestone', true);
    }
    
    modal.style.display = 'flex';
    
    const onOk = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', onOk);
        markMilestoneSeen(level);
        if (typeof setTimeFrozen === 'function') {
            setTimeFrozen('inferno_milestone', false);
        }
    };
    
    okBtn.addEventListener('click', onOk);
}

/**
 * Show feature-specific modal
 */
export function showFeatureModal(featureName, level) {
    const modal = document.getElementById('inferno-feature-modal');
    if (!modal) return;
    
    // Check if already seen
    if (hasSeenFeature(featureName)) return;
    
    const titleEl = document.getElementById('inferno-feature-title');
    const contentEl = document.getElementById('inferno-feature-content');
    const okBtn = document.getElementById('inferno-feature-ok');
    
    if (!titleEl || !contentEl || !okBtn) return;
    
    // Set content based on feature
    let title, content;
    switch (featureName) {
        case 'directional':
            title = '🧭 Inward Blocks';
            content = `
                <p style="margin-bottom: 8px;">More blocks point <b>inward</b> now.</p>
                <p style="margin: 0;"><b>Tip:</b> Clear blockers first!</p>
            `;
            break;
        case 'length':
            title = '📏 Longer Blocks';
            content = `
                <p style="margin-bottom: 8px;">Longer blocks (2-3 cells) appear more often.</p>
                <p style="margin: 0;"><b>Tip:</b> Clear them early!</p>
            `;
            break;
        case 'vertical':
            title = '⬆️ Fewer Vertical';
            content = `
                <p style="margin-bottom: 8px;">Vertical blocks (move any direction) are now <b>rare</b>.</p>
                <p style="margin: 0;"><b>Tip:</b> Use them wisely!</p>
            `;
            break;
        case 'multilayer':
            title = '🏗️ Layer Blocking';
            content = `
                <p style="margin-bottom: 8px;">Upper layers can <b>block lower exits</b>.</p>
                <p style="margin: 0;"><b>Tip:</b> Check all layers first!</p>
            `;
            break;
        case 'spincost':
            title = '💸 Expensive Spins';
            content = `
                <p style="margin-bottom: 8px;">Spins cost <b>more time</b> at higher levels.</p>
                <p style="margin: 0;"><b>Tip:</b> Use only when needed!</p>
            `;
            break;
        case 'difficulty':
            title = '🎯 Guaranteed Challenge';
            content = `
                <p style="margin-bottom: 8px;">Puzzles are <b>guaranteed challenging</b>.</p>
                <p style="margin: 0;"><b>Tip:</b> Plan carefully!</p>
            `;
            break;
        default:
            return; // Unknown feature
    }
    
    titleEl.textContent = title;
    contentEl.innerHTML = content;
    
    // Freeze time if in time-based mode
    if (typeof setTimeFrozen === 'function') {
        setTimeFrozen('inferno_feature', true);
    }
    
    modal.style.display = 'flex';
    
    const onOk = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', onOk);
        markFeatureSeen(featureName);
        if (typeof setTimeFrozen === 'function') {
            setTimeFrozen('inferno_feature', false);
        }
    };
    
    okBtn.addEventListener('click', onOk);
}

/**
 * Check if user has seen a level update
 */
function hasSeenLevelUpdate(level) {
    try {
        return localStorage.getItem(`${LEVEL_UPDATE_KEY_PREFIX}${level}`) === '1';
    } catch {
        return false;
    }
}

/**
 * Mark level update as seen
 */
function markLevelUpdateSeen(level) {
    try {
        localStorage.setItem(`${LEVEL_UPDATE_KEY_PREFIX}${level}`, '1');
    } catch {
        // ignore
    }
}

/**
 * Show general level update modal (for all modes)
 * Provides meaningful context about what to expect at this level
 */
export function showLevelUpdateModal(level) {
    // Only show at specific intervals
    if (!LEVEL_UPDATE_INTERVALS.includes(level)) {
        return;
    }
    
    // Check if already seen
    if (hasSeenLevelUpdate(level)) {
        return;
    }
    
    // Use the feature modal structure (reusable)
    const modal = document.getElementById('inferno-feature-modal');
    if (!modal) return;
    
    const titleEl = document.getElementById('inferno-feature-title');
    const contentEl = document.getElementById('inferno-feature-content');
    const okBtn = document.getElementById('inferno-feature-ok');
    
    if (!titleEl || !contentEl || !okBtn) return;
    
    // Set content based on level
    let title, content;
    
    if (level === 1) {
        title = '🎮 Level 1';
        content = `<p style="margin: 0;">Move blocks to edges. They only go where arrows point. Clear blockers first!</p>`;
    } else if (level === 3) {
        title = '📈 Level 3';
        content = `<p style="margin: 0;">More blocks = more chaos. Order matters - clear blockers first!</p>`;
    } else if (level === 5) {
        title = '🌟 Level 5';
        content = `<p style="margin: 0;">3D puzzles now. Layers matter - think ahead!</p>`;
    } else if (level === 8) {
        title = '🚀 Level 8';
        content = `<p style="margin: 0;">Longer blocks incoming. Clear them early!</p>`;
    } else if (level === 12) {
        title = '💪 Level 12';
        content = `<p style="margin: 0;">Upper blocks can block lower exits. Check all layers!</p>`;
    } else if (level === 15) {
        title = '🔥 Level 15';
        content = `<p style="margin: 0;">Difficulty spike! More inward blocks. Spins are expensive.</p>`;
    } else if (level === 20) {
        title = '🎯 Level 20';
        content = `<p style="margin: 0;">Every move counts. Visualize first, then execute!</p>`;
    } else if (level === 30) {
        title = '🏆 Level 30';
        content = `<p style="margin: 0;">Maximum chaos! Break it into sections.</p>`;
    } else if (level === 40) {
        title = '⚡ Level 40';
        content = `<p style="margin: 0;">Elite tier! Precision required. Take your time!</p>`;
    } else if (level === 60) {
        title = '🌟 Level 60';
        content = `<p style="margin: 0;">Maximum difficulty! Every puzzle is a boss fight.</p>`;
    } else if (level === 75) {
        title = '👑 Level 75';
        content = `<p style="margin: 0;">Legend status! You're a master now.</p>`;
    } else if (level === 100) {
        title = '🎊 Level 100';
        content = `<p style="margin: 0;">Level 100! You're a Jarrows legend. Keep going!</p>`;
    } else {
        return; // No message for this level
    }
    
    titleEl.textContent = title;
    contentEl.innerHTML = content;
    
    // Freeze time if in time-based mode
    if (typeof setTimeFrozen === 'function') {
        setTimeFrozen('level_update', true);
    }
    
    modal.style.display = 'flex';
    
    const onOk = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', onOk);
        markLevelUpdateSeen(level);
        if (typeof setTimeFrozen === 'function') {
            setTimeFrozen('level_update', false);
        }
    };
    
    okBtn.addEventListener('click', onOk);
}
