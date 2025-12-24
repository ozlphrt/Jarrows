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

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to reduce aliasing
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(3, 0, 3);

// Configure camera controls for heavy, momentum-based feel
// Lower damping factor = longer coasting (more inertia)
controls.enableDamping = true;
controls.dampingFactor = 0.08; // Slightly higher = more responsive (was 0.06)
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;

// Slightly faster speeds for better responsiveness
controls.rotateSpeed = 0.3; // Slightly faster (was 0.25)
controls.panSpeed = 0.6; // Slightly faster (was 0.5)
controls.zoomSpeed = 0.6; // Slightly faster (was 0.5)

// Distance constraints
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI * 0.9; // Prevent camera from going below ground

controls.update();

// Track previous camera position to detect user movement
let previousCameraPosition = new THREE.Vector3();
let previousCameraTarget = new THREE.Vector3();

// Detect when user manually controls the camera via OrbitControls
// We'll check if the camera moved in a way that doesn't match auto-rotation
let lastAutoRotationTime = 0;
controls.addEventListener('change', () => {
    if (userHasControlledCamera) return; // Already detected
    
    const timeSinceAutoRotation = performance.now() - lastAutoRotationTime;
    
    // If enough time has passed since auto-rotation, or if camera position changed significantly
    // in a way that doesn't match our rotation pattern, it's user input
    if (timeSinceAutoRotation > 50) { // Reduced threshold for faster detection
        // Check if camera position changed in a way that doesn't match auto-rotation
        const currentPos = camera.position.clone();
        const currentTarget = controls.target.clone();
        
        const posChanged = !currentPos.equals(previousCameraPosition);
        const targetChanged = !currentTarget.equals(previousCameraTarget);
        
        // If position or target changed significantly and it's been a while since auto-rotation
        if ((posChanged || targetChanged) && timeSinceAutoRotation > 50) {
            userHasControlledCamera = true;
        }
        
        previousCameraPosition.copy(currentPos);
        previousCameraTarget.copy(currentTarget);
    }
});

// Also detect mouse/wheel interactions directly
renderer.domElement.addEventListener('wheel', () => {
    userHasControlledCamera = true; // User is zooming
}, { passive: true });

// Detect right-click (pan) and middle-click (rotate)
renderer.domElement.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent context menu
    userHasControlledCamera = true; // User is panning
});

// Track camera drag state to prevent block clicks during camera movement
let isCameraDragging = false;
let mouseDownPos = null;
let mouseDownTime = null;
const DRAG_THRESHOLD = 3; // pixels - minimum movement to consider it a drag

// Unified mousedown handler for both camera control and block interaction
// Use capture phase to ensure we catch the event before OrbitControls
renderer.domElement.addEventListener('mousedown', (event) => {
    // IMMEDIATELY stop auto-rotation on ANY mouse button press (including left-click)
    userHasControlledCamera = true;
    
    // Check if it's a camera control button (not left-click for blocks)
    // Right-click (button 2) or middle-click (button 1) are camera controls
    if (event.button === 1 || event.button === 2) {
        // Already set userHasControlledCamera above
    }
    
    // Track left-click (button 0) for block interaction
    if (event.button === 0) {
        mouseDownPos = { x: event.clientX, y: event.clientY };
        mouseDownTime = performance.now();
        isCameraDragging = false;
    }
}, { capture: true, passive: true }); // Use capture phase and passive for performance

// Also handle touch events for mobile/tap
renderer.domElement.addEventListener('touchstart', (event) => {
    // IMMEDIATELY stop auto-rotation on touch/tap
    userHasControlledCamera = true;
    
    // Track touch position for block interaction
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseDownPos = { x: touch.clientX, y: touch.clientY };
        mouseDownTime = performance.now();
        isCameraDragging = false;
    }
}, { capture: true, passive: true }); // Use capture phase and passive for performance

renderer.domElement.addEventListener('mousemove', (event) => {
    if (mouseDownPos) {
        const dx = event.clientX - mouseDownPos.x;
        const dy = event.clientY - mouseDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > DRAG_THRESHOLD) {
            isCameraDragging = true;
            // Only set userHasControlledCamera if it's a right-click or middle-click drag
            // Left-click drag is for camera rotation, but we still want to allow block clicks
            // So we'll detect camera control through OrbitControls change event instead
        }
    }
});

renderer.domElement.addEventListener('mouseup', (event) => {
    // Reset drag state
    const wasDragging = isCameraDragging;
    mouseDownPos = null;
    isCameraDragging = false;
    
    // If it was a left-click drag (camera rotation), mark as user controlled
    if (wasDragging && event.button === 0) {
        userHasControlledCamera = true;
    }
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

// Calculate tower center (center of the grid)
const towerCenterX = gridSize / 2;
const towerCenterZ = gridSize / 2;
const towerCenterY = 0; // Ground level

// Camera auto-rotation during spawn
let cameraRotationAngle = 0; // Current rotation angle
let cameraRotationTime = 0; // Time accumulator for rotation
const ROTATION_SPEED = 0.003; // Rotation speed (radians per frame)
let userHasControlledCamera = false; // Track if user has manually controlled the camera

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

// Remove mode state
let removeModeActive = false;

// Progress persistence using localStorage
const STORAGE_KEY = 'jarrows_progress';
const STORAGE_HIGHEST_LEVEL_KEY = 'jarrows_highest_level';

// Save current progress
function saveProgress() {
    try {
        localStorage.setItem(STORAGE_KEY, currentLevel.toString());
        // Also track highest level reached
        const highestLevel = parseInt(localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) || '0', 10);
        if (currentLevel > highestLevel) {
            localStorage.setItem(STORAGE_HIGHEST_LEVEL_KEY, currentLevel.toString());
        }
    } catch (e) {
        console.warn('Failed to save progress:', e);
    }
}

// Load saved progress
function loadProgress() {
    try {
        const savedLevel = localStorage.getItem(STORAGE_KEY);
        if (savedLevel !== null) {
            const level = parseInt(savedLevel, 10);
            // Validate level is a valid number
            if (!isNaN(level) && level >= 0) {
                return level;
            }
        }
    } catch (e) {
        console.warn('Failed to load progress:', e);
    }
    return 0; // Default to level 0 if no saved progress
}

// Clear saved progress
function clearProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        // Note: We keep highest level for tracking, but user can start fresh
    } catch (e) {
        console.warn('Failed to clear progress:', e);
    }
}

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
function createSolvableBlocks(yOffset = 0, lowerLayerCells = null, targetBlockCount = 10, level = 1, preferLongBlocks = false) {
    // Note: We don't clear blocks here - that's done in generateSolvablePuzzle
    // This allows us to add multiple layers
    // preferLongBlocks: If true, prefer longer blocks (2-3 cells) over single blocks
    
    const totalCells = gridSize * gridSize;
    const occupiedCells = new Set();
    const blocksToPlace = []; // Store blocks to be placed sequentially
    
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
    
    // For level 2+, check if a block has support from lower layer (prevent floating)
    function hasSupport(block) {
        // Level 1 blocks don't need support (they're on the ground)
        if (yOffset === 0) {
            return true;
        }
        
        // Get the cells Set from lowerLayerCells (it might be a Set or an object with .cells)
        const lowerCells = lowerLayerCells instanceof Set ? lowerLayerCells : (lowerLayerCells?.cells || null);
        
        // Level 2+ blocks need at least one cell to have a block below
        if (block.isVertical) {
            return lowerCells && lowerCells.has(`${block.gridX},${block.gridZ}`);
        } else {
            const isXAligned = Math.abs(block.direction.x) > 0;
            for (let i = 0; i < block.length; i++) {
                const x = block.gridX + (isXAligned ? i : 0);
                const z = block.gridZ + (isXAligned ? 0 : i);
                if (lowerCells && lowerCells.has(`${x},${z}`)) {
                    return true; // At least one cell has support
                }
            }
            return false; // No support found
        }
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
            if (lowerLayerCells && typeof lowerLayerCells === 'object' && lowerLayerCells.yRanges) {
                const existingRanges = lowerLayerCells.yRanges.get(cellKey);
                if (existingRanges) {
                    for (const range of existingRanges) {
                        // Check if Y ranges overlap: overlap if NOT (yTop <= range.yBottom || yBottom >= range.yTop)
                        if (!(yTop <= range.yBottom || yBottom >= range.yTop)) {
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
                if (lowerLayerCells && typeof lowerLayerCells === 'object' && lowerLayerCells.yRanges) {
                    const existingRanges = lowerLayerCells.yRanges.get(cellKey);
                    if (existingRanges) {
                        for (const range of existingRanges) {
                            // Check if Y ranges overlap
                            if (!(yTop <= range.yBottom || yBottom >= range.yTop)) {
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
        // Try multiple passes to ensure we reach the target count
        const maxPasses = 10;
        let pass = 0;
        
        while (blocksToPlace.length < targetBlockCount && pass < maxPasses) {
            pass++;
            
            // Get all available cells (recalculate each pass)
            const availableCells = [];
            for (let x = 0; x < gridSize; x++) {
                for (let z = 0; z < gridSize; z++) {
                    if (!isCellOccupied(x, z)) {
                        availableCells.push({x, z});
                    }
                }
            }
            
            // If no available cells, we can't place more blocks
            if (availableCells.length === 0) break;
            
            // Shuffle for randomness
            for (let i = availableCells.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
            }
            
            let placedThisPass = 0;
            
            // Try to place blocks randomly
            for (const cell of availableCells) {
                if (blocksToPlace.length >= targetBlockCount) break;
                
                // Adjust length distribution based on remaining blocks needed and preferLongBlocks flag
                // If preferLongBlocks is true (layer 1 in multi-layer), prefer longer blocks (2-3 cells)
                const remaining = targetBlockCount - blocksToPlace.length;
                const rand = Math.random();
                let length;
                
                if (preferLongBlocks) {
                    // Prefer longer blocks: 20% length 1, 50% length 2, 30% length 3
                    if (rand < 0.2) {
                        length = 1;
                    } else if (rand < 0.7) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                } else if (remaining <= 5) {
                    // Very close to target - prefer single blocks (80% chance)
                    if (rand < 0.8) {
                        length = 1;
                    } else if (rand < 0.95) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                } else {
                    // Normal distribution: 40% length 1, 40% length 2, 20% length 3
                    if (rand < 0.4) {
                        length = 1;
                    } else if (rand < 0.8) {
                        length = 2;
                    } else {
                        length = 3;
                    }
                }
                
                // Random direction (all 4 directions equally likely)
                const randomDir = directions[Math.floor(Math.random() * directions.length)];
                
                // 50% vertical, 50% horizontal
                const isVertical = Math.random() < 0.5;
                
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                // This prevents race conditions where multiple blocks compete for the same cells
                const reservation = tryReserveCells(cell.x, cell.z, length, isVertical, randomDir);
                if (!reservation) {
                    continue; // Cells not available - skip this attempt
                }
                
                // Cells are now reserved - create the block
                const block = new Block(length, cell.x, cell.z, randomDir, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                
                // Check if block has support (for level 2+)
                // Note: We check support AFTER reserving cells because support check is independent
                // and doesn't affect cell occupation. If support fails, we release the cells.
                if (!hasSupport(block)) {
                    // Release reserved cells since block can't be placed
                    for (const cellKey of reservation.cells) {
                        occupiedCells.delete(cellKey);
                    }
                    scene.remove(block.group);
                    continue;
                }
                
                // Block is valid - keep it and cells remain reserved
                scene.remove(block.group); // Remove from scene, will be added with animation
                blocksToPlace.push(block);
                placedThisPass++;
            }
            
            // If we didn't place any blocks this pass, stop trying
            if (placedThisPass === 0) break;
        }
        
        // Return blocks placed
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
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(x, 0, length, isVertical, direction);
                if (reservation) {
                    // Cells reserved - create block
                    const block = new Block(length, x, 0, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
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
                        // Mark cells as occupied BEFORE adding to blocksToPlace (prevent overlaps)
                        if (!occupyCells(block)) {
                            scene.remove(block.group);
                            continue; // Block overlaps - skip it
                        }
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
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
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(0, z, length, isVertical, direction);
                if (reservation) {
                    // Cells reserved - create block
                    const block = new Block(length, 0, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
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
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(gridSize - 1, z, length, isVertical, direction);
                if (reservation) {
                    // Cells reserved - create block
                    const block = new Block(length, gridSize - 1, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    // Check if block has support (for level 2+)
                    if (hasSupport(block)) {
                        scene.remove(block.group); // Remove from scene, will be added with animation
                        edgeBlocks.push(block);
                        blocksToPlace.push(block);
                        // Stop if we've reached the target block count
                        if (blocksToPlace.length >= targetBlockCount) break;
                    } else {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
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
                scene.remove(testBlock.group);
                continue;
            }
            
            // Block is valid - keep it and cells remain reserved
            scene.remove(testBlock.group); // Remove from scene, will be added with animation
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
                    
                    // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                    const reservation = tryReserveCells(cell.x, cell.z, tryLength, false, dir);
                    if (!reservation) {
                        continue; // Cells not available - skip this attempt
                    }
                    
                    // Cells reserved - create block
                    const testBlock = new Block(tryLength, cell.x, cell.z, dir, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                    
                    // Check if block has support (for level 2+)
                    if (!hasSupport(testBlock)) {
                        // Release reserved cells since block can't be placed
                        for (const cellKey of reservation.cells) {
                            occupiedCells.delete(cellKey);
                        }
                        scene.remove(testBlock.group);
                        continue;
                    }
                    
                    // Block is valid - keep it and cells remain reserved
                    scene.remove(testBlock.group); // Remove from scene, will be added with animation
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
    
    // Reset camera rotation for new spawn
    cameraRotationTime = 0;
    cameraRotationAngle = 0;
    
    // Clear existing blocks first
    for (const block of blocks) {
        scene.remove(block.group);
    }
    blocks.length = 0;
    
    // Get target block count for this level
    const targetBlockCount = getBlocksForLevel(level);
    
    // Determine if we need multiple layers
    // Grid has 7x7 = 49 cells, so if targetBlockCount > 49, we need multiple layers
    const gridCells = gridSize * gridSize; // 49 cells
    const needsMultipleLayers = targetBlockCount > gridCells;
    
    let allBlocks = [];
    
    if (needsMultipleLayers) {
        // Multi-layer generation: Use longer blocks in lower layers to push more blocks to upper layers
        // Strategy: Layer 1 uses longer blocks (2-3 cells), leaving fewer blocks in layer 1
        // This pushes more blocks to layer 2, creating a better tower structure
        
        let remainingBlocks = targetBlockCount;
        let currentLayer = 0;
        let lowerLayerCells = null;
        
        while (remainingBlocks > 0 && currentLayer < 10) { // Max 10 layers to prevent infinite loops
            const yOffset = currentLayer * cubeSize;
            
            // For layer 1: Use longer blocks to minimize block count (prefer 2-3 cell blocks)
            // This leaves more room for layer 2
            // For layer 2+: Fill remaining blocks
            let blocksForThisLayer;
            let preferLongBlocks = false;
            
            if (currentLayer === 0) {
                // Layer 1: Aim for ~60-70% of grid cells filled with longer blocks
                // This means fewer blocks but more cells occupied
                const targetCellsFilled = Math.floor(gridCells * 0.65); // ~32 cells
                // Estimate: if we use mostly 2-cell blocks, we need ~16 blocks
                // If we use mostly 3-cell blocks, we need ~11 blocks
                // Let's aim for ~15-20 blocks in layer 1
                blocksForThisLayer = Math.min(remainingBlocks, Math.floor(gridCells * 0.4)); // ~20 blocks max
                preferLongBlocks = true;
            } else {
                // Layer 2+: Recalculate remaining blocks based on actual blocks placed so far
                remainingBlocks = targetBlockCount - allBlocks.length;
                blocksForThisLayer = remainingBlocks;
                preferLongBlocks = false;
            }
            
            // Generate blocks for this layer with preference for longer blocks in layer 1
            const layerBlocks = createSolvableBlocks(yOffset, lowerLayerCells, blocksForThisLayer, level, preferLongBlocks);
            
            // Track cells occupied by this layer for next layer
            // We need to track both 2D cells (for support checking) and Y ranges (for overlap checking)
            const currentLayerCells = new Set();
            const currentLayerYRanges = new Map(); // key: "x,z" -> array of {yBottom, yTop}
            
            for (const block of layerBlocks) {
                const blockCubeSize = block.cubeSize || cubeSize;
                const blockHeight = block.isVertical ? block.length * blockCubeSize : blockCubeSize;
                const yBottom = block.yOffset || yOffset;
                const yTop = yBottom + blockHeight;
                
                if (block.isVertical) {
                    const cellKey = `${block.gridX},${block.gridZ}`;
                    currentLayerCells.add(cellKey);
                    
                    // Track Y range for this cell
                    if (!currentLayerYRanges.has(cellKey)) {
                        currentLayerYRanges.set(cellKey, []);
                    }
                    currentLayerYRanges.get(cellKey).push({ yBottom, yTop });
                } else {
                    const isXAligned = Math.abs(block.direction.x) > 0;
                    for (let i = 0; i < block.length; i++) {
                        const x = block.gridX + (isXAligned ? i : 0);
                        const z = block.gridZ + (isXAligned ? 0 : i);
                        const cellKey = `${x},${z}`;
                        currentLayerCells.add(cellKey);
                        
                        // Track Y range for this cell
                        if (!currentLayerYRanges.has(cellKey)) {
                            currentLayerYRanges.set(cellKey, []);
                        }
                        currentLayerYRanges.get(cellKey).push({ yBottom, yTop });
                    }
                }
            }
            
            // Merge with previous layers
            if (lowerLayerCells) {
                // Merge 2D cells (for support checking)
                if (lowerLayerCells instanceof Set) {
                    // Convert to object structure if it's still a Set
                    const cells = lowerLayerCells;
                    lowerLayerCells = { cells, yRanges: new Map() };
                }
                for (const cell of currentLayerCells) {
                    lowerLayerCells.cells.add(cell);
                }
                // Merge Y ranges (for overlap checking)
                if (!lowerLayerCells.yRanges) {
                    lowerLayerCells.yRanges = new Map();
                }
                for (const [cellKey, ranges] of currentLayerYRanges.entries()) {
                    if (!lowerLayerCells.yRanges.has(cellKey)) {
                        lowerLayerCells.yRanges.set(cellKey, []);
                    }
                    lowerLayerCells.yRanges.get(cellKey).push(...ranges);
                }
            } else {
                // First layer - create structure with both cells and Y ranges
                lowerLayerCells = { cells: currentLayerCells, yRanges: currentLayerYRanges };
            }
            
            allBlocks = allBlocks.concat(layerBlocks);
            remainingBlocks = targetBlockCount - allBlocks.length; // Recalculate remaining based on actual placed blocks
            currentLayer++;
            
            // If we've placed enough blocks, stop
            if (allBlocks.length >= targetBlockCount) break;
            
            // If we didn't place any blocks this layer and we still need more, something went wrong
            // Try to continue with next layer anyway
            if (layerBlocks.length === 0 && remainingBlocks > 0) {
                console.warn(`Layer ${currentLayer} generated 0 blocks, but ${remainingBlocks} blocks still needed`);
            }
        }
    } else {
        // Single layer generation (base layer at Y=0)
        allBlocks = createSolvableBlocks(0, null, targetBlockCount, level);
    }
    
    // Place all blocks in batches
    await placeBlocksBatch(allBlocks, 10, 10); // 10 blocks per batch, 10ms between batches
    
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

// Remove a block with melt down animation
function removeBlockWithAnimation(block) {
    if (!blocks.includes(block) || block.isRemoved || block.isFalling || block.isAnimating) {
        return;
    }
    
    block.isRemoved = true;
    block.isAnimating = true;
    
    // Melt down animation: scale down and fade out
    const startScale = 1;
    const endScale = 0;
    const startOpacity = 1;
    const endOpacity = 0;
    const duration = 400; // milliseconds
    const startTime = performance.now();
    
    // Store original materials for opacity animation
    const originalMaterials = [];
    block.cubes.forEach(cube => {
        if (cube.material) {
            originalMaterials.push(cube.material);
            if (!cube.material.transparent) {
                cube.material.transparent = true;
            }
        }
    });
    
    const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Update scale
        const currentScale = startScale + (endScale - startScale) * eased;
        block.group.scale.set(currentScale, currentScale, currentScale);
        
        // Update opacity
        const currentOpacity = startOpacity + (endOpacity - startOpacity) * eased;
        originalMaterials.forEach(material => {
            if (material) {
                material.opacity = currentOpacity;
            }
        });
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete - remove from scene and array
            scene.remove(block.group);
            const index = blocks.indexOf(block);
            if (index > -1) {
                blocks.splice(index, 1);
            }
            
            // Remove from move history if present
            moveHistory = moveHistory.filter(m => m.block !== block);
            
            // Clean up physics body if it exists
            if (block.physicsBody && block.physicsBody.body) {
                // Import and use removePhysicsBody synchronously
                import('./physics.js').then(({ removePhysicsBody }) => {
                    removePhysicsBody(physics, block.physicsBody.body);
                });
            }
            
            console.log(`Removed block at (${block.gridX}, ${block.gridZ})`);
        }
    };
    
    animate();
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
    
    // Clear saved progress
    clearProgress();
    
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
        saveProgress(); // Save progress when advancing to next level
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

// Toggle remove mode
function toggleRemoveMode() {
    removeModeActive = !removeModeActive;
    const removeButton = document.getElementById('remove-button');
    if (removeButton) {
        if (removeModeActive) {
            removeButton.classList.add('active');
            removeButton.style.background = 'rgba(255, 100, 100, 0.6)'; // Red highlight
            removeButton.style.border = '2px solid rgba(255, 150, 150, 0.8)';
        } else {
            removeButton.classList.remove('active');
            removeButton.style.background = '';
            removeButton.style.border = '';
        }
    }
}

const removeButton = document.getElementById('remove-button');
if (removeButton) {
    removeButton.addEventListener('click', () => {
        toggleRemoveMode();
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
    // Note: Remove button is now always enabled (it toggles remove mode)
}

// Initialize game - load saved progress or start at level 0
currentLevel = loadProgress();
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
    // IMMEDIATELY stop auto-rotation on any click (including left-click)
    userHasControlledCamera = true;
    
    // Only process left-clicks (button 0) for block interaction
    if (event.button !== 0) {
        return;
    }
    
    // Check if this was actually a drag by checking mouse movement
    // If mouseDownPos exists and distance is small, it's a click, not a drag
    if (mouseDownPos) {
        const dx = event.clientX - mouseDownPos.x;
        const dy = event.clientY - mouseDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If distance exceeds threshold, it was a drag, not a click
        if (distance > DRAG_THRESHOLD) {
            mouseDownPos = null; // Reset for next interaction
            return; // Don't process as block click
        }
    }
    
    // Reset drag tracking
    mouseDownPos = null;
    isCameraDragging = false;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Collect ALL intersections from ALL blocks first, then pick the closest one
    // This ensures we click on the block that's actually visible/on top, not just the first one found
    const allIntersections = [];
    
    for (const block of blocks) {
        if (block.isAnimating || block.isFalling) continue;
        
        const intersects = raycaster.intersectObjects(block.cubes, true);
        
        // Store intersections with block reference for later processing
        for (const intersection of intersects) {
            allIntersections.push({
                intersection,
                block,
                distance: intersection.distance
            });
        }
    }
    
    // If no intersections, nothing was clicked
    if (allIntersections.length === 0) {
        return;
    }
    
    // Sort by distance (closest first) - this ensures we pick the block that's actually on top
    allIntersections.sort((a, b) => a.distance - b.distance);
    
    // Get the closest intersection (the block the user actually clicked on)
    const closestHit = allIntersections[0];
    const block = closestHit.block;
    
    // If remove mode is active, remove the block instead of moving it
    if (removeModeActive) {
        removeBlockWithAnimation(block);
        toggleRemoveMode(); // Deactivate remove mode after removing
        updateUndoButtonState();
        return; // Exit early, don't process as a move
    }
    
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
        return;
    }
    
    // Store if this block will fall (to update solution tracking)
    const willFall = block.canMove(blocks) === 'fall';
    
    // Save move state before moving (for undo)
    saveMoveState(block);
    
    block.move(blocks, gridSize);
    
    // After a block moves, check if any other blocks lost support and need to fall
    // Wait for move animation to complete before checking support
    // Check multiple times to catch blocks that might need to fall after others land
    setTimeout(() => {
        checkAndTriggerFalling(blocks);
        // Check again after a longer delay to catch cascading falls
        setTimeout(() => {
            checkAndTriggerFalling(blocks);
        }, 500);
    }, 400); // Delay to let move animation complete
    
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
}

/**
 * Check if a block has support from blocks below it
 * A block has support if:
 * - It's at yOffset = 0 (on the ground), OR
 * - At least one of its cells has a block below it at a lower yOffset
 */
function blockHasSupport(block, allBlocks) {
    // Blocks on the ground always have support
    if (block.yOffset === 0) {
        return true;
    }
    
    // Get all cells this block occupies
    const blockCells = getBlockCells(block);
    
    // For a block to have support, at least one of its cells must have support
    // (This allows horizontal blocks to be supported by just one cell)
    for (const cell of blockCells) {
        let cellHasSupport = false;
        
        // Look for blocks below this cell
        for (const other of allBlocks) {
            if (other === block || other.isFalling || other.isRemoved) continue;
            
            // Block must be at a lower Y level than the current block's bottom
            if (other.yOffset >= block.yOffset) continue;
            
            // Calculate the top of the supporting block
            const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
            const otherTop = other.yOffset + otherHeight;
            
            // Support block's top must be at or above this block's bottom
            // (with a small tolerance for floating point precision)
            if (otherTop < block.yOffset - 0.01) continue;
            
            // Check if the supporting block occupies this cell
            const otherCells = getBlockCells(other);
            for (const otherCell of otherCells) {
                if (otherCell.x === cell.x && otherCell.z === cell.z) {
                    cellHasSupport = true;
                    break;
                }
            }
            
            if (cellHasSupport) break;
        }
        
        // If this cell has support, the block has support (at least one cell is enough)
        if (cellHasSupport) {
            return true;
        }
    }
    
    return false; // No support found for any cell
}

/**
 * Check all blocks and trigger falling for those that lost support
 * Blocks fall until they reach the base (yOffset = 0) or another supporting block
 */
function checkAndTriggerFalling(blocks) {
    // Check all blocks that aren't already falling or removed
    for (const block of blocks) {
        if (block.isFalling || block.isRemoved) continue;
        
        // Skip blocks that are currently animating (they might be in the middle of a move)
        // But we still want to check blocks that are animating a fall
        if (block.isAnimating && !block.isFalling) continue;
        
        // Check if block has support
        if (!blockHasSupport(block, blocks)) {
            // Block lost support - make it fall
            console.log(`Block at (${block.gridX}, ${block.gridZ}) yOffset=${block.yOffset} lost support, starting fall`);
            startBlockFalling(block);
        }
    }
}

/**
 * Start a block falling - it will fall down in discrete steps until it reaches support or the base
 * This is different from blocks falling off the edge (which use physics)
 */
function startBlockFalling(block) {
    if (block.isFalling || block.isRemoved || block.isAnimating) return;
    
    // For blocks losing support, we want them to fall down in discrete Y steps
    // until they land on the base or another block
    // This is different from blocks falling off the edge which use physics
    
    // Check if block is already on the ground
    if (block.yOffset === 0) {
        // Already on ground, shouldn't fall
        return;
    }
    
    // Find the lowest Y level where this block can land (has support or is at base)
    let targetYOffset = 0; // Start at base
    
    // Get all cells this block occupies
    const blockCells = getBlockCells(block);
    
    // For each cell, find the highest supporting block below
    for (const cell of blockCells) {
        let highestSupportY = 0; // Base level
        
        // Look for blocks below this cell
        for (const other of blocks) {
            if (other === block || other.isFalling || other.isRemoved) continue;
            
            // Block must be at a lower Y level than current block
            if (other.yOffset >= block.yOffset) continue;
            
            // Check if this block occupies the cell
            const otherCells = getBlockCells(other);
            for (const otherCell of otherCells) {
                if (otherCell.x === cell.x && otherCell.z === cell.z) {
                    // Calculate the top of the supporting block
                    const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                    const otherTop = other.yOffset + otherHeight;
                    
                    // Update highest support if this is higher
                    if (otherTop > highestSupportY) {
                        highestSupportY = otherTop;
                    }
                    break;
                }
            }
        }
        
        // Target Y offset is the highest support found across all cells
        if (highestSupportY > targetYOffset) {
            targetYOffset = highestSupportY;
        }
    }
    
    // If target is same as current, block already has support
    if (targetYOffset >= block.yOffset) {
        return; // Block already has support
    }
    
    // Animate block falling down to target Y offset
    block.isAnimating = true;
    const startY = block.yOffset;
    const startTime = performance.now();
    const fallDistance = startY - targetYOffset;
    const fallDuration = Math.max(300, fallDistance * 200); // ms to fall, proportional to distance
    
    const animateFall = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / fallDuration, 1);
        
        // Ease out for smooth landing
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate Y offset
        const currentY = startY + (targetYOffset - startY) * eased;
        block.yOffset = currentY;
        
        // Update visual position
        block.updateWorldPosition();
        
        if (progress < 1) {
            requestAnimationFrame(animateFall);
        } else {
            // Landing complete
            block.yOffset = targetYOffset;
            block.updateWorldPosition();
            block.isAnimating = false;
            
            // Check if block now has support (should always be true after landing)
            if (!blockHasSupport(block, blocks) && block.yOffset > 0) {
                // Still no support - continue falling
                setTimeout(() => {
                    startBlockFalling(block);
                }, 50);
            }
        }
    };
    
    animateFall();
}

// Add click listener to window in capture phase to catch all clicks early
window.addEventListener('click', (event) => {
    // IMMEDIATELY stop auto-rotation on any click (capture phase - happens first)
    userHasControlledCamera = true;
}, { capture: true, passive: true }); // Use capture phase and passive for performance

// Also handle touch events at window level
window.addEventListener('touchstart', (event) => {
    // IMMEDIATELY stop auto-rotation on touch/tap
    userHasControlledCamera = true;
}, { capture: true, passive: true }); // Use capture phase and passive for performance

// Original click handler for block interaction (normal phase)
window.addEventListener('click', onMouseClick);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop with physics
let lastTime = performance.now();
let physicsUpdatedThisFrame = false; // Track if physics was updated this frame
let lastSupportCheckTime = 0;
const SUPPORT_CHECK_INTERVAL = 200; // Check support every 200ms

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
    
    // Auto-rotate camera until user manually controls it
    if (!userHasControlledCamera) {
        cameraRotationTime += deltaTime;
        cameraRotationAngle = cameraRotationTime * ROTATION_SPEED * 60; // Scale by 60 for consistent speed
        
        // Calculate camera position around the tower center
        const radius = 15; // Distance from tower center
        const height = 12; // Height above tower
        const cameraX = towerCenterX + radius * Math.cos(cameraRotationAngle);
        const cameraZ = towerCenterZ + radius * Math.sin(cameraRotationAngle);
        const cameraY = height;
        
        // Update camera position
        camera.position.set(cameraX, cameraY, cameraZ);
        camera.lookAt(towerCenterX, towerCenterY + 2, towerCenterZ);
        
        // Update controls target to match
        controls.target.set(towerCenterX, towerCenterY + 2, towerCenterZ);
        
        // Track when we last updated for auto-rotation (to distinguish from user input)
        lastAutoRotationTime = currentTime;
        
        // Update previous position for change detection
        previousCameraPosition.copy(camera.position);
        previousCameraTarget.copy(controls.target);
    } else {
        // User has control - let OrbitControls handle everything
        // Don't override camera position - let OrbitControls manage it
        // Just update previous positions for tracking
        previousCameraPosition.copy(camera.position);
        previousCameraTarget.copy(controls.target);
    }
    
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
        
        // Periodically check for blocks that lost support (continuous monitoring)
        if (currentTime - lastSupportCheckTime > SUPPORT_CHECK_INTERVAL) {
            lastSupportCheckTime = currentTime;
            checkAndTriggerFalling(blocks);
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
            saveProgress(); // Save progress when level is completed
            showLevelCompleteModal(currentLevel);
        }
        
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// PWA: Service worker is automatically registered by vite-plugin-pwa
// The plugin handles offline caching and updates automatically

