/**
 * Changelog data for Jarrows
 * Maps version strings to changelog entries
 */

export const changelog = {
    "8.36.1": {
        title: "Uniform Block Scale & Gap-Free Inferno Relocation",
        date: "2026-09-12",
        changes: [
            "Uniform Mobile Block Size: Removed scale-based level spawning and commits every block at canonical scale, preventing iPhone frame scheduling from leaving blocks visibly undersized",
            "Full-Footprint Relocation Support: Inferno dependency placement now requires direct support beneath every cell of a moved block, preventing randomized cantilevers and hollow shelves",
            "Safe Overlap Repair: Automatic overlap correction applies the same full-footprint support invariant before relocating blocks",
            "Final Tower Support Audit: Completed towers are validated after all post-processing and regenerated if any unsupported footprint remains"
        ]
    },
    "8.36.0": {
        title: "100% Strict Support, Zero Overhangs & Floating Block Elimination",
        date: "2026-09-12",
        changes: [
            "100% Strict Vertical Support: Upper layer horizontal blocks now require all cells to have direct solid support beneath them, completely eliminating cantilevered overhangs and floating blocks",
            "Unrestricted Single-Block Void Filling: Removed the 90% rejection of single-cell blocks in Step 4, ensuring all supported voids are filled solidly without leaving empty pockets",
            "Cohesive Ground Foundation: Balanced base layer vertical block probability to 35%, ensuring a flat, dense foundation for upper layers",
            "Layer Skipping Prevention: Prevented generator from advancing layers when zero blocks are placed, eliminating empty horizontal sandwich voids"
        ]
    },
    "8.35.0": {
        title: "Dense Tower Packing, Direct Vertical Support & Gap-Free Generation",
        date: "2026-09-12",
        changes: [
            "Dense Gap-Free Tower Generation: Eliminated artificial layer capping (TOWER_HEIGHT_RATIO) so multi-layer towers pack solidly without empty shelves, loose spacing, or hollow interiors",
            "Direct Vertical Support Verification: Upper layer blocks now verify direct vertical contact from the layer immediately below via 3D Y-ranges, preventing layer-skipping voids and floating overhangs",
            "Void & Gap Filling: Allowed single-cell blocks to fill isolated gaps in puzzle generation passes, ensuring full and cohesive layer coverage",
            "Support Preservation on Relocation: Inward edge adjustments now check direct vertical support before shifting blocks, preventing newly created gaps"
        ]
    },
    "8.34.0": {
        title: "Architectural Modernization, 3D Spin Button, Calibrated Physics & Streamlined HUD",
        date: "2026-09-12",
        changes: [
            "3D Isometric Cube Spin Button: Replaced misleading browser reload/sync icon with an intuitive 3D isometric cube and orbital rotation arrow, enlarged and centered for effortless mobile touch response",
            "Calibrated Fall & Explosion Tremors: Tuned whole-tower physical vibration, radial block ripple, and camera shake for crisp, satisfying impact feedback without disorienting screen jumps",
            "Streamlined Settings Menu: Removed redundant diagnostic preset buttons (colors, lighting, shadows, battery quality, debug clipboard) for a focused, clean preferences HUD",
            "Refined Level Display: Top-bar level badge is a dedicated non-interactive stat counter, while interactive level selection remains cleanly accessible via the LVL modal button",
            "Core Architectural Modernization: Extracted over 3,600 lines into modular ES subsystems (LevelGenerator.js, DialogManager.js, BlockView.js, settings.js, EventBus.js), reducing index.html to under 1,000 lines",
            "Automated Vitest Test Suite: Added 69 comprehensive unit and regression tests across 12 test suites covering puzzle generation, fall physics, and modal lifecycles",
            "AudioContext Autoplay Compliance: Eliminated browser console warnings on initial load by instantiating web audio strictly upon first player gesture"
        ]
    },
    "8.33.0": {
        title: "Robust Level Progression, Unified Button Spin Countdown & Production Stability",
        date: "2026-09-12",
        changes: [
            "Production Tile Spawning Stability: Eliminated diagnostic ReferenceError in direction indicator verification that crashed block instantiation when hosted outside localhost, ensuring rock-solid tile generation on GitHub Pages and online hosting",
            "Single Unified Spin Countdown: Replaced dual-timer overlap with a single sleek kinetic countdown badge positioned directly over the bottom-left spin button",
            "Level Progression Loop Fix: Resolved race conditions in level transition timeouts that could cause level completion modals to loop consecutively",
            "Unconditional Clean Splicing: Removed blocks are now spliced out on every frame regardless of active movement state, preventing ghost block remnants",
            "Synchronized Level Clear Verification: Level completion checks now strictly wait for all active block clearing animations and detonations to complete before presenting the victory dialog"
        ]
    },
    "8.32.2": {
        title: "Fix Tile Spawning on Online Production Hosting",
        date: "2026-09-12",
        changes: [
            "Block Spawning Fix: Eliminated fatal ReferenceError in direction indicator diagnostics that crashed block instantiation when hosted outside localhost, restoring full tile generation on GitHub Pages and production domains"
        ]
    },
    "8.32.1": {
        title: "Level Progression Loop Resolution & Robust Victory State Synchronization",
        date: "2026-09-12",
        changes: [
            "Level Progression Loop Fix: Resolved race condition where asynchronous generation timeouts caused consecutive level-complete modals to cycle infinitely without spawning playable blocks",
            "Unconditional Removed Block Cleanup: Spliced removed blocks from active tracking arrays on every animation frame regardless of movement state, eliminating ghost blocks",
            "Robust Victory State Synchronization: Level completion check now strictly verifies that all playable blocks are cleared and removal animations have fully finished before triggering the completion modal",
            "Lifecycle State Guards: Initialized playable state flags across all level transitions, restarts, and debug layout loaders"
        ]
    },
    "8.32.0": {
        title: "Animated Spin Countdown Over Button, Balanced Ash Colors & Fluid Detonation Physics",
        date: "2026-09-11",
        changes: [
            "Animated Spin Countdown Over Button: Repositioned kinetic countdown from screen top to hover directly over the bottom-left spin button, keeping the tower and upper tiles 100% visible and unobstructed",
            "Natural Slate-Charcoal Ash Color: Tuned ash shader coloration to a soft, balanced slate-charcoal grey with directional falloff for natural combustion dissolution",
            "Vivid Crimson Indicators: Enhanced length-1 indicators with deeper, richer crimson contrast against porcelain block bodies",
            "Smooth Detonation Dissolution: Resolved stuttering tile disappearance by deferring post-blast gravity recalculations until dissolution finishes, ensuring smooth particle dissipation",
            "Tile Color Stability on Spin: Removed residual emissive block body artifacts during and after temporary spin shuffles"
        ]
    },
    "8.27.1": {
        title: "4-Tier Studio Lighting Exposure & iPhone Shading Readability",
        date: "2026-09-02",
        changes: [
            "4-Tier Studio Lighting Exposure: Calibrated the studio light rig so all four vertical faces of the tower have distinct, gradual exposures (Side 1 brightest -> Side 2 less bright -> Side 3 balanced -> Side 4 gentle shade)",
            "Mobile/iPhone Shading Readability: Increased ambient studio baseline and fill light, completely eliminating overly dark/murky shadow faces on OLED screens while maintaining rich 3D shading depth",
            "Anchored Studio Rig: Anchored key, fill, and rim lights around the tower center for stable, consistent 3D appearance without artificial light spinning during orbit"
        ]
    },
    "8.27.0": {
        title: "Synchronized Pulsing Bomb Indicators, Cooling Translucency & Calibrated Camera Framing",
        date: "2026-09-02",
        changes: [
            "Synchronized Pulsing Bomb Indicators: All bomb block indicators (top arrow, forward dot, and backward circle) are now fully self-emissive and pulse in synchronized double-burst hazard strobe cycles on the GPU",
            "Cooling Blocks 80% Translucency: All arrows, dots, and circles on cooling/charred blocks become 80% translucent (opacity: 0.20) for immediate visual clarity while cooling down, smoothly restoring upon completion",
            "Dynamic Blast Strobe Effects: Disintegrating blocks flash with high-frequency self-emissive strobe sequences and thermal core dissolution during explosions and high-impact crushes",
            "Calibrated Camera Framing: Balanced auto-zoom and bounding box calculations provide comfortable tower visibility and breathing room without edge cropping or excessive distance",
            "Clean Matte Indicator Contrast: Idle non-bomb blocks feature clean, matte length-based colors with zero unprompted emissive glare"
        ]
    },
    "8.26.0": {
        title: "0 FPS Dirty-Frame Rendering, Battery Status API & Shadow Bypass Toggle",
        date: "2026-09-02",
        changes: [
            "Complete 0 FPS Dirty-Frame Rendering: WebGL render loop completely sleeps (0 FPS) during idle gameplay in non-timed modes until pointer/touch interaction or animation occurs, reducing GPU draw overhead by up to 90%",
            "Hardware Battery Status API Auto-Switch: Automatically monitors navigator.getBattery() and transitions smoothly into the Battery Saver preset when device charge falls to 20% or below",
            "Dynamic Shadow Map Bypass Toggle: Added 'SHD' toggle switch in Settings to instantly enable/disable directional shadow maps for optimal framerates on older mobile devices",
            "Web Audio Context Sleep on Inactivity: Automatically suspends the Web Audio AudioContext after 45 seconds of idle inactivity, releasing audio hardware DAC and threads with zero latency on resume",
            "Multi-Layer Ice Collision Locking & 3+ Cluster Threshold: Enforced 3+ block requirement for frosted crystal welding while supporting bottom-layer collision locking"
        ]
    },
    "8.25.0": {
        title: "Ground-Rooted Support Physics, Full Indicator Defrosting & Organic Blast Shaders",
        date: "2026-09-01",
        changes: [
            "Ground-Rooted Support Physics: Replaced local peer checks with a global ground-rooted reachability graph from y=0 upwards, eliminating mutual support deadlocks where multi-layer frosted clusters and sandwiched blocks floated in mid-air",
            "Base Plate Cluster Dissolution & Color Restoration: Landing on the base plate at y=0 comprehensively unlocks frosted clusters and restores vibrant length-based palette colors (Red, Teal, Yellow) to all arrows and indicators",
            "Hollow Ring Geometry & Additive Artifact Elimination: Removed secondary additive mesh domes and quads, rendering circle indicators as clean, crisp 3D rings with zero bright pinpoint light spots in their hollow centers",
            "Gap-Aware Non-Spherical Blast Shaders: Blended Chebyshev and Euclidean metrics with 3D procedural turbulence for realistic rectangular shockwave channeling along block crevices",
            "Dynamic Spin Cost & Level Timer Balancing: Implemented bomb-aware timer calculations with a 3:30 par ceiling, and scaled spin costs dynamically (8% - 18% of par) without artificial caps"
        ]
    },
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
