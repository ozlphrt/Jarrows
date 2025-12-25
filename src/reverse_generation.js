/**
 * Reverse Generation Module
 * 
 * Generates solvable puzzles by:
 * 1. Placing some blocks at edges pointing outward (solved state)
 * 2. Moving blocks backward (opposite to arrow direction) randomly
 * 3. Validating no overlaps during backward moves
 * 4. Result: puzzle that can be solved by moving blocks forward
 */

/**
 * Move a block backward (opposite to its arrow direction)
 * Returns: { success: boolean, newGridX, newGridZ, reason: string }
 */
export function moveBlockBackward(block, allBlocks, gridSize) {
    // Calculate backward direction (opposite to arrow direction)
    const backwardDirection = {
        x: -block.direction.x,
        z: -block.direction.z
    };
    
    const newGridX = block.gridX + backwardDirection.x;
    const newGridZ = block.gridZ + backwardDirection.z;
    
    // Check bounds
    if (block.isVertical) {
        if (newGridX < 0 || newGridX >= gridSize || newGridZ < 0 || newGridZ >= gridSize) {
            return { success: false, reason: 'out of bounds' };
        }
    } else {
        const isXAligned = Math.abs(block.direction.x) > 0;
        for (let i = 0; i < block.length; i++) {
            const checkX = newGridX + (isXAligned ? i : 0);
            const checkZ = newGridZ + (isXAligned ? 0 : i);
            if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                return { success: false, reason: 'out of bounds' };
            }
        }
    }
    
    // Check for overlaps with other blocks at the same Y level
    for (const other of allBlocks) {
        if (other === block || other.yOffset !== block.yOffset) continue;
        
        if (block.isVertical) {
            if (other.isVertical) {
                if (newGridX === other.gridX && newGridZ === other.gridZ) {
                    return { success: false, reason: 'overlap with vertical block' };
                }
            } else {
                const otherIsXAligned = Math.abs(other.direction.x) > 0;
                for (let j = 0; j < other.length; j++) {
                    const otherX = other.gridX + (otherIsXAligned ? j : 0);
                    const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                    if (newGridX === otherX && newGridZ === otherZ) {
                        return { success: false, reason: 'overlap with horizontal block' };
                    }
                }
            }
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const checkX = newGridX + (isXAligned ? i : 0);
                const checkZ = newGridZ + (isXAligned ? 0 : i);
                
                if (other.isVertical) {
                    if (checkX === other.gridX && checkZ === other.gridZ) {
                        return { success: false, reason: 'overlap with vertical block' };
                    }
                } else {
                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                    for (let j = 0; j < other.length; j++) {
                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                        if (checkX === otherX && checkZ === otherZ) {
                            return { success: false, reason: 'overlap with horizontal block' };
                        }
                    }
                }
            }
        }
    }
    
    return { success: true, newGridX, newGridZ };
}

/**
 * Generate blocks using reverse generation
 * @param {number} yOffset - Y level for this layer
 * @param {Set} lowerLayerCells - Cells occupied by lower layers (for support)
 * @param {number} targetBlockCount - Target number of blocks
 * @param {number} level - Current level
 * @param {number} edgeBlockPercentage - Percentage of blocks to start at edges (0-1)
 * @param {number} maxBackwardMoves - Maximum backward moves per block
 * @returns {Array} Array of blocks in their "puzzle" state (after backward moves)
 */
export function generateReversePuzzle(yOffset, lowerLayerCells, targetBlockCount, level, edgeBlockPercentage = 0.4, maxBackwardMoves = 5) {
    const gridSize = 7; // Should be passed as parameter, but using constant for now
    const cubeSize = 1;
    const blocks = [];
    const occupiedCells = new Set();
    
    // Helper to check if cell is occupied
    function isCellOccupied(x, z) {
        if (occupiedCells.has(`${x},${z}`)) return true;
        if (lowerLayerCells && lowerLayerCells.has(`${x},${z}`)) return true;
        return false;
    }
    
    // Helper to mark cells as occupied
    function occupyCells(block) {
        if (block.isVertical) {
            occupiedCells.add(`${block.gridX},${block.gridZ}`);
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (isXAligned ? i : 0);
                const z = block.gridZ + (isXAligned ? 0 : i);
                occupiedCells.add(`${x},${z}`);
            }
        }
    }
    
    // Helper to check if block has support (for upper layers)
    function hasSupport(block) {
        if (yOffset === 0) return true; // Ground level
        
        if (block.isVertical) {
            return lowerLayerCells && lowerLayerCells.has(`${block.gridX},${block.gridZ}`);
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (isXAligned ? i : 0);
                const z = block.gridZ + (isXAligned ? 0 : i);
                if (lowerLayerCells && lowerLayerCells.has(`${x},${z}`)) {
                    return true;
                }
            }
            return false;
        }
    }
    
    // STEP 1: Place some blocks at edges pointing outward (solved state)
    const edgeBlocks = [];
    const edgePositions = [];
    
    // Collect edge positions with support (for upper layers)
    // North edge (z = 0)
    for (let x = 0; x < gridSize; x++) {
        if (!isCellOccupied(x, 0) && hasSupport({ gridX: x, gridZ: 0, isVertical: false, length: 1 })) {
            edgePositions.push({ x, z: 0, direction: { x: 0, z: -1 }, edge: 'north' });
        }
    }
    // South edge (z = gridSize - 1)
    for (let x = 0; x < gridSize; x++) {
        if (!isCellOccupied(x, gridSize - 1) && hasSupport({ gridX: x, gridZ: gridSize - 1, isVertical: false, length: 1 })) {
            edgePositions.push({ x, z: gridSize - 1, direction: { x: 0, z: 1 }, edge: 'south' });
        }
    }
    // West edge (x = 0)
    for (let z = 0; z < gridSize; z++) {
        if (!isCellOccupied(0, z) && hasSupport({ gridX: 0, gridZ: z, isVertical: false, length: 1 })) {
            edgePositions.push({ x: 0, z, direction: { x: -1, z: 0 }, edge: 'west' });
        }
    }
    // East edge (x = gridSize - 1)
    for (let z = 0; z < gridSize; z++) {
        if (!isCellOccupied(gridSize - 1, z) && hasSupport({ gridX: gridSize - 1, gridZ: z, isVertical: false, length: 1 })) {
            edgePositions.push({ x: gridSize - 1, z, direction: { x: 1, z: 0 }, edge: 'east' });
        }
    }
    
    // Shuffle edge positions
    for (let i = edgePositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [edgePositions[i], edgePositions[j]] = [edgePositions[j], edgePositions[i]];
    }
    
    // Place edge blocks (only some, based on percentage)
    const numEdgeBlocks = Math.min(
        Math.floor(targetBlockCount * edgeBlockPercentage),
        edgePositions.length
    );
    
    // Import Block class - we'll need to pass it as parameter or import
    // For now, return edge block data that can be used to create blocks
    
    return {
        edgePositions: edgePositions.slice(0, numEdgeBlocks),
        occupiedCells: new Set(occupiedCells),
        lowerLayerCells,
        yOffset,
        targetBlockCount,
        level
    };
}




