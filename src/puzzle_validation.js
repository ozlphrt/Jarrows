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
    if (block.isVertical) {
        cells.push({x: block.gridX, z: block.gridZ});
    } else {
        const isXAligned = Math.abs(block.direction.x) > 0;
        for (let i = 0; i < block.length; i++) {
            const x = block.gridX + (isXAligned ? i : 0);
            const z = block.gridZ + (isXAligned ? 0 : i);
            cells.push({x, z});
        }
    }
    return cells;
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
        if (block === excludeBlock || block.isFalling || block.isAnimating) continue;
        for (const cell of getBlockCells(block)) {
            occupied.add(`${cell.x},${cell.z}`);
        }
    }
    return occupied;
}

/**
 * Validate structural correctness (no overlaps, valid positions)
 */
export function validateStructure(blocks, gridSize) {
    const occupiedCells = new Map();
    
    for (const block of blocks) {
        if (block.isFalling || block.isAnimating) continue;
        
        const cells = getBlockCells(block);
        
        // Check bounds
        for (const cell of cells) {
            if (cell.x < 0 || cell.x >= gridSize || cell.z < 0 || cell.z >= gridSize) {
                return { valid: false, reason: `Block out of bounds at (${cell.x}, ${cell.z})` };
            }
        }
        
        // Check overlaps
        for (const cell of cells) {
            const key = `${cell.x},${cell.z}`;
            if (occupiedCells.has(key)) {
                return { valid: false, reason: `Overlap at (${cell.x}, ${cell.z})` };
            }
            occupiedCells.set(key, block);
        }
    }
    
    return { valid: true };
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
    const remainingBlocks = blocks.filter(b => !b.isFalling && !b.isAnimating);
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

