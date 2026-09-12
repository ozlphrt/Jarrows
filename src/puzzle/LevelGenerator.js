import * as THREE from 'three';
import { Block } from '../Block.js';
import { canBlockExit, getBlockCells } from '../puzzle_validation.js';
import { getInfernoDifficultyConfig } from '../inferno_difficulty.js';

export const DEFAULT_BLAST_CELL_PERCENT = 8;
export const MAX_BLAST_CELL_PERCENT = 20;

export const directions = [
    { x: 1, z: 0 },   // East
    { x: -1, z: 0 },  // West
    { x: 0, z: 1 },   // South
    { x: 0, z: -1 }   // North
];

export function shuffleArray(array) {
    if (!array || !Array.isArray(array)) return array;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const generatorContext = {
    gridSize: 7,
    cubeSize: 1,
    scene: null,
    physics: null,
    currentArrowStyle: 2,
    blocks: [],
    blastCellPercent: DEFAULT_BLAST_CELL_PERCENT
};

export function setGeneratorContext(ctx) {
    if (ctx && typeof ctx === 'object') {
        Object.assign(generatorContext, ctx);
    }
}

export function getGeneratorContext() {
    return generatorContext;
}

export function setBlastCellPercent(percent) {
    generatorContext.blastCellPercent = Math.max(0, Math.min(MAX_BLAST_CELL_PERCENT, percent));
    return generatorContext.blastCellPercent;
}

export function getBlastCellPercent() {
    return generatorContext.blastCellPercent;
}


export function getBlocksForLevel(level) {
    if (level === 0) {
        return 3;
    }
    
    let count;
    if (level <= 50) {
        count = 10 + (level - 1) * 10;
    } else {
        count = 500 + (level - 50) * 2;
    }
    
    return Math.min(1000, count);
}

// Validation functions are now imported from puzzle_validation.js



export function getBlastCellProbabilityForLevel(level, customPercent = null) {
    if (level < 10) {
        return 0;
    }
    const pct = customPercent ?? generatorContext.blastCellPercent;
    return Math.max(0, Math.min(MAX_BLAST_CELL_PERCENT, pct)) / 100;
}

export function getBlockFootprintCellCount(block) {
    if (!block) return 0;
    if (block.isVertical) return 1;
    return Math.max(1, block.length || 1);
}

export function getEligibleBlocksForBlastTuning(customBlocks = null) {
    const list = Array.isArray(customBlocks) ? customBlocks : (Array.isArray(generatorContext.blocks) ? generatorContext.blocks : []);
    return list.filter((block) => {
        if (!block) return false;
        if (block.isRemoved || block.isFalling || block.removalStartTime) return false;
        return true;
    });
}

export function computeBlastCellStats(eligibleBlocks) {
    const totalCells = eligibleBlocks.reduce((sum, block) => sum + getBlockFootprintCellCount(block), 0);
    const bombCells = eligibleBlocks.reduce((sum, block) => (
        sum + (block.isBomb ? getBlockFootprintCellCount(block) : 0)
    ), 0);
    const actualPercent = totalCells > 0 ? (bombCells / totalCells) * 100 : 0;
    return { totalCells, bombCells, actualPercent };
}

export function getBlockSpatialCenter(block) {
    if (!block) return { x: 0, y: 0, z: 0 };
    const isXAligned = Math.abs(block.direction.x) > 0;
    const len = block.length || 1;
    if (block.isVertical) {
        return {
            x: block.gridX,
            y: block.yOffset + (len - 1) * 0.5,
            z: block.gridZ
        };
    }
    return {
        x: block.gridX + (isXAligned ? (len - 1) * 0.5 : 0),
        y: block.yOffset,
        z: block.gridZ + (isXAligned ? 0 : (len - 1) * 0.5)
    };
}

export function calculateBlockBombScore(block, currentGridSize) {
    const center = getBlockSpatialCenter(block);
    const isXAligned = Math.abs(block.direction.x) > 0;
    const len = block.length || 1;

    // Check if any cell of the block touches the outer perimeter boundary
    const minX = block.gridX;
    const maxX = block.gridX + (block.isVertical ? 0 : (isXAligned ? len - 1 : 0));
    const minZ = block.gridZ;
    const maxZ = block.gridZ + (block.isVertical ? 0 : (isXAligned ? 0 : len - 1));

    const touchesEdge = (
        minX <= 0 || minZ <= 0 ||
        maxX >= currentGridSize - 1 || maxZ >= currentGridSize - 1
    );

    // Near-Corner Target Anchor Points (approx 1.5 - 2.0 units inward from each corner)
    const cornerOffset = Math.min(2.0, Math.max(1.2, (currentGridSize - 1) * 0.25));
    const minCorner = cornerOffset;
    const maxCorner = (currentGridSize - 1) - cornerOffset;

    const cornerTargets = [
        { x: minCorner, z: minCorner },
        { x: minCorner, z: maxCorner },
        { x: maxCorner, z: minCorner },
        { x: maxCorner, z: maxCorner }
    ];

    // Find distance to the nearest inner corner anchor
    let minCornerDist = Infinity;
    for (const target of cornerTargets) {
        const dist = Math.hypot(center.x - target.x, center.z - target.z);
        if (dist < minCornerDist) {
            minCornerDist = dist;
        }
    }

    // 1. High bonus for proximity to near-corners (creates the crater view)
    const cornerScore = 10.0 / (1.0 + minCornerDist);

    // 2. Gentle layer preference so bombs are visible and distributed across the tower
    const layerScore = -0.4 * (center.y || block.yOffset || 0);

    return cornerScore + layerScore;
}

export function applyBlastCellPercentToCurrentTower(targetPercent, customBlocks = null, options = {}) {
    const eligibleBlocks = getEligibleBlocksForBlastTuning(customBlocks);
    if (eligibleBlocks.length === 0) return null;

    const { totalCells } = computeBlastCellStats(eligibleBlocks);
    if (totalCells <= 0) return null;

    const clampedPercent = Math.max(0, Math.min(MAX_BLAST_CELL_PERCENT, targetPercent));
    if (clampedPercent <= 0) {
        // Zero bombs requested
        for (const block of eligibleBlocks) {
            if (typeof block.setBombState === 'function') {
                block.setBombState(false);
            } else {
                block.isBomb = false;
            }
        }
        return { totalCells, bombCells: 0, actualPercent: 0 };
    }

    // Option 2: Layer-Based Scaling (1 bomb every 2-3 layers, capped at 5-6 bombs max)
    const maxLayer = eligibleBlocks.reduce((max, b) => Math.max(max, typeof b.yOffset === 'number' ? b.yOffset : 0), 0);
    const layerCount = Math.max(1, Math.floor(maxLayer) + 1);
    // 1-2 layers -> 1 bomb; 3-4 layers -> 2; 5-6 layers -> 3; 7-8 layers -> 4; 9-10 layers -> 5; 11+ layers -> 6 max
    const maxBombsAllowed = Math.max(1, Math.min(6, Math.ceil(layerCount / 2.2)));

    // Average block length is ~2 cells; cap target cells based on maxBombsAllowed
    const targetBombCells = Math.min(maxBombsAllowed * 2, Math.round((clampedPercent / 100) * totalCells));

    // Score all eligible blocks by near-corner proximity, lower layers, and edge exclusion
    const currentGridSize = options?.gridSize ?? (typeof generatorContext.gridSize === 'number' ? generatorContext.gridSize : 9);
    const scoredCandidates = eligibleBlocks.map(block => ({
        block,
        score: calculateBlockBombScore(block, currentGridSize),
        center: getBlockSpatialCenter(block),
        cells: getBlockFootprintCellCount(block)
    })).sort((a, b) => b.score - a.score); // Highest near-corner/lower-layer preference first

    const selectedBombs = [];
    let accumulatedBombCells = 0;

    // Pass 1: Strict spatial spacing (minimum 2.0 grid units in 3D between any two bombs)
    const MIN_SPACING_SQ_STRICT = 4.0;
    for (const cand of scoredCandidates) {
        if (selectedBombs.length >= maxBombsAllowed || accumulatedBombCells >= targetBombCells) break;

        const isTooClose = selectedBombs.some(b => {
            const dx = cand.center.x - b.center.x;
            const dy = cand.center.y - b.center.y;
            const dz = cand.center.z - b.center.z;
            return (dx * dx + dy * dy + dz * dz) < MIN_SPACING_SQ_STRICT;
        });

        if (!isTooClose) {
            selectedBombs.push(cand);
            accumulatedBombCells += cand.cells;
        }
    }

    // Pass 2: Relaxed spatial spacing (minimum 1.5 grid units) if quota not met
    const MIN_SPACING_SQ_RELAXED = 2.25;
    if (selectedBombs.length < maxBombsAllowed && accumulatedBombCells < targetBombCells) {
        for (const cand of scoredCandidates) {
            if (selectedBombs.length >= maxBombsAllowed || accumulatedBombCells >= targetBombCells) break;
            if (selectedBombs.includes(cand)) continue;

            const isTooClose = selectedBombs.some(b => {
                const dx = cand.center.x - b.center.x;
                const dy = cand.center.y - b.center.y;
                const dz = cand.center.z - b.center.z;
                return (dx * dx + dy * dy + dz * dz) < MIN_SPACING_SQ_RELAXED;
            });

            if (!isTooClose) {
                selectedBombs.push(cand);
                accumulatedBombCells += cand.cells;
            }
        }
    }

    const selectedSet = new Set(selectedBombs.map(s => s.block));
    for (const block of eligibleBlocks) {
        const shouldBeBomb = selectedSet.has(block);
        if (typeof block.setBombState === 'function') {
            block.setBombState(shouldBeBomb);
        } else {
            block.isBomb = shouldBeBomb;
        }
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }

    return computeBlastCellStats(eligibleBlocks);
}

/**
 * Reverse Generation: Start from solved state (blocks at edges) and work backward
 * This guarantees 100% solvable puzzles
 * @param {number} yOffset - Y offset for this layer (0 for level 1, cubeSize for level 2, etc.)
 * @param {Set} lowerLayerCells - Cells occupied by blocks in lower layers
 * @param {number} targetBlockCount - Target number of blocks to generate for this layer
 * @param {number} level - Current level number
 * @param {boolean} preferLongBlocks - If true, prefer longer blocks
 * @param {Object} difficultyConfig - Optional Inferno mode difficulty configuration
 * @param {number} heightRatio - Current layer height relative to total height (0-1)
 * @returns {Array} Array of blocks to be placed
 */
export function createSolvableBlocks(yOffset = 0, lowerLayerCells = null, targetBlockCount = 10, level = 1, preferLongBlocks = false, difficultyConfig = null, heightRatio = 0.5, options = {}) {
    const gridSize = options?.gridSize ?? generatorContext.gridSize;
    const cubeSize = options?.cubeSize ?? generatorContext.cubeSize;
    const scene = options?.scene ?? generatorContext.scene;
    const physics = options?.physics ?? generatorContext.physics;
    const currentArrowStyle = options?.currentArrowStyle ?? generatorContext.currentArrowStyle;
    const blocks = options?.blocks ?? generatorContext.blocks;
    // Note: We don't clear blocks here - that's done in generateSolvablePuzzle
    // This allows us to add multiple layers
    // preferLongBlocks: If true, prefer longer blocks (2-3 cells) over single blocks
    // difficultyConfig: Optional Inferno mode difficulty configuration

    const totalCells = gridSize * gridSize;
    const occupiedCells = new Set();
    const blocksToPlace = []; // Store blocks to be placed sequentially
    const isUpperLayer = yOffset > 0; // Declare once for use throughout function

    // Height-based probability modulation (even distribution across all tower layers)
    const heightMod = 1.0;
    const bombBaseProb = getBlastCellProbabilityForLevel(level);
    const spinBaseProb = (level >= 11) ? 0.12 : 0;
    
    // Create a "deck" of special types to ensure guaranteed distribution even in sparse layers
    const specialDeck = [];
    const deckSize = Math.max(targetBlockCount, 50); 
    for (let i = 0; i < deckSize; i++) {
        const rand = Math.random();
        if (rand < bombBaseProb * heightMod) specialDeck.push('bomb');
        else if (rand < (bombBaseProb + spinBaseProb) * heightMod) specialDeck.push('normal'); // Task 9.1: Disable spin gems
        else specialDeck.push('normal');
    }
    shuffleArray(specialDeck);
    let specialIdx = 0;

    // For small/medium block counts (Level 0-5: 3, 10, 20, 30, 40, 50 blocks), use random placement across entire grid
    // This prevents all blocks being at edges, all arrows pointing out, and all being vertical
    // Extended to include Level 5 (50 blocks) to ensure proper generation
    const isSmallCount = targetBlockCount <= 50;

    // Check if a cell is occupied in the CURRENT layer only
    // Note: Lower layer cells are NOT considered "occupied" - blocks can be placed on top of them
    // Support from lower layers is checked separately via hasSupport()
    function isCellOccupied(x, z) {
        // Only check if this cell is occupied in the current layer
        return occupiedCells.has(`${x},${z}`);
    }

    // For level 2+, check if a block has direct support from the layer directly below (prevent floating and gaps)
    function hasDirectSupportAt(cellX, cellZ) {
        if (yOffset === 0) return true;
        if (!lowerLayerCells) return false;
        const cellKey = `${cellX},${cellZ}`;
        if (typeof lowerLayerCells === 'object' && lowerLayerCells.yRanges) {
            const ranges = lowerLayerCells.yRanges.get(cellKey);
            if (ranges && ranges.some(r => Math.abs(r.yTop - yOffset) < 0.05)) {
                return true;
            }
            return false;
        }
        const lowerCells = lowerLayerCells instanceof Set ? lowerLayerCells : (lowerLayerCells?.cells || null);
        return !!(lowerCells && lowerCells.has(cellKey));
    }

    function hasSupport(block) {
        // Level 1 blocks don't need support (they're on the ground)
        if (yOffset === 0) {
            return true;
        }

        if (block.isVertical) {
            return hasDirectSupportAt(block.gridX, block.gridZ);
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            let supportedCount = 0;
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (isXAligned ? i : 0);
                const z = block.gridZ + (isXAligned ? 0 : i);
                if (hasDirectSupportAt(x, z)) {
                    supportedCount++;
                }
            }
            // Require 100% of cells to have direct solid support beneath them for upper layers
            // This eliminates cantilevered overhangs, floating blocks, and hollow caverns between layers
            return supportedCount === block.length;
        }
    }

    /**
     * Check if a block faces toward the nearest edge (can exit)
     * Returns: { canExit: boolean, distanceToEdge: number }
     */
    function canBlockFaceOutward(gridX, gridZ, direction, gridSize) {
        // Calculate distance to each edge
        const distToNorth = gridZ;
        const distToSouth = gridSize - 1 - gridZ;
        const distToWest = gridX;
        const distToEast = gridSize - 1 - gridX;

        // Check if direction points toward nearest edge
        let distanceToEdge = Infinity;
        let facesOutward = false;

        if (direction.z === -1 && distToNorth < distToSouth && distToNorth < distToWest && distToNorth < distToEast) {
            // Facing north, and north is the nearest edge
            distanceToEdge = distToNorth;
            facesOutward = true;
        } else if (direction.z === 1 && distToSouth < distToNorth && distToSouth < distToWest && distToSouth < distToEast) {
            // Facing south, and south is the nearest edge
            distanceToEdge = distToSouth;
            facesOutward = true;
        } else if (direction.x === -1 && distToWest < distToNorth && distToWest < distToSouth && distToWest < distToEast) {
            // Facing west, and west is the nearest edge
            distanceToEdge = distToWest;
            facesOutward = true;
        } else if (direction.x === 1 && distToEast < distToNorth && distToEast < distToSouth && distToEast < distToWest) {
            // Facing east, and east is the nearest edge
            distanceToEdge = distToEast;
            facesOutward = true;
        }

        return { canExit: facesOutward, distanceToEdge };
    }

    /**
     * Get the best direction pointing toward the nearest edge
     */
    function getBestOutwardDirection(gridX, gridZ, gridSize) {
        const distToNorth = gridZ;
        const distToSouth = gridSize - 1 - gridZ;
        const distToWest = gridX;
        const distToEast = gridSize - 1 - gridX;

        const minDist = Math.min(distToNorth, distToSouth, distToWest, distToEast);

        if (minDist === distToNorth) return { x: 0, z: -1 };
        if (minDist === distToSouth) return { x: 0, z: 1 };
        if (minDist === distToWest) return { x: -1, z: 0 };
        return { x: 1, z: 0 }; // East
    }

    /**
     * ATOMIC CELL RESERVATION: Try to reserve cells for a block BEFORE creating it.
     * This prevents race conditions where multiple blocks try to occupy the same cells.
     * 
     * IMPORTANT: For multi-layer generation, we also need to check Y ranges to prevent
     * vertical blocks from overlapping across layers. We track Y ranges in lowerLayerCells
     * if provided.
     * 
     * @param {number} gridX - Starting X position
     * @param {number} gridZ - Starting Z position
     * @param {number} length - Block length
     * @param {boolean} isVertical - Whether block is vertical
     * @param {Object} direction - Block direction {x, z}
     * @returns {Object|null} - Returns {cells: Set of cell keys} if successful, null if cells are occupied
     */
    function tryReserveCells(gridX, gridZ, length, isVertical, direction) {
        const cellsToReserve = new Set();

        // Calculate Y range for this block
        const blockHeight = isVertical ? length * cubeSize : cubeSize;
        const yBottom = yOffset;
        const yTop = yOffset + blockHeight;

        if (isVertical) {
            // Vertical block occupies single X,Z cell but spans multiple Y levels
            const cellKey = `${gridX},${gridZ}`;

            // Check if cell is occupied in current layer
            if (occupiedCells.has(cellKey)) {
                return null; // Cell already occupied in this layer
            }

            // Check Y range overlap with lower layers if we have that info
            // Use same logic as yRangesOverlap: (aTop - bBottom > EPS) && (bTop - aBottom > EPS)
            if (lowerLayerCells && typeof lowerLayerCells === 'object' && lowerLayerCells.yRanges) {
                const existingRanges = lowerLayerCells.yRanges.get(cellKey);
                if (existingRanges) {
                    const Y_OVERLAP_EPS = 0.001; // Same as puzzle_validation.js
                    for (const range of existingRanges) {
                        // Check if Y ranges overlap using same logic as validation
                        if ((yTop - range.yBottom > Y_OVERLAP_EPS) && (range.yTop - yBottom > Y_OVERLAP_EPS)) {
                            return null; // Y ranges overlap with lower layer
                        }
                    }
                }
            }

            cellsToReserve.add(cellKey);
        } else {
            // Horizontal block occupies multiple X,Z cells but single Y level
            const isXAligned = Math.abs(direction.x) > 0;
            for (let i = 0; i < length; i++) {
                const x = gridX + (isXAligned ? i : 0);
                const z = gridZ + (isXAligned ? 0 : i);

                // Check bounds
                if (x < 0 || x >= gridSize || z < 0 || z >= gridSize) {
                    return null; // Out of bounds
                }

                const cellKey = `${x},${z}`;

                // Check if cell is occupied in current layer
                if (occupiedCells.has(cellKey)) {
                    return null; // Cell already occupied in this layer
                }

                // Check Y range overlap with lower layers (horizontal blocks are single Y level)
                // Use same logic as yRangesOverlap: (aTop - bBottom > EPS) && (bTop - aBottom > EPS)
                if (lowerLayerCells && typeof lowerLayerCells === 'object' && lowerLayerCells.yRanges) {
                    const existingRanges = lowerLayerCells.yRanges.get(cellKey);
                    if (existingRanges) {
                        const Y_OVERLAP_EPS = 0.001; // Same as puzzle_validation.js
                        for (const range of existingRanges) {
                            // Check if Y ranges overlap using same logic as validation
                            if ((yTop - range.yBottom > Y_OVERLAP_EPS) && (range.yTop - yBottom > Y_OVERLAP_EPS)) {
                                return null; // Y ranges overlap with lower layer
                            }
                        }
                    }
                }

                cellsToReserve.add(cellKey);
            }
        }

        // All cells are available - reserve them atomically
        for (const cellKey of cellsToReserve) {
            occupiedCells.add(cellKey);
        }

        return { cells: cellsToReserve, yBottom, yTop };
    }

    /**
     * Mark cells as occupied for an already-created block.
     * This is a fallback for edge cases, but tryReserveCells should be used instead.
     */
    function occupyCells(block) {
        // This should not be called if tryReserveCells was used correctly
        // But we keep it for backward compatibility and as a safety check
        if (block.isVertical) {
            const cellKey = `${block.gridX},${block.gridZ}`;
            if (occupiedCells.has(cellKey)) {
                console.warn(`Warning: Attempting to occupy already occupied cell (${cellKey}) in layer at Y=${yOffset}`);
                return false;
            }
            occupiedCells.add(cellKey);
            return true;
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            const cellsToOccupy = [];
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (isXAligned ? i : 0);
                const z = block.gridZ + (isXAligned ? 0 : i);
                const cellKey = `${x},${z}`;
                if (occupiedCells.has(cellKey)) {
                    console.warn(`Warning: Attempting to occupy already occupied cell (${cellKey}) in layer at Y=${yOffset}`);
                    return false;
                }
                cellsToOccupy.push(cellKey);
            }
            for (const cellKey of cellsToOccupy) {
                occupiedCells.add(cellKey);
            }
            return true;
        }
    }

    // SMALL COUNT MODE: Random placement across entire grid for variety
    if (isSmallCount) {
        // Phase 1: Random placement with multiple passes
        const maxPasses = isUpperLayer ? (targetBlockCount > 100 ? 50 : 40) : (targetBlockCount > 100 ? 20 : 10);
        let pass = 0;
        let consecutiveFailedPasses = 0;
        const maxConsecutiveFailures = 3; // Allow 3 failed passes before switching strategy

        while (blocksToPlace.length < targetBlockCount && pass < maxPasses) {
            pass++;

            // Get all available cells (recalculate each pass)
            const availableCells = [];
            for (let x = 0; x < gridSize; x++) {
                for (let z = 0; z < gridSize; z++) {
                    if (!isCellOccupied(x, z)) {
                        availableCells.push({ x, z });
                    }
                }
            }

            // If no available cells, we can't place more blocks
            if (availableCells.length === 0) break;

            // Shuffle for randomness - add extra randomization for small levels
            // For level 0 with few blocks, add more shuffles to ensure variation
            const shuffleCount = level === 0 ? 3 : 1;
            for (let shuffle = 0; shuffle < shuffleCount; shuffle++) {
                for (let i = availableCells.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
                }
            }

            let placedThisPass = 0;

            // Try to place blocks randomly
            for (const cell of availableCells) {
                if (blocksToPlace.length >= targetBlockCount) break;

                // Adjust length distribution based on remaining blocks needed and preferLongBlocks flag
                // If preferLongBlocks is true (layer 1 in multi-layer), prefer longer blocks (2-3 cells)
                // If difficultyConfig is provided (Inferno mode), use config-driven distribution
                const remaining = targetBlockCount - blocksToPlace.length;
                const rand = Math.random();
                let length;

                if (difficultyConfig && difficultyConfig.lengthDistribution) {
                    // Use Inferno mode difficulty configuration
                    const dist = difficultyConfig.lengthDistribution;
                    if (rand < dist.length1) {
                        length = 1;
                    } else if (rand < dist.length1 + dist.length2) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                } else if (preferLongBlocks) {
                    // Prefer longer blocks for base: 20% length 1, 50% length 2, 30% length 3
                    if (rand < 0.2) {
                        length = 1;
                    } else if (rand < 0.7) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                } else if (heightRatio > 0.6) {
                    // Top level layers: Favor 2-cell and 3-cell tiles (20% length 1, 45% length 2, 35% length 3)
                    if (rand < 0.20) {
                        length = 1;
                    } else if (rand < 0.65) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                } else if (remaining <= 5) {
                    // Very close to target completion - prefer single blocks (80% chance)
                    if (rand < 0.8) {
                        length = 1;
                    } else if (rand < 0.95) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                } else {
                    // Standard distribution: Equal ~33.3% distribution for length 1, 2, and 3
                    if (rand < 0.333) {
                        length = 1;
                    } else if (rand < 0.666) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                }

                // Prioritize blocks that face outward (toward edges) for easier gameplay
                // Use difficulty config if available (Inferno mode), otherwise default to 70%
                let randomDir;
                const outwardPercentage = difficultyConfig ? difficultyConfig.outwardPercentage : getInfernoDifficultyConfig(level).outwardPercentage;
                const preferOutward = Math.random() < outwardPercentage;
                const bestOutwardDir = getBestOutwardDirection(cell.x, cell.z, gridSize);

                if (preferOutward) {
                    // 80% chance to use best outward direction, 20% chance to use random
                    randomDir = Math.random() < 0.8 ? bestOutwardDir : directions[Math.floor(Math.random() * directions.length)];
                } else {
                    // Prefer INWARD direction (opposite of outward)
                    // If bestOutwardDir is undefined/null (e.g. center cell), fallback to random
                    if (bestOutwardDir) {
                        // Find the exact inverse direction object from the directions array
                        const inwardDir = directions.find(d => d.x === -bestOutwardDir.x && d.z === -bestOutwardDir.z) || directions[Math.floor(Math.random() * directions.length)];
                        // 80% chance to use inward direction, 20% chance to use random
                        randomDir = Math.random() < 0.8 ? inwardDir : directions[Math.floor(Math.random() * directions.length)];
                    } else {
                        randomDir = directions[Math.floor(Math.random() * directions.length)];
                    }
                }


                // Use difficulty config for vertical percentage if available (Inferno mode), otherwise 50%
                const verticalPercentage = difficultyConfig ? difficultyConfig.verticalPercentage : 0.5;
                const isVertical = Math.random() < verticalPercentage;

                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                // This prevents race conditions where multiple blocks compete for the same cells
                const reservation = tryReserveCells(cell.x, cell.z, length, isVertical, randomDir);
                if (!reservation) {
                    continue; // Cells not available - skip this attempt
                }

                // Task 7.7.4: Use special deck for balanced distribution
                const specialType = specialDeck[specialIdx % specialDeck.length];
                const isBomb = (specialType === 'bomb');
                const isSpinGem = (specialType === 'spin');

                // Cells are now reserved - create the block
                const block = new Block(length, cell.x, cell.z, randomDir, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb, isSpinGem);
                
                // Show hints for special blocks
                if (typeof window !== 'undefined' && typeof window.showGameHint === 'function') {
                    if (isBomb) window.showGameHint("Careful with that bomb! It clears everything in its path.", "hint-bomb");
                    if (isSpinGem) window.showGameHint("Spin Gems give you extra turns. Grab them!", "hint-spingem");
                }
                
                // Move block from scene to towerGroup
                if (scene) scene.remove(block.group);

                // Check if block has support (for level 2+)
                // Note: We check support AFTER reserving cells because support check is independent
                // and doesn't affect cell occupation. If support fails, we release the cells.
                if (!hasSupport(block)) {
                    // Release reserved cells since block can't be placed
                    for (const cellKey of reservation.cells) {
                        occupiedCells.delete(cellKey);
                    }
                    continue;
                }

                // Block is valid - keep it and cells remain reserved
                // Will be added to towerGroup with animation in placeBlocksBatch
                blocksToPlace.push(block);
                // Task 7.7.6: Increment deck index ONLY on successful placement
                specialIdx++;
                placedThisPass++;
            }

            // Track consecutive failures - don't break early, continue to fallback strategies
            if (placedThisPass === 0) {
                consecutiveFailedPasses++;
                // Switch to systematic approach after several failed random attempts
                if (consecutiveFailedPasses >= maxConsecutiveFailures && pass >= 5) {
                    break;
                }
            } else {
                consecutiveFailedPasses = 0; // Reset on success
            }
        }

        // Phase 2: Systematic fallback - if random placement didn't reach target
        if (blocksToPlace.length < targetBlockCount) {
            const stillEmpty = [];
            for (let x = 0; x < gridSize; x++) {
                for (let z = 0; z < gridSize; z++) {
                    if (!isCellOccupied(x, z)) {
                        stillEmpty.push({ x, z });
                    }
                }
            }

            // Try each empty cell systematically with all valid configurations
            for (const cell of stillEmpty) {
                if (blocksToPlace.length >= targetBlockCount) break;

                // Try all directions
                const dirs = [
                    { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }
                ];

                let placed = false;

                // Try lengths in order: 1, 2, 3 (prioritize single blocks to maximize count)
                for (const tryLength of [1, 2, 3]) {
                    if (placed) break;

                    // Try both horizontal and vertical
                    for (const isVert of [false, true]) {
                        if (placed) break;

                        // Try each direction
                        for (const dir of dirs) {
                            if (placed) break;

                            // ATOMIC OPERATION: Try to reserve cells
                            const reservation = tryReserveCells(cell.x, cell.z, tryLength, isVert, dir);
                            if (!reservation) {
                                continue;
                            }

                            // Task 7.7.4: Use special deck for balanced distribution
                            const specialType = specialDeck[specialIdx % specialDeck.length];
                            const isBomb = (specialType === 'bomb');
                            const isSpinGem = (specialType === 'spin');

                            // Create block for support check
                            const testBlock = new Block(tryLength, cell.x, cell.z, dir, isVert, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb, isSpinGem);
                            if (scene) scene.remove(testBlock.group);

                            // Check support
                            if (!hasSupport(testBlock)) {
                                // Release reserved cells
                                for (const cellKey of reservation.cells) {
                                    occupiedCells.delete(cellKey);
                                }
                                continue;
                            }

                            // Success - block supported
                            blocksToPlace.push(testBlock);
                            // Task 7.7.6: Increment deck index ONLY on successful placement
                            specialIdx++;
                            placed = true;
                            break;
                        }
                    }
                }
            }
        }

        // Phase 3: Final aggressive fill - try every cell with every configuration
        if (blocksToPlace.length < targetBlockCount) {
            const allCells = [];
            for (let x = 0; x < gridSize; x++) {
                for (let z = 0; z < gridSize; z++) {
                    allCells.push({ x, z });
                }
            }

            // Shuffle for randomness
            for (let i = allCells.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
            }

            for (const cell of allCells) {
                if (blocksToPlace.length >= targetBlockCount) break;

                // Try all configurations systematically
                const dirs = [
                    { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }
                ];

                let placed = false;

                // Try all lengths
                for (const tryLength of [1, 2, 3]) {
                    if (placed) break;

                    // Try both orientations
                    for (const isVert of [false, true]) {
                        if (placed) break;

                        // Try all directions
                        for (const dir of dirs) {
                            if (placed) break;

                            // Try to reserve - this handles all validation
                            const reservation = tryReserveCells(cell.x, cell.z, tryLength, isVert, dir);
                            if (!reservation) {
                                continue;
                            }

                            // Task 7.7.4/7.7.6: Use special deck for balanced distribution
                            const specialType = specialDeck[specialIdx % specialDeck.length];
                            const isBomb = (specialType === 'bomb');
                            const isSpinGem = (specialType === 'spin');

                            // Create block for support check
                            const testBlock = new Block(tryLength, cell.x, cell.z, dir, isVert, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb, isSpinGem);
                            if (scene) scene.remove(testBlock.group);

                            // Check support
                            if (!hasSupport(testBlock)) {
                                for (const cellKey of reservation.cells) {
                                    occupiedCells.delete(cellKey);
                                }
                                continue;
                            }

                            // Valid - keep it
                            blocksToPlace.push(testBlock);
                            // Task 7.7.6: Increment deck index ONLY on successful placement
                            specialIdx++;
                            placed = true;
                            break;
                        }
                    }
                }
            }
        }

        // Sort blocks to prioritize those that can exit (for easier gameplay)
        if (blocksToPlace.length > 0) {
            // Build occupied cells map for exit checking
            const occupiedCellsForExit = new Set();
            blocksToPlace.forEach(block => {
                const cells = getBlockCells(block);
                cells.forEach(cell => occupiedCellsForExit.add(`${cell.x},${cell.z}`));
            });

            blocksToPlace.sort((a, b) => {
                const aExit = canBlockExit(a, occupiedCellsForExit, gridSize);
                const bExit = canBlockExit(b, occupiedCellsForExit, gridSize);

                // Blocks that can exit come first
                if (aExit.canExit && !bExit.canExit) return -1;
                if (!aExit.canExit && bExit.canExit) return 1;

                // If both can exit, prefer those with fewer steps to exit
                if (aExit.canExit && bExit.canExit) {
                    return aExit.stepsToExit - bExit.stepsToExit;
                }

                // If neither can exit, prefer blocks that face outward (toward nearest edge)
                const aOutward = canBlockFaceOutward(a.gridX, a.gridZ, a.direction, gridSize);
                const bOutward = canBlockFaceOutward(b.gridX, b.gridZ, b.direction, gridSize);

                if (aOutward.canExit && !bOutward.canExit) return -1;
                if (!aOutward.canExit && bOutward.canExit) return 1;

                // If both face outward, prefer closer to edge
                if (aOutward.canExit && bOutward.canExit) {
                    return aOutward.distanceToEdge - bOutward.distanceToEdge;
                }

                return 0;
            });
        }

        // Return blocks placed
        return blocksToPlace;
    }

    // LARGE COUNT MODE: Use edge placement strategy (original logic)
    // STEP 1: Place blocks at edges pointing outward (guaranteed solvable)
    // This creates a "solved" state where all blocks can exit immediately

    const edgeBlocks = [];

    // Place blocks at edges - STRICTLY prefer longer blocks (2-3), avoid single blocks
    // Helper: Check if horizontal block extends in X or Z direction
    function getBlockExtent(block) {
        if (block.isVertical) return null; // Vertical blocks don't extend horizontally
        const isXAligned = Math.abs(block.direction.x) > 0;
        return isXAligned ? 'x' : 'z';
    }

    // Place blocks at edges - STRICTLY prefer longer blocks (2-3), avoid single blocks
    // North edge (z = 0, pointing north/up)
    for (let x = 0; x < gridSize; x++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(x, 0)) {
            // Respect outwardPercentage for edge blocks - only some point outward
            const config = difficultyConfig || getInfernoDifficultyConfig(level);
            if (Math.random() > config.outwardPercentage) continue;

            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < (yOffset === 0 ? 0.35 : 0.6);
            const direction = { x: 0, z: -1 }; // North

            // Only place vertical blocks or single blocks at edges
            if (isVertical || length === 1) {
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(x, 0, length, isVertical, direction);
                if (reservation) {
                    // Determine if this should be a bomb block (Task 1.1)
                    const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * length));
                    
                    // Cells reserved - create block
                    const block = new Block(length, x, 0, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        if (scene) scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
                        if (scene) scene.remove(block.group);
                    }
                }
            }
        }
    }

    // South edge (z = gridSize-1, pointing south/down)
    for (let x = 0; x < gridSize; x++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(x, gridSize - 1)) {
            // Respect outwardPercentage for edge blocks
            const config = difficultyConfig || getInfernoDifficultyConfig(level);
            if (Math.random() > config.outwardPercentage) continue;

            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < (yOffset === 0 ? 0.35 : 0.6);
            const direction = { x: 0, z: 1 }; // South

            if (isVertical || length === 1) {
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(x, gridSize - 1, length, isVertical, direction);
                if (reservation) {
                    // Determine if this should be a bomb block (Task 1.1)
                    const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * length));
                    
                    // Cells reserved - create block
                    const block = new Block(length, x, gridSize - 1, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        if (scene) scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
                        if (scene) scene.remove(block.group);
                    }
                }
            }
        }
    }

    // West edge (x = 0, pointing west/left)
    for (let z = 0; z < gridSize; z++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(0, z)) {
            // Respect outwardPercentage for edge blocks
            const config = difficultyConfig || getInfernoDifficultyConfig(level);
            if (Math.random() > config.outwardPercentage) continue;

            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < (yOffset === 0 ? 0.35 : 0.6);
            const direction = { x: -1, z: 0 }; // West

            if (isVertical || length === 1) {
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(0, z, length, isVertical, direction);
                if (reservation) {
                    // Determine if this should be a bomb block (Task 1.1)
                    const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * length));
                    
                    // Cells reserved - create block
                    const block = new Block(length, 0, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        if (scene) scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
                        if (scene) scene.remove(block.group);
                    }
                }
            }
        }
    }

    // East edge (x = gridSize-1, pointing east/right)
    for (let z = 0; z < gridSize; z++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(gridSize - 1, z)) {
            // Respect outwardPercentage for edge blocks
            const config = difficultyConfig || getInfernoDifficultyConfig(level);
            if (Math.random() > config.outwardPercentage) continue;

            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < (yOffset === 0 ? 0.35 : 0.6);
            const direction = { x: 1, z: 0 }; // East

            if (isVertical || length === 1) {
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(gridSize - 1, z, length, isVertical, direction);
                if (reservation) {
                    // Determine if this should be a bomb block (Task 1.1)
                    const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * length));
                    
                    // Cells reserved - create block
                    const block = new Block(length, gridSize - 1, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        if (scene) scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
                        if (scene) scene.remove(block.group);
                    }
                }
            }
        }
    }

    // STEP 2: Move blocks inward aggressively to create complexity (while maintaining solvability)
    // This creates interdependencies and makes puzzles more interesting
    // Skip this step if we've already reached target block count
    const maxInwardAttempts = 800; // More attempts for complexity
    let inwardAttempts = 0;

    // For high block counts, allow filling up to 100% of cells
    // For multi-layer scenarios (yOffset > 0), we need to be more aggressive to reach target
    // Lower the fill threshold for upper layers to allow more attempts
    const fillThreshold = isUpperLayer ? 0.98 : (targetBlockCount > 100 ? 1.0 : 0.95);
    while (inwardAttempts < maxInwardAttempts && occupiedCells.size < totalCells * fillThreshold && blocksToPlace.length < targetBlockCount) {
        inwardAttempts++;

        // Pick a random edge block to try moving inward
        if (edgeBlocks.length === 0) break;
        const block = edgeBlocks[Math.floor(Math.random() * edgeBlocks.length)];
        if (!block || block.isFalling) continue;

        // Calculate inward direction (opposite of block's direction)
        const inwardDir = {
            x: -block.direction.x,
            z: -block.direction.z
        };

        // Try moving 1 step inward (conservative)
        const newX = block.gridX + inwardDir.x;
        const newZ = block.gridZ + inwardDir.z;

        // Check if new position is valid and doesn't overlap
        let canMove = true;
        const testCells = [];

        if (block.isVertical) {
            if (newX < 0 || newX >= gridSize || newZ < 0 || newZ >= gridSize) {
                canMove = false;
            } else if (isCellOccupied(newX, newZ)) {
                canMove = false;
            } else {
                testCells.push({ x: newX, z: newZ });
            }
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const checkX = newX + (isXAligned ? i : 0);
                const checkZ = newZ + (isXAligned ? 0 : i);

                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    canMove = false;
                    break;
                }
                if (isCellOccupied(checkX, checkZ)) {
                    canMove = false;
                    break;
                }
                testCells.push({ x: checkX, z: checkZ });
            }
        }

        if (!canMove) continue;

        // Ensure block has direct support at the new inward position for upper layers
        if (isUpperLayer) {
            const tempBlock = {
                gridX: newX,
                gridZ: newZ,
                length: block.length,
                isVertical: block.isVertical,
                direction: block.direction
            };
            if (!hasSupport(tempBlock)) {
                continue; // Do not move inward if it loses support or creates a floating overhang
            }
        }

        // ATOMIC OPERATION: Try to reserve new cells BEFORE releasing old ones
        // This prevents race conditions where another block could claim the new cells
        const reservation = tryReserveCells(newX, newZ, block.length, block.isVertical, block.direction);
        if (!reservation) {
            continue; // New cells not available - can't move
        }

        // New cells are reserved - now safely release old cells and update block
        const oldX = block.gridX;
        const oldZ = block.gridZ;
        const oldCells = getBlockCells(block);

        // Remove old cells from occupied cells (safe now since new cells are reserved)
        for (const cell of oldCells) {
            occupiedCells.delete(`${cell.x},${cell.z}`);
        }

        // Update block position
        block.gridX = newX;
        block.gridZ = newZ;
        block.updateWorldPosition();

        // New cells are already reserved by tryReserveCells, so we're done
        // Move successful - keep new position
        continue;
    }

    // STEP 3: Fill remaining cells with longer blocks when possible

    // STEP 3: Fill remaining cells - try to create longer blocks (2-3) first, single blocks only as last resort
    const remainingCells = [];
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            if (!isCellOccupied(x, z)) {
                remainingCells.push({ x, z });
            }
        }
    }

    // Shuffle remaining cells for randomness
    for (let i = remainingCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingCells[i], remainingCells[j]] = [remainingCells[j], remainingCells[i]];
    }

    // Try to fill cells, preferring longer blocks
    // Stop if we've reached target block count
    for (const cell of remainingCells) {
        if (blocksToPlace.length >= targetBlockCount) break;
        const distToEdges = {
            east: gridSize - 1 - cell.x,
            west: cell.x,
            south: gridSize - 1 - cell.z,
            north: cell.z
        };

        const minDist = Math.min(...Object.values(distToEdges));
        const nearestEdges = Object.entries(distToEdges)
            .filter(([_, dist]) => dist === minDist)
            .map(([edge, _]) => edge);

        let chosenDirection = directions[0];
        const config = difficultyConfig || getInfernoDifficultyConfig(level);
        const preferOutward = Math.random() < config.outwardPercentage;

        if (preferOutward) {
            // Point toward nearest edge
            if (nearestEdges.includes('east')) {
                chosenDirection = { x: 1, z: 0 };
            } else if (nearestEdges.includes('west')) {
                chosenDirection = { x: -1, z: 0 };
            } else if (nearestEdges.includes('south')) {
                chosenDirection = { x: 0, z: 1 };
            } else if (nearestEdges.includes('north')) {
                chosenDirection = { x: 0, z: -1 };
            }
        } else {
            // Point inward or random (not toward nearest edge ideally)
            // Pick a random direction from the directions array
            chosenDirection = directions[Math.floor(Math.random() * directions.length)];
            
            // If it happens to be an outward direction, and we really wanted inward,
            // we could flip it, but random is usually enough given how low the percentage is.
        }

        // Try to create longer blocks (2-3) first, single blocks only as absolute last resort
        let blockAdded = false;
        const isXAligned = Math.abs(chosenDirection.x) > 0;

        // Try length 3, then 2, then 1 to maximize block packing and fill gaps
        for (const tryLength of [3, 2, 1]) {
            if (tryLength === 1 && preferLongBlocks && Math.random() < 0.5) continue;

            let canPlace = true;
            const testCells = [];

            // Check if we can place a horizontal block of this length
            for (let i = 0; i < tryLength; i++) {
                const checkX = cell.x + (isXAligned ? i : 0);
                const checkZ = cell.z + (isXAligned ? 0 : i);

                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    canPlace = false;
                    break;
                }
                if (isCellOccupied(checkX, checkZ)) {
                    canPlace = false;
                    break;
                }
                testCells.push({ x: checkX, z: checkZ });
            }

            if (!canPlace) continue;

            // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
            const reservation = tryReserveCells(cell.x, cell.z, tryLength, false, chosenDirection);
            if (!reservation) {
                continue; // Cells not available - skip this attempt
            }

            // Cells reserved - create block
            const testBlock = new Block(tryLength, cell.x, cell.z, chosenDirection, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);

            // Check if block has support (for level 2+)
            if (!hasSupport(testBlock)) {
                // Release reserved cells since block can't be placed
                for (const cellKey of reservation.cells) {
                    occupiedCells.delete(cellKey);
                }
                if (scene) scene.remove(testBlock.group);
                // Debug: Log why block was rejected (only for upper layers to avoid spam)
                if (isUpperLayer && blocksToPlace.length < targetBlockCount * 0.5) {
                    const lowerCells = lowerLayerCells instanceof Set ? lowerLayerCells : (lowerLayerCells?.cells || null);
                    const supportCount = testBlock.isVertical
                        ? (lowerCells && lowerCells.has(`${testBlock.gridX},${testBlock.gridZ}`) ? 1 : 0)
                        : (() => {
                            const isXAligned = Math.abs(testBlock.direction.x) > 0;
                            let count = 0;
                            for (let i = 0; i < testBlock.length; i++) {
                                const x = testBlock.gridX + (isXAligned ? i : 0);
                                const z = testBlock.gridZ + (isXAligned ? 0 : i);
                                if (lowerCells && lowerCells.has(`${x},${z}`)) count++;
                            }
                            return count;
                        })();
                    if (supportCount === 0 && blocksToPlace.length % 10 === 0) {
                        console.log(`  [Debug] Block at (${testBlock.gridX},${testBlock.gridZ}) rejected: no support (layer yOffset=${yOffset})`);
                    }
                }
                continue;
            }

            // Block is valid - keep it and cells remain reserved
            if (scene) scene.remove(testBlock.group); // Remove from scene, will be added with animation
            blocksToPlace.push(testBlock);

            // Block is valid - keep it
            blockAdded = true;
            // Stop if we've reached target block count
            if (blocksToPlace.length >= targetBlockCount) break;
            break;
        }

        // If we couldn't add any block, skip this cell for now
    }

    // STEP 4: Aggressive fill pass - try to fill every remaining cell
    // Try multiple times with different strategies to maximize fill
    // Skip if we've already reached target block count
    let fillPasses = 0;
    // For high block counts, use more passes to ensure we reach target
    // For upper layers, need more passes due to support constraints
    const maxFillPasses = isUpperLayer ? (targetBlockCount > 100 ? 25 : 15) : (targetBlockCount > 100 ? 10 : 3);

    while (fillPasses < maxFillPasses && occupiedCells.size < totalCells && blocksToPlace.length < targetBlockCount) {
        fillPasses++;
        const beforeFill = occupiedCells.size;

        // Get remaining cells
        const stillEmpty = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                if (!isCellOccupied(x, z)) {
                    stillEmpty.push({ x, z });
                }
            }
        }

        // Shuffle for randomness
        for (let i = stillEmpty.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [stillEmpty[i], stillEmpty[j]] = [stillEmpty[j], stillEmpty[i]];
        }

        // Try to fill each empty cell
        for (const cell of stillEmpty) {
            // Try all 4 directions to find one that works
            const dirs = [
                { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }
            ];

            // Shuffle directions
            for (let i = dirs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
            }

            let filled = false;

            // Try each direction
            for (const dir of dirs) {
                // Try length 2 first (single blocks only if absolutely necessary)
                for (const tryLength of [2, 3, 1]) {
                    // Allow length 1 to fill all remaining supported voids cleanly

                    const isXAligned = Math.abs(dir.x) > 0;
                    let canPlace = true;
                    const testCells = [];

                    for (let i = 0; i < tryLength; i++) {
                        const checkX = cell.x + (isXAligned ? i : 0);
                        const checkZ = cell.z + (isXAligned ? 0 : i);

                        if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                            canPlace = false;
                            break;
                        }
                        if (isCellOccupied(checkX, checkZ)) {
                            canPlace = false;
                            break;
                        }
                        testCells.push({ x: checkX, z: checkZ });
                    }

                    if (!canPlace) continue;

                    // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                    const reservation = tryReserveCells(cell.x, cell.z, tryLength, false, dir);
                    if (!reservation) {
                        continue; // Cells not available - skip this attempt
                    }

                    // Determine if this should be a bomb block (Task 1.1)
                    // Slated for levels 31-40 in roadmap
                    const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * tryLength)); // scaled by length
                    
                    // Cells reserved - create block
                    const testBlock = new Block(tryLength, cell.x, cell.z, dir, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level, isBomb);

                    // Check if block has support (for level 2+)
                    if (!hasSupport(testBlock)) {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
                        if (scene) scene.remove(testBlock.group);
                        continue;
                    }

                    // Block is valid - keep it and cells remain reserved
                    if (scene) scene.remove(testBlock.group); // Remove from scene, will be added with animation
                    blocksToPlace.push(testBlock);

                    filled = true;
                    // Stop if we've reached target block count
                    if (blocksToPlace.length >= targetBlockCount) break;
                    break;
                }

                if (filled) break;
                // Stop outer loop if we've reached target block count
                if (blocksToPlace.length >= targetBlockCount) break;
            }
        }

        // If we didn't fill any new cells this pass, stop trying
        if (occupiedCells.size === beforeFill) break;
    }

    // FINAL AGGRESSIVE FILL: If we're still short of target, try every cell with every configuration
    // This ensures we reach the target block count for high-level puzzles
    // IMPORTANT: Use tryReserveCells for all validation to prevent overlaps
    if (blocksToPlace.length < targetBlockCount) {
        const allCells = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                allCells.push({ x, z });
            }
        }

        // Shuffle for randomness
        for (let i = allCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
        }

        for (const cell of allCells) {
            if (blocksToPlace.length >= targetBlockCount) break;

            // Try all configurations systematically
            const dirs = [
                { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }
            ];

            let placed = false;

            // Try all lengths (prioritize single blocks to maximize count)
            for (const tryLength of [1, 2, 3]) {
                if (placed) break;

                // Try both orientations
                for (const isVert of [false, true]) {
                    if (placed) break;

                    // Try all directions
                    for (const dir of dirs) {
                        if (placed) break;

                        // Try to reserve - this handles all validation
                        const reservation = tryReserveCells(cell.x, cell.z, tryLength, isVert, dir);
                        if (!reservation) {
                            continue;
                        }

                        // Create block for support check
                        const testBlock = new Block(tryLength, cell.x, cell.z, dir, isVert, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                        if (scene) scene.remove(testBlock.group);

                        // Check support
                        if (!hasSupport(testBlock)) {
                            for (const cellKey of reservation.cells) {
                                occupiedCells.delete(cellKey);
                            }
                            continue;
                        }

                        // Valid - keep it
                        blocksToPlace.push(testBlock);
                        placed = true;
                    }
                }
            }
        }
    }

    const singleBlockCount = blocksToPlace.filter(b => b.length === 1).length;
    const totalBlockCount = blocksToPlace.length;
    const singleBlockPercent = ((singleBlockCount / totalBlockCount) * 100).toFixed(1);

    // Logging removed - only show final summary in generateSolvablePuzzle

    return blocksToPlace;
}

const FAST_SPAWN_LEVEL_THRESHOLD = 51;

export function getSpawnPlacementConfig(level, totalBlocks) {
    // Level 1-5: Snappy responsive build (<250ms)
    if (level <= 5) {
        return {
            batchSize: 45,
            delayBetweenBatches: 2
        };
    }

    // Level 6-50: Rapid dynamic build (<200ms)
    if (level <= 50) {
        return {
            batchSize: 75,
            delayBetweenBatches: 0
        };
    }

    // Level 51+: Sleek Turbo Build (<150ms)
    return {
        batchSize: Math.max(120, Math.min(300, Math.ceil(totalBlocks / 4))),
        delayBetweenBatches: 0
    };
}

export function createHeadOnCollisionBlocks(targetBlockCount = 10, level = 1, options = {}) {
    const gridSize = options?.gridSize ?? generatorContext.gridSize;
    const cubeSize = options?.cubeSize ?? generatorContext.cubeSize;
    const scene = options?.scene ?? generatorContext.scene;
    const physics = options?.physics ?? generatorContext.physics;
    const currentArrowStyle = options?.currentArrowStyle ?? generatorContext.currentArrowStyle;
    const blocks = options?.blocks ?? generatorContext.blocks;
    const blocksToPlace = [];
    const occupiedCells = new Set();

    // Head-on collision pairs: blocks facing each other
    const headOnPairs = [
        // Mix: Start with some horizontal blocks first
        { x1: 1, z1: 1, dir1: { x: 1, z: 0 }, x2: 3, z2: 1, dir2: { x: -1, z: 0 }, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 1, z1: 3, dir1: { x: 1, z: 0 }, x2: 4, z2: 3, dir2: { x: -1, z: 0 }, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 0, z1: 5, dir1: { x: 1, z: 0 }, x2: 3, z2: 5, dir2: { x: -1, z: 0 }, len1: 2, len2: 2, vert1: false, vert2: false }, // Multi-cell horizontal
        { x1: 2, z1: 1, dir1: { x: 0, z: 1 }, x2: 2, z2: 3, dir2: { x: 0, z: -1 }, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 5, z1: 2, dir1: { x: 0, z: 1 }, x2: 5, z2: 5, dir2: { x: 0, z: -1 }, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 0, z1: 2, dir1: { x: 0, z: 1 }, x2: 0, z2: 4, dir2: { x: 0, z: -1 }, len1: 2, len2: 2, vert1: false, vert2: false }, // Multi-cell horizontal

        // Vertical blocks (head-on collisions) - Use positions that don't conflict
        { x1: 3, z1: 2, dir1: { x: 1, z: 0 }, x2: 5, z2: 2, dir2: { x: -1, z: 0 }, len1: 2, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 1, z1: 4, dir1: { x: 0, z: 1 }, x2: 1, z2: 6, dir2: { x: 0, z: -1 }, len1: 3, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 6, z1: 1, dir1: { x: 1, z: 0 }, x2: 4, z2: 1, dir2: { x: -1, z: 0 }, len1: 2, len2: 1, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 6, z1: 4, dir1: { x: 0, z: 1 }, x2: 6, z2: 6, dir2: { x: 0, z: -1 }, len1: 2, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 0, z1: 0, dir1: { x: 1, z: 0 }, x2: 6, z2: 0, dir2: { x: -1, z: 0 }, len1: 3, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell - moved to avoid conflict
        { x1: 3, z1: 5, dir1: { x: 0, z: 1 }, x2: 3, z2: 3, dir2: { x: 0, z: -1 }, len1: 2, len2: 3, vert1: true, vert2: true }, // Vertical multi-cell - moved to avoid conflict

        // More horizontal blocks
        { x1: 2, z1: 0, dir1: { x: 1, z: 0 }, x2: 5, z2: 0, dir2: { x: -1, z: 0 }, len1: 3, len2: 2, vert1: false, vert2: false }, // Multi-cell horizontal
        { x1: 4, z1: 0, dir1: { x: 0, z: 1 }, x2: 4, z2: 2, dir2: { x: 0, z: -1 }, len1: 2, len2: 1, vert1: false, vert2: false }, // Moved to avoid conflict
        { x1: 3, z1: 6, dir1: { x: 1, z: 0 }, x2: 5, z2: 6, dir2: { x: -1, z: 0 }, len1: 1, len2: 1, vert1: false, vert2: false },
    ];

    function isCellOccupied(x, z) {
        return occupiedCells.has(`${x},${z}`);
    }

    function occupyCells(x, z, length, isXAligned) {
        for (let i = 0; i < length; i++) {
            const cellX = x + (isXAligned ? i : 0);
            const cellZ = z + (isXAligned ? 0 : i);
            occupiedCells.add(`${cellX},${cellZ}`);
        }
    }

    // Place head-on collision pairs
    for (const pair of headOnPairs) {
        if (blocksToPlace.length >= targetBlockCount) break;

        // Place first block
        const isXAligned1 = Math.abs(pair.dir1.x) > 0;
        let canPlace1 = true;
        // For vertical blocks, only check the base cell
        if (pair.vert1) {
            if (pair.x1 < 0 || pair.x1 >= gridSize || pair.z1 < 0 || pair.z1 >= gridSize || isCellOccupied(pair.x1, pair.z1)) {
                canPlace1 = false;
            }
        } else {
            for (let i = 0; i < pair.len1; i++) {
                const checkX = pair.x1 + (isXAligned1 ? i : 0);
                const checkZ = pair.z1 + (isXAligned1 ? 0 : i);
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize || isCellOccupied(checkX, checkZ)) {
                    canPlace1 = false;
                    break;
                }
            }
        }

        if (canPlace1) {
            if (pair.vert1) {
                occupiedCells.add(`${pair.x1},${pair.z1}`);
            } else {
                occupyCells(pair.x1, pair.z1, pair.len1, isXAligned1);
            }
            const isVertical1 = pair.vert1 === true;
            console.log(`Creating block1 at (${pair.x1}, ${pair.z1}), vert1=${pair.vert1}, isVertical1=${isVertical1}, length=${pair.len1}`);
            const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * pair.len1));
            const block1 = new Block(pair.len1, pair.x1, pair.z1, pair.dir1, isVertical1, currentArrowStyle, scene, physics, gridSize, cubeSize, 0, 1, isBomb);
            console.log(`Block1 created, isVertical=${block1.isVertical}`);
            if (scene) scene.remove(block1.group);
            blocksToPlace.push(block1);
        }

        // Place second block (head-on collision partner)
        if (blocksToPlace.length < targetBlockCount) {
            const isXAligned2 = Math.abs(pair.dir2.x) > 0;
            let canPlace2 = true;
            // For vertical blocks, only check the base cell
            if (pair.vert2) {
                if (pair.x2 < 0 || pair.x2 >= gridSize || pair.z2 < 0 || pair.z2 >= gridSize || isCellOccupied(pair.x2, pair.z2)) {
                    canPlace2 = false;
                }
            } else {
                for (let i = 0; i < pair.len2; i++) {
                    const checkX = pair.x2 + (isXAligned2 ? i : 0);
                    const checkZ = pair.z2 + (isXAligned2 ? 0 : i);
                    if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize || isCellOccupied(checkX, checkZ)) {
                        canPlace2 = false;
                        break;
                    }
                }
            }

            if (canPlace2) {
                if (pair.vert2) {
                    occupiedCells.add(`${pair.x2},${pair.z2}`);
                } else {
                    occupyCells(pair.x2, pair.z2, pair.len2, isXAligned2);
                }
                const isVertical2 = pair.vert2 === true;
                console.log(`Creating block2 at (${pair.x2}, ${pair.z2}), vert2=${pair.vert2}, isVertical2=${isVertical2}, length=${pair.len2}`);
                const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * pair.len2));
                const block2 = new Block(pair.len2, pair.x2, pair.z2, pair.dir2, isVertical2, currentArrowStyle, scene, physics, gridSize, cubeSize, 0, 1, isBomb);
                console.log(`Block2 created, isVertical=${block2.isVertical}`);
                if (scene) scene.remove(block2.group);
                blocksToPlace.push(block2);
            }
        }
    }

    // Fill remaining slots with random blocks if needed
    while (blocksToPlace.length < targetBlockCount) {
        const x = Math.floor(Math.random() * gridSize);
        const z = Math.floor(Math.random() * gridSize);
        if (!isCellOccupied(x, z)) {
            const directions = [{ x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const length = Math.random() < 0.5 ? 1 : (Math.random() < 0.5 ? 2 : 3);
            const isVertical = Math.random() < 0.3; // 30% chance for vertical blocks
            const isXAligned = Math.abs(direction.x) > 0;

            let canPlace = true;
            if (isVertical) {
                // Vertical blocks only occupy the base cell
                if (x < 0 || x >= gridSize || z < 0 || z >= gridSize || isCellOccupied(x, z)) {
                    canPlace = false;
                }
            } else {
                for (let i = 0; i < length; i++) {
                    const checkX = x + (isXAligned ? i : 0);
                    const checkZ = z + (isXAligned ? 0 : i);
                    if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize || isCellOccupied(checkX, checkZ)) {
                        canPlace = false;
                        break;
                    }
                }
            }

            if (canPlace) {
                if (isVertical) {
                    occupiedCells.add(`${x},${z}`);
                } else {
                    occupyCells(x, z, length, isXAligned);
                }
                // Determine if this should be a bomb block (Task 1.1)
                const isBomb = (level >= 31 && Math.random() < (getBlastCellProbabilityForLevel(level) * length));

                // Task 1.3: Spin Gems appear from Level 11+
                const isSpinGem = false; // Task 9.1: Disable spin gems

                const block = new Block(length, x, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, 0, 1, isBomb, isSpinGem);
                if (scene) scene.remove(block.group);
                blocksToPlace.push(block);
            }
        }
    }

    return blocksToPlace;
}
