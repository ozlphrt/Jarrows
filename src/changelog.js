/**
 * Changelog data for Jarrows
 * Maps version strings to changelog entries
 */

export const changelog = {
    "8.24.0": {
        title: "Dynamic Par Time Economy, Combo Multipliers & Strategic Spin Balancing",
        date: "2026-09-01",
        changes: [
            "Level-Aware Par Time Scaling: Each puzzle initializes with a calibrated par time tailored to its block count, with a max bank ceiling of 1.5x par to eliminate runaway 50-minute marathons",
            "Skill Carryover Bonus: Fast level completions carry over up to 25% of the next level's par time as a skill head-start",
            "Rhythmic Combo Rewards: Chaining moves within 2.4s triggers escalating combo multipliers (up to 2.5x) for high-tempo play",
            "Strategic Spin Cost & Escalation: Spins cost a fair toll (8s - 25s) based on level par, with consecutive spin escalation (1.5x - 2.0x) that resets after 16s of regular play",
            "Clutch Spin Grace Window: Spins in critical low-time situations leave at least 3.0s on the clock to give the player a clutch solve window"
        ]
    },
    "8.23.0": {
        title: "Smoke Burst on Tap, Crisp Ash Dissolution & Endgame Cooldown Acceleration",
        date: "2026-09-01",
        changes: [
            "Cooling Block Tap Feedback & Smoke Bursts: Tapping smoldering or cooling blocks triggers a vivid burst of billowing smoke puffs, embers, wobble shake, and informative guidance",
            "Crisp Ash Dissolution Curve: Ash soot remains prominently dark for the bulk of the cooldown period and then clears inward smoothly and crisply, making cooldown status immediately obvious",
            "Endgame Cooldown Acceleration: Cooldown progression automatically speeds up 2.4x - 3.5x when 3-4 or fewer blocks remain on the board, eliminating unnecessary endgame wait times",
            "Synchronized Outside-In Block Unlocking: Blocks unlock progressively the exact moment the clearing ash boundary retreats past them"
        ]
    },
    "8.22.0": {
        title: "Tower Support Physics Stability & Real-Time Layout Debug Capture",
        date: "2026-09-01",
        changes: [
            "Fixed Stand-Alone Suspension Bug: Support grid dynamically indexes active falling blocks at their destination landing target, preventing falling upper blocks from dropping through or getting suspended in mid-air",
            "Safe Physical Overlap Resolution: Puzzle structure repair engine strictly requires physical support and no longer elevates blocks into unsupported air",
            "Animation Support Check Isolation: Block bounce and movement animations are strictly protected from premature support checks during multi-block cascades",
            "Desktop Click Support Parity: Mouse interactions trigger full support checks identically to touch inputs",
            "Debug Layout Clipboard Export (DBG): Added settings button to copy complete 3D puzzle block coordinate metadata in formatted JSON"
        ]
    },
    "8.21.0": {
        title: "Multi-Blast Cooldown Engine & Atmospheric Detonation Aftermath",
        date: "2026-08-31",
        changes: [
            "Independent Multi-Blast Engine: Supports up to 6 concurrent explosions with isolated GPU slots and distinct cooldown lifecycles",
            "4-Phase Detonation Aftermath: Rapid heat bloom, molten cooling, deep charcoal ash dwell, and progressive ash dissolution",
            "Volumetric Billboard Smoke System: 320-sprite pool emitting organic billowing cloud puffs directly from the blast epicenter",
            "Accurate Visual Blast Locking: Calibrated shockwave radius ensuring only visibly charred crater blocks are locked, keeping clean outer blocks freely playable",
            "Full Cooldown Immobilization: Affected blocks remain safely immobilized across all phases until ash has 100% dissolved",
            "Ash Soot Shader Coating: Sinks glowing indicators and overlays burnt charcoal soot on direct and ambient block faces"
        ]
    },
    "8.20.0": {
        title: "Welded Translucent Ice Clusters & Radial Tower Physics",
        date: "2026-08-28",
        changes: [
            "Welded Crystal Ice Clusters: Adjacent locked translucent blocks weld together when 3+ blocks connect, adopting a unified frosted crystal ice aesthetic and icy indicators",
            "Individual Locked Translucency: 1-2 colliding locked blocks maintain their individual translucent color styling",
            "Rigid Cluster Support & Dissolution: Welded clusters calculate support as rigid bodies and dissolve back into normal blocks upon landing on the base plate",
            "Radial Tower Shockwave: Attempting to push locked/translucent blocks triggers a distance-attenuated chaotic vibration across the entire tower",
            "Translucent Explosive Guard: Explosive blocks are safely deactivated while in translucent mode"
        ]
    },
    "8.19.0": {
        title: "Single Draw-Call Instanced Rendering & GPU Shader Acceleration",
        date: "2026-08-26",
        changes: [
            "Debris explosion instanced rendering: Reduced debris draw calls from 500 down to 1",
            "GPU shader acceleration: Offloaded bomb breathing, indicators, and highlight pulsing to vertex/fragment shaders",
            "Active subset tracking: Replaced 1,000-block per-frame iterations with active moving block tracking",
            "Wake-on-demand rendering: Scene automatically sleeps at 0% GPU load when motionless, saving battery and preventing thermal throttling"
        ]
    },
    "5.0.0": {
        title: "Major Update: Enhanced Lighting System & Debug Tools",
        date: "2026-01-13",
        changes: [
            "Major lighting system overhaul with optimized default values",
            "Added comprehensive light controls in debug panel with dat.gui styling",
            "Implemented manual light control sliders (ambient, key, fill) with immediate visual feedback",
            "Added JSON load/capture functionality for light values",
            "Fixed grid alignment with block cell boundaries",
            "Improved debug panel layout and compactness",
            "Disabled automatic light updates when manually controlling lights via debug panel",
            "Enhanced shadow quality and performance"
        ]
    },
    "4.7.4": {
        title: "Debug Panel Improvements & Light Controls",
        date: "2026-01-13",
        changes: [
            "Added collapsible light controls section in debug panel with dat.gui styling",
            "Implemented manual light control sliders (ambient, key, fill) with immediate visual feedback",
            "Added JSON load/capture functionality for light values",
            "Fixed grid alignment with block cell boundaries",
            "Improved debug panel layout and compactness",
            "Disabled automatic light updates when manually controlling lights via debug panel"
        ]
    },
    "4.7.3": {
        title: "Physics Collision Fixes",
        date: "2026-01-13",
        changes: [
            "Fixed vertical blocks overlapping after head-on collisions",
            "Fixed blocks falling multiple layers after head-on collisions",
            "Fixed blocks continuing movement after head-on collision when position overlaps",
            "Improved collision detection accuracy for horizontal multi-cell blocks"
        ]
    },
    "4.7.2": {
        title: "Debug Panel & Collision Improvements",
        date: "2026-01-13",
        changes: [
            "Added comprehensive debug panel with collision event tracking",
            "Enhanced head-on collision detection for all block types",
            "Improved movement calculation logging for bug investigation"
        ]
    },
    "4.7.1": {
        title: "Physics System Refinements",
        date: "2026-01-12",
        changes: [
            "Refined block collision physics rules",
            "Improved support checking and falling mechanics",
            "Enhanced visual feedback for collisions"
        ]
    }
};

/**
 * Get changelog entry for a specific version
 * @param {string} version - Version string (e.g., "4.7.3")
 * @returns {Object|null} Changelog entry or null if not found
 */
export function getChangelogForVersion(version) {
    return changelog[version] || null;
}

/**
 * Get all changelog entries sorted by version (newest first)
 * @returns {Array} Array of {version, ...entry} objects
 */
export function getAllChangelogs() {
    return Object.entries(changelog)
        .map(([version, entry]) => ({ version, ...entry }))
        .sort((a, b) => {
            // Simple version comparison (assumes semantic versioning)
            const aParts = a.version.split('.').map(Number);
            const bParts = b.version.split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                const aVal = aParts[i] || 0;
                const bVal = bParts[i] || 0;
                if (bVal !== aVal) return bVal - aVal;
            }
            return 0;
        });
}
