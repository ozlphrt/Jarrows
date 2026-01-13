/**
 * Changelog data for Jarrows
 * Maps version strings to changelog entries
 */

export const changelog = {
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
