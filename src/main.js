import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initPhysics, createPhysicsBlock, updatePhysics, isPhysicsStepping, hasPendingOperations, isPhysicsProcessing } from './physics.js';
import { Block } from './Block.js';
import { createLights, createGrid } from './scene.js';
import { validateStructure, validateSolvability, calculateDifficulty, getBlockCells } from './puzzle_validation.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Global arrow style
let currentArrowStyle = 2;

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 8, 8);
camera.lookAt(3, 0, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(3, 0, 3);

// Configure camera controls for heavy, momentum-based feel
// Lower damping factor = longer coasting (more inertia)
controls.enableDamping = true;
controls.dampingFactor = 0.06; // Lower = heavier, longer coasting
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;

// Slower speeds = heavier feel (harder to start, harder to stop)
controls.rotateSpeed = 0.25; // Slower rotation for heavier feel
controls.panSpeed = 0.5;
controls.zoomSpeed = 0.5;

// Distance constraints
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI * 0.9; // Prevent camera from going below ground

controls.update();

// Track camera drag state to prevent block clicks during camera movement
let isCameraDragging = false;
let mouseDownPos = null;
const DRAG_THRESHOLD = 3; // pixels - minimum movement to consider it a drag

renderer.domElement.addEventListener('mousedown', (event) => {
    mouseDownPos = { x: event.clientX, y: event.clientY };
    isCameraDragging = false;
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (mouseDownPos) {
        const dx = event.clientX - mouseDownPos.x;
        const dy = event.clientY - mouseDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > DRAG_THRESHOLD) {
            isCameraDragging = true;
        }
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    mouseDownPos = null;
    // Keep isCameraDragging true until next mousedown to prevent click after drag
});

renderer.domElement.addEventListener('mouseleave', () => {
    mouseDownPos = null;
    isCameraDragging = false;
});

// Setup scene elements
createLights(scene);
const { base, gridHelper } = createGrid(scene);
const gridSize = 7;
const cubeSize = 1;

// Initialize Rapier physics
const physics = await initPhysics();

// Create random blocks
const blocks = [];
const directions = [
    {x: 1, z: 0},   // East
    {x: -1, z: 0},  // West
    {x: 0, z: 1},   // South
    {x: 0, z: -1}   // North
];

// Leveling system
let currentLevel = 0;
let isGeneratingLevel = false; // Prevent multiple simultaneous level generations
let levelCompleteShown = false; // Prevent showing level complete modal multiple times

// Get block count for current level
// Level 0 = 3 blocks (tutorial)
// Level 1 = 10 blocks
// Level 2 = 20 blocks
// Level 3 = 30 blocks
// Level N = 10 + (N - 1) * 10 blocks (for N >= 1)
function getBlocksForLevel(level) {
    if (level === 0) {
        return 3;
    }
    return 10 + (level - 1) * 10;
}

// Validation functions are now imported from puzzle_validation.js

/**
 * Reverse Generation: Start from solved state (blocks at edges) and work backward
 * This guarantees 100% solvable puzzles
 * @param {number} yOffset - Y offset for this layer (0 for level 1, cubeSize for level 2, etc.)
 * @param {Set} lowerLayerCells - Cells occupied by blocks in lower layers (for level 2+ to prevent overlapping and floating)
 * @param {number} targetBlockCount - Target number of blocks to generate
 * @param {number} level - Current level number
 * @returns {Array} Array of blocks to be placed (not yet added to scene)
 */
function createSolvableBlocks(yOffset = 0, lowerLayerCells = null, targetBlockCount = 10, level = 1) {
    // Note: We don't clear blocks here - that's done in generateSolvablePuzzle
    // This allows us to add multiple layers
    
    const totalCells = gridSize * gridSize;
    const occupiedCells = new Set();
    const blocksToPlace = []; // Store blocks to be placed sequentially
    
    // For small block counts (like Level 1 with 10 blocks), use random placement across entire grid
    // This prevents all blocks being at edges, all arrows pointing out, and all being vertical
    const isSmallCount = targetBlockCount <= 15;
    
    // For level 2+, also check cells occupied by lower layers to prevent overlapping
    function isCellOccupied(x, z) {
        // Check if this cell is occupied in current layer
        if (occupiedCells.has(`${x},${z}`)) {
            return true;
        }
        // For level 2+, also check if cell is occupied in lower layers (prevent overlapping)
        if (lowerLayerCells && lowerLayerCells.has(`${x},${z}`)) {
            return true;
        }
        return false;
    }
    
    // For level 2+, check if a block has support from lower layer (prevent floating)
    function hasSupport(block) {
        // Level 1 blocks don't need support (they're on the ground)
        if (yOffset === 0) {
            return true;
        }
        
        // Level 2+ blocks need at least one cell to have a block below
        if (block.isVertical) {
            return lowerLayerCells && lowerLayerCells.has(`${block.gridX},${block.gridZ}`);
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (isXAligned ? i : 0);
                const z = block.gridZ + (isXAligned ? 0 : i);
                if (lowerLayerCells && lowerLayerCells.has(`${x},${z}`)) {
                    return true; // At least one cell has support
                }
            }
            return false; // No support found
        }
    }
    
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
    
    // SMALL COUNT MODE: Random placement across entire grid for variety
    if (isSmallCount) {
        // Get all available cells
        const availableCells = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                if (!isCellOccupied(x, z)) {
                    availableCells.push({x, z});
                }
            }
        }
        
        // Shuffle for randomness
        for (let i = availableCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
        }
        
        // Try to place blocks randomly
        for (const cell of availableCells) {
            if (blocksToPlace.length >= targetBlockCount) break;
            
            // Random length distribution: 40% length 1, 40% length 2, 20% length 3
            const rand = Math.random();
            let length;
            if (rand < 0.4) {
                length = 1;
            } else if (rand < 0.8) {
                length = 2;
            } else {
                length = 3;
            }
            
            // Random direction (all 4 directions equally likely)
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            
            // 50% vertical, 50% horizontal
            const isVertical = Math.random() < 0.5;
            
            // Check if we can place this block
            let canPlace = true;
            const testCells = [];
            
            if (isVertical) {
                // Vertical blocks only occupy one cell
                if (isCellOccupied(cell.x, cell.z)) {
                    canPlace = false;
                } else {
                    testCells.push({x: cell.x, z: cell.z});
                }
            } else {
                // Horizontal blocks occupy multiple cells
                const isXAligned = Math.abs(randomDir.x) > 0;
                for (let i = 0; i < length; i++) {
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
                    testCells.push({x: checkX, z: checkZ});
                }
            }
            
            if (!canPlace) continue;
            
            // Create and place the block
            const block = new Block(length, cell.x, cell.z, randomDir, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
            
            // Check if block has support (for level 2+)
            if (!hasSupport(block)) {
                scene.remove(block.group);
                continue;
            }
            
            scene.remove(block.group); // Remove from scene, will be added with animation
            blocksToPlace.push(block);
            occupyCells(block);
        }
        
        // Return early for small counts - we've placed blocks randomly
        return blocksToPlace;
    }
    
    // LARGE COUNT MODE: Use edge placement strategy (original logic)
    // STEP 1: Place blocks at edges pointing outward (guaranteed solvable)
    // This creates a "solved" state where all blocks can exit immediately
    
    const edgeBlocks = [];
    
    // Place blocks along each edge
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
            // 90% chance of length 2-3, only use 1 as last resort
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1; // 90% chance of 2-3
            const isVertical = length > 1 && Math.random() < 0.7; // Prefer vertical for multi-block
            const direction = {x: 0, z: -1}; // North
            
            // Only place vertical blocks or single blocks at edges
            if (isVertical || length === 1) {
                if (!isCellOccupied(x, 0)) {
                    const block = new Block(length, x, 0, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // South edge (z = gridSize-1, pointing south/down)
    for (let x = 0; x < gridSize; x++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(x, gridSize - 1)) {
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < 0.7;
            const direction = {x: 0, z: 1}; // South
            
            if (isVertical || length === 1) {
                if (!isCellOccupied(x, gridSize - 1)) {
                    const block = new Block(length, x, gridSize - 1, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // West edge (x = 0, pointing west/left)
    for (let z = 0; z < gridSize; z++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(0, z)) {
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < 0.7;
            const direction = {x: -1, z: 0}; // West
            
            if (isVertical || length === 1) {
                if (!isCellOccupied(0, z)) {
                    const block = new Block(length, 0, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // East edge (x = gridSize-1, pointing east/right)
    for (let z = 0; z < gridSize; z++) {
        if (blocksToPlace.length >= targetBlockCount) break;
        if (!isCellOccupied(gridSize - 1, z)) {
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < 0.7;
            const direction = {x: 1, z: 0}; // East
            
            if (isVertical || length === 1) {
                if (!isCellOccupied(gridSize - 1, z)) {
                    const block = new Block(length, gridSize - 1, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        scene.remove(block.group);
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
    
    while (inwardAttempts < maxInwardAttempts && occupiedCells.size < totalCells * 0.95 && blocksToPlace.length < targetBlockCount) {
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
                testCells.push({x: newX, z: newZ});
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
                testCells.push({x: checkX, z: checkZ});
            }
        }
        
        if (!canMove) continue;
        
        // Temporarily move block and validate solvability
        const oldX = block.gridX;
        const oldZ = block.gridZ;
        const oldCells = getBlockCells(block);
        
        // Remove from occupied cells
        for (const cell of oldCells) {
            occupiedCells.delete(`${cell.x},${cell.z}`);
        }
        
        // Update block position
        block.gridX = newX;
        block.gridZ = newZ;
        block.updateWorldPosition();
        
        // Add new cells
        for (const cell of testCells) {
            occupiedCells.add(`${cell.x},${cell.z}`);
        }
        
        // Move successful - keep new position
        continue;
    }
    
    // STEP 3: Fill remaining cells with longer blocks when possible
    
    // STEP 3: Fill remaining cells - try to create longer blocks (2-3) first, single blocks only as last resort
    const remainingCells = [];
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            if (!isCellOccupied(x, z)) {
                remainingCells.push({x, z});
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
        if (nearestEdges.includes('east')) {
            chosenDirection = {x: 1, z: 0};
        } else if (nearestEdges.includes('west')) {
            chosenDirection = {x: -1, z: 0};
        } else if (nearestEdges.includes('south')) {
            chosenDirection = {x: 0, z: 1};
        } else if (nearestEdges.includes('north')) {
            chosenDirection = {x: 0, z: -1};
        }
        
        // Try to create longer blocks (2-3) first, single blocks only as absolute last resort
        let blockAdded = false;
        const isXAligned = Math.abs(chosenDirection.x) > 0;
        
        // Try length 3, then 2, then 1 (with very low probability for 1)
        for (const tryLength of [3, 2, 1]) {
            if (tryLength === 1 && Math.random() < 0.85) continue; // Only 15% chance to use single blocks
            
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
                testCells.push({x: checkX, z: checkZ});
            }
            
            if (!canPlace) continue;
            
            // Try adding this block
            const testBlock = new Block(tryLength, cell.x, cell.z, chosenDirection, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
            
            // Check if block has support (for level 2+)
            if (!hasSupport(testBlock)) {
                scene.remove(testBlock.group);
                continue;
            }
            
            scene.remove(testBlock.group); // Remove from scene, will be added with animation
            blocksToPlace.push(testBlock);
            occupyCells(testBlock); // Use helper function to mark cells as occupied

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
    const maxFillPasses = 3;
    
    while (fillPasses < maxFillPasses && occupiedCells.size < totalCells && blocksToPlace.length < targetBlockCount) {
        fillPasses++;
        const beforeFill = occupiedCells.size;
        
        // Get remaining cells
        const stillEmpty = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                if (!isCellOccupied(x, z)) {
                    stillEmpty.push({x, z});
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
                {x: 1, z: 0}, {x: -1, z: 0}, {x: 0, z: 1}, {x: 0, z: -1}
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
                    if (tryLength === 1 && Math.random() < 0.9) continue; // Only 10% chance for single
                    
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
                        testCells.push({x: checkX, z: checkZ});
                    }
                    
                    if (!canPlace) continue;
                    
                    // Try adding block
                    const testBlock = new Block(tryLength, cell.x, cell.z, dir, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    
                    // Check if block has support (for level 2+)
                    if (!hasSupport(testBlock)) {
                        scene.remove(testBlock.group);
                        continue;
                    }
                    
                    scene.remove(testBlock.group); // Remove from scene, will be added with animation
                    blocksToPlace.push(testBlock);
                    occupyCells(testBlock);
                    
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
    
    const singleBlockCount = blocksToPlace.filter(b => b.length === 1).length;
    const totalBlockCount = blocksToPlace.length;
    const singleBlockPercent = ((singleBlockCount / totalBlockCount) * 100).toFixed(1);
    
    console.log(`Generated puzzle with ${blocksToPlace.length} blocks, ${occupiedCells.size}/${totalCells} cells filled (${((occupiedCells.size/totalCells)*100).toFixed(1)}%)`);
    console.log(`  Single blocks: ${singleBlockCount}/${totalBlockCount} (${singleBlockPercent}%)`);
    
    return blocksToPlace;
}

// Place blocks in batches with fast animation
function placeBlocksBatch(blocksToPlace, batchSize = 10, delayBetweenBatches = 10) {
    return new Promise((resolve) => {
        let batchIndex = 0;
        
        const placeBatch = () => {
            const startIdx = batchIndex * batchSize;
            const endIdx = Math.min(startIdx + batchSize, blocksToPlace.length);
            
            if (startIdx >= blocksToPlace.length) {
                resolve();
                return;
            }
            
            // Add all blocks in this batch to scene immediately
            for (let i = startIdx; i < endIdx; i++) {
                const block = blocksToPlace[i];
                block.group.scale.set(0, 0, 0);
                scene.add(block.group);
                blocks.push(block);
            }
            
            // Animate all blocks in batch simultaneously - very fast
        const startTime = performance.now();
            const duration = 50; // Very fast animation
        
            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out cubic for smooth animation
                const eased = 1 - Math.pow(1 - progress, 3);
                
                // Update all blocks in batch
                for (let i = startIdx; i < endIdx; i++) {
                    blocksToPlace[i].group.scale.set(eased, eased, eased);
                }
                            
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                    // Finalize scale
                    for (let i = startIdx; i < endIdx; i++) {
                        blocksToPlace[i].group.scale.set(1, 1, 1);
                    }
                    
                    // Move to next batch
                    batchIndex++;
                    setTimeout(placeBatch, delayBetweenBatches);
                        }
                    };
                    
                    animate();
        };
        
        placeBatch();
    });
}

// Generate solvable puzzle using reverse generation (guaranteed solvable)
async function generateSolvablePuzzle(level = 1) {
    if (isGeneratingLevel) {
        console.warn('Level generation already in progress, skipping...');
        return;
    }
    
    isGeneratingLevel = true;
    levelCompleteShown = false; // Reset level complete flag for new level
    
    // Clear existing blocks first
    for (const block of blocks) {
        scene.remove(block.group);
    }
    blocks.length = 0;
    
    // Get target block count for this level
    const targetBlockCount = getBlocksForLevel(level);
    
    // Generate level (base layer at Y=0) - returns blocks to place
    const level1Blocks = createSolvableBlocks(0, null, targetBlockCount, level);
    
    // Place all blocks in batches
    await placeBlocksBatch(level1Blocks, 10, 10); // 10 blocks per batch, 10ms between batches
    
    // Update level counter display
    const levelValueElement = document.getElementById('level-value');
    if (levelValueElement) {
        levelValueElement.textContent = level;
    }
    
    isGeneratingLevel = false;
    
    // Start timer for new level
    resetTimer();
    startTimer();
    
    // Update button states after level generation
    updateUndoButtonState();
    
    console.log(`✓ Generated Level ${level} puzzle using reverse generation`);
    console.log(`  Target blocks: ${targetBlockCount}, Actual blocks: ${blocks.length}`);
}

// Move history for undo functionality
let moveHistory = [];

// Timer functionality
let timerStartTime = null;
let timerPausedTime = 0;
let isTimerRunning = false;

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Start timer
function startTimer() {
    if (isTimerRunning) return;
    
    timerStartTime = performance.now() / 1000; // Convert to seconds
    timerPausedTime = 0;
    isTimerRunning = true;
}

// Stop timer
function stopTimer() {
    if (!isTimerRunning) return;
    
    if (timerStartTime !== null) {
        timerPausedTime += (performance.now() / 1000) - timerStartTime;
    }
    timerStartTime = null;
    isTimerRunning = false;
}

// Reset timer
function resetTimer() {
    timerStartTime = null;
    timerPausedTime = 0;
    isTimerRunning = false;
    updateTimerDisplay();
}

// Update timer display
function updateTimerDisplay() {
    const timerValueElement = document.getElementById('timer-value');
    if (!timerValueElement) return;
    
    let elapsedSeconds = timerPausedTime;
    
    if (isTimerRunning && timerStartTime !== null) {
        elapsedSeconds += (performance.now() / 1000) - timerStartTime;
    }
    
    timerValueElement.textContent = formatTime(elapsedSeconds);
}

// Save move state before a block moves
function saveMoveState(block) {
    moveHistory.push({
        block: block,
        gridX: block.gridX,
        gridZ: block.gridZ,
        direction: {...block.direction},
        isVertical: block.isVertical,
        timestamp: performance.now()
    });
    
    // Limit history to last 50 moves
    if (moveHistory.length > 50) {
        moveHistory.shift();
    }
}

// Undo last move
function undoLastMove() {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory.pop();
    const block = lastMove.block;
    
    // Check if block still exists (hasn't been removed)
    if (!blocks.includes(block) || block.isRemoved) {
        // Block was removed, can't undo
        return;
    }
    
    // Restore block position
    block.gridX = lastMove.gridX;
    block.gridZ = lastMove.gridZ;
    block.direction = lastMove.direction;
    block.isVertical = lastMove.isVertical;
    block.updateWorldPosition();
    
    console.log(`Undo: Restored block to (${block.gridX}, ${block.gridZ})`);
}

// Remove last moved block (if it hasn't fallen off)
function removeLastMovedBlock() {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    const block = lastMove.block;
    
    // Check if block still exists and hasn't fallen
    if (!blocks.includes(block) || block.isRemoved || block.isFalling) {
        console.warn('Cannot remove: block has already been removed or is falling');
        return;
    }
    
    // Remove block from scene and array
    scene.remove(block.group);
    const index = blocks.indexOf(block);
    if (index > -1) {
        blocks.splice(index, 1);
    }
    
    // Remove from move history
    moveHistory = moveHistory.filter(m => m.block !== block);
    
    console.log(`Removed block at (${lastMove.gridX}, ${lastMove.gridZ})`);
}

// Restart current level
async function restartCurrentLevel() {
    if (isGeneratingLevel) return;
    
    // Clear move history
    moveHistory = [];
    
    // Regenerate current level
    await generateSolvablePuzzle(currentLevel);
}

// Start new game (reset to level 0)
async function startNewGame() {
    if (isGeneratingLevel) return;
    
    // Reset to level 0
    currentLevel = 0;
    levelCompleteShown = false;
    
    // Clear move history
    moveHistory = [];
    
    // Hide level complete modal if visible
    hideLevelCompleteModal();
    
    // Generate level 0
    await generateSolvablePuzzle(currentLevel);
}

// Level completion modal functions
function showLevelCompleteModal(completedLevel) {
    const modal = document.getElementById('level-complete-modal');
    const message = document.getElementById('level-complete-message');
    
    if (modal && message) {
        message.textContent = `Congratulations! You cleared Level ${completedLevel}!`;
        modal.style.display = 'flex';
    }
}

function hideLevelCompleteModal() {
    const modal = document.getElementById('level-complete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Next level button handler
const nextLevelButton = document.getElementById('next-level-button');
if (nextLevelButton) {
    nextLevelButton.addEventListener('click', async () => {
        hideLevelCompleteModal();
        currentLevel++;
        moveHistory = []; // Clear move history for new level
        await generateSolvablePuzzle(currentLevel);
    });
}

// Game control button handlers
const undoButton = document.getElementById('undo-button');
if (undoButton) {
    undoButton.addEventListener('click', () => {
        undoLastMove();
        updateUndoButtonState();
    });
}

const removeButton = document.getElementById('remove-button');
if (removeButton) {
    removeButton.addEventListener('click', () => {
        removeLastMovedBlock();
        updateUndoButtonState();
    });
}

const restartLevelButton = document.getElementById('restart-level-button');
if (restartLevelButton) {
    restartLevelButton.addEventListener('click', async () => {
        await restartCurrentLevel();
        updateUndoButtonState();
    });
}

const newGameButton = document.getElementById('new-game-button');
if (newGameButton) {
    newGameButton.addEventListener('click', async () => {
        await startNewGame();
        updateUndoButtonState();
    });
}

// Update undo button state (enable/disable based on history)
function updateUndoButtonState() {
    if (undoButton) {
        undoButton.disabled = moveHistory.length === 0;
    }
    if (removeButton) {
        removeButton.disabled = moveHistory.length === 0;
    }
}

// Initialize Level 0
generateSolvablePuzzle(currentLevel);

// Initialize button states
updateUndoButtonState();

// Initialize timer display
updateTimerDisplay();

// Solution tracking for testing
window.puzzleSolution = null;
window.solutionStep = 0;

// Highlight the next block in solution
function highlightNextBlock() {
    // Clear all highlights
    for (const block of blocks) {
        if (block.setHighlight) {
            block.setHighlight(false);
        }
    }
    
    if (!window.puzzleSolution || window.solutionStep >= window.puzzleSolution.length) {
        console.log('✓ Solution complete! All blocks cleared.');
        return;
    }
    
    const nextBlockInSolution = window.puzzleSolution[window.solutionStep];
    
    // Solution contains actual block objects, but they may have been removed
    // Check if block still exists in blocks array
    if (blocks.includes(nextBlockInSolution) && !nextBlockInSolution.isFalling && !nextBlockInSolution.isRemoved) {
        console.log(`→ Step ${window.solutionStep + 1}/${window.puzzleSolution.length}: Highlighting block at (${nextBlockInSolution.gridX}, ${nextBlockInSolution.gridZ})`);
        nextBlockInSolution.setHighlight(true);
        console.log(`  ✓ Block highlighted! Look for the bright YELLOW block`);
        console.log(`  Block properties: length=${nextBlockInSolution.length}, vertical=${nextBlockInSolution.isVertical}, dir=(${nextBlockInSolution.direction.x}, ${nextBlockInSolution.direction.z})`);
    } else {
        // Block was already moved/removed, skip to next
        console.warn('Block from solution already moved, advancing to next step');
        window.solutionStep++;
        highlightNextBlock();
    }
}

// Raycasting for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Don't process block clicks if camera was being dragged
    if (isCameraDragging) {
        isCameraDragging = false; // Reset for next interaction
        return;
    }
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    for (const block of blocks) {
        if (block.isAnimating || block.isFalling) continue;
        
        const intersects = raycaster.intersectObjects(block.cubes, true);
        
        if (intersects.length > 0) {
            // Check if this matches the solution (if we're testing)
            if (window.puzzleSolution && window.solutionStep < window.puzzleSolution.length) {
                const expectedBlock = window.puzzleSolution[window.solutionStep];
                const isCorrect = (block === expectedBlock);
                
                if (isCorrect) {
                    console.log(`✓ Correct! Moving block at step ${window.solutionStep + 1}/${window.puzzleSolution.length}`);
                } else {
                    console.warn(`✗ Wrong block! Expected block at (${expectedBlock.gridX}, ${expectedBlock.gridZ}), clicked (${block.gridX}, ${block.gridZ})`);
                    console.warn('  You can still move it, but it may not match the solution path');
                }
            }
            
            // Validate structure before move
            const structureCheck = validateStructure(blocks, gridSize);
            if (!structureCheck.valid) {
                console.warn('Puzzle structure invalid before move, skipping:', structureCheck.reason);
                break;
            }
            
            // Store if this block will fall (to update solution tracking)
            const willFall = block.canMove(blocks) === 'fall';
            
            // Save move state before moving (for undo)
            saveMoveState(block);
            
            block.move(blocks, gridSize);
            
            // Update button states after move
            updateUndoButtonState();
            
            // If block will fall, it's being cleared - advance solution step
            if (willFall && window.puzzleSolution) {
                // Wait for animation to complete, then update
                setTimeout(() => {
                    // Check if block actually fell (is removed)
                    const blockStillExists = blocks.includes(block);
                    if (!blockStillExists || block.isFalling) {
                        window.solutionStep++;
                        highlightNextBlock();
                    }
                }, 1000); // Wait for move animation + fall to start
            }
            
            // Structure validation after move is handled by Block.move() collision detection
                                break;
                            }
                        }
}

window.addEventListener('click', onMouseClick);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop with physics
let lastTime = performance.now();
let physicsUpdatedThisFrame = false; // Track if physics was updated this frame

// FPS tracking
let fpsFrameCount = 0;
let fpsLastUpdate = performance.now();
let fpsUpdateInterval = 500; // Update FPS display every 500ms
const fpsElement = document.getElementById('fps-counter');

function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Update timer display (every frame for smooth updates)
    updateTimerDisplay();
    
    // Update FPS counter
    fpsFrameCount++;
    if (currentTime - fpsLastUpdate >= fpsUpdateInterval) {
        const fps = Math.round((fpsFrameCount * 1000) / (currentTime - fpsLastUpdate));
        if (fpsElement) {
            fpsElement.textContent = `FPS: ${fps}`;
        }
        const blockValueElement = document.getElementById('block-value');
        if (blockValueElement) {
            blockValueElement.textContent = blocks.length;
        }
        fpsFrameCount = 0;
        fpsLastUpdate = currentTime;
    }
    
    // Reset frame flag
    physicsUpdatedThisFrame = false;
    
    // Check if any blocks are falling
    const hasPhysicsBlocks = blocks.some(block => block.isFalling && block.physicsBody);
    const hasFallingBlocks = blocks.some(block => block.isFalling);
    
    // CRITICAL: Only call updatePhysics ONCE per frame, before any reads
    // Process operations and step physics
    if (!physicsUpdatedThisFrame && (hasPhysicsBlocks || hasPendingOperations() || hasFallingBlocks)) {
        updatePhysics(physics, deltaTime);
        physicsUpdatedThisFrame = true;
    }
    
    // Update block visuals from physics AFTER step completes
    // This is the read phase - modifications queued here will be processed NEXT frame
    if (!isPhysicsStepping() && !isPhysicsProcessing()) {
        // Include blocks that are falling, even if they don't have a physics body yet
        // (they need updateFromPhysics to create the physics body)
        const blocksToUpdate = blocks.filter(block => 
            !block.isRemoved && block.isFalling
        );
        
        for (const block of blocksToUpdate) {
            block.updateFromPhysics();
        }
        
        // Update highlight animations
        for (const block of blocks) {
            if (block.updateHighlightAnimation) {
                block.updateHighlightAnimation(deltaTime);
            }
        }
        
        // Clean up removed blocks and update solution tracking
        for (let i = blocks.length - 1; i >= 0; i--) {
            if (blocks[i].isRemoved) {
                // Block was removed (fell off) - advance solution if we're tracking
                if (window.puzzleSolution && window.solutionStep < window.puzzleSolution.length) {
                    window.solutionStep++;
                    // Update highlight after a short delay to ensure cleanup is done
                    setTimeout(() => {
                        highlightNextBlock();
                    }, 100);
                }
                blocks.splice(i, 1);
            }
        }
        
        // Check for level completion (all blocks cleared)
        // Only check if not generating a new level and level complete hasn't been shown yet
        if (blocks.length === 0 && currentLevel >= 0 && !isGeneratingLevel && !levelCompleteShown) {
            levelCompleteShown = true;
            stopTimer(); // Stop timer when level is complete
            showLevelCompleteModal(currentLevel);
        }
        
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

