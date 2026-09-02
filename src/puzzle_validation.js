/**
 * Puzzle Validation Module
 * 
 * Validates puzzle configurations for:
 * - Structural correctness (no overlaps, valid positions)
 * - Sequential solvability (all blocks can be cleared in some order)
 */

/**
 * Get all cells occupied by a block
 */
export function getBlockCells(block) {
    const cells = [];
    const bx = Math.round(block.gridX);
    const bz = Math.round(block.gridZ);
    if (block.isVertical) {
        cells.push({x: bx, z: bz});
    } else {
        const isXAligned = Math.abs(block.direction.x) > 0;
        for (let i = 0; i < block.length; i++) {
            const x = bx + (isXAligned ? i : 0);
            const z = bz + (isXAligned ? 0 : i);
            cells.push({x, z});
        }
    }
    return cells;
}

// --- 3D overlap helpers (snap + epsilon) ---
// Float drift can accumulate in yOffset (e.g. 2.0016). For structure checks and fixes,
// treat values very close to an integer as that integer.
const Y_SNAP_EPS = 0.35;
const Y_OVERLAP_EPS = 0.05; // touching at boundary is NOT overlap

function snapLayerY(y) {
    const r = Math.round(y);
    return Math.abs(y - r) < Y_SNAP_EPS ? r : y;
}

function yRangesOverlap(aBottom, aTop, bBottom, bTop) {
    return (aTop - bBottom > Y_OVERLAP_EPS) && (bTop - aBottom > Y_OVERLAP_EPS);
}

/**
 * Check if a block can exit the board in its current state
 * Returns: { canExit: boolean, stepsToExit: number }
 */
export function canBlockExit(block, occupiedCells, gridSize) {
    const dir = block.direction;
    let currentX = block.gridX;
    let currentZ = block.gridZ;
    let steps = 0;
    const maxSteps = gridSize * 2;
    
    while (steps < maxSteps) {
        steps++;
        const nextX = currentX + dir.x;
        const nextZ = currentZ + dir.z;
        
        // Check if block can exit
        if (block.isVertical) {
            if (nextX < 0 || nextX >= gridSize || nextZ < 0 || nextZ >= gridSize) {
                return { canExit: true, stepsToExit: steps };
            }
            if (occupiedCells.has(`${nextX},${nextZ}`)) {
                return { canExit: false, stepsToExit: steps };
            }
        } else {
            const isXAligned = Math.abs(dir.x) > 0;
            let canMove = true;
            let canExit = false;
            
            for (let i = 0; i < block.length; i++) {
                const checkX = nextX + (isXAligned ? i : 0);
                const checkZ = nextZ + (isXAligned ? 0 : i);
                
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    canExit = true;
                    break;
                }
                if (occupiedCells.has(`${checkX},${checkZ}`)) {
                    canMove = false;
                    break;
                }
            }
            
            if (canExit) {
                return { canExit: true, stepsToExit: steps };
            }
            if (!canMove) {
                return { canExit: false, stepsToExit: steps };
            }
        }
        
        currentX = nextX;
        currentZ = nextZ;
    }
    
    return { canExit: false, stepsToExit: steps };
}

/**
 * Build occupied cells map from block list
 */
function buildOccupiedCells(blocks, excludeBlock = null) {
    const occupied = new Set();
    for (const block of blocks) {
        // Skip blocks that are falling, animating, removed, exploding, or being removed
        if (block === excludeBlock || block.isFalling || block.isAnimating || block.isRemoved || block.isExploding || block.removalStartTime) continue;
        for (const cell of getBlockCells(block)) {
            occupied.add(`${cell.x},${cell.z}`);
        }
    }
    return occupied;
}

/**
 * Validate structural correctness (no overlaps, valid positions)
 * Updated to support 3D stacking - checks Y levels for overlaps
 */
export function validateStructure(blocks, gridSize) {
    if (!Array.isArray(blocks)) return { valid: true };

    // Deduplicate any repeated block references in blocks array
    const seenBlocks = new Set();
    for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i];
        if (!b) continue;
        if (seenBlocks.has(b)) {
            console.warn(`validateStructure: Pruned duplicate block reference at (${b.gridX}, ${b.gridZ}, yOffset=${b.yOffset})`);
            blocks.splice(i, 1);
        } else {
            seenBlocks.add(b);
        }
    }

    // Track occupied cells with their Y ranges
    const occupiedCells = new Map(); // key: "x,z" -> array of {block, yBottom, yTop}
    
    for (const block of blocks) {
        // Skip blocks that are falling, animating, removed, exploding, or being removed
        if (block.isFalling || block.isAnimating || block.isRemoved || block.isExploding || block.removalStartTime) continue;
        
        const cells = getBlockCells(block);
        
        // Calculate block height (use cubeSize from block if available, otherwise default to 1)
        const cubeSize = block.cubeSize || 1;
        const blockHeight = block.isVertical ? block.length * cubeSize : cubeSize;
        const yBottom = snapLayerY(block.yOffset || 0);
        const yTop = yBottom + blockHeight;
        
        // Check bounds
        for (const cell of cells) {
            if (cell.x < 0 || cell.x >= gridSize || cell.z < 0 || cell.z >= gridSize) {
                return { valid: false, reason: `Block out of bounds at (${cell.x}, ${cell.z})` };
            }
        }
        
        // Check overlaps (3D - including Y levels)
        for (const cell of cells) {
            const key = `${cell.x},${cell.z}`;
            
            if (occupiedCells.has(key)) {
                // Check if Y ranges overlap with any existing block at this X,Z
                const existingBlocks = occupiedCells.get(key);
                for (const existing of existingBlocks) {
                    // Check if Y ranges overlap (ignoring self-comparison)
                    if (existing.block !== block && yRangesOverlap(yBottom, yTop, existing.yBottom, existing.yTop)) {
                        // Enhanced debug info
                        const blockInfo = `block at (${block.gridX}, ${block.gridZ}), yOffset=${yBottom}, height=${blockHeight}`;
                        const existingInfo = `block at (${existing.block.gridX}, ${existing.block.gridZ}), yOffset=${existing.yBottom}, height=${existing.yTop - existing.yBottom}`;
                        console.warn(`Overlap detected: ${blockInfo} overlaps with ${existingInfo} at (${cell.x}, ${cell.z})`);
                        return { valid: false, reason: `Overlap at (${cell.x}, ${cell.z})` };
                    }
                }
                // Add this block to the list at this position
                existingBlocks.push({block, yBottom, yTop});
            } else {
                // First block at this X,Z position
                occupiedCells.set(key, [{block, yBottom, yTop}]);
            }
        }
    }
    
    return { valid: true };
}

/**
 * Fix overlapping blocks by moving them apart or pruning unresolvable duplicate/stacked blocks
 * Returns: { fixed: boolean, movedBlocks: Block[], prunedBlocks: Block[], failedOverlaps: any[] }
 */
export function fixOverlappingBlocks(blocks, gridSize) {
    if (!Array.isArray(blocks)) return { fixed: true, movedBlocks: [], prunedBlocks: [], failedOverlaps: [] };

    const movedBlocks = [];
    const prunedBlocks = [];

    // Step 1: Remove exact duplicate block references
    const seen = new Set();
    for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i];
        if (!b) continue;
        if (seen.has(b)) {
            console.warn(`fixOverlappingBlocks: Removed duplicate block reference at (${b.gridX}, ${b.gridZ}, yOffset=${b.yOffset})`);
            blocks.splice(i, 1);
        } else {
            seen.add(b);
        }
    }

    function getBlockYRange(block, yOverride = null) {
        const cubeSize = block.cubeSize || 1;
        const height = block.isVertical ? block.length * cubeSize : cubeSize;
        const yBottom = snapLayerY(yOverride !== null ? yOverride : (block.yOffset || 0));
        return { yBottom, yTop: yBottom + height, height, cubeSize };
    }

    function cellsToKeySet(cells) {
        const s = new Set();
        for (const c of cells) s.add(`${c.x},${c.z}`);
        return s;
    }

    function isSafeAtYOffset(blockToMove, testYOffset, allBlocks) {
        const { yBottom, yTop } = getBlockYRange(blockToMove, testYOffset);
        const moveCells = getBlockCells(blockToMove);
        const moveCellSet = cellsToKeySet(moveCells);

        for (const other of allBlocks) {
            if (!other || other === blockToMove || other.isFalling || other.isAnimating || other.isRemoved || other.isExploding || other.removalStartTime) continue;
            const otherCells = getBlockCells(other);
            let sharesCell = false;
            for (const c of otherCells) {
                if (moveCellSet.has(`${c.x},${c.z}`)) {
                    sharesCell = true;
                    break;
                }
            }
            if (!sharesCell) continue;

            const otherRange = getBlockYRange(other);
            if (yRangesOverlap(yBottom, yTop, otherRange.yBottom, otherRange.yTop)) {
                return false;
            }
        }
        return true;
    }

    function hasSupportAtYOffset(blockToMove, testYOffset, allBlocks) {
        if (testYOffset <= 0.05) return true;
        const moveCells = getBlockCells(blockToMove);
        const moveCellSet = cellsToKeySet(moveCells);

        for (const other of allBlocks) {
            if (!other || other === blockToMove || other.isFalling || other.isRemoved || other.isExploding || other.removalStartTime) continue;
            const otherCells = getBlockCells(other);
            let sharesCell = false;
            for (const c of otherCells) {
                if (moveCellSet.has(`${c.x},${c.z}`)) {
                    sharesCell = true;
                    break;
                }
            }
            if (!sharesCell) continue;

            const otherHeight = other.isVertical ? (other.length * (other.cubeSize || 1)) : (other.cubeSize || 1);
            const otherTop = snapLayerY(other.yOffset || 0) + otherHeight;
            if (Math.abs(otherTop - testYOffset) < 0.1) {
                return true;
            }
        }
        return false;
    }

    // Helper to safely prune an unresolvable overlapping block
    function pruneBlock(blockToPrune) {
        if (!blockToPrune || blockToPrune.isRemoved) return;
        console.warn(`fixOverlappingBlocks: Pruning unresolvable overlapping block at (${blockToPrune.gridX}, ${blockToPrune.gridZ}, yOffset=${blockToPrune.yOffset})`);

        if (blockToPrune.group && blockToPrune.group.parent) {
            blockToPrune.group.parent.remove(blockToPrune.group);
        }
        if (Array.isArray(blockToPrune.cubes)) {
            for (const cube of blockToPrune.cubes) {
                if (cube && cube.geometry) cube.geometry.dispose();
                if (cube && cube.material) {
                    if (Array.isArray(cube.material)) cube.material.forEach(m => m && m.dispose && m.dispose());
                    else if (cube.material.dispose) cube.material.dispose();
                }
            }
        }
        if (blockToPrune.arrow) {
            blockToPrune.arrow.traverse((child) => {
                if (child.geometry && child.geometry.dispose) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m && m.dispose && m.dispose());
                    else if (child.material.dispose) child.material.dispose();
                }
            });
        }
        if (blockToPrune.directionIndicators) {
            blockToPrune.directionIndicators.traverse((child) => {
                if (child.geometry && child.geometry.dispose) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m && m.dispose && m.dispose());
                    else if (child.material.dispose) child.material.dispose();
                }
            });
        }

        blockToPrune.isRemoved = true;
        const idx = blocks.indexOf(blockToPrune);
        if (idx !== -1) {
            blocks.splice(idx, 1);
        }

        if (typeof window !== 'undefined' && window.activeBlocks && window.activeBlocks.has(blockToPrune)) {
            window.activeBlocks.delete(blockToPrune);
        }

        prunedBlocks.push(blockToPrune);
    }

    // Run up to 2 passes to resolve direct and cascading overlaps
    let failedOverlaps = [];
    for (let pass = 0; pass < 2; pass++) {
        failedOverlaps = [];
        const overlaps = [];
        const occupiedCells = new Map(); // key: "x,z" -> array of {block, yBottom, yTop}

        for (const block of blocks) {
            if (block.isFalling || block.isAnimating || block.isRemoved || block.isExploding || block.removalStartTime) continue;
            const { yBottom, yTop } = getBlockYRange(block);
            const cells = getBlockCells(block);

            for (const cell of cells) {
                const key = `${cell.x},${cell.z}`;
                const list = occupiedCells.get(key) || [];
                for (const existing of list) {
                    if (existing.block !== block && yRangesOverlap(yBottom, yTop, existing.yBottom, existing.yTop)) {
                        overlaps.push({ block1: block, block2: existing.block, cell: { x: cell.x, z: cell.z } });
                    }
                }
                list.push({ block, yBottom, yTop });
                occupiedCells.set(key, list);
            }
        }

        if (overlaps.length === 0) break;

        for (const overlap of overlaps) {
            const b1 = overlap.block1;
            const b2 = overlap.block2;
            if (!b1 || !b2 || b1.isRemoved || b2.isRemoved) continue;

            // Heuristic: if vertical+horizontal overlap, move the horizontal block.
            // Otherwise move the one with higher Y (or b2 if identical).
            const b1Y = snapLayerY(b1.yOffset || 0);
            const b2Y = snapLayerY(b2.yOffset || 0);
            let blockToMove = b1;
            if (b1.isVertical !== b2.isVertical) {
                blockToMove = b1.isVertical ? b2 : b1;
            } else {
                blockToMove = b1Y >= b2Y ? b1 : b2;
            }

            const { cubeSize } = getBlockYRange(blockToMove);
            const base = snapLayerY(blockToMove.yOffset || 0);

            // Candidate list: snapped base, downward steps to 0, then only supported layer tops
            const candidates = [base];
            const maxLayers = Math.max(1, Math.round(base / cubeSize));
            for (let i = 1; i <= maxLayers; i++) {
                candidates.push(Math.max(0, base - i * cubeSize));
            }
            candidates.push(0);

            // Also candidate tops of overlapping or neighboring blocks below
            const otherBlock = blockToMove === b1 ? b2 : b1;
            const otherHeight = otherBlock.isVertical ? (otherBlock.length * cubeSize) : cubeSize;
            const otherTop = snapLayerY(otherBlock.yOffset || 0) + otherHeight;
            candidates.push(otherTop);

            let chosen = null;
            for (const c of candidates) {
                if (isSafeAtYOffset(blockToMove, c, blocks) && hasSupportAtYOffset(blockToMove, c, blocks)) {
                    chosen = c;
                    break;
                }
            }

            if (chosen !== null && Math.abs((blockToMove.yOffset || 0) - chosen) > 1e-9) {
                blockToMove.yOffset = chosen;
                if (typeof blockToMove.updateWorldPosition === 'function') {
                    blockToMove.updateWorldPosition();
                }
                if (!movedBlocks.includes(blockToMove)) movedBlocks.push(blockToMove);
            } else if (chosen === null) {
                // If this block cannot be safely relocated without overlap, prune it so the puzzle is playable
                pruneBlock(blockToMove);
            }
        }
    }

    // Only report fixed if structure is actually valid afterwards.
    const recheck = validateStructure(blocks, gridSize);
    if (!recheck.valid) {
        console.warn(`fixOverlappingBlocks: Structure still has invalid overlaps: ${recheck.reason}`);
    }
    return { fixed: recheck.valid, movedBlocks, prunedBlocks, failedOverlaps };
}

/**
 * Check and fix all overlapping blocks in the puzzle
 * Can be called manually for debugging or automatically before moves/after generation
 */
export function checkAndFixAllOverlaps(blocks, gridSize) {
    const structureCheck = validateStructure(blocks, gridSize);
    if (structureCheck.valid) {
        return { fixed: false, message: 'No overlaps detected', movedBlocks: [], prunedBlocks: [] };
    }
    
    console.warn('Overlaps detected, attempting to fix...');
    const fixResult = fixOverlappingBlocks(blocks, gridSize);
    
    if (fixResult.fixed) {
        const movedCount = fixResult.movedBlocks ? fixResult.movedBlocks.length : 0;
        const prunedCount = fixResult.prunedBlocks ? fixResult.prunedBlocks.length : 0;
        const parts = [];
        if (movedCount > 0) parts.push(`moved ${movedCount} block(s)`);
        if (prunedCount > 0) parts.push(`pruned ${prunedCount} overlapping block(s)`);
        const detail = parts.length > 0 ? parts.join(', ') : 'deduplicated';
        return { fixed: true, message: `Fixed overlapping blocks: ${detail}`, movedBlocks: fixResult.movedBlocks, prunedBlocks: fixResult.prunedBlocks };
    } else {
        return { fixed: false, message: 'Could not fix all overlaps automatically', movedBlocks: fixResult.movedBlocks || [], prunedBlocks: fixResult.prunedBlocks || [] };
    }
}

/**
 * Validate sequential solvability
 * 
 * Strategy: Try to clear blocks one at a time. If all blocks can be cleared,
 * the puzzle is solvable. This accounts for the fact that clearing one block
 * may unblock others.
 * 
 * Returns: { solvable: boolean, solution: Block[] (order of clearing), reason: string }
 */
export function validateSolvability(blocks, gridSize) {
    // Structural check first
    const structureCheck = validateStructure(blocks, gridSize);
    if (!structureCheck.valid) {
        return { solvable: false, solution: [], reason: structureCheck.reason };
    }
    
    // Create a working copy of blocks (simulate removal)
    // Exclude blocks that are falling, animating, removed, or being removed
    const remainingBlocks = blocks.filter(b => !b.isFalling && !b.isAnimating && !b.isRemoved && !b.isExploding && !b.removalStartTime);
    const solution = [];
    const maxIterations = remainingBlocks.length * 2; // Safety limit
    let iterations = 0;
    
    while (remainingBlocks.length > 0 && iterations < maxIterations) {
        iterations++;
        
        // Find a block that can exit
        let foundClearable = false;
        const occupiedCells = buildOccupiedCells(remainingBlocks);
        
        for (let i = 0; i < remainingBlocks.length; i++) {
            const block = remainingBlocks[i];
            const exitCheck = canBlockExit(block, occupiedCells, gridSize);
            
            if (exitCheck.canExit) {
                // This block can be cleared
                solution.push(block);
                remainingBlocks.splice(i, 1);
                foundClearable = true;
                break;
            }
        }
        
        if (!foundClearable) {
            // No block can exit - puzzle is unsolvable
            return {
                solvable: false,
                solution: [],
                reason: `${remainingBlocks.length} blocks cannot be cleared`
            };
        }
    }
    
    if (remainingBlocks.length > 0) {
        return {
            solvable: false,
            solution: [],
            reason: `Could not clear all blocks after ${iterations} iterations`
        };
    }
    
    return {
        solvable: true,
        solution: solution,
        reason: `All ${blocks.length} blocks can be cleared`
    };
}

/**
 * Calculate puzzle difficulty metrics
 */
export function calculateDifficulty(blocks, gridSize) {
    const solvability = validateSolvability(blocks, gridSize);
    
    if (!solvability.solvable) {
        return {
            difficulty: 'unsolvable',
            score: Infinity,
            metrics: {
                totalBlocks: blocks.length,
                solvable: false
            }
        };
    }
    
    // Difficulty factors:
    // 1. Number of blocks (more = harder)
    // 2. Average steps to exit (more = harder)
    // 3. Block interdependencies (blocks that block others)
    
    const occupiedCells = buildOccupiedCells(blocks);
    let totalSteps = 0;
    let maxSteps = 0;
    let blockingCount = 0;
    
    for (const block of blocks) {
        const exitCheck = canBlockExit(block, occupiedCells, gridSize);
        totalSteps += exitCheck.stepsToExit;
        maxSteps = Math.max(maxSteps, exitCheck.stepsToExit);
        
        // Check if this block blocks others
        const cells = getBlockCells(block);
        for (const other of blocks) {
            if (other === block) continue;
            const otherCells = getBlockCells(other);
            // Check if block is in the path of other
            // Simplified: if they share cells or block is in other's path
            const otherExit = canBlockExit(other, occupiedCells, gridSize);
            if (!otherExit.canExit) {
                // Check if removing this block would help
                const tempOccupied = buildOccupiedCells(blocks, block);
                const newExit = canBlockExit(other, tempOccupied, gridSize);
                if (newExit.canExit) {
                    blockingCount++;
                    break;
                }
            }
        }
    }
    
    const avgSteps = totalSteps / blocks.length;
    const density = blocks.length / (gridSize * gridSize);
    
    // Difficulty score (higher = harder)
    const score = (
        blocks.length * 10 +           // More blocks = harder
        avgSteps * 5 +                 // More steps = harder
        maxSteps * 3 +                 // Long paths = harder
        blockingCount * 15 +           // Interdependencies = harder
        density * 100                  // Higher density = harder
    );
    
    let difficulty = 'easy';
    if (score > 200) difficulty = 'hard';
    else if (score > 100) difficulty = 'medium';
    
    return {
        difficulty,
        score,
        metrics: {
            totalBlocks: blocks.length,
            avgStepsToExit: avgSteps.toFixed(2),
            maxStepsToExit: maxSteps,
            blockingRelations: blockingCount,
            density: density.toFixed(2),
            solvable: true
        }
    };
}

