/**
 * Inferno Mode Modals System
 * 
 * Handles explanation modals for Inferno mode features:
 * - Milestone modals (levels 10, 25, 50)
 * - Feature-specific modals (first encounter)
 */

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
        title = '🔥 Milestone: Level 10';
        content = `
            <p style="margin-bottom: 12px;">Congratulations! You've reached the first difficulty milestone.</p>
            <p style="margin-bottom: 12px;"><b>What's changing:</b></p>
            <ul>
                <li>More blocks point <b>inward</b> (harder to clear)</li>
                <li>Longer blocks appear more often</li>
                <li>Fewer flexible vertical blocks</li>
                <li>Spins cost more time</li>
            </ul>
            <p style="margin-top: 12px;">Difficulty will increase gradually over the next few levels. Good luck!</p>
        `;
    } else if (level === 25) {
        title = '🔥 Milestone: Level 25';
        content = `
            <p style="margin-bottom: 12px;">Impressive! You've reached the second difficulty milestone.</p>
            <p style="margin-bottom: 12px;"><b>What's changing:</b></p>
            <ul>
                <li>Even more blocks point <b>inward</b></li>
                <li>Most blocks are now <b>long</b> (2-3 cells)</li>
                <li>Very few vertical blocks remain</li>
                <li>Upper layers can <b>block lower exits</b></li>
                <li>Spins are now <b>very expensive</b></li>
            </ul>
            <p style="margin-top: 12px;">The heat is rising! Difficulty increases over the next few levels.</p>
        `;
    } else if (level === 50) {
        title = '🔥 Milestone: Level 50';
        content = `
            <p style="margin-bottom: 12px;">Incredible! You've reached the ultimate milestone!</p>
            <p style="margin-bottom: 12px;"><b>What's changing:</b></p>
            <ul>
                <li>Maximum difficulty scaling reached</li>
                <li>Almost all blocks point <b>inward</b></li>
                <li>Most blocks are <b>3 cells long</b></li>
                <li>Vertical blocks are <b>extremely rare</b></li>
                <li>Complex multi-layer dependencies</li>
                <li>Spins cost <b>most of your time</b></li>
            </ul>
            <p style="margin-top: 12px;">After level 50, difficulty continues increasing at a slower rate. You're in the Inferno now!</p>
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
            title = '🧭 Directional Complexity';
            content = `
                <p style="margin-bottom: 12px;">More blocks now point <b>inward</b> instead of toward the edges!</p>
                <p style="margin-bottom: 12px;">This means you'll need to clear blocking blocks first before you can remove the ones behind them.</p>
                <p style="margin-top: 12px;"><b>Tip:</b> Plan your moves carefully - look for blocks that can exit immediately!</p>
            `;
            break;
        case 'length':
            title = '📏 Longer Blocks';
            content = `
                <p style="margin-bottom: 12px;">Longer blocks (2-3 cells) appear more frequently now!</p>
                <p style="margin-bottom: 12px;">These blocks take up more space and create more complex blocking relationships.</p>
                <p style="margin-top: 12px;"><b>Tip:</b> Longer blocks are harder to clear - prioritize them when possible!</p>
            `;
            break;
        case 'vertical':
            title = '⬆️ Fewer Flexible Blocks';
            content = `
                <p style="margin-bottom: 12px;">Vertical blocks (which can move in any direction) are now <b>rare</b>!</p>
                <p style="margin-bottom: 12px;">Most blocks can only move in one direction, making puzzles more challenging.</p>
                <p style="margin-top: 12px;"><b>Tip:</b> Use vertical blocks wisely - they're your most flexible option!</p>
            `;
            break;
        case 'multilayer':
            title = '🏗️ Multi-Layer Complexity';
            content = `
                <p style="margin-bottom: 12px;">Upper layer blocks can now <b>block lower layer exits</b>!</p>
                <p style="margin-bottom: 12px;">You'll need to think in 3D - sometimes you must clear upper blocks before lower ones can exit.</p>
                <p style="margin-top: 12px;"><b>Tip:</b> Check which blocks are blocking others - the solution order matters!</p>
            `;
            break;
        case 'spincost':
            title = '💸 Expensive Spins';
            content = `
                <p style="margin-bottom: 12px;">Spins now cost <b>more time</b> at higher levels!</p>
                <p style="margin-bottom: 12px;">The cost increases with each level, making spins a strategic decision rather than a free action.</p>
                <p style="margin-top: 12px;"><b>Tip:</b> Use spins only when necessary - they're expensive!</p>
            `;
            break;
        case 'difficulty':
            title = '🎯 Guaranteed Challenge';
            content = `
                <p style="margin-bottom: 12px;">Puzzles are now <b>guaranteed to be challenging</b>!</p>
                <p style="margin-bottom: 12px;">The game ensures every puzzle meets a minimum difficulty threshold, so you'll always face a real challenge.</p>
                <p style="margin-top: 12px;"><b>Tip:</b> Every puzzle is solvable, but requires careful planning!</p>
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
