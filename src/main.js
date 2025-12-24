import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initPhysics, createPhysicsBlock, updatePhysics, isPhysicsStepping, hasPendingOperations, isPhysicsProcessing } from './physics.js';
import { Block } from './Block.js';
import { createLights, createGrid } from './scene.js';
import { validateStructure, validateSolvability, calculateDifficulty, getBlockCells } from './puzzle_validation.js';
import { createDebugPanel } from './debug-panel.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Global arrow style
let currentArrowStyle = 2;

// Level system: blocks per level
// This was originally set to 35, but can be adjusted based on grid size and difficulty
// For a 7x7 grid (49 cells), 35 blocks allows for ~71% fill, leaving room for movement
const BLOCKS_PER_LEVEL = 35;
let currentLevel = 1; // Start at level 1
let isGeneratingLevel = false; // Prevent multiple simultaneous level generations
let startWithEmptyBoard = true; // Start with empty board - disable auto-generation on initial load

// Constants - declare early so functions can use them
const gridSize = 7;
const cubeSize = 1;

// Calculate tower center (center of the grid)
const towerCenterX = gridSize / 2;
const towerCenterZ = gridSize / 2;
const towerCenterY = 0; // Ground level

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// Function to calculate tower top height (maximum y position of any block)
function getTowerTopHeight() {
    if (typeof blocks === 'undefined' || !blocks || blocks.length === 0) {
        return cubeSize; // Default to ground level + one cube height
    }
    
    let maxHeight = 0;
    for (const block of blocks) {
        if (block.isRemoved || block.isFalling) continue;
        const blockHeight = block.isVertical ? block.length * cubeSize : cubeSize;
        const blockTop = block.yOffset + blockHeight;
        if (blockTop > maxHeight) {
            maxHeight = blockTop;
        }
    }
    return maxHeight || cubeSize;
}

// Function to calculate camera position for default view
// Camera should be 30-45 degrees above tower top, zoomed to show 100% of top
function calculateDefaultCameraPosition() {
    const towerTopHeight = getTowerTopHeight();
    const gridDiagonal = Math.sqrt(gridSize * gridSize + gridSize * gridSize) * cubeSize;
    const cameraAngle = (28 * Math.PI) / 180; // 28 degrees
    const fov = camera.fov * (Math.PI / 180);
    const aspect = window.innerWidth / window.innerHeight;
    const verticalFov = 2 * Math.atan(Math.tan(fov / 2) * aspect);
    const baseDistanceToFit = (gridDiagonal / 2) / Math.tan(verticalFov / 2);
    const heightBasedDistance = towerTopHeight * 0.2;
    const distanceToFit = baseDistanceToFit + heightBasedDistance;
    const distance = distanceToFit * 0.85; // Maximum zoom
    
    const heightAboveTop = distance * Math.sin(cameraAngle);
    const horizontalDistance = distance * Math.cos(cameraAngle);
    const cameraX = towerCenterX + horizontalDistance * Math.cos(cameraRotationAngle);
    const cameraZ = towerCenterZ + horizontalDistance * Math.sin(cameraRotationAngle);
    const cameraY = towerTopHeight + heightAboveTop;
    
    const fovRad = fov;
    const verticalOffset = distance * Math.tan(fovRad / 2) * 0.4;
    const lookAtY = towerTopHeight - verticalOffset;
    
    return {
        x: cameraX,
        y: cameraY,
        z: cameraZ,
        lookAtX: towerCenterX,
        lookAtY: lookAtY,
        lookAtZ: towerCenterZ,
        distance: distance
    };
}

// Initial camera setup
const initialTowerHeight = cubeSize;
const gridDiagonal = Math.sqrt(gridSize * gridSize + gridSize * gridSize) * cubeSize;
const cameraAngle = (28 * Math.PI) / 180;
const fov = camera.fov * (Math.PI / 180);
const aspect = window.innerWidth / window.innerHeight;
const verticalFov = 2 * Math.atan(Math.tan(fov / 2) * aspect);
const distanceToFit = (gridDiagonal / 2) / Math.tan(verticalFov / 2);
const distance = distanceToFit * 1.1;
const heightAboveTop = distance * Math.sin(cameraAngle);
const horizontalDistance = distance * Math.cos(cameraAngle);
const initialCameraX = towerCenterX + horizontalDistance * 0.707;
const initialCameraZ = towerCenterZ + horizontalDistance * 0.707;
const initialCameraY = initialTowerHeight + heightAboveTop;

camera.position.set(initialCameraX, initialCameraY, initialCameraZ);
camera.lookAt(towerCenterX, initialTowerHeight, towerCenterZ);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(towerCenterX, towerCenterY, towerCenterZ);
controls.enableDamping = true;
controls.dampingFactor = 0.06; // Lower = more inertia (harder to start, harder to stop)
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.rotateSpeed = 0.25; // Slower rotation
controls.panSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI * 0.9;

// Camera lock/unlock system
let cameraLocked = true;
let defaultCameraState = {
    position: new THREE.Vector3(initialCameraX, initialCameraY, initialCameraZ),
    target: new THREE.Vector3(towerCenterX, towerCenterY, towerCenterZ)
};

// Camera smoothing system
let cameraTargetPosition = new THREE.Vector3(initialCameraX, initialCameraY, initialCameraZ);
let cameraTargetLookAt = new THREE.Vector3(towerCenterX, initialTowerHeight, towerCenterZ);
let smoothedLookAt = new THREE.Vector3(towerCenterX, initialTowerHeight, towerCenterZ);
let smoothedLookAtY = initialTowerHeight;
let lastTowerHeight = initialTowerHeight;
let targetCameraDistance = initialCameraY;
let smoothedCameraDistance = initialCameraY;
const CAMERA_SMOOTHING = 0.03;
const TOWER_HEIGHT_THRESHOLD = 0.15;
const CAMERA_UPDATE_INTERVAL = 4;
let cameraUpdateCounter = 0;

// Auto-rotation during spawn
const initialHorizontalOffsetX = initialCameraX - towerCenterX;
const initialHorizontalOffsetZ = initialCameraZ - towerCenterZ;
const initialHorizontalDistance = Math.sqrt(initialHorizontalOffsetX * initialHorizontalOffsetX + initialHorizontalOffsetZ * initialHorizontalOffsetZ);
const initialHorizontalAngle = Math.atan2(initialHorizontalOffsetZ, initialHorizontalOffsetX);
let cameraRotationAngle = initialHorizontalAngle;
let cameraRotationTime = 0;
const ROTATION_SPEED = 0.003;

// Unlock camera on user interaction
renderer.domElement.addEventListener('wheel', (event) => {
    if (cameraLocked) {
        cameraLocked = false;
        console.log('Camera unlocked - zoom interaction detected');
    }
}, { passive: true });

controls.addEventListener('change', () => {
    if (cameraLocked) {
        cameraLocked = false;
        console.log('Camera unlocked - OrbitControls change detected');
    }
});

renderer.domElement.addEventListener('mousedown', (event) => {
    if (cameraLocked && (event.button === 0 || event.button === 2)) {
        cameraLocked = false;
        console.log('Camera unlocked - mouse interaction detected');
    }
});

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
const lights = createLights(scene);
const { base, gridHelper } = createGrid(scene);

// Initialize Rapier physics
const physics = await initPhysics();

// Create random blocks
const blocks = [];

// Update camera position now that blocks array exists
if (cameraLocked) {
    const defaultCameraPos = calculateDefaultCameraPosition();
    cameraTargetPosition.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);
    cameraTargetLookAt.set(defaultCameraPos.lookAtX, defaultCameraPos.lookAtY, defaultCameraPos.lookAtZ);
    smoothedLookAt.set(defaultCameraPos.lookAtX, defaultCameraPos.lookAtY, defaultCameraPos.lookAtZ);
    smoothedLookAtY = defaultCameraPos.lookAtY;
    lastTowerHeight = defaultCameraPos.lookAtY;
    targetCameraDistance = defaultCameraPos.distance || defaultCameraPos.y;
    smoothedCameraDistance = targetCameraDistance;
    camera.position.copy(cameraTargetPosition);
    camera.lookAt(defaultCameraPos.lookAtX, defaultCameraPos.lookAtY, defaultCameraPos.lookAtZ);
    controls.target.set(towerCenterX, defaultCameraPos.lookAtY, towerCenterZ);
    defaultCameraState.position.copy(camera.position);
    defaultCameraState.target.set(towerCenterX, defaultCameraPos.lookAtY, towerCenterZ);
}

// Create debug panel for light controls (after blocks array is initialized)
createDebugPanel(lights, blocks);
const directions = [
    {x: 1, z: 0},   // East
    {x: -1, z: 0},  // West
    {x: 0, z: 1},   // South
    {x: 0, z: -1}   // North
];

// Validation functions are now imported from puzzle_validation.js

/**
 * Reverse Generation: Start from solved state (blocks at edges) and work backward
 * This guarantees 100% solvable puzzles
 * @param {number} yOffset - Y offset for this layer (0 for level 1, cubeSize for level 2, etc.)
 * @param {Set} lowerLayerCells - Cells occupied by blocks in lower layers (for level 2+ to prevent overlapping and floating)
 * @param {number} targetBlockCount - Target number of blocks to generate (default: BLOCKS_PER_LEVEL)
 * @param {number} level - Current level number (default: 1)
 * @returns {Array} Array of blocks to be placed (not yet added to scene)
 */
function createSolvableBlocks(yOffset = 0, lowerLayerCells = null, targetBlockCount = BLOCKS_PER_LEVEL, level = 1) {
    // Note: We don't clear blocks here - that's done in generateSolvablePuzzle
    // This allows us to add multiple layers
    
    const totalCells = gridSize * gridSize;
    const occupiedCells = new Set();
    const blocksToPlace = []; // Store blocks to be placed sequentially
    
    // For upper layers, adjust target if we have limited supported cells
    let adjustedTarget = targetBlockCount;
    if (yOffset > 0 && lowerLayerCells) {
        const supportedCellCount = lowerLayerCells.size;
        // If we have fewer supported cells than target blocks, adjust target
        // (each block needs at least 1 cell, but can be 2-3 cells)
        if (supportedCellCount < targetBlockCount) {
            adjustedTarget = Math.min(targetBlockCount, supportedCellCount);
            console.log(`  Upper layer: ${supportedCellCount} supported cells, adjusting target from ${targetBlockCount} to ${adjustedTarget} blocks`);
        }
    }
    
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
    // Blocks need at least one cell to have a block directly below them
    function hasSupport(block) {
        // Level 1 blocks don't need support (they're on the ground)
        if (yOffset === 0) {
            return true;
        }
        
        // Level 2+ blocks need at least one cell to have a block directly below them
        // This ensures blocks are stacked on top of each other, not floating
        if (block.isVertical) {
            // Vertical block: the single cell must have support
            return lowerLayerCells && lowerLayerCells.has(`${block.gridX},${block.gridZ}`);
        } else {
            // Horizontal block: at least one cell must have support
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
    
    // STEP 1: Place blocks at edges pointing outward (guaranteed solvable)
    // This creates a "solved" state where all blocks can exit immediately
    // For upper layers (yOffset > 0), we need to place blocks only where there's support
    
    const edgeBlocks = [];
    
    // For upper layers, collect all cells that have support from lower layers
    const supportedCells = new Set();
    if (lowerLayerCells && lowerLayerCells.size > 0) {
        // All cells with blocks below are supported
        for (const cell of lowerLayerCells) {
            supportedCells.add(cell);
        }
    }
    
    // Place blocks along each edge
    // Helper: Check if horizontal block extends in X or Z direction
    function getBlockExtent(block) {
        if (block.isVertical) return null; // Vertical blocks don't extend horizontally
        const isXAligned = Math.abs(block.direction.x) > 0;
        return isXAligned ? 'x' : 'z';
    }
    
    // Place blocks at edges - STRICTLY prefer longer blocks (2-3), avoid single blocks
    // For upper layers, only place at edges where there's support
    // North edge (z = 0, pointing north/up)
    for (let x = 0; x < gridSize; x++) {
        // For upper layers, skip if this cell doesn't have support
        if (yOffset > 0 && (!lowerLayerCells || !lowerLayerCells.has(`${x},0`))) {
            continue;
        }
        
        if (!isCellOccupied(x, 0)) {
            // 90% chance of length 2-3, only use 1 as last resort
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1; // 90% chance of 2-3
            const isVertical = length > 1 && Math.random() < 0.7; // Prefer vertical for multi-block
            const direction = {x: 0, z: -1}; // North
            
            // Only place vertical blocks or single blocks at edges
            if (isVertical || length === 1) {
                if (!isCellOccupied(x, 0)) {
                    if (blocksToPlace.length >= adjustedTarget) break;
                    const block = new Block(length, x, 0, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // South edge (z = gridSize-1, pointing south/down)
    for (let x = 0; x < gridSize; x++) {
        // For upper layers, skip if this cell doesn't have support
        if (yOffset > 0 && (!lowerLayerCells || !lowerLayerCells.has(`${x},${gridSize - 1}`))) {
            continue;
        }
        
        if (!isCellOccupied(x, gridSize - 1)) {
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < 0.7;
            const direction = {x: 0, z: 1}; // South
            
            if (isVertical || length === 1) {
                if (!isCellOccupied(x, gridSize - 1)) {
                    if (blocksToPlace.length >= adjustedTarget) break;
                    const block = new Block(length, x, gridSize - 1, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // West edge (x = 0, pointing west/left)
    for (let z = 0; z < gridSize; z++) {
        // For upper layers, skip if this cell doesn't have support
        if (yOffset > 0 && (!lowerLayerCells || !lowerLayerCells.has(`0,${z}`))) {
            continue;
        }
        
        if (!isCellOccupied(0, z)) {
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < 0.7;
            const direction = {x: -1, z: 0}; // West
            
            if (isVertical || length === 1) {
                if (!isCellOccupied(0, z)) {
                    if (blocksToPlace.length >= adjustedTarget) break;
                    const block = new Block(length, 0, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // East edge (x = gridSize-1, pointing east/right)
    for (let z = 0; z < gridSize; z++) {
        // For upper layers, skip if this cell doesn't have support
        if (yOffset > 0 && (!lowerLayerCells || !lowerLayerCells.has(`${gridSize - 1},${z}`))) {
            continue;
        }
        
        if (!isCellOccupied(gridSize - 1, z)) {
            const length = Math.random() < 0.9 ? (Math.floor(Math.random() * 2) + 2) : 1;
            const isVertical = length > 1 && Math.random() < 0.7;
            const direction = {x: 1, z: 0}; // East
            
            if (isVertical || length === 1) {
                if (!isCellOccupied(gridSize - 1, z)) {
                    if (blocksToPlace.length >= adjustedTarget) break;
                    const block = new Block(length, gridSize - 1, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        occupyCells(block);
                    } else {
                        scene.remove(block.group);
                    }
                }
            }
        }
    }
    
    // STEP 2: Move blocks inward aggressively to create complexity (while maintaining solvability)
    // This creates interdependencies and makes puzzles more interesting
    const maxInwardAttempts = 800; // More attempts for complexity
    let inwardAttempts = 0;
    
    while (inwardAttempts < maxInwardAttempts && occupiedCells.size < totalCells * 0.95 && blocksToPlace.length < adjustedTarget) {
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
    // For upper layers, only consider cells that have support from lower layers
    const remainingCells = [];
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            // For upper layers, skip cells without support
            if (yOffset > 0 && (!lowerLayerCells || !lowerLayerCells.has(`${x},${z}`))) {
                continue;
            }
            
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
    for (const cell of remainingCells) {
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
        
        // Try length 3, then 2, then 1
        // For upper layers, be more willing to use single blocks to reach target count
        const singleBlockChance = yOffset > 0 ? 0.3 : 0.85; // Upper layers: 70% chance, ground: 15% chance
        for (const tryLength of [3, 2, 1]) {
            if (tryLength === 1 && Math.random() < singleBlockChance) continue;
            
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
            
                    // Check if we've reached target block count
                    if (blocksToPlace.length >= adjustedTarget) break;
            
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
            break;
        }
        
        // If we couldn't add any block, skip this cell for now
    }
    
    // STEP 4: Aggressive fill pass - try to fill every remaining cell
    // Try multiple times with different strategies to maximize fill
    let fillPasses = 0;
    const maxFillPasses = 3;
    
    while (fillPasses < maxFillPasses && occupiedCells.size < totalCells) {
        fillPasses++;
        const beforeFill = occupiedCells.size;
        
        // Get remaining cells
        // For upper layers, only consider cells that have support from lower layers
        const stillEmpty = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                // For upper layers, skip cells without support
                if (yOffset > 0 && (!lowerLayerCells || !lowerLayerCells.has(`${x},${z}`))) {
                    continue;
                }
                
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
                    
                    // Check if we've reached target block count
                    if (blocksToPlace.length >= adjustedTarget) break;
                    
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
                    break;
                }
                
                if (filled) break;
            }
        }
        
        // If we didn't fill any new cells this pass, stop trying
        if (occupiedCells.size === beforeFill) break;
        
        // Stop if we've reached target block count
        if (blocksToPlace.length >= adjustedTarget) break;
    }
    
    const singleBlockCount = blocksToPlace.filter(b => b.length === 1).length;
    const totalBlockCount = blocksToPlace.length;
    const singleBlockPercent = ((singleBlockCount / totalBlockCount) * 100).toFixed(1);
    
    console.log(`Generated puzzle with ${blocksToPlace.length} blocks, ${occupiedCells.size}/${totalCells} cells filled (${((occupiedCells.size/totalCells)*100).toFixed(1)}%)`);
    console.log(`  Single blocks: ${singleBlockCount}/${totalBlockCount} (${singleBlockPercent}%)`);
    
    return blocksToPlace;
}

// Place blocks instantly - no delays or animations
function placeBlocksBatch(blocksToPlace, batchSize = 10, delayBetweenBatches = 0) {
    return new Promise((resolve) => {
        // Add all blocks to scene immediately with no animation
        for (let i = 0; i < blocksToPlace.length; i++) {
            const block = blocksToPlace[i];
            block.group.scale.set(1, 1, 1); // Set to full scale immediately
            scene.add(block.group);
            blocks.push(block);
        }
        resolve();
    });
}

// Helper function to get occupied cells for a specific layer (used for multi-layer generation)
function getOccupiedCellsForLayer(layerNumber) {
    const occupiedCells = new Set();
    const targetYOffset = layerNumber * cubeSize;
    
    for (const block of blocks) {
        if (block.yOffset === targetYOffset) {
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
    }
    
    return occupiedCells;
}

// TEST: Reverse generation with visual feedback (multi-layer support)
// This function demonstrates reverse generation: places blocks at edges, then moves them backward
async function generateReversePuzzleTest(edgeBlockPercentage = 0.4, maxBackwardMoves = 5, numLayers = 2) {
    console.log(`🧪 Starting reverse generation test (${numLayers} layer${numLayers > 1 ? 's' : ''})...`);
    
    // Clear existing blocks
    for (const block of blocks) {
        scene.remove(block.group);
    }
    blocks.length = 0;
    
    const gridSize = 7;
    const cubeSize = 1;
    const targetBlockCount = 15; // Smaller count per layer for testing
    
    // Generate layers sequentially (bottom first, then upper layers)
    let lowerLayerCells = null;
    
    for (let layer = 0; layer < numLayers; layer++) {
        const yOffset = layer * cubeSize;
        console.log(`\n📦 Generating Layer ${layer + 1}/${numLayers} at Y=${yOffset}...`);
        
        // Get blocks for this layer using reverse generation
        // This will complete ALL backward moves for this layer before returning
        const layerBlocks = await generateReverseLayer(
            yOffset, 
            lowerLayerCells, 
            targetBlockCount, 
            edgeBlockPercentage, 
            maxBackwardMoves,
            layer === 0 // Show solved state only for first layer
        );
        
        // Wait for all animations to complete before moving to next layer
        console.log(`  ⏳ Waiting for Layer ${layer + 1} animations to complete...`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Extra buffer for animations
        
        // Update lowerLayerCells for next layer (using final positions after all backward moves)
        if (layer < numLayers - 1) {
            lowerLayerCells = new Set();
            for (const block of layerBlocks) {
                if (block.isVertical) {
                    lowerLayerCells.add(`${block.gridX},${block.gridZ}`);
                } else {
                    const isXAligned = Math.abs(block.direction.x) > 0;
                    for (let i = 0; i < block.length; i++) {
                        const x = block.gridX + (isXAligned ? i : 0);
                        const z = block.gridZ + (isXAligned ? 0 : i);
                        lowerLayerCells.add(`${x},${z}`);
                    }
                }
            }
            console.log(`  ✓ Layer ${layer + 1} complete: ${lowerLayerCells.size} cells available for layer ${layer + 2}`);
            
            // Wait before starting next layer
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    console.log(`\n✓ Reverse generation complete: ${blocks.length} blocks across ${numLayers} layer${numLayers > 1 ? 's' : ''}`);
    console.log('💡 Blocks can now be moved forward (in arrow direction) to solve the puzzle!');
}

// Generate a single layer using reverse generation
async function generateReverseLayer(yOffset, lowerLayerCells, targetBlockCount, edgeBlockPercentage, maxBackwardMoves, showSolvedState = true) {
    const gridSize = 7;
    const cubeSize = 1;
    
    // Helper to check if cell has support (for upper layers)
    function hasSupport(x, z) {
        if (yOffset === 0) return true; // Ground level always has support
        return lowerLayerCells && lowerLayerCells.has(`${x},${z}`);
    }
    
    // Helper to check if cell is occupied
    const occupiedCells = new Set();
    function isCellOccupied(x, z) {
        if (occupiedCells.has(`${x},${z}`)) return true;
        if (lowerLayerCells && lowerLayerCells.has(`${x},${z}`)) return true;
        return false;
    }
    
    // STEP 1: Place one block at a time, move it backward toward center
    if (showSolvedState) {
        console.log('  Step 1: Placing blocks and moving them backward toward center...');
    }
    const placedBlocks = [];
    const centerX = Math.floor(gridSize / 2);
    const centerZ = Math.floor(gridSize / 2);
    
    // Helper to calculate distance from center
    function distanceFromCenter(x, z) {
        const dx = x - centerX;
        const dz = z - centerZ;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    // Helper to check if a position is valid for a block
    function canPlaceBlockAtPosition(length, gridX, gridZ, direction, isVertical, yOffset, occupiedCells, allBlocks) {
        const testCells = [];
        
        if (isVertical) {
            if (!hasSupport(gridX, gridZ) || isCellOccupied(gridX, gridZ)) {
                return { valid: false };
            }
            testCells.push({ x: gridX, z: gridZ });
        } else {
            const isXAligned = Math.abs(direction.x) > 0;
            for (let j = 0; j < length; j++) {
                const checkX = gridX + (isXAligned ? j : 0);
                const checkZ = gridZ + (isXAligned ? 0 : j);
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    return { valid: false };
                }
                if (!hasSupport(checkX, checkZ) || isCellOccupied(checkX, checkZ)) {
                    return { valid: false };
                }
                testCells.push({ x: checkX, z: checkZ });
            }
        }
        
        // Check for overlap with ALL existing blocks
        for (const existingBlock of allBlocks) {
            if (existingBlock.yOffset !== yOffset || existingBlock.isRemoved || existingBlock.isFalling) continue;
            
            const existingCells = [];
            if (existingBlock.isVertical) {
                existingCells.push({ x: existingBlock.gridX, z: existingBlock.gridZ });
            } else {
                const existingIsXAligned = Math.abs(existingBlock.direction.x) > 0;
                for (let i = 0; i < existingBlock.length; i++) {
                    const x = existingBlock.gridX + (existingIsXAligned ? i : 0);
                    const z = existingBlock.gridZ + (existingIsXAligned ? 0 : i);
                    existingCells.push({ x, z });
                }
            }
            
            for (const testCell of testCells) {
                for (const existingCell of existingCells) {
                    if (testCell.x === existingCell.x && testCell.z === existingCell.z) {
                        return { valid: false };
                    }
                }
            }
        }
        
        return { valid: true, cells: testCells };
    }
    
    // Helper to move a block backward toward center (one step)
    // Returns: { moved: boolean, newGridX, newGridZ } - doesn't modify block, just checks if move is valid
    function canMoveBlockBackwardOneStep(block, allBlocks, occupiedCellsSet) {
        const backwardDirection = {
            x: -block.direction.x,
            z: -block.direction.z
        };
        
        const newGridX = block.gridX + backwardDirection.x;
        const newGridZ = block.gridZ + backwardDirection.z;
        
        // Check bounds
        if (block.isVertical) {
            if (newGridX < 0 || newGridX >= gridSize || newGridZ < 0 || newGridZ >= gridSize) {
                return { moved: false };
            }
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const checkX = newGridX + (isXAligned ? i : 0);
                const checkZ = newGridZ + (isXAligned ? 0 : i);
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    return { moved: false };
                }
            }
        }
        
        // Get cells that the block would occupy at new position
        const newCells = [];
        if (block.isVertical) {
            newCells.push({ x: newGridX, z: newGridZ });
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const checkX = newGridX + (isXAligned ? i : 0);
                const checkZ = newGridZ + (isXAligned ? 0 : i);
                newCells.push({ x: checkX, z: checkZ });
            }
        }
        
        // Get cells that the block currently occupies
        const currentCells = [];
        if (block.isVertical) {
            currentCells.push({ x: block.gridX, z: block.gridZ });
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const checkX = block.gridX + (isXAligned ? i : 0);
                const checkZ = block.gridZ + (isXAligned ? 0 : i);
                currentCells.push({ x: checkX, z: checkZ });
            }
        }
        
        // Check for overlaps with other blocks at same Y level
        // Use occupiedCellsSet to check, but exclude current block's cells
        for (const newCell of newCells) {
            // Skip if this cell is part of the block's current position (it's moving from here)
            let isCurrentCell = false;
            for (const currentCell of currentCells) {
                if (currentCell.x === newCell.x && currentCell.z === newCell.z) {
                    isCurrentCell = true;
                    break;
                }
            }
            if (isCurrentCell) continue; // This cell is being vacated, so it's fine
            
            // Check if this cell is occupied by another block
            if (occupiedCellsSet.has(`${newCell.x},${newCell.z}`)) {
                return { moved: false };
            }
        }
        
        // Move is valid
        return { moved: true, newGridX, newGridZ };
    }
    
    // Generate blocks one at a time, place them, then move backward toward center
    const targetCells = gridSize * gridSize;
    let blocksPlaced = 0;
    const maxBlocks = targetBlockCount * 2; // Allow more blocks to ensure 100% fill
    
    while (occupiedCells.size < targetCells && blocksPlaced < maxBlocks) {
        blocksPlaced++;
        
        // Generate random block properties
        const length = Math.floor(Math.random() * 3) + 1; // 1-3
        const isVertical = Math.random() < 0.3; // 30% vertical
        const directions = [
            {x: 1, z: 0},   // East
            {x: -1, z: 0},  // West
            {x: 0, z: 1},   // South
            {x: 0, z: -1}   // North
        ];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        // Find an initial position for this block (try random positions, starting from edges)
        // We'll place it initially, then move it backward toward center
        let initialPosition = null;
        
        // Try random positions first (prefer positions away from center for backward movement)
        const candidatePositions = [];
        for (let z = 0; z < gridSize; z++) {
            for (let x = 0; x < gridSize; x++) {
                candidatePositions.push({ x, z, distance: distanceFromCenter(x, z) });
            }
        }
        
        // Sort by distance from center (furthest first - so we can move backward toward center)
        candidatePositions.sort((a, b) => b.distance - a.distance);
        
        // Shuffle positions with similar distances to add randomness
        for (let i = 0; i < candidatePositions.length - 1; i++) {
            const j = Math.floor(Math.random() * (candidatePositions.length - i)) + i;
            [candidatePositions[i], candidatePositions[j]] = [candidatePositions[j], candidatePositions[i]];
        }
        
        // Try each position until we find a valid one
        for (const candidate of candidatePositions) {
            const check = canPlaceBlockAtPosition(length, candidate.x, candidate.z, direction, isVertical, yOffset, occupiedCells, blocks);
            if (check.valid) {
                initialPosition = { x: candidate.x, z: candidate.z, cells: check.cells };
                break;
            }
        }
        
        // If we found a position, place the block
        if (!initialPosition) {
            // Can't place this block configuration - try next iteration
            continue;
        }
        
        // Mark cells as occupied
        for (const cell of initialPosition.cells) {
            occupiedCells.add(`${cell.x},${cell.z}`);
        }
        
        // Create block at initial position
        const block = new Block(length, initialPosition.x, initialPosition.z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, 1);
        blocks.push(block);
        placedBlocks.push(block);
        
        // Animate spawn
        block.group.scale.set(0, 0, 0);
        const startTime = performance.now();
        const duration = 150;
        
        await new Promise(resolve => {
            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                block.group.scale.set(eased, eased, eased);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    block.group.scale.set(1, 1, 1);
                    setTimeout(() => resolve(), 30);
                }
            };
            animate();
        });
        
        // Now move this block backward (opposite to arrow direction) toward center as many times as possible
        let movedBackward = true;
        let backwardMoves = 0;
        const maxBackwardMoves = gridSize * 2; // Safety limit
        
        while (movedBackward && backwardMoves < maxBackwardMoves) {
            // Store previous position before move
            const prevGridX = block.gridX;
            const prevGridZ = block.gridZ;
            const prevDistance = distanceFromCenter(prevGridX, prevGridZ);
            
            // Check if we can move backward (using occupied cells to avoid overlaps)
            const moveCheck = canMoveBlockBackwardOneStep(block, blocks, occupiedCells);
            
            if (moveCheck.moved) {
                // Update block position
                block.gridX = moveCheck.newGridX;
                block.gridZ = moveCheck.newGridZ;
                const newDistance = distanceFromCenter(block.gridX, block.gridZ);
                
                // Only continue if we're moving closer to center (or at least not further)
                if (newDistance <= prevDistance) {
                    backwardMoves++;
                    
                    // Update occupied cells BEFORE animation (so next check is accurate)
                    // Remove old cells (previous position)
                    if (block.isVertical) {
                        occupiedCells.delete(`${prevGridX},${prevGridZ}`);
                    } else {
                        const isXAligned = Math.abs(block.direction.x) > 0;
                        for (let i = 0; i < block.length; i++) {
                            const x = prevGridX + (isXAligned ? i : 0);
                            const z = prevGridZ + (isXAligned ? 0 : i);
                            occupiedCells.delete(`${x},${z}`);
                        }
                    }
                    
                    // Add new cells (current position after move)
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
                    
                    // Also update block's world position immediately (before animation)
                    block.updateWorldPosition();
                    
                    // Animate the backward move
                    await new Promise(resolve => {
                        // Calculate start position (previous position)
                        let startX, startZ;
                        if (block.isVertical) {
                            startX = prevGridX * cubeSize + cubeSize / 2;
                            startZ = prevGridZ * cubeSize + cubeSize / 2;
                        } else {
                            const isXAligned = Math.abs(block.direction.x) > 0;
                            if (isXAligned) {
                                const startGridX = prevGridX * cubeSize + cubeSize / 2;
                                const endGridX = (prevGridX + block.length - 1) * cubeSize + cubeSize / 2;
                                startX = (startGridX + endGridX) / 2;
                                startZ = prevGridZ * cubeSize + cubeSize / 2;
                            } else {
                                startX = prevGridX * cubeSize + cubeSize / 2;
                                const startGridZ = prevGridZ * cubeSize + cubeSize / 2;
                                const endGridZ = (prevGridZ + block.length - 1) * cubeSize + cubeSize / 2;
                                startZ = (startGridZ + endGridZ) / 2;
                            }
                        }
                        
                        // Calculate end position (current position after move)
                        block.updateWorldPosition();
                        const endX = block.group.position.x;
                        const endZ = block.group.position.z;
                        
                        // Reset to start position for animation
                        block.group.position.set(startX, block.yOffset, startZ);
                        
                        const startTime = performance.now();
                        const duration = 200; // 200ms per backward move
                        
                        const animate = () => {
                            const elapsed = performance.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            const currentX = startX + (endX - startX) * progress;
                            const currentZ = startZ + (endZ - startZ) * progress;
                            block.group.position.set(currentX, block.yOffset, currentZ);
                            
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                block.group.position.set(endX, block.yOffset, endZ);
                                setTimeout(() => resolve(), 30);
                            }
                        };
                        
                        animate();
                    });
                    
                    // Update occupied cells: remove old cells, add new cells for this block
                    // Remove old cells (previous position)
                    if (block.isVertical) {
                        occupiedCells.delete(`${prevGridX},${prevGridZ}`);
                    } else {
                        const isXAligned = Math.abs(block.direction.x) > 0;
                        for (let i = 0; i < block.length; i++) {
                            const x = prevGridX + (isXAligned ? i : 0);
                            const z = prevGridZ + (isXAligned ? 0 : i);
                            occupiedCells.delete(`${x},${z}`);
                        }
                    }
                    
                    // Add new cells (current position after move)
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
                } else {
                    // Moved away from center - revert and stop
                    movedBackward = false;
                    block.gridX = prevGridX;
                    block.gridZ = prevGridZ;
                    block.updateWorldPosition();
                }
            } else {
                // Can't move backward anymore (blocked or out of bounds) - stop
                movedBackward = false;
            }
        }
        
        // If we've filled all cells, stop
        if (occupiedCells.size >= targetCells) {
            break;
        }
    }
    
    if (showSolvedState) {
        console.log(`  ✓ Placed ${placedBlocks.length} blocks and moved them backward toward center`);
        // Wait a moment to show placement
        await new Promise(resolve => setTimeout(resolve, 500));
    } else {
        console.log(`  ✓ Placed ${placedBlocks.length} blocks and moved them backward toward center`);
    }
    
    // Use placedBlocks for backward moves
    const edgeBlocks = placedBlocks;
    
    // STEP 2: Move blocks backward (opposite to arrow direction) randomly
    if (showSolvedState) {
        console.log('  Step 2: Moving blocks backward to create puzzle...');
    }
    
    // Helper function to move a block backward
    function moveBlockBackward(block, allBlocks) {
        const backwardDirection = {
            x: -block.direction.x,
            z: -block.direction.z
        };
        
        const newGridX = block.gridX + backwardDirection.x;
        const newGridZ = block.gridZ + backwardDirection.z;
        
        // Check bounds
        if (block.isVertical) {
            if (newGridX < 0 || newGridX >= gridSize || newGridZ < 0 || newGridZ >= gridSize) {
                return false;
            }
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const checkX = newGridX + (isXAligned ? i : 0);
                const checkZ = newGridZ + (isXAligned ? 0 : i);
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    return false;
                }
            }
        }
        
        // Check for overlaps
        for (const other of allBlocks) {
            if (other === block || other.yOffset !== block.yOffset) continue;
            
            if (block.isVertical) {
                if (other.isVertical) {
                    if (newGridX === other.gridX && newGridZ === other.gridZ) return false;
                } else {
                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                    for (let j = 0; j < other.length; j++) {
                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                        if (newGridX === otherX && newGridZ === otherZ) return false;
                    }
                }
            } else {
                const isXAligned = Math.abs(block.direction.x) > 0;
                for (let i = 0; i < block.length; i++) {
                    const checkX = newGridX + (isXAligned ? i : 0);
                    const checkZ = newGridZ + (isXAligned ? 0 : i);
                    
                    if (other.isVertical) {
                        if (checkX === other.gridX && checkZ === other.gridZ) return false;
                    } else {
                        const otherIsXAligned = Math.abs(other.direction.x) > 0;
                        for (let j = 0; j < other.length; j++) {
                            const otherX = other.gridX + (otherIsXAligned ? j : 0);
                            const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                            if (checkX === otherX && checkZ === otherZ) return false;
                        }
                    }
                }
            }
        }
        
        // Move is valid - update position
        block.gridX = newGridX;
        block.gridZ = newGridZ;
        block.updateWorldPosition();
        return true;
    }
    
    // Move each block backward a random number of times
    // Process all blocks sequentially to ensure each completes before next starts
    let completedMoves = 0;
    const animationPromises = [];
    
    // Perform all moves sequentially and collect animation promises
    for (const block of edgeBlocks) {
        const numMoves = Math.floor(Math.random() * maxBackwardMoves) + 1;
        
        for (let move = 0; move < numMoves; move++) {
            if (moveBlockBackward(block, blocks)) {
                completedMoves++;
                
                // Create animation promise
                const animationPromise = new Promise(resolve => {
                    const startX = block.group.position.x;
                    const startZ = block.group.position.z;
                    block.updateWorldPosition();
                    const endX = block.group.position.x;
                    const endZ = block.group.position.z;
                    
                    // Reset to start position for animation
                    block.group.position.set(startX, block.yOffset, startZ);
                    
                    const startTime = performance.now();
                    const duration = 300; // 300ms per backward move
                    
                    const animate = () => {
                        const elapsed = performance.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        const currentX = startX + (endX - startX) * progress;
                        const currentZ = startZ + (endZ - startZ) * progress;
                        block.group.position.set(currentX, block.yOffset, currentZ);
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            block.group.position.set(endX, block.yOffset, endZ);
                            // Small delay to ensure position is fully set and frame is rendered
                            setTimeout(() => resolve(), 50);
                        }
                    };
                    
                    animate();
                });
                
                // Wait for this animation to complete before moving to next
                await animationPromise;
            } else {
                // Can't move backward anymore, stop for this block
                break;
            }
        }
    }
    
    // Extra wait to ensure all animations are truly complete (including any queued frame updates)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Ensure all animations are complete before returning
    console.log(`  ✓ Layer complete: ${completedMoves} backward moves finished for ${edgeBlocks.length} blocks`);
    
    // STEP 3: Fill layer to 100% (no gaps) before moving to next layer
    const totalCells = gridSize * gridSize;
    const currentFillPercentage = (occupiedCells.size / totalCells) * 100;
    const targetFillPercentage = 100;
    
    if (currentFillPercentage < targetFillPercentage) {
        // Fill to 100% for all layers
        console.log(`  → Current fill: ${currentFillPercentage.toFixed(1)}%, filling to ${targetFillPercentage}%...`);
        
        // Fill to 100% systematically - go through every empty cell
        const targetCells = totalCells; // 100% = all cells
        let passes = 0;
        const maxPasses = 5; // Maximum number of passes to try
        
        while (occupiedCells.size < targetCells && passes < maxPasses) {
            passes++;
            const beforePass = occupiedCells.size;
            
            // Collect all empty cells for this pass
            const emptyCells = [];
            for (let z = 0; z < gridSize; z++) {
                for (let x = 0; x < gridSize; x++) {
                    if (!isCellOccupied(x, z)) {
                        emptyCells.push({ x, z });
                    }
                }
            }
            
            if (emptyCells.length === 0) {
                // No empty cells - we're done!
                break;
            }
            
            console.log(`  → Pass ${passes}: ${emptyCells.length} empty cells remaining`);
            
            // Try to fill each empty cell
            for (const emptyCell of emptyCells) {
                const randomX = emptyCell.x;
                const randomZ = emptyCell.z;
                
                // Skip if already occupied (double-check)
                if (isCellOccupied(randomX, randomZ)) continue;
            
            // Try to place a block here - prefer single blocks for tight spaces
            // Try different block configurations to maximize fill
            let placed = false;
            
            // First, try single vertical block (takes only 1 cell)
            if (!isCellOccupied(randomX, randomZ)) {
                // Check for overlap with all existing blocks
                let canPlaceSingle = true;
                for (const existingBlock of blocks) {
                    if (existingBlock.yOffset !== yOffset || existingBlock.isRemoved || existingBlock.isFalling) continue;
                    
                    if (existingBlock.isVertical) {
                        if (existingBlock.gridX === randomX && existingBlock.gridZ === randomZ) {
                            canPlaceSingle = false;
                            break;
                        }
                    } else {
                        const existingIsXAligned = Math.abs(existingBlock.direction.x) > 0;
                        for (let i = 0; i < existingBlock.length; i++) {
                            const x = existingBlock.gridX + (existingIsXAligned ? i : 0);
                            const z = existingBlock.gridZ + (existingIsXAligned ? 0 : i);
                            if (x === randomX && z === randomZ) {
                                canPlaceSingle = false;
                                break;
                            }
                        }
                        if (!canPlaceSingle) break;
                    }
                }
                
                if (canPlaceSingle) {
                    // Place single vertical block
                    const block = new Block(1, randomX, randomZ, {x: 0, z: 1}, true, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, 1);
                    blocks.push(block);
                    edgeBlocks.push(block);
                    occupiedCells.add(`${randomX},${randomZ}`);
                    
                    // Animate spawn
                    block.group.scale.set(0, 0, 0);
                    const startTime = performance.now();
                    const duration = 200;
                    
                    await new Promise(resolve => {
                        const animate = () => {
                            const elapsed = performance.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            block.group.scale.set(eased, eased, eased);
                            
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                block.group.scale.set(1, 1, 1);
                                setTimeout(() => resolve(), 50);
                            }
                        };
                        animate();
                    });
                    
                    placed = true;
                }
            }
            
            // If single block couldn't be placed, try horizontal blocks
            if (!placed) {
                const directions = [
                    {x: 1, z: 0},   // East
                    {x: -1, z: 0},  // West
                    {x: 0, z: 1},   // South
                    {x: 0, z: -1}   // North
                ];
                
                // Shuffle directions to try different orientations
                for (let d = directions.length - 1; d > 0; d--) {
                    const j = Math.floor(Math.random() * (d + 1));
                    [directions[d], directions[j]] = [directions[j], directions[d]];
                }
                
                // Try different lengths (prefer shorter for tight spaces)
                for (const direction of directions) {
                    for (const length of [1, 2, 3]) {
                        const testCells = [];
                        let canPlace = true;
                        
                        if (length === 1) {
                            testCells.push({ x: randomX, z: randomZ });
                        } else {
                            const isXAligned = Math.abs(direction.x) > 0;
                            for (let j = 0; j < length; j++) {
                                const checkX = randomX + (isXAligned ? j : 0);
                                const checkZ = randomZ + (isXAligned ? 0 : j);
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
                        }
                        
                        if (!canPlace) continue;
                        
                        // Check for overlap with ALL existing blocks
                        for (const existingBlock of blocks) {
                            if (existingBlock.yOffset !== yOffset || existingBlock.isRemoved || existingBlock.isFalling) continue;
                            
                            const existingCells = [];
                            if (existingBlock.isVertical) {
                                existingCells.push({ x: existingBlock.gridX, z: existingBlock.gridZ });
                            } else {
                                const existingIsXAligned = Math.abs(existingBlock.direction.x) > 0;
                                for (let i = 0; i < existingBlock.length; i++) {
                                    const x = existingBlock.gridX + (existingIsXAligned ? i : 0);
                                    const z = existingBlock.gridZ + (existingIsXAligned ? 0 : i);
                                    existingCells.push({ x, z });
                                }
                            }
                            
                            for (const testCell of testCells) {
                                for (const existingCell of existingCells) {
                                    if (testCell.x === existingCell.x && testCell.z === existingCell.z) {
                                        canPlace = false;
                                        break;
                                    }
                                }
                                if (!canPlace) break;
                            }
                            if (!canPlace) break;
                        }
                        
                        if (!canPlace) continue;
                        
                        // Place the block
                        const block = new Block(length, randomX, randomZ, direction, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, 1);
                        blocks.push(block);
                        edgeBlocks.push(block);
                        
                        for (const cell of testCells) {
                            occupiedCells.add(`${cell.x},${cell.z}`);
                        }
                        
                        // Animate spawn
                        block.group.scale.set(0, 0, 0);
                        const startTime = performance.now();
                        const duration = 200;
                        
                        await new Promise(resolve => {
                            const animate = () => {
                                const elapsed = performance.now() - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const eased = 1 - Math.pow(1 - progress, 3);
                                block.group.scale.set(eased, eased, eased);
                                
                                if (progress < 1) {
                                    requestAnimationFrame(animate);
                                } else {
                                    block.group.scale.set(1, 1, 1);
                                    setTimeout(() => resolve(), 50);
                                }
                            };
                            animate();
                        });
                        
                        placed = true;
                        break;
                    }
                    if (placed) break;
                }
            }
            
            // Skip to next iteration if we couldn't place anything
            if (!placed) continue;
            }
            
            // Check if we made progress this pass
            if (occupiedCells.size === beforePass) {
                // No progress made this pass, break to avoid infinite loop
                console.log(`  → Pass ${passes} made no progress, stopping`);
                break;
            }
        }
        
        // Final verification: double-check all cells are filled and fill any remaining gaps
        let finalRemainingCells = [];
        for (let z = 0; z < gridSize; z++) {
            for (let x = 0; x < gridSize; x++) {
                if (!isCellOccupied(x, z)) {
                    finalRemainingCells.push({ x, z });
                }
            }
        }
        
        // Keep trying to fill remaining cells until all are filled or we can't place any more
        let finalPassAttempts = 0;
        const maxFinalPassAttempts = finalRemainingCells.length * 2; // Try each cell twice
        
        while (finalRemainingCells.length > 0 && finalPassAttempts < maxFinalPassAttempts) {
            finalPassAttempts++;
            
            // Refresh list of remaining cells
            finalRemainingCells = [];
            for (let z = 0; z < gridSize; z++) {
                for (let x = 0; x < gridSize; x++) {
                    if (!isCellOccupied(x, z)) {
                        finalRemainingCells.push({ x, z });
                    }
                }
            }
            
            if (finalRemainingCells.length === 0) break; // All filled!
            
            if (finalPassAttempts === 1) {
                console.log(`  → Final pass: ${finalRemainingCells.length} cells remaining, attempting to fill...`);
            }
            
            let filledAny = false;
            
            // Try each remaining cell
            for (const cell of finalRemainingCells) {
                // Try to place a single vertical block
                let canPlace = true;
                for (const existingBlock of blocks) {
                    if (existingBlock.yOffset !== yOffset || existingBlock.isRemoved || existingBlock.isFalling) continue;
                    
                    if (existingBlock.isVertical) {
                        if (existingBlock.gridX === cell.x && existingBlock.gridZ === cell.z) {
                            canPlace = false;
                            break;
                        }
                    } else {
                        const existingIsXAligned = Math.abs(existingBlock.direction.x) > 0;
                        for (let i = 0; i < existingBlock.length; i++) {
                            const x = existingBlock.gridX + (existingIsXAligned ? i : 0);
                            const z = existingBlock.gridZ + (existingIsXAligned ? 0 : i);
                            if (x === cell.x && z === cell.z) {
                                canPlace = false;
                                break;
                            }
                        }
                        if (!canPlace) break;
                    }
                }
                
                if (canPlace) {
                    const block = new Block(1, cell.x, cell.z, {x: 0, z: 1}, true, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, 1);
                    blocks.push(block);
                    edgeBlocks.push(block);
                    occupiedCells.add(`${cell.x},${cell.z}`);
                    filledAny = true;
                    
                    // Quick spawn animation
                    block.group.scale.set(0, 0, 0);
                    const startTime = performance.now();
                    const duration = 150;
                    
                    await new Promise(resolve => {
                        const animate = () => {
                            const elapsed = performance.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            block.group.scale.set(eased, eased, eased);
                            
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                block.group.scale.set(1, 1, 1);
                                setTimeout(() => resolve(), 30);
                            }
                        };
                        animate();
                    });
                }
            }
            
            // If we didn't fill any cells this pass, we can't fill more
            if (!filledAny) {
                break;
            }
        }
        
        const finalFillPercentage = (occupiedCells.size / totalCells) * 100;
        if (finalFillPercentage >= 99.9) {
            console.log(`  ✓ Fill complete: ${finalFillPercentage.toFixed(1)}% (${occupiedCells.size}/${totalCells} cells) - layer fully filled`);
        } else {
            console.log(`  ⚠ Fill incomplete: ${finalFillPercentage.toFixed(1)}% (${occupiedCells.size}/${totalCells} cells) - ${totalCells - occupiedCells.size} cells remaining`);
        }
    } else {
        console.log(`  ✓ Fill already complete: ${currentFillPercentage.toFixed(1)}% (${occupiedCells.size}/${totalCells} cells)`);
    }
    
        // Blocks are ready for backward moves
    
    if (showSolvedState) {
        console.log(`  ✓ Center-out generation complete: ${edgeBlocks.length} blocks placed`);
    }
    
    // Final validation: rebuild occupied cells from all blocks to ensure accuracy
    // This fixes any potential sync issues between occupiedCells and actual block positions
    occupiedCells.clear();
    for (const existingBlock of blocks) {
        if (existingBlock.yOffset === yOffset && !existingBlock.isRemoved && !existingBlock.isFalling) {
            if (existingBlock.isVertical) {
                occupiedCells.add(`${existingBlock.gridX},${existingBlock.gridZ}`);
            } else {
                const isXAligned = Math.abs(existingBlock.direction.x) > 0;
                for (let i = 0; i < existingBlock.length; i++) {
                    const x = existingBlock.gridX + (isXAligned ? i : 0);
                    const z = existingBlock.gridZ + (isXAligned ? 0 : i);
                    occupiedCells.add(`${x},${z}`);
                }
            }
        }
    }
    
    // Validate structure one final time
    const finalValidation = validateStructure(blocks.filter(b => b.yOffset === yOffset && !b.isRemoved && !b.isFalling), gridSize);
    if (!finalValidation.valid) {
        console.warn(`  ⚠ Layer validation failed: ${finalValidation.reason}`);
    }
    
    return edgeBlocks; // Return blocks for this layer
}

// Generate solvable puzzle using reverse generation (guaranteed solvable)
async function generateSolvablePuzzle() {
    // Clear existing blocks first
    for (const block of blocks) {
        scene.remove(block.group);
    }
    blocks.length = 0;
    currentLevel = 1; // Reset to level 1
    
    // Update level display
    if (levelElement) {
        levelElement.textContent = `Level: ${currentLevel}`;
    }
    
    // Generate Level 1: 105 blocks (3 layers * 35 blocks each)
    const numLayers = 3; // Start with 3 layers for Level 1
    const allBlocks = [];
    let lowerLayerCells = null;
    
    // Generate and place layers sequentially - each layer is placed before the next one is generated
    for (let layer = 0; layer < numLayers; layer++) {
        const yOffset = layer * cubeSize;
        console.log(`  Generating layer ${layer + 1}/${numLayers} at Y=${yOffset}...`);
        
        if (layer > 0) {
            console.log(`  → Placing blocks ON TOP of layer ${layer} (${lowerLayerCells ? lowerLayerCells.size : 0} supported cells)`);
        }
        
        // Generate blocks for this layer
        const layerBlocks = createSolvableBlocks(yOffset, lowerLayerCells, BLOCKS_PER_LEVEL, currentLevel);
        console.log(`  ✓ Layer ${layer + 1} generated ${layerBlocks.length} blocks at Y=${yOffset}`);
        
        // Place this layer's blocks BEFORE generating the next layer
        // This ensures layer 1 is visible before layer 2 is created
        await placeBlocksBatch(layerBlocks, 10, 10);
        console.log(`  → Layer ${layer + 1} placed in scene`);
        
        // Update lowerLayerCells for next layer - track ALL cells occupied by this layer
        // Next layer will place blocks directly on top of these cells
        if (layer < numLayers - 1) {
            lowerLayerCells = new Set();
            for (const block of layerBlocks) {
            if (block.isVertical) {
                    lowerLayerCells.add(`${block.gridX},${block.gridZ}`);
            } else {
                const isXAligned = Math.abs(block.direction.x) > 0;
                for (let i = 0; i < block.length; i++) {
                    const x = block.gridX + (isXAligned ? i : 0);
                    const z = block.gridZ + (isXAligned ? 0 : i);
                        lowerLayerCells.add(`${x},${z}`);
                    }
                }
            }
            console.log(`  → Layer ${layer + 1} provides ${lowerLayerCells.size} cells for layer ${layer + 2} to stack on top`);
        }
    }
    
    console.log(`✓ Generated Level ${currentLevel} with ${blocks.length} blocks (${numLayers} layers)`);
}

// Get DOM elements before calling generateSolvablePuzzle
const fpsElement = document.getElementById('fps-counter');
const blockCountElement = document.getElementById('block-counter');
const levelElement = document.getElementById('level-counter');

// Start with empty board - blocks can be spawned manually with SPACE key
// generateSolvablePuzzle(); // Commented out to start with empty board

// Explicitly ensure blocks array is empty
blocks.length = 0;

// Clear any blocks from scene (in case they exist)
for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];
    if (child.userData && child.userData.isBlock) {
        scene.remove(child);
    }
}

// Initialize level display for empty board
if (levelElement) {
    levelElement.textContent = `Level: ${currentLevel}`;
}

// Keep auto-generation disabled permanently when starting with empty board
// User can manually spawn blocks with SPACE key
// startWithEmptyBoard remains true - auto-generation only happens if user explicitly clears all blocks after playing
console.log('Board initialized: Starting with empty board. Use SPACE key to spawn blocks.');

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
    
    // Collect all intersections from all blocks
    const allIntersections = [];
    
    for (const block of blocks) {
        if (block.isAnimating || block.isFalling) continue;
        
        const intersects = raycaster.intersectObjects(block.cubes, true);
        
        if (intersects.length > 0) {
            // Store the closest intersection point for this block
            // Use the first intersection (closest to camera)
            const closestIntersect = intersects[0];
            allIntersections.push({
                block: block,
                distance: closestIntersect.distance,
                point: closestIntersect.point,
                yOffset: block.yOffset
            });
        }
    }
    
    // If no intersections, return
    if (allIntersections.length === 0) {
        return;
    }
    
    // Sort by Y position (highest first) to prioritize blocks on top
    // If Y positions are equal, use distance (closest first)
    allIntersections.sort((a, b) => {
        // First, prioritize by Y offset (higher Y = on top)
        if (b.yOffset !== a.yOffset) {
            return b.yOffset - a.yOffset;
        }
        // If same Y level, use distance (closer = more likely what user clicked)
        return a.distance - b.distance;
    });
    
    // Select the topmost block (first in sorted array)
    const selectedBlock = allIntersections[0].block;
    
            // Check if this matches the solution (if we're testing)
            if (window.puzzleSolution && window.solutionStep < window.puzzleSolution.length) {
                const expectedBlock = window.puzzleSolution[window.solutionStep];
        const isCorrect = (selectedBlock === expectedBlock);
                
                if (isCorrect) {
                    console.log(`✓ Correct! Moving block at step ${window.solutionStep + 1}/${window.puzzleSolution.length}`);
                } else {
            console.warn(`✗ Wrong block! Expected block at (${expectedBlock.gridX}, ${expectedBlock.gridZ}), clicked (${selectedBlock.gridX}, ${selectedBlock.gridZ})`);
                    console.warn('  You can still move it, but it may not match the solution path');
                }
            }
            
            // Validate structure before move
            const structureCheck = validateStructure(blocks, gridSize);
            if (!structureCheck.valid) {
                console.warn('Puzzle structure invalid before move, skipping:', structureCheck.reason);
        return;
            }
            
            // Store if this block will fall (to update solution tracking)
    const willFall = selectedBlock.canMove(blocks) === 'fall';
            
    selectedBlock.move(blocks, gridSize);
            
            // If block will fall, it's being cleared - advance solution step
            if (willFall && window.puzzleSolution) {
                // Wait for animation to complete, then update
                setTimeout(() => {
                    // Check if block actually fell (is removed)
            const blockStillExists = blocks.includes(selectedBlock);
            if (!blockStillExists || selectedBlock.isFalling) {
                        window.solutionStep++;
                        highlightNextBlock();
                    }
                }, 1000); // Wait for move animation + fall to start
            }
            
            // Structure validation after move is handled by Block.move() collision detection
}

window.addEventListener('click', onMouseClick);

// Check if a block has support from blocks below it
// A block only falls when ALL of its supporting cubes are removed
// (i.e., if ANY cell has support, the block stays; only falls if ALL cells have no support)
function hasSupportBelow(block) {
    // Blocks on the ground (yOffset === 0) always have support
    if (block.yOffset === 0) {
        return true;
    }
    
    // Calculate the Y level directly below this block
    const supportYOffset = block.yOffset - cubeSize;
    
    // Get all cells this block occupies
    const blockCells = getBlockCells(block);
    
    // Check each cell - if ANY cell has support, the block has support
    // Block only falls when ALL cells have no support
    for (const cell of blockCells) {
        let cellHasSupport = false;
        
        // Check all blocks at the support Y level
        for (const other of blocks) {
            if (other === block || other.isFalling || other.isRemoved || other.isAnimating) continue;
            if (other.yOffset !== supportYOffset) continue;
            
            // Check if this supporting block occupies the same X,Z position
            if (other.isVertical) {
                if (other.gridX === cell.x && other.gridZ === cell.z) {
                    cellHasSupport = true;
                    break; // This cell has support, move to next cell
                }
            } else {
                const otherIsXAligned = Math.abs(other.direction.x) > 0;
                for (let i = 0; i < other.length; i++) {
                    const otherX = other.gridX + (otherIsXAligned ? i : 0);
                    const otherZ = other.gridZ + (otherIsXAligned ? 0 : i);
                    if (otherX === cell.x && otherZ === cell.z) {
                        cellHasSupport = true;
                        break; // This cell has support, move to next cell
                    }
                }
                if (cellHasSupport) break;
            }
        }
        
        // If this cell has support, the block has support (at least one cell supported)
        if (cellHasSupport) {
            return true;
        }
    }
    
    // All cells checked - none have support, so block should fall
    return false;
}

// Check all blocks and make unsupported ones fall
function checkAndDropUnsupportedBlocks() {
    // Check all blocks that are not already falling
    for (const block of blocks) {
        if (block.isFalling || block.isRemoved || block.isAnimating) continue;
        
        // Check if block has support
        if (!hasSupportBelow(block)) {
            // Block lost support - make it fall
            console.log(`Block at (${block.gridX}, ${block.gridZ}) Y=${block.yOffset} lost support, making it fall`);
            block.fall();
        }
    }
}

// Function to get all occupied cells at a specific Y level
function getOccupiedCellsAtY(yOffset) {
    const occupied = new Set();
    for (const block of blocks) {
        if (block.yOffset === yOffset && !block.isRemoved && !block.isFalling) {
            if (block.isVertical) {
                occupied.add(`${block.gridX},${block.gridZ}`);
            } else {
                const isXAligned = Math.abs(block.direction.x) > 0;
                for (let i = 0; i < block.length; i++) {
                    const x = block.gridX + (isXAligned ? i : 0);
                    const z = block.gridZ + (isXAligned ? 0 : i);
                    occupied.add(`${x},${z}`);
                }
            }
        }
    }
    return occupied;
}

// Function to check if a block can be placed at a position (checks all layers for overlap)
function canPlaceBlockAt(length, gridX, gridZ, direction, isVertical, yOffset) {
    // Check all existing blocks at any Y level to prevent overlap
    const isXAligned = Math.abs(direction.x) > 0;
    
    // Get all cells this block would occupy
    const blockCells = [];
    for (let i = 0; i < length; i++) {
        let x, z;
        if (isVertical) {
            x = gridX;
            z = gridZ;
            // Vertical blocks only occupy one cell
            if (i === 0) {
                blockCells.push({x, z});
            }
        } else {
            x = gridX + (isXAligned ? i : 0);
            z = gridZ + (isXAligned ? 0 : i);
            blockCells.push({x, z});
        }
    }
    
    // Check bounds for all cells
    for (const cell of blockCells) {
        if (cell.x < 0 || cell.x >= gridSize || cell.z < 0 || cell.z >= gridSize) {
            return false;
        }
    }
    
    // Check for overlap with existing blocks at ANY Y level
    // Make a copy of blocks array to avoid issues during iteration
    // Include animating blocks - they still occupy space and can cause overlaps!
    const existingBlocks = [...blocks].filter(b => !b.isRemoved && !b.isFalling);
    
    for (const block of existingBlocks) {
        // Get cells occupied by this existing block
        const existingCells = [];
        if (block.isVertical) {
            existingCells.push({x: block.gridX, z: block.gridZ, y: block.yOffset || 0});
        } else {
            const existingIsXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (existingIsXAligned ? i : 0);
                const z = block.gridZ + (existingIsXAligned ? 0 : i);
                existingCells.push({x, z, y: block.yOffset || 0});
            }
        }
        
        // Check if any cell of the new block overlaps with any existing block
        // (same X,Z position, regardless of Y - we don't want any overlap)
        for (const newCell of blockCells) {
            for (const existingCell of existingCells) {
                if (newCell.x === existingCell.x && newCell.z === existingCell.z) {
                    // Same X,Z position - check if Y levels overlap
                    // Calculate block heights
                    // For horizontal blocks: height is cubeSize (1 unit)
                    // For vertical blocks: height is length * cubeSize
                    const newBlockHeight = isVertical ? length * cubeSize : cubeSize;
                    const existingBlockHeight = block.isVertical ? (block.length * cubeSize) : cubeSize;
                    
                    // Calculate Y ranges
                    // Block's Y position is at yOffset, and the mesh is positioned at blockHeight/2 within the group
                    // So the actual bottom of the block is at yOffset, top is at yOffset + blockHeight
                    const newBottom = yOffset;
                    const newTop = yOffset + newBlockHeight;
                    const existingBottom = existingCell.y; // This is block.yOffset
                    const existingTop = existingCell.y + existingBlockHeight;
                    
                    // Check if Y ranges overlap
                    // Overlap occurs when: newTop > existingBottom AND newBottom < existingTop
                    // No overlap when: newTop <= existingBottom OR newBottom >= existingTop
                    const hasOverlap = newTop > existingBottom && newBottom < existingTop;
                    
                    if (hasOverlap) {
                        // Overlap detected - no need to log (this is normal during position checking)
                        return false; // Overlap detected!
                    }
                }
            }
        }
    }
    
    return true; // No overlap found
}

// Function to spawn a block instantly (no animation)
function animateBlockSpawn(block) {
    block.group.scale.set(1, 1, 1); // Set to full scale immediately
    scene.add(block.group);
    return Promise.resolve(); // Return immediately resolved promise
}

// Function to spawn a random block at the lowest available position
function spawnRandomBlock() {
    // Try multiple block configurations before giving up
    // This increases the chance of finding a valid position
    // Increased attempts to handle dense boards better
    const maxAttempts = 50; // Try up to 50 different block configurations
    
    const directions = [
        {x: 1, z: 0},   // East
        {x: -1, z: 0},  // West
        {x: 0, z: 1},   // South
        {x: 0, z: -1}   // North
    ];
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Random block properties for this attempt
        const length = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const isVertical = Math.random() < 0.3; // 30% chance vertical
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        // Try to find a position starting from the lowest Y (ground level)
        // Try up to 100 layers high to accommodate more blocks
        const maxLayers = 100;
        
        for (let layer = 0; layer < maxLayers; layer++) {
            const yOffset = layer * cubeSize;
            
            // Get all possible positions at this Y level
            const candidatePositions = [];
            for (let z = 0; z < gridSize; z++) {
                for (let x = 0; x < gridSize; x++) {
                    candidatePositions.push({x, z});
                }
            }
            
            // Shuffle for randomness
            for (let i = candidatePositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidatePositions[i], candidatePositions[j]] = [candidatePositions[j], candidatePositions[i]];
            }
            
            // Try each candidate position
            for (const pos of candidatePositions) {
                // Use canPlaceBlockAt for accurate checking (handles all blocks including animating ones)
                if (canPlaceBlockAt(length, pos.x, pos.z, direction, isVertical, yOffset)) {
                    // Found a valid position! Create and place the block
                    const block = new Block(length, pos.x, pos.z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, currentLevel);
                    
                    // Remove from scene temporarily (Block constructor adds it)
                    scene.remove(block.group);
                    
                    // Re-check position one more time before adding (blocks array might have changed)
                    if (!canPlaceBlockAt(length, pos.x, pos.z, direction, isVertical, yOffset)) {
                        // Position became invalid - cleanup and try next
                        scene.remove(block.group);
                        continue;
                    }
                    
                    // Check if block has support (for blocks above ground level)
                    // Only place blocks that have support - prevents blocks from falling immediately
                    if (yOffset > 0 && !hasSupportBelow(block)) {
                        // Block doesn't have support - cleanup and try next position
                        scene.remove(block.group);
                        continue;
                    }
                    
                    // Add to blocks array
                    blocks.push(block);
                    
                    // Final validation check after adding to array
                    const structureCheck = validateStructure(blocks, gridSize);
                    if (!structureCheck.valid) {
                        // Overlap detected! Remove the block immediately
                        console.warn(`⚠ Overlap detected at (${pos.x}, ${pos.z}), removing block: ${structureCheck.reason}`);
                        blocks.pop(); // Remove from array
                        scene.remove(block.group); // Ensure it's removed from scene
                        continue; // Try next position
                    }
                    
                // Animate the spawn
                animateBlockSpawn(block);
                // Removed console.log to reduce spam - blocks are spawning successfully
                
                return true; // Successfully placed
                }
            }
        }
    }
    
    // Tried multiple configurations but couldn't find a valid position
    // Don't log every failure - only log occasionally to avoid spam
    // This is normal when the board is getting full
    return false; // Could not place
}

// Get blocks slider element
const blocksSlider = document.getElementById('blocks-slider');
const blocksSliderValue = document.getElementById('blocks-slider-value');

// Auto-spawn state
let isAutoSpawning = false;
let targetBlockCount = 1; // Default target
let lastSpawnTime = 0;
let consecutiveFailures = 0; // Track consecutive spawn failures
let initialSpawnComplete = false; // Track if initial spawn to target is complete
const spawnInterval = 0; // Spawn as fast as possible (no delay)
const maxConsecutiveFailures = 10; // After 10 failures, slow down spawning

// Function to update slider value and target count
function updateSliderValue(newValue) {
    if (blocksSlider && blocksSliderValue) {
        // Clamp value to slider range
        const min = parseInt(blocksSlider.min) || 1;
        const max = parseInt(blocksSlider.max) || 500;
        newValue = Math.max(min, Math.min(max, newValue));
        
        blocksSlider.value = newValue;
        blocksSliderValue.textContent = newValue;
        targetBlockCount = newValue;
        console.log(`Target block count set to: ${targetBlockCount}`);
    }
}

// Update slider value display and target count
if (blocksSlider && blocksSliderValue) {
    blocksSlider.addEventListener('input', (event) => {
        const newValue = parseInt(event.target.value) || 1;
        updateSliderValue(newValue);
        // When slider changes, reset initial spawn completion flag
        // This allows new target to be reached
        initialSpawnComplete = false;
        consecutiveFailures = 0; // Reset failure counter
    });
    
    // Initialize target from slider default value
    if (blocksSlider.value) {
        targetBlockCount = parseInt(blocksSlider.value) || 1;
    }
}

// Add + and - button handlers
const decreaseBtn = document.getElementById('blocks-slider-decrease');
const increaseBtn = document.getElementById('blocks-slider-increase');

if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
        if (blocksSlider) {
            const currentValue = parseInt(blocksSlider.value) || 1;
            updateSliderValue(currentValue - 1);
        }
    });
}

if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
        if (blocksSlider) {
            const currentValue = parseInt(blocksSlider.value) || 1;
            updateSliderValue(currentValue + 1);
        }
    });
}

// Keyboard event listener for SPACE key (manual spawn)
window.addEventListener('keydown', async (event) => {
    if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        
        // Get number of blocks to spawn from slider (default to 1)
        const spawnCount = blocksSlider ? parseInt(blocksSlider.value) || 1 : 1;
        
        // Spawn multiple blocks sequentially
        for (let i = 0; i < spawnCount; i++) {
            const success = spawnRandomBlock();
            if (!success) {
                // If we can't place a block, stop trying
                console.log(`Stopped spawning: Could not place block ${i + 1}/${spawnCount}`);
                break;
            }
            // No delay - spawn as fast as possible
        }
    }
});
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Recalculate camera position on resize
    if (cameraLocked) {
        const defaultCameraPos = calculateDefaultCameraPosition();
        cameraTargetPosition.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);
        cameraTargetLookAt.set(defaultCameraPos.lookAtX, defaultCameraPos.lookAtY, defaultCameraPos.lookAtZ);
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop with physics
let lastTime = performance.now();
let physicsUpdatedThisFrame = false; // Track if physics was updated this frame

// FPS tracking
let fpsFrameCount = 0;
let fpsLastUpdate = performance.now();
let fpsUpdateInterval = 500; // Update FPS display every 500ms
// Note: fpsElement, blockCountElement, and levelElement are declared before generateSolvablePuzzle() call

function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Update FPS counter
    fpsFrameCount++;
    if (currentTime - fpsLastUpdate >= fpsUpdateInterval) {
        const fps = Math.round((fpsFrameCount * 1000) / (currentTime - fpsLastUpdate));
        if (fpsElement) {
            fpsElement.textContent = `FPS: ${fps}`;
        }
        if (blockCountElement) {
            blockCountElement.textContent = `Blocks: ${blocks.length}`;
        }
        if (levelElement) {
            levelElement.textContent = `Level: ${currentLevel}`;
        }
        fpsFrameCount = 0;
        fpsLastUpdate = currentTime;
    }
    
    // Auto-spawn blocks to reach target count from slider
    // Only spawn until initial target is reached, then stop (user plays to clear blocks)
    if (!initialSpawnComplete && !isAutoSpawning && blocks.length < targetBlockCount) {
        // Adjust spawn interval based on consecutive failures
        // Even with performance issues, we should still try to spawn (just slower)
        const adjustedInterval = consecutiveFailures > maxConsecutiveFailures 
            ? spawnInterval * 3  // Slow down to 150ms if many failures
            : spawnInterval;
        
        // Check if enough time has passed since last spawn
        // With spawnInterval = 0, spawn immediately
        const timeSinceLastSpawn = currentTime - lastSpawnTime;
        if (spawnInterval === 0 || timeSinceLastSpawn >= adjustedInterval * 0.8) { // Allow 80% of interval to account for frame drops
            isAutoSpawning = true;
            lastSpawnTime = currentTime; // Update time immediately to prevent rapid-fire attempts
            
            (async () => {
                const blocksBeforeSpawn = blocks.length; // Track count before spawn
                const success = spawnRandomBlock();
                
                if (success) {
                    consecutiveFailures = 0; // Reset on success
                    
                    // Check if we've reached the target
                    // Block is added synchronously in spawnRandomBlock, so check immediately
                    if (blocks.length >= targetBlockCount) {
                        initialSpawnComplete = true;
                        console.log(`✓ Initial spawn complete: ${blocks.length} blocks (target: ${targetBlockCount})`);
                    }
                    isAutoSpawning = false;
                } else {
                    consecutiveFailures++; // Increment on failure
                    
                    // Log progress every 10 failures to help debug
                    if (consecutiveFailures % 10 === 0) {
                        const progress = ((blocks.length / targetBlockCount) * 100).toFixed(1);
                        console.log(`Spawn progress: ${blocks.length}/${targetBlockCount} (${progress}%), ${consecutiveFailures} consecutive failures`);
                    }
                    
                    // Check if board might be full by trying a quick scan
                    // If we've failed many times, do a quick check to see if there are any valid positions left
                    if (consecutiveFailures > maxConsecutiveFailures * 3 && consecutiveFailures % 20 === 0) {
                        let foundValidPosition = false;
                        // Quick scan: try a few single blocks at different positions
                        for (let testLayer = 0; testLayer < 3 && !foundValidPosition; testLayer++) {
                            const testYOffset = testLayer * cubeSize;
                            for (let testZ = 0; testZ < gridSize && !foundValidPosition; testZ += 2) {
                                for (let testX = 0; testX < gridSize && !foundValidPosition; testX += 2) {
                                    if (canPlaceBlockAt(1, testX, testZ, {x: 0, z: 1}, true, testYOffset)) {
                                        foundValidPosition = true;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (!foundValidPosition) {
                            console.log(`⚠ Board appears full - no valid positions found after ${consecutiveFailures} failures`);
                            // If board is full and we're reasonably close to target, stop
                            if (blocks.length >= targetBlockCount * 0.6) {
                                initialSpawnComplete = true;
                                console.log(`✓ Initial spawn complete: ${blocks.length} blocks (target: ${targetBlockCount}, board appears full)`);
                            }
                        }
                    }
                    
                    // If we've failed many times and are close to target, consider it complete
                    // This handles cases where we can't reach exact target due to board constraints
                    // More lenient: need more failures (5x = 50) and higher percentage (98%) before giving up
                    // This prevents stopping too early when board is getting full but still has space
                    if (consecutiveFailures > maxConsecutiveFailures * 5 && blocks.length >= targetBlockCount * 0.98) {
                        initialSpawnComplete = true;
                        console.log(`✓ Initial spawn complete: ${blocks.length} blocks (target: ${targetBlockCount}, reached ~98% after ${consecutiveFailures} failures)`);
                    }
                    isAutoSpawning = false;
                }
            })();
        }
    }
    
    // Reset frame flag
    physicsUpdatedThisFrame = false;
    
    // Check if any blocks have physics bodies (cache check to avoid repeated iteration)
    // Only check if we haven't already determined there are physics blocks
    let hasPhysicsBlocks = false;
    if (!physicsUpdatedThisFrame) {
        // Quick check: only iterate if we have blocks and haven't checked recently
        // Most of the time blocks won't have physics unless they're falling
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].physicsBody && !blocks[i].isRemoved) {
                hasPhysicsBlocks = true;
                break; // Early exit
            }
        }
    }
    
    // CRITICAL: Only call updatePhysics ONCE per frame, before any reads
    // Process operations and step physics for all blocks
    if (!physicsUpdatedThisFrame && (hasPhysicsBlocks || hasPendingOperations())) {
        updatePhysics(physics, deltaTime);
        physicsUpdatedThisFrame = true;
    }
    
    // Update block visuals from physics AFTER step completes
    // This is the read phase - modifications queued here will be processed NEXT frame
    if (!isPhysicsStepping() && !isPhysicsProcessing()) {
        // Update falling blocks (use direct loop to avoid creating new array)
        // Only update blocks that are falling and not removed
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (!block.isRemoved && block.isFalling) {
            block.updateFromPhysics();
            }
        }
        
        // Update highlight animations (throttled to every other frame to reduce work)
        // Most blocks won't have highlights, so this is usually a no-op
        if (fpsFrameCount % 2 === 0) {
        for (const block of blocks) {
            if (block.updateHighlightAnimation) {
                block.updateHighlightAnimation(deltaTime);
                }
            }
        }
        
        // Clean up removed blocks and update solution tracking
        let blocksWereRemoved = false;
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
                blocksWereRemoved = true;
            }
        }
        
        // After blocks are removed, check if any remaining blocks lost their support
        // Blocks on top should fall if the blocks below them are removed
        if (blocksWereRemoved) {
            checkAndDropUnsupportedBlocks();
        }
        
        // Periodically check for unsupported blocks (throttled to reduce performance impact)
        // This catches cases where blocks moved and left others without support
        // Only check every 15 frames to reduce performance impact further
        if (!isPhysicsStepping() && !isPhysicsProcessing() && fpsFrameCount % 15 === 0) {
            // Use early exit loop instead of filter to avoid creating new array
            const maxChecksPerFrame = 1; // Reduced to 1 check per frame for better performance
            let checksThisFrame = 0;
            for (let i = 0; i < blocks.length && checksThisFrame < maxChecksPerFrame; i++) {
                const block = blocks[i];
                if (!block.isFalling && !block.isRemoved && !block.isAnimating) {
                    if (!hasSupportBelow(block)) {
                        block.fall();
                        checksThisFrame++;
                    }
                }
            }
        }
        
        // Check if level is completed (blocks count goes to zero)
        // Don't auto-generate if we're starting with an empty board
        if (blocks.length === 0 && !isGeneratingLevel && !startWithEmptyBoard) {
            // Level completed - increase level and generate new blocks
            const previousLevel = currentLevel;
            currentLevel++;
            const targetBlocks = currentLevel * BLOCKS_PER_LEVEL;
            console.log(`🎉 Level ${previousLevel} cleared! Generating Level ${currentLevel} with ${targetBlocks} blocks...`);
            
            isGeneratingLevel = true;
            // Update level display immediately
            if (levelElement) {
                levelElement.textContent = `Level: ${currentLevel}`;
            }
            // Generate level asynchronously (non-blocking)
            // For levels with more blocks than can fit on one layer, use multiple layers
            // Each layer has up to BLOCKS_PER_LEVEL blocks
            (async () => {
                const numLayers = currentLevel; // Level 1 = 1 layer, Level 2 = 2 layers, etc.
                let lowerLayerCells = null; // Track occupied cells from previous layers
                
                // Generate and place layers sequentially - each layer is placed before the next one is generated
                for (let layer = 0; layer < numLayers; layer++) {
                    const yOffset = layer * cubeSize;
                    console.log(`  Generating layer ${layer + 1}/${numLayers} at Y=${yOffset}...`);
                    
                    if (layer > 0) {
                        console.log(`  → Placing blocks ON TOP of layer ${layer} (${lowerLayerCells ? lowerLayerCells.size : 0} supported cells)`);
                    }
                    
                    // Generate blocks for this layer
                    const layerBlocks = createSolvableBlocks(yOffset, lowerLayerCells, BLOCKS_PER_LEVEL, currentLevel);
                    console.log(`  ✓ Layer ${layer + 1} generated ${layerBlocks.length} blocks at Y=${yOffset}`);
                    
                    // Place this layer's blocks BEFORE generating the next layer
                    // This ensures layer 1 is visible before layer 2 is created
                    await placeBlocksBatch(layerBlocks, 10, 10);
                    console.log(`  → Layer ${layer + 1} placed in scene (${layerBlocks.length} blocks at Y=${yOffset})`);
                    // Debug: Check actual Y positions
                    if (layerBlocks.length > 0) {
                        const firstBlock = layerBlocks[0];
                        console.log(`    First block Y position: ${firstBlock.group.position.y}, yOffset: ${firstBlock.yOffset}`);
                    }
                    
                    // Update lowerLayerCells for next layer - track ALL cells occupied by this layer
                    // Next layer will place blocks directly on top of these cells
                    if (layer < numLayers - 1) {
                        lowerLayerCells = new Set();
                        for (const block of layerBlocks) {
                            if (block.isVertical) {
                                lowerLayerCells.add(`${block.gridX},${block.gridZ}`);
                            } else {
                                const isXAligned = Math.abs(block.direction.x) > 0;
                                for (let i = 0; i < block.length; i++) {
                                    const x = block.gridX + (isXAligned ? i : 0);
                                    const z = block.gridZ + (isXAligned ? 0 : i);
                                    lowerLayerCells.add(`${x},${z}`);
                                }
                            }
                        }
                        console.log(`  → Layer ${layer + 1} provides ${lowerLayerCells.size} cells for layer ${layer + 2} to stack on top`);
                    }
                }
                
                isGeneratingLevel = false;
                console.log(`✓ Generated Level ${currentLevel} with ${blocks.length} blocks (${numLayers} layer${numLayers > 1 ? 's' : ''})`);
            })();
        }
        
    }
    
    // Camera auto-rotation and dynamic adjustments
    if (cameraLocked) {
        // Update rotation angle every frame for smooth continuous rotation
        cameraRotationTime += 1;
        cameraRotationAngle = initialHorizontalAngle + cameraRotationTime * ROTATION_SPEED;
        
        // Recalculate camera position every N frames
        cameraUpdateCounter++;
        if (cameraUpdateCounter >= CAMERA_UPDATE_INTERVAL) {
            cameraUpdateCounter = 0;
            
            const currentTowerHeight = getTowerTopHeight();
            const heightChange = Math.abs(currentTowerHeight - lastTowerHeight);
            
            if (heightChange > TOWER_HEIGHT_THRESHOLD) {
                const newDefaultPos = calculateDefaultCameraPosition();
                cameraTargetPosition.set(newDefaultPos.x, newDefaultPos.y, newDefaultPos.z);
                cameraTargetLookAt.set(newDefaultPos.lookAtX, newDefaultPos.lookAtY, newDefaultPos.lookAtZ);
                targetCameraDistance = newDefaultPos.distance || newDefaultPos.y;
                lastTowerHeight = currentTowerHeight;
            }
        }
        
        // Smoothly interpolate camera position
        camera.position.lerp(cameraTargetPosition, CAMERA_SMOOTHING);
        smoothedLookAt.lerp(cameraTargetLookAt, CAMERA_SMOOTHING);
        smoothedLookAtY = smoothedLookAt.y;
        smoothedCameraDistance += (targetCameraDistance - smoothedCameraDistance) * CAMERA_SMOOTHING;
        
        // Manually control camera when locked
        camera.lookAt(smoothedLookAt.x, smoothedLookAt.y, smoothedLookAt.z);
        defaultCameraState.position.copy(camera.position);
        defaultCameraState.target.set(towerCenterX, smoothedLookAt.y, towerCenterZ);
    } else {
        // When unlocked: Let OrbitControls handle everything
        const currentTowerTopHeight = getTowerTopHeight();
        const heightChange = Math.abs(currentTowerTopHeight - lastTowerHeight);
        
        // Update target to tower top
        if (heightChange > TOWER_HEIGHT_THRESHOLD * 0.3) {
            lastTowerHeight = currentTowerTopHeight;
        }
        
        // Calculate offset to position tower top at top of screen
        const fovRad = camera.fov * (Math.PI / 180);
        const currentDistance = camera.position.distanceTo(new THREE.Vector3(towerCenterX, currentTowerTopHeight, towerCenterZ));
        const verticalOffset = currentDistance * Math.tan(fovRad / 2) * 0.4;
        const targetLookAtY = currentTowerTopHeight - verticalOffset;
        
        cameraTargetLookAt.set(towerCenterX, targetLookAtY, towerCenterZ);
        smoothedLookAt.lerp(cameraTargetLookAt, CAMERA_SMOOTHING);
        smoothedLookAtY = smoothedLookAt.y;
        
        // Set controls target to tower top
        controls.target.set(smoothedLookAt.x, smoothedLookAt.y, smoothedLookAt.z);
        controls.update();
    }
    
    renderer.render(scene, camera);
}

animate();

