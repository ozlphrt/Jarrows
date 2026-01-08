/**
 * Inferno Mode Difficulty Configuration
 * 
 * Calculates difficulty parameters based on level, with milestone transitions
 * and post-50 scaling at 50% rate.
 */

/**
 * Calculate milestone transition progress (0.0 to 1.0) over 3-5 levels
 * @param {number} level - Current level
 * @param {number} milestoneLevel - Milestone level (10, 25, or 50)
 * @param {number} transitionLength - Number of levels for transition (default 4)
 * @returns {number} Transition progress from 0.0 to 1.0
 */
function getMilestoneTransition(level, milestoneLevel, transitionLength = 4) {
    if (level < milestoneLevel) return 0.0;
    if (level >= milestoneLevel + transitionLength) return 1.0;
    
    const progress = (level - milestoneLevel) / transitionLength;
    return Math.min(1.0, Math.max(0.0, progress));
}

/**
 * Calculate post-50 scaling factor (50% rate)
 * @param {number} level - Current level
 * @returns {number} Scaling factor (1.0 for level <= 50, then increases at 50% rate)
 */
function getPost50Scaling(level) {
    if (level <= 50) return 1.0;
    const levelsPast50 = level - 50;
    // 50% rate: each level past 50 adds 0.5 to the scaling
    return 1.0 + (levelsPast50 * 0.5);
}

/**
 * Linear interpolation between two values
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Get directional complexity (outward-facing percentage)
 * Lower percentage = more inward blocks = harder
 */
function getDirectionalComplexity(level) {
    // Base values at different level ranges
    let baseValue;
    if (level <= 5) {
        baseValue = 0.70; // 70% outward
    } else if (level <= 10) {
        // Transition from 70% to 50% over levels 6-10
        const t = (level - 5) / 5;
        baseValue = lerp(0.70, 0.50, t);
    } else if (level <= 25) {
        // Transition from 50% to 30% over levels 11-25
        const t10 = getMilestoneTransition(level, 10, 4);
        const t25 = getMilestoneTransition(level, 25, 4);
        if (level < 14) {
            // Still transitioning from 10 milestone
            baseValue = lerp(0.50, 0.30, t10);
        } else {
            // Transitioning to 25 milestone
            baseValue = lerp(0.30, 0.15, t25);
        }
    } else if (level <= 50) {
        // Transition from 30% to 15% over levels 26-50
        const t25 = getMilestoneTransition(level, 25, 4);
        const t50 = getMilestoneTransition(level, 50, 4);
        if (level < 29) {
            // Still transitioning from 25 milestone
            baseValue = lerp(0.30, 0.15, t25);
        } else {
            // Transitioning to 50 milestone
            baseValue = lerp(0.15, 0.10, t50);
        }
    } else {
        // Post-50: continue decreasing at 50% rate
        const t50 = getMilestoneTransition(50, 50, 4);
        const baseAt50 = lerp(0.15, 0.10, t50);
        const scaling = getPost50Scaling(level);
        // Continue decreasing, but at 50% rate (minimum 5%)
        baseValue = Math.max(0.05, baseAt50 - ((level - 50) * 0.01 * (scaling - 1.0)));
    }
    
    return Math.max(0.05, Math.min(0.70, baseValue));
}

/**
 * Get block length distribution (percentages for length 1, 2, 3)
 * Returns { length1: number, length2: number, length3: number }
 */
function getBlockLengthDistribution(level) {
    let length1, length2, length3;
    
    if (level <= 5) {
        length1 = 0.40;
        length2 = 0.40;
        length3 = 0.20;
    } else if (level <= 10) {
        // Transition from 40/40/20 to 30/40/30
        const t = (level - 5) / 5;
        length1 = lerp(0.40, 0.30, t);
        length2 = 0.40;
        length3 = lerp(0.20, 0.30, t);
    } else if (level <= 25) {
        // Transition from 30/40/30 to 20/35/45
        const t10 = getMilestoneTransition(level, 10, 4);
        const t25 = getMilestoneTransition(level, 25, 4);
        if (level < 14) {
            length1 = lerp(0.30, 0.20, t10);
            length2 = lerp(0.40, 0.35, t10);
            length3 = lerp(0.30, 0.45, t10);
        } else {
            length1 = lerp(0.20, 0.10, t25);
            length2 = lerp(0.35, 0.30, t25);
            length3 = lerp(0.45, 0.60, t25);
        }
    } else if (level <= 50) {
        // Transition from 20/35/45 to 10/30/60
        const t25 = getMilestoneTransition(level, 25, 4);
        const t50 = getMilestoneTransition(level, 50, 4);
        if (level < 29) {
            length1 = lerp(0.20, 0.10, t25);
            length2 = lerp(0.35, 0.30, t25);
            length3 = lerp(0.45, 0.60, t25);
        } else {
            length1 = lerp(0.10, 0.05, t50);
            length2 = lerp(0.30, 0.25, t50);
            length3 = lerp(0.60, 0.70, t50);
        }
    } else {
        // Post-50: continue shifting at 50% rate
        const t50 = getMilestoneTransition(50, 50, 4);
        const base1 = lerp(0.10, 0.05, t50);
        const base2 = lerp(0.30, 0.25, t50);
        const base3 = lerp(0.60, 0.70, t50);
        const scaling = getPost50Scaling(level);
        const shift = (level - 50) * 0.005 * (scaling - 1.0);
        length1 = Math.max(0.02, base1 - shift);
        length2 = Math.max(0.20, base2 - shift * 0.5);
        length3 = Math.min(0.78, base3 + shift * 1.5);
    }
    
    // Normalize to ensure they sum to 1.0
    const sum = length1 + length2 + length3;
    return {
        length1: length1 / sum,
        length2: length2 / sum,
        length3: length3 / sum
    };
}

/**
 * Get vertical block frequency (percentage of vertical blocks)
 * Lower percentage = fewer flexible blocks = harder
 */
function getVerticalBlockFrequency(level) {
    let baseValue;
    
    if (level <= 5) {
        baseValue = 0.30; // 30% vertical
    } else if (level <= 10) {
        // Transition from 30% to 20%
        const t = (level - 5) / 5;
        baseValue = lerp(0.30, 0.20, t);
    } else if (level <= 25) {
        // Transition from 20% to 10%
        const t10 = getMilestoneTransition(level, 10, 4);
        const t25 = getMilestoneTransition(level, 25, 4);
        if (level < 14) {
            baseValue = lerp(0.20, 0.10, t10);
        } else {
            baseValue = lerp(0.10, 0.05, t25);
        }
    } else if (level <= 50) {
        // Transition from 10% to 5%
        const t25 = getMilestoneTransition(level, 25, 4);
        const t50 = getMilestoneTransition(level, 50, 4);
        if (level < 29) {
            baseValue = lerp(0.10, 0.05, t25);
        } else {
            baseValue = lerp(0.05, 0.02, t50);
        }
    } else {
        // Post-50: continue decreasing at 50% rate (minimum 1%)
        const t50 = getMilestoneTransition(50, 50, 4);
        const baseAt50 = lerp(0.05, 0.02, t50);
        const scaling = getPost50Scaling(level);
        baseValue = Math.max(0.01, baseAt50 - ((level - 50) * 0.001 * (scaling - 1.0)));
    }
    
    return Math.max(0.01, Math.min(0.30, baseValue));
}

/**
 * Get multi-layer complexity (percentage of upper layer blocks that block lower exits)
 */
function getMultilayerComplexity(level) {
    let baseValue;
    
    if (level <= 10) {
        baseValue = 0.0; // No special dependencies
    } else if (level <= 25) {
        // Transition from 0% to 20%
        const t10 = getMilestoneTransition(level, 10, 4);
        const t25 = getMilestoneTransition(level, 25, 4);
        if (level < 14) {
            // Introduce concept at level 10
            baseValue = lerp(0.0, 0.10, t10);
        } else {
            baseValue = lerp(0.10, 0.20, t25);
        }
    } else if (level <= 50) {
        // Transition from 20% to 40%
        const t25 = getMilestoneTransition(level, 25, 4);
        const t50 = getMilestoneTransition(level, 50, 4);
        if (level < 29) {
            baseValue = lerp(0.20, 0.40, t25);
        } else {
            baseValue = lerp(0.40, 0.60, t50);
        }
    } else {
        // Post-50: continue increasing at 50% rate (maximum 80%)
        const t50 = getMilestoneTransition(50, 50, 4);
        const baseAt50 = lerp(0.40, 0.60, t50);
        const scaling = getPost50Scaling(level);
        baseValue = Math.min(0.80, baseAt50 + ((level - 50) * 0.01 * (scaling - 1.0)));
    }
    
    return Math.max(0.0, Math.min(0.80, baseValue));
}

/**
 * Get spin cost multiplier (fraction of remaining time to charge)
 * Higher multiplier = more expensive spins = harder
 */
function getSpinCostMultiplier(level) {
    let baseValue;
    
    if (level <= 5) {
        baseValue = 1/3; // 33.3%
    } else if (level <= 10) {
        // Transition from 1/3 to 1/2
        const t = (level - 5) / 5;
        baseValue = lerp(1/3, 1/2, t);
    } else if (level <= 25) {
        // Transition from 1/2 to 2/3
        const t10 = getMilestoneTransition(level, 10, 4);
        const t25 = getMilestoneTransition(level, 25, 4);
        if (level < 14) {
            baseValue = lerp(1/2, 2/3, t10);
        } else {
            baseValue = lerp(2/3, 3/4, t25);
        }
    } else if (level <= 50) {
        // Transition from 2/3 to 3/4
        const t25 = getMilestoneTransition(level, 25, 4);
        const t50 = getMilestoneTransition(level, 50, 4);
        if (level < 29) {
            baseValue = lerp(2/3, 3/4, t25);
        } else {
            baseValue = lerp(3/4, 0.85, t50);
        }
    } else {
        // Post-50: continue increasing at 50% rate (maximum 90%)
        const t50 = getMilestoneTransition(50, 50, 4);
        const baseAt50 = lerp(3/4, 0.85, t50);
        const scaling = getPost50Scaling(level);
        baseValue = Math.min(0.90, baseAt50 + ((level - 50) * 0.005 * (scaling - 1.0)));
    }
    
    return Math.max(1/3, Math.min(0.90, baseValue));
}

/**
 * Get difficulty score threshold (minimum difficulty for puzzle generation)
 */
function getDifficultyThreshold(level) {
    let baseValue;
    
    if (level <= 10) {
        baseValue = 50; // Easy-medium
    } else if (level <= 25) {
        // Transition from 50 to 100
        const t10 = getMilestoneTransition(level, 10, 4);
        const t25 = getMilestoneTransition(level, 25, 4);
        if (level < 14) {
            baseValue = lerp(50, 100, t10);
        } else {
            baseValue = lerp(100, 200, t25);
        }
    } else if (level <= 50) {
        // Transition from 200 to 400
        const t25 = getMilestoneTransition(level, 25, 4);
        const t50 = getMilestoneTransition(level, 50, 4);
        if (level < 29) {
            baseValue = lerp(200, 400, t25);
        } else {
            baseValue = lerp(400, 600, t50);
        }
    } else {
        // Post-50: continue scaling at 50% rate
        const t50 = getMilestoneTransition(50, 50, 4);
        const baseAt50 = lerp(400, 600, t50);
        const scaling = getPost50Scaling(level);
        baseValue = baseAt50 + ((level - 50) * 20 * (scaling - 1.0));
    }
    
    return Math.max(50, baseValue);
}

/**
 * Get complete difficulty configuration for a level
 * @param {number} level - Current level
 * @returns {Object} Configuration object with all difficulty parameters
 */
export function getInfernoDifficultyConfig(level) {
    const lengthDist = getBlockLengthDistribution(level);
    
    return {
        // Directional complexity: percentage of blocks pointing outward
        outwardPercentage: getDirectionalComplexity(level),
        
        // Block length distribution
        lengthDistribution: lengthDist,
        
        // Vertical block frequency: percentage of vertical blocks
        verticalPercentage: getVerticalBlockFrequency(level),
        
        // Multi-layer complexity: percentage of upper blocks that block lower exits
        multilayerBlockingPercentage: getMultilayerComplexity(level),
        
        // Spin cost multiplier: fraction of remaining time
        spinCostMultiplier: getSpinCostMultiplier(level),
        
        // Difficulty threshold: minimum difficulty score
        difficultyThreshold: getDifficultyThreshold(level),
        
        // Helper: check if level is a milestone
        isMilestone: level === 10 || level === 25 || level === 50,
        
        // Helper: get milestone number if applicable
        milestoneNumber: level === 10 ? 10 : level === 25 ? 25 : level === 50 ? 50 : null
    };
}
