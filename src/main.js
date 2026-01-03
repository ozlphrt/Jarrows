import * as THREE from 'three';
import { initPhysics, createPhysicsBlock, updatePhysics, isPhysicsStepping, hasPendingOperations, isPhysicsProcessing } from './physics.js';
import { Block } from './Block.js';
import { createLights, createGrid, setGradientBackground, setupFog } from './scene.js';
import { validateStructure, validateSolvability, calculateDifficulty, getBlockCells, fixOverlappingBlocks, checkAndFixAllOverlaps, canBlockExit } from './puzzle_validation.js';

// Scene setup
const scene = new THREE.Scene();
// Dark theme: much darker grey gradient (default)
setGradientBackground(scene, 0x0f0f0f, 0x050505);
setupFog(scene, true); // Fog enabled for dark theme

// Expose scene, blocks, THREE, and scene functions for toggle handlers
window.gameScene = scene;
window.THREE = THREE;
window.setGradientBackground = setGradientBackground;
window.setupFog = setupFog;

// Global arrow style
let currentArrowStyle = 2;


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // Limit pixel ratio for performance on mobile
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows for better quality
document.body.appendChild(renderer.domElement);

// Track camera drag state to prevent block clicks during camera movement
let isCameraDragging = false;
let wasCameraDragging = false; // Track if a drag occurred (persists until click is processed)
let mouseDownPos = null;
let mouseDownTime = null;
const DRAG_THRESHOLD = 3; // pixels - minimum movement to consider it a drag

// Camera control state
let isDraggingCamera = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Mouse controls for camera orbit
renderer.domElement.addEventListener('mousedown', (event) => {
    // Only handle left-click for camera orbit
    if (event.button === 0) {
        isDraggingCamera = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        // Track for block click detection
        mouseDownPos = { x: event.clientX, y: event.clientY };
        mouseDownTime = performance.now();
        isCameraDragging = false;
        wasCameraDragging = false; // Reset drag flag on new mouse down
    }
}, { passive: true });

renderer.domElement.addEventListener('mousemove', (event) => {
    if (isDraggingCamera) {
        const dx = event.clientX - lastMouseX;
        const dy = event.clientY - lastMouseY;
        
        // Update azimuth (horizontal rotation)
        targetAzimuth += dx * DRAG_SENSITIVITY;
        
        // Update elevation (vertical rotation)
        targetElevation -= dy * DRAG_SENSITIVITY;
        targetElevation = Math.max(MIN_ELEVATION, Math.min(MAX_ELEVATION, targetElevation));
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        // Mark as camera drag if movement exceeds threshold
        if (mouseDownPos) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > DRAG_THRESHOLD) {
                isCameraDragging = true;
                wasCameraDragging = true; // Mark that a drag occurred
            }
        }
    } else if (mouseDownPos) {
        // Track mouse movement for block click detection
        const dx = event.clientX - mouseDownPos.x;
        const dy = event.clientY - mouseDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > DRAG_THRESHOLD) {
            isCameraDragging = true;
            wasCameraDragging = true; // Mark that a drag occurred
        }
    }
});

renderer.domElement.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
        isDraggingCamera = false;
    }
    
    // Note: Don't reset wasCameraDragging here - let click handler check it first
    // Reset drag state after a short delay to allow click handler to check
    mouseDownPos = null;
    isCameraDragging = false;
});

renderer.domElement.addEventListener('mouseleave', () => {
    isDraggingCamera = false;
    mouseDownPos = null;
    isCameraDragging = false;
    wasCameraDragging = false; // Reset on mouse leave
});

// Right-click + drag for framing control (desktop)
let isFramingDrag = false;
let framingDragStartY = 0;
let framingDragLastY = 0;
const FRAMING_DRAG_SENSITIVITY = 0.02; // Same as framing slider sensitivity
let targetFramingOffset = window.framingOffsetY || 0.1;
let framingSmoothAnimationId = null;
const FRAMING_SMOOTHING = 0.2; // Smoothing factor (0-1, lower = smoother)

// Initialize targetFramingOffset when framingOffsetY is set from preferences
if (window.framingOffsetY !== undefined) {
    targetFramingOffset = window.framingOffsetY;
}

renderer.domElement.addEventListener('contextmenu', (e) => {
    // Prevent context menu when right-clicking for framing control
    e.preventDefault();
});

renderer.domElement.addEventListener('mousedown', (event) => {
    // Right-click for framing control
    if (event.button === 2) {
        isFramingDrag = true;
        framingDragStartY = event.clientY;
        framingDragLastY = event.clientY;
        event.preventDefault();
    }
}, { passive: false });

renderer.domElement.addEventListener('mousemove', (event) => {
    if (isFramingDrag) {
        const deltaY = event.clientY - framingDragLastY;
        const totalDeltaY = event.clientY - framingDragStartY;
        
        // Calculate sensitivity based on velocity (like framing slider)
        const now = performance.now();
        if (!framingDragLastTime) framingDragLastTime = now;
        const deltaTime = Math.max(1, now - framingDragLastTime);
        const velocity = Math.abs(deltaY) / deltaTime;
        
        // Dynamic sensitivity based on velocity
        const velocityMultiplier = Math.min(1 + (velocity * 0.5), 5.0);
        const dynamicSensitivity = FRAMING_DRAG_SENSITIVITY * velocityMultiplier;
        
        // Update target framing offset (negative because up should increase)
        const valueDelta = -deltaY * dynamicSensitivity;
        targetFramingOffset = Math.max(MIN_FRAMING_OFFSET, Math.min(MAX_FRAMING_OFFSET, targetFramingOffset + valueDelta));
        
        // Start smooth animation if not already running
        if (framingSmoothAnimationId === null) {
            const smoothFraming = () => {
                const currentOffset = window.framingOffsetY;
                const diff = targetFramingOffset - currentOffset;
                
                if (Math.abs(diff) > 0.001) {
                    // Smooth interpolation
                    const newOffset = currentOffset + diff * FRAMING_SMOOTHING;
                    const clampedOffset = Math.max(MIN_FRAMING_OFFSET, Math.min(MAX_FRAMING_OFFSET, newOffset));
                    
                    window.framingOffsetY = clampedOffset;
                    updateCameraPosition();
                    
                    // Update framing value display if it exists
                    const framingValueDisplay = document.getElementById('framing-value-display');
                    if (framingValueDisplay) {
                        framingValueDisplay.textContent = clampedOffset.toFixed(1);
                    }
                    
                    framingSmoothAnimationId = requestAnimationFrame(smoothFraming);
                } else {
                    // Reached target
                    window.framingOffsetY = targetFramingOffset;
                    updateCameraPosition();
                    
                    const framingValueDisplay = document.getElementById('framing-value-display');
                    if (framingValueDisplay) {
                        framingValueDisplay.textContent = targetFramingOffset.toFixed(1);
                    }
                    
                    // Save to localStorage
                    try {
                        localStorage.setItem('jarrows_framing', targetFramingOffset.toString());
                    } catch (e) {
                        console.warn('Failed to save framing preference:', e);
                    }
                    
                    framingSmoothAnimationId = null;
                }
            };
            smoothFraming();
        }
        
        framingDragLastY = event.clientY;
        framingDragLastTime = now;
        event.preventDefault();
    }
});

let framingDragLastTime = 0;

renderer.domElement.addEventListener('mouseup', (event) => {
    if (event.button === 2 && isFramingDrag) {
        isFramingDrag = false;
        framingDragLastTime = 0;
        // Let smooth animation continue until it reaches target
        event.preventDefault();
    }
});

// Mouse wheel for zoom
renderer.domElement.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    const zoomSpeed = 0.1; // 10% per scroll step
    const zoomFactor = 1 + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed);
    targetRadius *= zoomFactor;
    targetRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, targetRadius));
}, { passive: false });

// Setup scene elements
const lights = createLights(scene);
const { base, gridHelper } = createGrid(scene);
const gridSize = 7;
const cubeSize = 1;

// Calculate tower center (center of the 7x7 grid)
const towerCenter = new THREE.Vector3(3.5, 0, 3.5);

// Create tower group - contains base, grid, and all blocks
const towerGroup = new THREE.Group();
towerGroup.name = 'towerGroup';
scene.add(towerGroup);

// Move base and gridHelper into towerGroup
// Reset their positions to be relative to towerGroup origin (0,0,0)
// They were positioned at (3.5, y, 3.5) in world space, but now need to be relative to towerGroup
scene.remove(base);
scene.remove(gridHelper);

// Reset positions relative to towerGroup origin
base.position.set(0, -0.1, 0); // Base at origin, slightly below ground
gridHelper.position.set(0, 0.01, 0); // Grid at origin, slightly above base

towerGroup.add(base);
towerGroup.add(gridHelper);

// Tower position offset (for panning/reframing)
let towerPositionOffset = new THREE.Vector3(0, 0, 0);

// Function to center the tower (reset pan offset)
function centerTower() {
    towerPositionOffset.set(0, 0, 0);
}

// Function to vertically center the tower based on block positions
function centerTowerVertically() {
    if (blocks.length === 0) return;
    
    let minY = Infinity;
    let maxY = -Infinity;
    
    // Calculate min and max Y positions of all blocks
    for (const block of blocks) {
        if (block.isRemoved || block.isFalling) continue;
        
        const blockHeight = block.isVertical ? block.length * block.cubeSize : block.cubeSize;
        const blockBottom = block.yOffset;
        const blockTop = blockBottom + blockHeight;
        
        minY = Math.min(minY, blockBottom);
        maxY = Math.max(maxY, blockTop);
    }
    
    if (minY === Infinity || maxY === -Infinity) return;
    
    // Calculate center Y position
    const centerY = (minY + maxY) / 2;
    
    // Adjust tower position offset to center vertically (negative because we want to move the tower down)
    towerPositionOffset.y = -centerY;
    
    console.log(`Tower vertically centered: minY=${minY.toFixed(2)}, maxY=${maxY.toFixed(2)}, centerY=${centerY.toFixed(2)}, offsetY=${towerPositionOffset.y.toFixed(2)}`);
}

// Camera system constants
const MIN_RADIUS = 5;
const MAX_RADIUS = 50;
const MIN_ELEVATION = -Math.PI / 2 + 0.1;
const MAX_ELEVATION = Math.PI / 2 - 0.1;
const ZOOM_PADDING = 2;
const SPAWN_ZOOM_PADDING = 4; // Extra padding during spawn to show all blocks
const SPAWN_ZOOM_MULTIPLIER = 1.3; // Additional multiplier for spawn zoom
const DRAG_SENSITIVITY = 0.0025; // Slightly increased for more responsive rotation
const PAN_SENSITIVITY = 0.01;
// Mobile touch rotation sensitivity (higher for faster rotation on mobile)
const TOUCH_DRAG_SENSITIVITY = 0.004; // 60% faster than desktop for better mobile experience

// Spherical coordinates (target values - set by user input)
let cameraRadius = 10;
let cameraAzimuth = Math.PI / 4; // 45° (diagonal view)
let cameraElevation = Math.PI / 4; // 45° above horizontal

// Target values (set by user input)
let targetRadius = cameraRadius;
let targetAzimuth = cameraAzimuth;
let targetElevation = cameraElevation;

// Current values (interpolated)
let currentRadius = cameraRadius;
let currentAzimuth = cameraAzimuth;
let currentElevation = cameraElevation;

// Calculate initial camera position to show entire base plate
function calculateInitialCameraPosition() {
    // Base plate dimensions
    const basePlateSize = gridSize * cubeSize; // 7 units
    const basePlateDiagonal = Math.sqrt(basePlateSize * basePlateSize * 2);
    
    // Calculate required distance to fit base plate in view
    const fov = camera.fov * (Math.PI / 180); // Convert to radians
    const aspect = camera.aspect;
    const requiredDistance = (basePlateDiagonal + ZOOM_PADDING) / (2 * Math.tan(fov / 2) * aspect);
    
    // Set initial values
    cameraRadius = Math.max(MIN_RADIUS, requiredDistance);
    cameraElevation = Math.PI / 4; // 45°
    cameraAzimuth = Math.PI / 4; // 45° (diagonal view)
    
    // Set target and current values
    targetRadius = cameraRadius;
    targetAzimuth = cameraAzimuth;
    targetElevation = cameraElevation;
    currentRadius = cameraRadius;
    currentAzimuth = cameraAzimuth;
    currentElevation = cameraElevation;
}

// Update camera position from spherical coordinates
function updateCameraPosition() {
    // Calculate effective tower center (with offset)
    const effectiveTowerCenter = towerCenter.clone().add(towerPositionOffset);
    
    // Convert spherical to Cartesian coordinates
    const x = currentRadius * Math.sin(currentElevation) * Math.cos(currentAzimuth);
    const y = currentRadius * Math.cos(currentElevation);
    const z = currentRadius * Math.sin(currentElevation) * Math.sin(currentAzimuth);
    
    // Set camera position
    camera.position.set(
        effectiveTowerCenter.x + x,
        effectiveTowerCenter.y + y,
        effectiveTowerCenter.z + z
    );
    
    // Look at point higher above tower center to move base plate down in frame (closer to bottom)
    // Vertical framing offset - controlled by slider (default 6.5, range ~4 to ~10)
    const lookAtOffset = new THREE.Vector3(0, window.framingOffsetY || 6.5, 0);
    const lookAtTarget = effectiveTowerCenter.clone().add(lookAtOffset);
    camera.lookAt(lookAtTarget);
    
    // Update tower group position
    towerGroup.position.copy(towerCenter.clone().add(towerPositionOffset));
    towerGroup.rotation.set(0, 0, 0); // Always locked to zero
}

// Update lights to follow camera angle
function updateLightsForCamera(lights, azimuth, elevation, center) {
    if (!lights) return;
    
    // Calculate camera direction vector (normalized)
    const cameraDirX = Math.sin(elevation) * Math.cos(azimuth);
    const cameraDirY = Math.cos(elevation);
    const cameraDirZ = Math.sin(elevation) * Math.sin(azimuth);
    
    const cameraDirection = new THREE.Vector3(cameraDirX, cameraDirY, cameraDirZ).normalize();
    
    // Minimum angle above base plate: 30 degrees
    // tan(30°) ≈ 0.577, so y >= 0.577 * sqrt(x² + z²)
    const minAngleRad = Math.PI / 6; // 30 degrees
    const minTanAngle = Math.tan(minAngleRad); // ≈ 0.577
    
    // Key light: positioned more towards camera to increase shadows and reflections visible from camera
    // Position light closer to camera direction but slightly offset to create visible shadows
    const keyLightDistance = 30;
    // Offset the light slightly to the side and above camera to create dramatic shadows
    const keyLightOffset = new THREE.Vector3(
        cameraDirection.x * 0.3 + Math.sin(azimuth + Math.PI/4) * 0.2,
        cameraDirection.y * 0.5 + 0.3, // More elevation for better shadows
        cameraDirection.z * 0.3 + Math.cos(azimuth + Math.PI/4) * 0.2
    );
    let keyLightPos = cameraDirection.clone().multiplyScalar(keyLightDistance).add(keyLightOffset);
    
    // Ensure minimum 30° angle above base plate
    const keyHorizontalDist = Math.sqrt(keyLightPos.x * keyLightPos.x + keyLightPos.z * keyLightPos.z);
    const minKeyY = keyHorizontalDist * minTanAngle;
    if (keyLightPos.y < minKeyY) {
        keyLightPos.y = minKeyY;
    }
    
    lights.keyLight.position.copy(center.clone().add(keyLightPos));
    
    // Update shadow camera to ensure it covers the scene (important for directional lights)
    // The shadow camera needs to look at the scene center to cover both tower and table
    if (lights.keyLight.shadow && lights.keyLight.shadow.camera) {
        lights.keyLight.shadow.camera.position.copy(lights.keyLight.position);
        lights.keyLight.shadow.camera.lookAt(center);
        lights.keyLight.shadow.camera.updateMatrixWorld();
    }
    
    // Fill light: minimal fill light for dramatic shadows (positioned opposite to key light)
    const fillLightDistance = 25;
    let fillLightPos = cameraDirection.clone().multiplyScalar(-fillLightDistance);
    fillLightPos.y += 6; // Keep it elevated but lower for more shadow contrast
    // Reduced fill light intensity is handled in createLights for dramatic shadows
    
    // Ensure minimum 30° angle above base plate
    const fillHorizontalDist = Math.sqrt(fillLightPos.x * fillLightPos.x + fillLightPos.z * fillLightPos.z);
    const minFillY = fillHorizontalDist * minTanAngle;
    if (fillLightPos.y < minFillY) {
        fillLightPos.y = minFillY;
    }
    
    if (lights.fillLight) {
        lights.fillLight.position.copy(center.clone().add(fillLightPos));
    }
}

// Initialize Rapier physics
const physics = await initPhysics();

// Create random blocks
const blocks = [];

// Expose blocks array for toggle handlers
window.gameBlocks = blocks;

// Expose overlap fixing function for debugging
window.fixOverlaps = () => {
    const result = checkAndFixAllOverlaps(blocks, gridSize);
    console.log(result.message);
    return result;
};

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

// Random spin counter (3 spins per game)
let remainingSpins = 3;

// Progress persistence using localStorage
const STORAGE_KEY = 'jarrows_progress';
const STORAGE_HIGHEST_LEVEL_KEY = 'jarrows_highest_level';
const STORAGE_VERSION_KEY = 'jarrows_storage_version';
const RESET_FLAG_KEY = 'jarrows_reset_completed';
const CURRENT_STORAGE_VERSION = '2.0'; // Increment to reset all users

// One-time reset: Clear all existing progress for all users
// This ensures everyone starts from level 0
// Uses a flag to ensure reset only happens once per version
function resetAllProgress() {
    try {
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const resetFlag = localStorage.getItem(RESET_FLAG_KEY);
        
        // Check if we need to reset (version mismatch or reset not yet completed for this version)
        const needsReset = storedVersion !== CURRENT_STORAGE_VERSION || 
                          (storedVersion === CURRENT_STORAGE_VERSION && resetFlag !== 'true');
        
        if (needsReset) {
            console.log('Resetting all progress: storage version mismatch or first run');
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_HIGHEST_LEVEL_KEY);
            localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
            localStorage.setItem(RESET_FLAG_KEY, 'true'); // Mark reset as completed
            console.log('All users reset to level 0 (reset flag set)');
            return true; // Progress was reset
        }
    } catch (e) {
        console.warn('Failed to reset progress:', e);
    }
    return false; // No reset needed
}

// Save current progress
function saveProgress() {
    try {
        // Ensure storage version and reset flag are set
        if (localStorage.getItem(STORAGE_VERSION_KEY) !== CURRENT_STORAGE_VERSION) {
            localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
            // If version changed, reset flag should be handled by resetAllProgress()
            // But ensure it's set here as well for safety
            if (localStorage.getItem(RESET_FLAG_KEY) !== 'true') {
                localStorage.setItem(RESET_FLAG_KEY, 'true');
            }
        }
        
        // Save current level
        localStorage.setItem(STORAGE_KEY, currentLevel.toString());
        console.log(`Progress saved: Level ${currentLevel}`);
        
        // Also track highest level reached
        const highestLevel = parseInt(localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) || '0', 10);
        if (currentLevel > highestLevel) {
            localStorage.setItem(STORAGE_HIGHEST_LEVEL_KEY, currentLevel.toString());
            console.log(`New highest level reached: ${currentLevel}`);
        }
        
        // Verify save was successful
        const verify = localStorage.getItem(STORAGE_KEY);
        if (verify !== currentLevel.toString()) {
            console.error('Progress save verification failed!');
            return false;
        }
        return true;
    } catch (e) {
        console.error('Failed to save progress:', e);
        // Check if localStorage is available
        if (e.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded - cannot save progress');
        } else if (e.name === 'SecurityError') {
            console.error('localStorage access denied - cannot save progress');
        }
        return false;
    }
}

// Load saved progress
function loadProgress() {
    try {
        // First, check if we need to reset all progress
        resetAllProgress();
        
        // Now try to load saved progress
        const savedLevel = localStorage.getItem(STORAGE_KEY);
        if (savedLevel !== null && savedLevel !== '') {
            const level = parseInt(savedLevel, 10);
            // Validate level is a valid number
            if (!isNaN(level) && level >= 0) {
                console.log(`Progress loaded: Level ${level}`);
                return level;
            } else {
                console.warn('Invalid saved level, resetting to 0');
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    } catch (e) {
        console.warn('Failed to load progress:', e);
    }
    console.log('Starting from level 0 (no saved progress)');
    return 0; // Default to level 0 if no saved progress
}

// Clear saved progress
function clearProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        // Keep storage version and highest level for tracking
        console.log('Progress cleared - user will start from level 0 on next load');
        return true;
    } catch (e) {
        console.warn('Failed to clear progress:', e);
        return false;
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
    const isUpperLayer = yOffset > 0; // Declare once for use throughout function
    
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
        
        if (minDist === distToNorth) return {x: 0, z: -1};
        if (minDist === distToSouth) return {x: 0, z: 1};
        if (minDist === distToWest) return {x: -1, z: 0};
        return {x: 1, z: 0}; // East
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
        // For high block counts in multi-layer, use more passes
        // For upper layers (yOffset > 0), need even more passes due to support constraints
        const maxPasses = isUpperLayer ? (targetBlockCount > 100 ? 50 : 40) : (targetBlockCount > 100 ? 20 : 10);
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
                
                // Prioritize blocks that face outward (toward edges) for easier gameplay
                // 70% chance to prefer outward-facing directions
                let randomDir;
                const preferOutward = Math.random() < 0.7; // 70% chance to prefer outward-facing
                if (preferOutward) {
                    // Try to get a direction pointing toward the nearest edge
                    const bestDir = getBestOutwardDirection(cell.x, cell.z, gridSize);
                    // 80% chance to use best direction, 20% chance to use random
                    randomDir = Math.random() < 0.8 ? bestDir : directions[Math.floor(Math.random() * directions.length)];
                } else {
                    randomDir = directions[Math.floor(Math.random() * directions.length)];
                }
                
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
                
                // Move block from scene to towerGroup
                scene.remove(block.group);
                
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
                placedThisPass++;
            }
            
            // If we didn't place any blocks this pass, stop trying
            if (placedThisPass === 0) break;
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
                // ATOMIC OPERATION: Try to reserve cells BEFORE creating the block
                const reservation = tryReserveCells(x, gridSize - 1, length, isVertical, direction);
                if (reservation) {
                    // Cells reserved - create block
                    const block = new Block(length, x, gridSize - 1, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
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
    
    // FINAL AGGRESSIVE FILL: If we're still short of target, fill remaining cells with single blocks
    // This ensures we reach the target block count for high-level puzzles
    // IMPORTANT: Use tryReserveCells for all validation to prevent overlaps
    if (blocksToPlace.length < targetBlockCount && occupiedCells.size < totalCells) {
        const remainingNeeded = targetBlockCount - blocksToPlace.length;
        const remainingCells = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                // Don't check isCellOccupied here - let tryReserveCells handle it
                remainingCells.push({x, z});
            }
        }
        
        // Shuffle for randomness
        for (let i = remainingCells.length - 1; i > 0 && blocksToPlace.length < targetBlockCount; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingCells[i], remainingCells[j]] = [remainingCells[j], remainingCells[i]];
        }
        
        for (const cell of remainingCells) {
            if (blocksToPlace.length >= targetBlockCount) break;
            
            // Find nearest edge for direction
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
            
            const edge = nearestEdges[Math.floor(Math.random() * nearestEdges.length)];
            let direction = {x: 0, z: 0};
            if (edge === 'east') direction = {x: 1, z: 0};
            else if (edge === 'west') direction = {x: -1, z: 0};
            else if (edge === 'south') direction = {x: 0, z: 1};
            else if (edge === 'north') direction = {x: 0, z: -1};
            
            // Try to reserve cells first - this prevents overlaps
            const reservation = tryReserveCells(cell.x, cell.z, 1, false, direction);
            if (!reservation) {
                // Cell already occupied or invalid - skip
                continue;
            }
            
            // Check support for level 2+ before creating block
            // Create a temporary block just for support check
            const testBlock = new Block(1, cell.x, cell.z, direction, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
            const hasBlockSupport = yOffset === 0 || hasSupport(testBlock);
            scene.remove(testBlock.group);
            
            if (hasBlockSupport) {
                // Create the actual block - cells are already reserved
                const block = new Block(1, cell.x, cell.z, direction, false, currentArrowStyle, scene, physics, gridSize, cubeSize, yOffset, level);
                scene.remove(block.group); // Remove from scene, will be added with animation
                blocksToPlace.push(block);
            } else {
                // No support - release reserved cells
                for (const cellKey of reservation.cells) {
                    occupiedCells.delete(cellKey);
                }
            }
        }
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
            
            // Add all blocks in this batch to towerGroup immediately
            for (let i = startIdx; i < endIdx; i++) {
                const block = blocksToPlace[i];
                if (!block) {
                    console.warn(`⚠️ Null block at index ${i} in batch starting at ${startIdx}`);
                    continue;
                }
                block.group.scale.set(0, 0, 0);
                towerGroup.add(block.group);
                blocks.push(block);
            }
            
            // Animate all blocks in batch simultaneously - very fast
        const startTime = performance.now();
            const duration = 50; // Very fast animation
            let batchAnimationId = null;
        
            const animate = () => {
                // Check if level generation was cancelled
                const startIdx = batchIndex * batchSize;
                if (!isGeneratingLevel || blocksToPlace.length === 0 || startIdx >= blocksToPlace.length) {
                    if (batchAnimationId !== null) {
                        cancelAnimationFrame(batchAnimationId);
                        batchAnimationId = null;
                    }
                    return;
                }
                
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out cubic for smooth animation
                const eased = 1 - Math.pow(1 - progress, 3);
                
                // Update all blocks in batch
                for (let i = startIdx; i < endIdx && i < blocksToPlace.length; i++) {
                    if (blocksToPlace[i] && blocksToPlace[i].group) {
                    blocksToPlace[i].group.scale.set(eased, eased, eased);
                    }
                }
                            
                            if (progress < 1) {
                    batchAnimationId = requestAnimationFrame(animate);
                            } else {
                    // Finalize scale
                    for (let i = startIdx; i < endIdx && i < blocksToPlace.length; i++) {
                        if (blocksToPlace[i] && blocksToPlace[i].group) {
                        blocksToPlace[i].group.scale.set(1, 1, 1);
                        }
                    }
                    
                    if (batchAnimationId !== null) {
                        cancelAnimationFrame(batchAnimationId);
                        batchAnimationId = null;
                    }
                    
                    // Move to next batch
                    batchIndex++;
                    setTimeout(placeBatch, delayBetweenBatches);
                        }
                    };
                    
            batchAnimationId = requestAnimationFrame(animate);
        };
        
        placeBatch();
    });
}

// Create blocks with many head-on collisions for testing
function createHeadOnCollisionBlocks(targetBlockCount = 10) {
    const blocksToPlace = [];
    const occupiedCells = new Set();
    
    // Head-on collision pairs: blocks facing each other
    const headOnPairs = [
        // Mix: Start with some horizontal blocks first
        { x1: 1, z1: 1, dir1: {x: 1, z: 0}, x2: 3, z2: 1, dir2: {x: -1, z: 0}, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 1, z1: 3, dir1: {x: 1, z: 0}, x2: 4, z2: 3, dir2: {x: -1, z: 0}, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 0, z1: 5, dir1: {x: 1, z: 0}, x2: 3, z2: 5, dir2: {x: -1, z: 0}, len1: 2, len2: 2, vert1: false, vert2: false }, // Multi-cell horizontal
        { x1: 2, z1: 1, dir1: {x: 0, z: 1}, x2: 2, z2: 3, dir2: {x: 0, z: -1}, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 5, z1: 2, dir1: {x: 0, z: 1}, x2: 5, z2: 5, dir2: {x: 0, z: -1}, len1: 1, len2: 1, vert1: false, vert2: false },
        { x1: 0, z1: 2, dir1: {x: 0, z: 1}, x2: 0, z2: 4, dir2: {x: 0, z: -1}, len1: 2, len2: 2, vert1: false, vert2: false }, // Multi-cell horizontal
        
        // Vertical blocks (head-on collisions) - Use positions that don't conflict
        { x1: 3, z1: 2, dir1: {x: 1, z: 0}, x2: 5, z2: 2, dir2: {x: -1, z: 0}, len1: 2, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 1, z1: 4, dir1: {x: 0, z: 1}, x2: 1, z2: 6, dir2: {x: 0, z: -1}, len1: 3, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 6, z1: 1, dir1: {x: 1, z: 0}, x2: 4, z2: 1, dir2: {x: -1, z: 0}, len1: 2, len2: 1, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 6, z1: 4, dir1: {x: 0, z: 1}, x2: 6, z2: 6, dir2: {x: 0, z: -1}, len1: 2, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell
        { x1: 0, z1: 0, dir1: {x: 1, z: 0}, x2: 6, z2: 0, dir2: {x: -1, z: 0}, len1: 3, len2: 2, vert1: true, vert2: true }, // Vertical multi-cell - moved to avoid conflict
        { x1: 3, z1: 5, dir1: {x: 0, z: 1}, x2: 3, z2: 3, dir2: {x: 0, z: -1}, len1: 2, len2: 3, vert1: true, vert2: true }, // Vertical multi-cell - moved to avoid conflict
        
        // More horizontal blocks
        { x1: 2, z1: 0, dir1: {x: 1, z: 0}, x2: 5, z2: 0, dir2: {x: -1, z: 0}, len1: 3, len2: 2, vert1: false, vert2: false }, // Multi-cell horizontal
        { x1: 4, z1: 0, dir1: {x: 0, z: 1}, x2: 4, z2: 2, dir2: {x: 0, z: -1}, len1: 2, len2: 1, vert1: false, vert2: false }, // Moved to avoid conflict
        { x1: 3, z1: 6, dir1: {x: 1, z: 0}, x2: 5, z2: 6, dir2: {x: -1, z: 0}, len1: 1, len2: 1, vert1: false, vert2: false },
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
            const block1 = new Block(pair.len1, pair.x1, pair.z1, pair.dir1, isVertical1, currentArrowStyle, scene, physics, gridSize, cubeSize, 0, 1);
            console.log(`Block1 created, isVertical=${block1.isVertical}`);
            scene.remove(block1.group);
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
                const block2 = new Block(pair.len2, pair.x2, pair.z2, pair.dir2, isVertical2, currentArrowStyle, scene, physics, gridSize, cubeSize, 0, 1);
                console.log(`Block2 created, isVertical=${block2.isVertical}`);
                scene.remove(block2.group);
                blocksToPlace.push(block2);
            }
        }
    }
    
    // Fill remaining slots with random blocks if needed
    while (blocksToPlace.length < targetBlockCount) {
        const x = Math.floor(Math.random() * gridSize);
        const z = Math.floor(Math.random() * gridSize);
        if (!isCellOccupied(x, z)) {
            const directions = [{x: 1, z: 0}, {x: -1, z: 0}, {x: 0, z: 1}, {x: 0, z: -1}];
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
                const block = new Block(length, x, z, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize, 0, 1);
                scene.remove(block.group);
                blocksToPlace.push(block);
            }
        }
    }
    
    return blocksToPlace;
}

// Generate solvable puzzle using reverse generation (guaranteed solvable)
async function generateSolvablePuzzle(level = 1) {
    if (isGeneratingLevel) {
        console.warn('Level generation already in progress, skipping...');
        return;
    }
    
    isGeneratingLevel = true;
    levelCompleteShown = false; // Reset level complete flag for new level
    
    // Reset spin counter for new level
    remainingSpins = 3;
    updateSpinCounterDisplay();
    
    // Ensure randomization by consuming some random numbers at start
    // This helps prevent identical layouts when generation happens quickly
    for (let i = 0; i < (Date.now() % 50 + Math.floor(Math.random() * 50)); i++) {
        Math.random(); // Consume random numbers to shift the sequence
    }
    
    // Clear existing blocks first and clean up animations
    for (const block of blocks) {
        // Stop any ongoing animations
        if (block.isAnimating) {
            block.isAnimating = false;
        }
        // Remove from scene
        towerGroup.remove(block.group);
        // Dispose of geometries and materials to free memory
        if (block.cubes) {
            block.cubes.forEach(cube => {
                if (cube.geometry) cube.geometry.dispose();
                if (cube.material) cube.material.dispose();
            });
        }
        if (block.arrow) {
            block.arrow.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        if (block.directionIndicators) {
            block.directionIndicators.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    }
    blocks.length = 0;
    
    // Clean up any pending animation frames
    if (framingSmoothAnimationId !== null) {
        cancelAnimationFrame(framingSmoothAnimationId);
        framingSmoothAnimationId = null;
    }
    
    // Get target block count for this level
    const targetBlockCount = getBlocksForLevel(level);
    
    // Special case: Level 1 with head-on collisions for testing
    if (level === 1) {
        const headOnBlocks = createHeadOnCollisionBlocks(targetBlockCount);
        
        // Use the same animation system as normal generation
        await placeBlocksBatch(headOnBlocks);
        
        isGeneratingLevel = false;
        return;
    }
    
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
        
        // Calculate max layers needed: targetBlockCount / gridCells (rounded up) + buffer
        const maxLayersNeeded = Math.ceil(targetBlockCount / gridCells) + 2; // Add buffer for safety
        const maxLayers = Math.max(10, maxLayersNeeded); // At least 10, but more if needed
        while (remainingBlocks > 0 && currentLayer < maxLayers) {
            const yOffset = currentLayer * cubeSize;
            
            // For layer 1: Use longer blocks to minimize block count (prefer 2-3 cell blocks)
            // This leaves more room for layer 2
            // For layer 2+: Fill remaining blocks
            let blocksForThisLayer;
            let preferLongBlocks = false;
            
            if (currentLayer === 0) {
                // Layer 1: Use longer blocks to minimize block count (prefer 2-3 cell blocks)
                // For high block counts, allow more blocks in layer 1 to reduce total layers needed
                // Limit to gridCells to ensure we don't exceed capacity
                blocksForThisLayer = Math.min(remainingBlocks, gridCells);
                preferLongBlocks = true;
            } else {
                // Layer 2+: Recalculate remaining blocks based on actual blocks placed so far
                remainingBlocks = targetBlockCount - allBlocks.length;
                // For upper layers, we need to be more conservative
                // Check how many cells in lower layer actually have support
                const supportedCells = lowerLayerCells?.cells?.size || 0;
                // Request blocks based on available support - can't place more blocks than we have support cells
                // But also try to fill the layer reasonably (aim for 80-90% of support cells)
                const maxBlocksBasedOnSupport = Math.floor(supportedCells * 0.95); // Use 95% of supported cells
                const maxBlocksPerUpperLayer = Math.min(gridCells, maxBlocksBasedOnSupport);
                blocksForThisLayer = Math.min(remainingBlocks, maxBlocksPerUpperLayer);
                preferLongBlocks = false;
                
                // If we have very few supported cells, we might not be able to place many blocks
                if (supportedCells < 10 && remainingBlocks > 50) {
                    console.warn(`⚠️ Layer ${currentLayer}: Only ${supportedCells} supported cells, limiting block requests`);
                }
            }
            
            // Generate blocks for this layer with preference for longer blocks in layer 1
            console.log(`  Layer ${currentLayer}: Requesting ${blocksForThisLayer} blocks (remaining: ${remainingBlocks}, total so far: ${allBlocks.length})`);
            const layerBlocks = createSolvableBlocks(yOffset, lowerLayerCells, blocksForThisLayer, level, preferLongBlocks);
            console.log(`  Layer ${currentLayer}: Generated ${layerBlocks.length} blocks (requested ${blocksForThisLayer}, difference: ${blocksForThisLayer - layerBlocks.length})`);
            
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
                console.warn(`⚠️ Layer ${currentLayer} generated 0 blocks, but ${remainingBlocks} blocks still needed`);
                console.warn(`   Lower layer has ${lowerLayerCells?.cells?.size || 0} supported cells`);
            }
            
            // If we placed significantly fewer blocks than requested, log details
            if (layerBlocks.length < blocksForThisLayer * 0.8 && remainingBlocks > 0) {
                console.warn(`⚠️ Layer ${currentLayer} only generated ${layerBlocks.length}/${blocksForThisLayer} blocks (${((layerBlocks.length/blocksForThisLayer)*100).toFixed(1)}%)`);
                console.warn(`   Lower layer support: ${lowerLayerCells?.cells?.size || 0} cells`);
                console.warn(`   Current layer occupied: ${currentLayerCells.size} cells`);
            }
        }
    } else {
        // Single layer generation (base layer at Y=0)
        allBlocks = createSolvableBlocks(0, null, targetBlockCount, level);
    }
    
    // Place all blocks in batches
    console.log(`  Placing ${allBlocks.length} blocks in batches...`);
    await placeBlocksBatch(allBlocks, 10, 10); // 10 blocks per batch, 10ms between batches
    console.log(`  Placement complete. Blocks array now has ${blocks.length} blocks`);
    
    // CRITICAL: Support checking is already disabled by isGeneratingLevel flag
    // The flag will be set to false after a delay to ensure all blocks are initialized
    
    // Validate structure after placement to catch any overlaps
    const structureCheck = validateStructure(blocks, gridSize);
    if (!structureCheck.valid) {
        console.error(`✗ Structure validation failed: ${structureCheck.reason}`);
        console.error('  Regenerating puzzle...');
        // Regenerate if validation fails
        isGeneratingLevel = false;
        await generateSolvablePuzzle(level);
        return;
    }
    
    // Update level counter display
    const levelValueElement = document.getElementById('level-value');
    if (levelValueElement) {
        levelValueElement.textContent = level;
    }
    
    // Keep isGeneratingLevel true for a bit longer to prevent support checking from running
    // Blocks need time to fully initialize before support checking resumes
    setTimeout(() => {
        isGeneratingLevel = false;
        console.log('  Level generation complete, support checking enabled');
        
        // Vertically center the tower after all blocks are spawned
        centerTowerVertically();
    }, 1500); // 1.5 seconds to ensure all blocks are initialized
    
    // Start timer for new level
    resetTimer();
    startTimer();
    // Reset move counter for new level
    totalMoves = 0;
    
    // Update button states after level generation
    updateUndoButtonState();
    
    console.log(`✓ Generated Level ${level} puzzle using reverse generation`);
    console.log(`  Target blocks: ${targetBlockCount}, Actual blocks: ${blocks.length}`);
    console.log(`  Structure validation: ✓ PASSED`);
    
    // Enhanced block count verification
    if (blocks.length !== targetBlockCount) {
        console.warn(`⚠️ BLOCK COUNT MISMATCH: Expected ${targetBlockCount}, got ${blocks.length} (difference: ${targetBlockCount - blocks.length})`);
    } else {
        console.log(`✓ Block count verified: ${blocks.length} blocks match target ${targetBlockCount}`);
    }
    
    // Log block breakdown by type
    const verticalCount = blocks.filter(b => b.isVertical).length;
    const horizontalCount = blocks.filter(b => !b.isVertical).length;
    const singleCellCount = blocks.filter(b => b.length === 1).length;
    const multiCellCount = blocks.filter(b => b.length > 1).length;
    console.log(`  Block breakdown: ${verticalCount} vertical, ${horizontalCount} horizontal, ${singleCellCount} single-cell, ${multiCellCount} multi-cell`);
}

// Move history for undo functionality
let moveHistory = [];
let totalMoves = 0; // Track total moves for the current level

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
    
    // Increment total move counter
    totalMoves++;
    
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
    
    // Stop any ongoing animations
    block.isAnimating = false;
    block.needsStop = true;
    
    // Restore block position
    block.gridX = lastMove.gridX;
    block.gridZ = lastMove.gridZ;
    block.direction = lastMove.direction;
    block.isVertical = lastMove.isVertical;
    
    // Reset scale and position immediately
    block.group.scale.set(1, 1, 1);
    block.updateWorldPosition();
    
    console.log(`Undo: Restored block to (${block.gridX}, ${block.gridZ})`);
}

// Remove a block with selected animation type
function removeBlockWithAnimation(block) {
    if (!blocks.includes(block) || block.isRemoved || block.isFalling || block.isAnimating) {
        return;
    }
    
    // Mark as animating (but NOT removed yet - let animation complete first)
    block.isAnimating = true;
    block.isRemoved = false; // Don't mark as removed until animation completes
    block.removalStartTime = performance.now();
    block.meltDuration = 600; // 600ms melt animation (faster)
    
    // Store original scale, position, rotation, and colors
    const originalScale = block.group.scale.clone();
    const originalPosition = block.group.position.clone();
    const originalRotation = block.group.rotation.clone();
    const originalColors = [];
    
    // Make materials transparent for fade effect and store original colors
    block.cubes.forEach((cube, index) => {
        if (cube.material) {
            if (!cube.material.transparent) {
                cube.material.transparent = true;
            }
            cube.material.opacity = 1.0;
            // Store original color for heat effect
            originalColors[index] = cube.material.color.clone();
            // Initialize emissive if not present
            if (!cube.material.emissive) {
                cube.material.emissive = new THREE.Color(0, 0, 0);
            }
        }
    });
    
    // Also handle arrow and direction indicators if they exist
    if (block.arrow) {
        block.arrow.traverse((child) => {
            if (child.material) {
                if (!child.material.transparent) {
                    child.material.transparent = true;
                }
                child.material.opacity = 1.0;
            }
        });
    }
    
    if (block.directionIndicators) {
        block.directionIndicators.traverse((child) => {
            if (child.material) {
                if (!child.material.transparent) {
                    child.material.transparent = true;
                }
                child.material.opacity = 1.0;
            }
        });
    }
    
    // Animation function - called each frame
    block.updateMeltAnimation = function(deltaTime) {
        if (!this.removalStartTime) return;
        
        const elapsed = performance.now() - this.removalStartTime;
        const progress = Math.min(elapsed / this.meltDuration, 1.0);
        
        // Easing function for smooth melt (ease-in-out with slight bounce at end)
        let eased;
        if (progress < 0.7) {
            // Smooth ease-in-out for most of animation
            eased = progress < 0.35 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        } else {
            // Accelerate melt at the end (like liquid pooling)
            const t = (progress - 0.7) / 0.3;
            eased = 0.755 + 0.245 * (1 - Math.pow(1 - t, 3));
        }
        
        // Melt effect: scale down Y (height) more than X/Z, simulate melting
        const scaleY = 1 - eased; // Height melts away completely
        // Width/depth shrink more as it melts (starts slow, accelerates)
        const scaleXZ = 1 - eased * 0.5; // Width/depth shrinks up to 50%
        
        // Add slight wobble/rotation as it melts (like liquid sloshing)
        const wobbleAmount = Math.sin(progress * Math.PI * 8) * (1 - eased) * 0.05;
        const rotationWobble = Math.sin(progress * Math.PI * 6) * (1 - eased) * 0.1;
        
        this.group.scale.set(
            originalScale.x * scaleXZ * (1 + wobbleAmount),
            originalScale.y * scaleY,
            originalScale.z * scaleXZ * (1 - wobbleAmount * 0.5)
        );
        
        // Add slight rotation wobble
        this.group.rotation.x = rotationWobble * 0.3;
        this.group.rotation.z = rotationWobble * 0.2;
        
        // Slight downward movement as it melts (more pronounced at end)
        const sinkAmount = eased * 0.3 + Math.pow(eased, 2) * 0.2;
        this.group.position.y = originalPosition.y - sinkAmount;
        
        // Fade out opacity with slight glow effect mid-animation
        let opacity = 1 - eased;
        if (progress > 0.3 && progress < 0.7) {
            // Add slight glow/pulse effect during mid-melt
            const glow = Math.sin(progress * Math.PI * 4) * 0.1;
            opacity = Math.min(1, opacity + glow);
        }
        
        // Debug log first frame and every 200ms
        if (!this._meltDebugLogged || elapsed % 200 < 16) {
            if (!this._meltDebugLogged) {
                console.log('Melt animation started', { progress: (progress * 100).toFixed(1) + '%', scaleY: scaleY.toFixed(2), opacity: opacity.toFixed(2) });
                this._meltDebugLogged = true;
            }
        }
        
        // Color shift towards warmer tones as it "heats up" during melt
        const heatProgress = Math.min(progress * 1.5, 1.0); // Heat effect peaks earlier
        const heatIntensity = Math.sin(heatProgress * Math.PI) * 0.4;
        
        this.cubes.forEach((cube, index) => {
            if (cube.material && originalColors[index]) {
                cube.material.opacity = opacity;
                
                // Add heat glow effect (shift towards orange/red)
                if (heatProgress < 0.85) {
                    const originalColor = originalColors[index];
                    // Create heat color (orange/red glow)
                    const heatColor = new THREE.Color().lerpColors(
                        originalColor,
                        new THREE.Color(1.0, 0.5, 0.1), // Bright orange-red
                        heatIntensity
                    );
                    cube.material.color.copy(heatColor);
                    
                    // Add emissive glow during heat phase (pulsing effect)
                    const pulse = Math.sin(progress * Math.PI * 6) * 0.2 + 0.8;
                    cube.material.emissive.copy(heatColor);
                    cube.material.emissiveIntensity = heatIntensity * 0.6 * pulse;
                } else {
                    // Fade back to original color as it finishes melting
                    const fadeBack = (progress - 0.85) / 0.15;
                    const finalColor = new THREE.Color().lerpColors(
                        new THREE.Color(1.0, 0.5, 0.1),
                        originalColors[index],
                        fadeBack
                    );
                    cube.material.color.copy(finalColor);
                    cube.material.emissiveIntensity = heatIntensity * 0.6 * (1 - fadeBack);
                }
            }
        });
        
        // Fade arrow and indicators
        if (this.arrow) {
            this.arrow.traverse((child) => {
                if (child.material) {
                    child.material.opacity = opacity;
                }
            });
        }
        
        if (this.directionIndicators) {
            this.directionIndicators.traverse((child) => {
                if (child.material) {
                    child.material.opacity = opacity;
                }
            });
        }
        
        // Remove block when animation completes
        if (progress >= 1.0) {
            // Mark as removed first
            this.isRemoved = true;
            this.remove();
            // Clean up from blocks array
            const index = blocks.indexOf(this);
            if (index > -1) {
                blocks.splice(index, 1);
            }
            // Remove from move history if present
            moveHistory = moveHistory.filter(m => m.block !== this);
            // Clear animation function
            this.updateMeltAnimation = null;
        }
    };
    
    console.log(`Melting block at (${block.gridX}, ${block.gridZ})`, {
        originalScale,
        originalPosition,
        meltDuration: block.meltDuration
    });
}

// Restart current level
async function restartCurrentLevel() {
    // Reset spin counter
    remainingSpins = 3;
    updateSpinCounterDisplay();
    if (isGeneratingLevel) return;
    
    // Clear move history
    moveHistory = [];
    totalMoves = 0;
    
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
    totalMoves = 0;
    
    // Reset spin counter
    remainingSpins = 3;
    updateSpinCounterDisplay();
    
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
    const levelNumber = document.getElementById('level-complete-level');
    const timeElement = document.getElementById('level-complete-time');
    const movesElement = document.getElementById('level-complete-moves');
    const blocksElement = document.getElementById('level-complete-blocks');
    
    if (modal) {
        // Per request: remove the "Outstanding performance" line.
        if (message) message.textContent = '';
        
        if (levelNumber) {
            levelNumber.textContent = String(completedLevel);
        }
        
        // Get elapsed time
        let elapsedSeconds = timerPausedTime;
        if (isTimerRunning && timerStartTime !== null) {
            elapsedSeconds += (performance.now() / 1000) - timerStartTime;
        }
        const timeString = formatTime(elapsedSeconds);
        if (timeElement) {
            timeElement.textContent = timeString;
        }
        
        // Get move count (use totalMoves for accurate count)
        if (movesElement) {
            movesElement.textContent = String(totalMoves);
        }
        
        // Get number of blocks cleared (initial block count for this level)
        const initialBlockCount = getBlocksForLevel(completedLevel);
        if (blocksElement) {
            blocksElement.textContent = String(initialBlockCount);
        }
        
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
        totalMoves = 0; // Reset move counter
        saveProgress(); // Save progress when advancing to next level
        await generateSolvablePuzzle(currentLevel);
    });
}

// Game control button handlers (undo and remove buttons removed)

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

// Update spin counter display
function updateSpinCounterDisplay() {
    const spinCounter = document.getElementById('spin-counter');
    if (spinCounter) {
        spinCounter.textContent = remainingSpins.toString();
}

const diceButton = document.getElementById('dice-button');
if (diceButton) {
        if (remainingSpins === 0) {
            diceButton.disabled = true;
            diceButton.style.opacity = '0.5';
            diceButton.style.cursor = 'not-allowed';
        } else {
            diceButton.disabled = false;
            diceButton.style.opacity = '1';
            diceButton.style.cursor = 'pointer';
        }
    }
}

// Auto spin after spawn (doesn't count toward 3 spins)
function autoSpinAfterSpawn() {
    console.log('Auto spinning blocks after spawn (does not count toward spin limit)');
    
    // Filter for eligible blocks: vertical OR single-cell blocks OR horizontal multi-cell blocks
    const eligibleBlocks = blocks.filter(block => 
        (block.isVertical || block.length === 1 || (!block.isVertical && block.length > 1)) &&
        !block.isFalling &&
        !block.isRemoved &&
        !block.removalStartTime &&
        !block.isAnimating
    );
    
    if (eligibleBlocks.length === 0) {
        return; // No eligible blocks to spin
    }
    
    // Spin each block with slight duration randomization for visual variety
    // Note: This does NOT decrement remainingSpins
    eligibleBlocks.forEach((block, index) => {
        // Add slight delay and duration variation for staggered effect
        const baseDuration = 1800; // 1.8 seconds base
        const durationVariation = 200; // ±200ms variation
        const duration = baseDuration + (Math.random() * 2 - 1) * durationVariation;
        
        // Small delay for staggered start (optional, creates wave effect)
        const delay = index * 20; // 20ms delay between each block
        
        setTimeout(() => {
            try {
                if (typeof block.animateRandomSpin === 'function') {
                    block.animateRandomSpin(duration);
                } else {
                    console.error('Block does not have animateRandomSpin method!', block);
                }
            } catch (error) {
                console.error('Error spinning block:', error);
            }
        }, delay);
    });
}

// Spin random blocks (vertical and single-cell blocks) to break interlock situations
function spinRandomBlocks() {
    // Check if spins are available
    if (remainingSpins <= 0) {
        console.log('No spins remaining');
        return;
    }
    
    console.log('spinRandomBlocks called, total blocks:', blocks.length);
    
    // Filter for eligible blocks: vertical OR single-cell blocks OR horizontal multi-cell blocks
    // Horizontal multi-cell blocks can only rotate 180 degrees (flip direction)
    const eligibleBlocks = blocks.filter(block => 
        (block.isVertical || block.length === 1 || (!block.isVertical && block.length > 1)) &&
        !block.isFalling &&
        !block.isRemoved &&
        !block.removalStartTime &&
        !block.isAnimating
    );
    
    console.log('Eligible blocks found:', eligibleBlocks.length);
    
    if (eligibleBlocks.length === 0) {
        console.log('No eligible blocks to spin');
        return; // No eligible blocks to spin
    }
    
    // Decrement spin counter
    remainingSpins--;
    updateSpinCounterDisplay();
    
    // Spin each block with slight duration randomization for visual variety
    eligibleBlocks.forEach((block, index) => {
        // Add slight delay and duration variation for staggered effect
        const baseDuration = 1800; // 1.8 seconds base
        const durationVariation = 200; // ±200ms variation
        const duration = baseDuration + (Math.random() * 2 - 1) * durationVariation;
        
        // Small delay for staggered start (optional, creates wave effect)
        const delay = index * 20; // 20ms delay between each block
        
        setTimeout(() => {
            try {
                console.log('Spinning block:', { isVertical: block.isVertical, length: block.length });
                if (typeof block.animateRandomSpin === 'function') {
                    block.animateRandomSpin(duration);
                } else {
                    console.error('Block does not have animateRandomSpin method!', block);
                }
            } catch (error) {
                console.error('Error spinning block:', error);
            }
        }, delay);
    });
}

// Setup dice button handler - ensure DOM is ready
function setupDiceButton() {
    const diceButton = document.getElementById('dice-button');
    if (diceButton) {
        console.log('Dice button found, attaching handler');
        // Initialize spin counter display
        updateSpinCounterDisplay();
        diceButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Dice button clicked!');
            spinRandomBlocks();
        });
    } else {
        console.error('Dice button not found! Retrying...');
        // Retry after a short delay if button not found
        setTimeout(setupDiceButton, 100);
    }
}

// Setup dice button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDiceButton);
} else {
    setupDiceButton();
}

// Setup elevation slider
// Vertical framing offset (controls where tower appears in frame)
// Range: 0.1 (tower higher in frame) to 10.0 (tower lower in frame)
const MIN_FRAMING_OFFSET = 0.1;
const MAX_FRAMING_OFFSET = 10.0;
window.framingOffsetY = 0.1; // Default value for desktop/web

function setupFramingSlider() {
    const controlPanel = document.getElementById('framing-control');
    const valueDisplay = document.getElementById('framing-value-display');
    
    if (controlPanel && valueDisplay) {
        const BASE_SENSITIVITY = 0.02; // Base sensitivity per pixel
        const VELOCITY_MULTIPLIER = 0.5; // How much velocity affects sensitivity
        const MAX_VELOCITY_MULTIPLIER = 5.0; // Maximum speed multiplier
        const MIN_PUSH_DISTANCE = 3; // Minimum pixels to move before updating value
        const VELOCITY_SMOOTHING = 0.7; // Smoothing factor for velocity (0-1, higher = smoother)
        const CONTINUOUS_MOTION_BASE = 0.01; // Base speed for continuous motion while held
        const DISTANCE_MULTIPLIER = 0.002; // How much push distance affects continuous speed
        const MAX_CONTINUOUS_SPEED = 0.3; // Maximum continuous motion speed
        const SPEED_SMOOTHING = 0.15; // Smoothing factor for speed acceleration (0-1, lower = smoother/slower)
        
        let isDragging = false;
        let startY = 0;
        let lastY = 0;
        let lastUpdateTime = 0;
        let pushDirection = null; // 'up' or 'down'
        let velocity = 0; // Current velocity (pixels per frame)
        let smoothedVelocity = 0; // Smoothed velocity for more stable calculation
        let pushDistance = 0; // Distance pushed away from start
        let targetSpeed = 0; // Target speed based on push distance
        let currentSpeed = 0; // Current smoothed speed
        let continuousMotionId = null; // Animation frame ID for continuous motion
        
        const updateValueDisplay = (offset) => {
            valueDisplay.textContent = offset.toFixed(1);
        };
        
        const clampValue = (value) => {
            return Math.max(MIN_FRAMING_OFFSET, Math.min(MAX_FRAMING_OFFSET, value));
        };
        
        const updateFraming = (delta) => {
            const newOffset = clampValue(window.framingOffsetY + delta);
            if (newOffset !== window.framingOffsetY) {
                window.framingOffsetY = newOffset;
                updateValueDisplay(newOffset);
                updateCameraPosition(); // Update camera immediately
                // Save framing preference to localStorage
                try {
                    localStorage.setItem('jarrows_framing', newOffset.toString());
                } catch (e) {
                    console.warn('Failed to save framing preference:', e);
                }
            }
        };
        
        const stopContinuousMotion = () => {
            if (continuousMotionId !== null) {
                cancelAnimationFrame(continuousMotionId);
                continuousMotionId = null;
            }
        };
        
        const continueMotionWhileHeld = () => {
            if (!isDragging) {
                stopContinuousMotion();
                currentSpeed = 0;
                targetSpeed = 0;
                return;
            }
            
            // Calculate target speed based on push distance
            // Harder push (further distance) = faster continuous motion
            const distanceSpeed = Math.min(pushDistance * DISTANCE_MULTIPLIER, MAX_CONTINUOUS_SPEED);
            targetSpeed = CONTINUOUS_MOTION_BASE + distanceSpeed;
            
            // Smoothly interpolate current speed towards target speed
            currentSpeed = currentSpeed + (targetSpeed - currentSpeed) * SPEED_SMOOTHING;
            
            // Determine direction based on push direction
            const direction = pushDirection === 'up' ? -1 : 1;
            
            // Update value continuously while held with smoothed speed
            updateFraming(currentSpeed * direction);
            
            // Continue animation
            continuousMotionId = requestAnimationFrame(continueMotionWhileHeld);
        };
        
        const setPushAnimation = (direction) => {
            controlPanel.classList.remove('pushing-up', 'pushing-down');
            if (direction === 'up') {
                controlPanel.classList.add('pushing-up');
            } else if (direction === 'down') {
                controlPanel.classList.add('pushing-down');
            }
        };
        
        const clearPushAnimation = () => {
            controlPanel.classList.remove('pushing-up', 'pushing-down');
        };
        
        // Load framing preference from localStorage if not already set
        if (window.framingOffsetY === undefined || window.framingOffsetY === null) {
            try {
                const savedFraming = localStorage.getItem('jarrows_framing');
                if (savedFraming !== null) {
                    const parsedFraming = parseFloat(savedFraming);
                    if (!isNaN(parsedFraming)) {
                        window.framingOffsetY = clampValue(parsedFraming);
                    }
                }
            } catch (e) {
                console.warn('Failed to load framing preference:', e);
            }
        }
        
        // Set initial value display
        updateValueDisplay(window.framingOffsetY);
        
        // Mouse events
        controlPanel.addEventListener('mousedown', (e) => {
            // Stop any existing continuous motion
            stopContinuousMotion();
            
            isDragging = true;
            startY = e.clientY;
            lastY = e.clientY;
            lastUpdateTime = performance.now();
            velocity = 0;
            smoothedVelocity = 0;
            pushDistance = 0;
            targetSpeed = 0;
            currentSpeed = 0;
            controlPanel.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const now = performance.now();
            const deltaTime = Math.max(1, now - lastUpdateTime); // Prevent division by zero
            const deltaY = e.clientY - lastY;
            const totalDeltaY = e.clientY - startY;
            
            // Calculate push distance (how far from start point)
            pushDistance = Math.abs(totalDeltaY);
            
            // Calculate velocity (pixels per millisecond)
            const currentVelocity = Math.abs(deltaY) / deltaTime;
            // Smooth the velocity to avoid jitter
            smoothedVelocity = smoothedVelocity * VELOCITY_SMOOTHING + currentVelocity * (1 - VELOCITY_SMOOTHING);
            
            // Determine push direction
            if (Math.abs(totalDeltaY) > MIN_PUSH_DISTANCE) {
                const direction = totalDeltaY < 0 ? 'up' : 'down';
                if (pushDirection !== direction) {
                    pushDirection = direction;
                    setPushAnimation(direction);
                    // Start continuous motion when direction is established
                    if (continuousMotionId === null) {
                        continueMotionWhileHeld();
                    }
                }
            }
            
            // Calculate sensitivity based on velocity (faster push = higher sensitivity)
            // Velocity is in pixels/ms, so we scale it appropriately
            const velocityMultiplier = Math.min(1 + (smoothedVelocity * VELOCITY_MULTIPLIER), MAX_VELOCITY_MULTIPLIER);
            const dynamicSensitivity = BASE_SENSITIVITY * velocityMultiplier;
            
            // Update value based on movement with velocity-based sensitivity
            const valueDelta = -deltaY * dynamicSensitivity; // Negative because up should increase
            updateFraming(valueDelta);
            
            lastY = e.clientY;
            lastUpdateTime = now;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                stopContinuousMotion();
                clearPushAnimation();
                pushDirection = null;
                velocity = 0;
                smoothedVelocity = 0;
                pushDistance = 0;
                targetSpeed = 0;
                currentSpeed = 0;
                controlPanel.style.cursor = 'ns-resize';
            }
        });
        
        // Touch events
        let touchStartY = 0;
        let touchLastY = 0;
        let touchLastTime = 0;
        
        controlPanel.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // Stop any existing continuous motion
                stopContinuousMotion();
                
                isDragging = true;
                touchStartY = e.touches[0].clientY;
                touchLastY = e.touches[0].clientY;
                touchLastTime = performance.now();
                velocity = 0;
                smoothedVelocity = 0;
                pushDistance = 0;
                targetSpeed = 0;
                currentSpeed = 0;
                e.preventDefault();
            }
        });
        
        controlPanel.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            
            const touchY = e.touches[0].clientY;
            const now = performance.now();
            const deltaTime = Math.max(1, now - touchLastTime);
            const deltaY = touchY - touchLastY;
            const totalDeltaY = touchY - touchStartY;
            
            // Calculate push distance (how far from start point)
            pushDistance = Math.abs(totalDeltaY);
            
            // Calculate velocity (pixels per millisecond)
            const currentVelocity = Math.abs(deltaY) / deltaTime;
            // Smooth the velocity to avoid jitter
            smoothedVelocity = smoothedVelocity * VELOCITY_SMOOTHING + currentVelocity * (1 - VELOCITY_SMOOTHING);
            
            // Determine push direction
            if (Math.abs(totalDeltaY) > MIN_PUSH_DISTANCE) {
                const direction = totalDeltaY < 0 ? 'up' : 'down';
                if (pushDirection !== direction) {
                    pushDirection = direction;
                    setPushAnimation(direction);
                    // Start continuous motion when direction is established
                    if (continuousMotionId === null) {
                        continueMotionWhileHeld();
                    }
                }
            }
            
            // Calculate sensitivity based on velocity (faster push = higher sensitivity)
            const velocityMultiplier = Math.min(1 + (smoothedVelocity * VELOCITY_MULTIPLIER), MAX_VELOCITY_MULTIPLIER);
            const dynamicSensitivity = BASE_SENSITIVITY * velocityMultiplier;
            
            // Update value based on movement with velocity-based sensitivity
            const valueDelta = -deltaY * dynamicSensitivity; // Negative because up should increase
            updateFraming(valueDelta);
            
            touchLastY = touchY;
            touchLastTime = now;
            e.preventDefault();
        });
        
        controlPanel.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                stopContinuousMotion();
                clearPushAnimation();
                pushDirection = null;
                velocity = 0;
                smoothedVelocity = 0;
                pushDistance = 0;
                targetSpeed = 0;
                currentSpeed = 0;
            }
        });
        
        controlPanel.addEventListener('touchcancel', () => {
            if (isDragging) {
                isDragging = false;
                stopContinuousMotion();
                clearPushAnimation();
                pushDirection = null;
                velocity = 0;
                smoothedVelocity = 0;
                pushDistance = 0;
                targetSpeed = 0;
                currentSpeed = 0;
            }
        });
    } else {
        setTimeout(setupFramingSlider, 100);
    }
}

// Setup framing slider on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFramingSlider);
} else {
    setupFramingSlider();
}

// Update undo button state (enable/disable based on history)
function updateUndoButtonState() {
    // Undo button removed - function kept for compatibility
}

// Initialize camera position
calculateInitialCameraPosition();
updateCameraPosition(); // Position camera immediately to avoid default (0,0,0) view on first frame

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
    // Only process left-clicks (button 0) for block interaction
    if (event.button !== 0) {
        return;
    }
    
    // Prevent block selection if camera was dragged
    if (wasCameraDragging || isCameraDragging) {
        // Reset drag tracking for next interaction
        wasCameraDragging = false;
        isCameraDragging = false;
        mouseDownPos = null;
        return; // Don't process as block click
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
    wasCameraDragging = false;
    
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
    
    // Close settings menu when user clicks on a block (returns to game)
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu) {
        settingsMenu.classList.remove('show');
    }
    
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
        console.warn('This may indicate a bug in the movement logic or puzzle generation.');
        // Don't block the move - allow it to proceed and let the move logic handle collisions
        // The validation might be too strict or detecting a transient state
        // return;
    }
    
    // Store if this block will fall (to update solution tracking)
    const moveResult = block.canMove(blocks);
    const willFall = moveResult === 'fall';
    
    // Save move state before moving (for undo)
    saveMoveState(block);
    
    block.move(blocks, gridSize);
    
    // After a block moves, validate structure and fix any overlaps
    setTimeout(() => {
        const structureCheck = validateStructure(blocks, gridSize);
        if (!structureCheck.valid) {
            console.warn('Overlap detected after move, attempting to fix...');
            const fixResult = fixOverlappingBlocks(blocks, gridSize);
            if (fixResult.fixed) {
                console.log(`Fixed ${fixResult.movedBlocks.length} overlapping block(s)`);
            } else {
                console.error('Failed to fix overlaps - manual intervention may be needed');
            }
        }
    }, 100);
    
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
    // Skip support checking during level generation to prevent false positives
    // Blocks are placed with proper support during generation, but the check might
    // run before all blocks are fully initialized, causing blocks to fall incorrectly
    if (isGeneratingLevel || window.supportCheckingEnabled === false) {
        return;
    }
    
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
    
    let fallAnimationId = null;
    const animateFall = () => {
        // Check if block was removed or level changed
        if (block.isRemoved || !blocks.includes(block) || isGeneratingLevel) {
            if (fallAnimationId !== null) {
                cancelAnimationFrame(fallAnimationId);
                fallAnimationId = null;
            }
            block.isAnimating = false;
            return;
        }
        
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
            fallAnimationId = requestAnimationFrame(animateFall);
        } else {
            // Landing complete
            block.yOffset = targetYOffset;
            block.updateWorldPosition();
            block.isAnimating = false;
            fallAnimationId = null;
            
            // Check if block now has support (should always be true after landing)
            if (!blockHasSupport(block, blocks) && block.yOffset > 0) {
                // Still no support - continue falling
                setTimeout(() => {
                    startBlockFalling(block);
                }, 50);
            }
        }
    };
    
    fallAnimationId = requestAnimationFrame(animateFall);
}

// Add click listener to window in capture phase to catch all clicks early
window.addEventListener('click', (event) => {
    // Track clicks for block interaction
}, { capture: true, passive: true }); // Use capture phase and passive for performance

// Also handle touch events at window level
window.addEventListener('touchstart', (event) => {
    // Track touch start for tap detection (single touch only)
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTime = performance.now();
    }
}, { capture: true, passive: true }); // Use capture phase and passive for performance

// Original click handler for block interaction (normal phase)
window.addEventListener('click', onMouseClick);

// Touch controls for camera
let touchState = {
    isActive: false,
    touches: [],
    startDistance: 0,
    startCenter: null,
    lastCenter: null,
    isPinching: false,
    isFramingControl: false,
    wasFramingControl: false, // Track if framing control was active (persists until checked by onTouchEnd)
    hadDoubleTouch: false, // Track if we ever had 2 touches in this gesture sequence (prevents block selection)
    framingStartY: 0,
    framingLastY: 0,
    framingLastTime: 0
};

// Touch start handler
renderer.domElement.addEventListener('touchstart', (event) => {
    event.preventDefault();
    
    touchState.touches = Array.from(event.touches);
    touchState.isActive = true;
    
    // Reset framing control tracking for new touch sequence
    touchState.wasFramingControl = false;
    touchState.hadDoubleTouch = false;
    
    if (touchState.touches.length === 1) {
        // Single touch - orbit mode
        const touch = touchState.touches[0];
        touchState.lastCenter = { x: touch.clientX, y: touch.clientY };
        
        // Track for block tap detection
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTime = performance.now();
        isCameraDragging = false;
    } else if (touchState.touches.length === 2) {
        // Dual touch - detect pinch vs drag
        touchState.hadDoubleTouch = true; // Mark that we had a double touch gesture
        
        const touch1 = touchState.touches[0];
        const touch2 = touchState.touches[1];
        
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        touchState.startDistance = Math.sqrt(dx * dx + dy * dy);
        
        touchState.startCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
        touchState.lastCenter = touchState.startCenter;
        touchState.isPinching = false;
        touchState.isFramingControl = false;
        touchState.framingStartY = touchState.startCenter.y;
        touchState.framingLastY = touchState.startCenter.y;
        touchState.framingLastTime = performance.now();
    }
}, { passive: false });

// Touch move handler
renderer.domElement.addEventListener('touchmove', (event) => {
    event.preventDefault();
    
    if (!touchState.isActive) return;
    
    const currentTouches = Array.from(event.touches);
    
    if (currentTouches.length === 1 && touchState.touches.length === 1) {
        // Single touch orbit
        const touch = currentTouches[0];
        const lastTouch = touchState.touches[0];
        
        const dx = touch.clientX - lastTouch.clientX;
        const dy = touch.clientY - lastTouch.clientY;
        
        // Update azimuth and elevation (use higher sensitivity for mobile touch)
        targetAzimuth += dx * TOUCH_DRAG_SENSITIVITY;
        targetElevation -= dy * TOUCH_DRAG_SENSITIVITY;
        targetElevation = Math.max(MIN_ELEVATION, Math.min(MAX_ELEVATION, targetElevation));
        
        touchState.touches = currentTouches;
        
        // Mark as camera drag
        if (touchStartPos) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > DRAG_THRESHOLD) {
                isCameraDragging = true;
            }
        }
    } else if (currentTouches.length === 2 && touchState.touches.length === 2) {
        // Dual touch - detect pinch (zoom) vs vertical drag (framing)
        touchState.hadDoubleTouch = true; // Ensure flag is set if we're in a double touch gesture
        
        const touch1 = currentTouches[0];
        const touch2 = currentTouches[1];
        
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        
        const distanceChange = Math.abs(currentDistance - touchState.startDistance) / touchState.startDistance;
        
        const currentCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
        
        const centerDeltaY = Math.abs(currentCenter.y - touchState.lastCenter.y);
        const centerDeltaX = Math.abs(currentCenter.x - touchState.lastCenter.x);
        const centerMovement = Math.sqrt(centerDeltaX * centerDeltaX + centerDeltaY * centerDeltaY);
        
        // Determine gesture: pinch (distance change) vs framing drag (vertical movement)
        if (distanceChange > 0.05) {
            // Pinch to zoom
            if (!touchState.isPinching) {
            touchState.isPinching = true;
                touchState.isFramingControl = false;
            }
            
            const zoomFactor = currentDistance / touchState.startDistance;
            targetRadius /= zoomFactor;
            targetRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, targetRadius));
            touchState.startDistance = currentDistance;
            touchState.lastCenter = currentCenter;
        } else if (centerDeltaY > centerDeltaX && centerMovement > 5) {
            // Vertical drag for framing control (like framing slider)
            if (!touchState.isFramingControl) {
                touchState.isFramingControl = true;
                touchState.isPinching = false;
                touchState.framingStartY = currentCenter.y;
                touchState.framingLastY = currentCenter.y;
                touchState.framingLastTime = performance.now();
            }
            
            const deltaY = currentCenter.y - touchState.framingLastY;
            const now = performance.now();
            const deltaTime = Math.max(1, now - touchState.framingLastTime);
            const velocity = Math.abs(deltaY) / deltaTime;
            
            // Dynamic sensitivity based on velocity (like framing slider)
            const velocityMultiplier = Math.min(1 + (velocity * 0.5), 5.0);
            const dynamicSensitivity = FRAMING_DRAG_SENSITIVITY * velocityMultiplier;
            
            // Update target framing offset (positive because up should decrease - reversed from right-click)
            const valueDelta = deltaY * dynamicSensitivity;
            targetFramingOffset = Math.max(MIN_FRAMING_OFFSET, Math.min(MAX_FRAMING_OFFSET, targetFramingOffset + valueDelta));
            
            // Start smooth animation if not already running
            if (framingSmoothAnimationId === null) {
                const smoothFraming = () => {
                    const currentOffset = window.framingOffsetY;
                    const diff = targetFramingOffset - currentOffset;
                    
                    if (Math.abs(diff) > 0.001) {
                        // Smooth interpolation
                        const newOffset = currentOffset + diff * FRAMING_SMOOTHING;
                        const clampedOffset = Math.max(MIN_FRAMING_OFFSET, Math.min(MAX_FRAMING_OFFSET, newOffset));
                        
                        window.framingOffsetY = clampedOffset;
                        updateCameraPosition();
                        
                        // Update framing value display if it exists
                        const framingValueDisplay = document.getElementById('framing-value-display');
                        if (framingValueDisplay) {
                            framingValueDisplay.textContent = clampedOffset.toFixed(1);
                        }
                        
                        framingSmoothAnimationId = requestAnimationFrame(smoothFraming);
        } else {
                        // Reached target
                        window.framingOffsetY = targetFramingOffset;
                        updateCameraPosition();
                        
                        const framingValueDisplay = document.getElementById('framing-value-display');
                        if (framingValueDisplay) {
                            framingValueDisplay.textContent = targetFramingOffset.toFixed(1);
                        }
                        
                        // Save to localStorage
                        try {
                            localStorage.setItem('jarrows_framing', targetFramingOffset.toString());
                        } catch (e) {
                            console.warn('Failed to save framing preference:', e);
                        }
                        
                        framingSmoothAnimationId = null;
                    }
                };
                smoothFraming();
            }
            
            touchState.framingLastY = currentCenter.y;
            touchState.framingLastTime = now;
            touchState.lastCenter = currentCenter;
        } else {
            // Neither pinch nor framing drag - update center for next frame
            touchState.lastCenter = currentCenter;
        }
        
        touchState.touches = currentTouches;
    }
}, { passive: false });

// Touch end handler
renderer.domElement.addEventListener('touchend', (event) => {
    event.preventDefault();
    
    const remainingTouches = Array.from(event.touches);
    
    // Store if framing control was active before resetting (for onTouchEnd to check)
    if (touchState.isFramingControl) {
        touchState.wasFramingControl = true;
    }
    
    if (remainingTouches.length === 0) {
        // All touches ended - hadDoubleTouch will be cleared in onTouchEnd after check
        touchState.isActive = false;
        touchState.touches = [];
        touchState.isPinching = false;
        touchState.isFramingControl = false;
        touchState.framingLastTime = 0;
    } else if (remainingTouches.length === 1) {
        // One touch ended, switch to single touch mode
        // Keep hadDoubleTouch flag true to prevent block selection from remaining touch
        touchState.touches = remainingTouches;
        const touch = remainingTouches[0];
        touchState.lastCenter = { x: touch.clientX, y: touch.clientY };
        touchState.isFramingControl = false;
        touchState.framingLastTime = 0;
    }
}, { passive: false });

// Touch handler for mobile block interaction
let touchStartPos = null;
let touchStartTime = null;
const TOUCH_DRAG_THRESHOLD = 5; // pixels - minimum movement to consider it a drag

function onTouchEnd(event) {
    // Prevent block selection if we had a double touch gesture (pinch or framing control)
    // This ensures no blocks are selected after completing double touch gestures
    if (touchState.hadDoubleTouch || touchState.wasFramingControl || touchState.isFramingControl) {
        // Only clear hadDoubleTouch when all touches have ended
        if (event.touches.length === 0) {
            touchState.hadDoubleTouch = false;
        }
        touchState.wasFramingControl = false; // Clear flag after checking
        touchStartPos = null;
        return; // Don't process as block tap
    }
    
    // Only process single touch (not multi-touch)
    if (event.touches.length > 0 || event.changedTouches.length !== 1) {
        touchStartPos = null;
        return;
    }
    
    const touch = event.changedTouches[0];
    
    // Check if this was actually a drag by checking touch movement
    if (touchStartPos) {
        const dx = touch.clientX - touchStartPos.x;
        const dy = touch.clientY - touchStartPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeElapsed = performance.now() - touchStartTime;
        
        // If distance exceeds threshold or time is too long, it was a drag, not a tap
        if (distance > TOUCH_DRAG_THRESHOLD || timeElapsed > 300) {
            touchStartPos = null;
            return; // Don't process as block tap
        }
    }
    
    // Reset drag tracking
    touchStartPos = null;
    
    // Convert touch to normalized device coordinates
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Collect ALL intersections from ALL blocks first, then pick the closest one
    const allIntersections = [];
    
    for (const block of blocks) {
        if (block.isAnimating || block.isFalling) continue;
        
        const intersects = raycaster.intersectObjects(block.cubes, true);
        
        for (const intersection of intersects) {
            allIntersections.push({
                intersection,
                block,
                distance: intersection.distance
            });
        }
    }
    
    // If no intersections, nothing was tapped
    if (allIntersections.length === 0) {
        return;
    }
    
    // Sort by distance (closest first)
    allIntersections.sort((a, b) => a.distance - b.distance);
    
    // Get the closest intersection
    const closestHit = allIntersections[0];
    const block = closestHit.block;
    
    // Close settings menu when user clicks on a block (returns to game)
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu) {
        settingsMenu.classList.remove('show');
    }
    
    // If remove mode is active, remove the block instead of moving it
    if (removeModeActive) {
        removeBlockWithAnimation(block);
        toggleRemoveMode();
        updateUndoButtonState();
        return;
    }
    
    // Validate structure before move
    const structureCheck = validateStructure(blocks, gridSize);
    if (!structureCheck.valid) {
        console.warn('Puzzle structure invalid before move, skipping:', structureCheck.reason);
        console.warn('This may indicate a bug in the movement logic or puzzle generation.');
        // Don't block the move - allow it to proceed and let the move logic handle collisions
        // The validation might be too strict or detecting a transient state
        // return;
    }
    
    // Store if this block will fall
    const willFall = block.canMove(blocks) === 'fall';
    
    // Save move state before moving
    saveMoveState(block);
    
    block.move(blocks, gridSize);
    
    // After a block moves, validate structure and fix any overlaps
    setTimeout(() => {
        const structureCheck = validateStructure(blocks, gridSize);
        if (!structureCheck.valid) {
            console.warn('Overlap detected after move, attempting to fix...');
            const fixResult = fixOverlappingBlocks(blocks, gridSize);
            if (fixResult.fixed) {
                console.log(`Fixed ${fixResult.movedBlocks.length} overlapping block(s)`);
            } else {
                console.error('Failed to fix overlaps - manual intervention may be needed');
            }
        }
    }, 100);
    
    // After a block moves, check if any other blocks lost support
    setTimeout(() => {
        checkAndTriggerFalling(blocks);
        setTimeout(() => {
            checkAndTriggerFalling(blocks);
        }, 500);
    }, 400);
    
    // Update button states after move
    updateUndoButtonState();
    
    // If block will fall, advance solution step
    if (willFall && window.puzzleSolution) {
        setTimeout(() => {
            const blockStillExists = blocks.includes(block);
            if (!blockStillExists || block.isFalling) {
                window.solutionStep++;
                highlightNextBlock();
            }
        }, 1000);
    }
}

// Touch start tracking is handled above in the capture phase handler

// Handle touch end for block interaction
window.addEventListener('touchend', onTouchEnd, { passive: true });

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Recalculate initial camera position if needed
    if (!isGeneratingLevel && blocks.length === 0) {
        calculateInitialCameraPosition();
    }
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
    
    // Update tower group position
    towerGroup.position.copy(towerCenter.clone().add(towerPositionOffset));
    towerGroup.rotation.set(0, 0, 0); // Always locked to zero
    
    // Dynamic zoom during spawn
    if (isGeneratingLevel && blocks.length > 0) {
        // Calculate bounding box of all blocks
        const box = new THREE.Box3();
        for (const block of blocks) {
            block.group.updateMatrixWorld(true);
            box.expandByObject(block.group);
        }
        
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Calculate required distance to fit all blocks
        const fov = camera.fov * (Math.PI / 180);
        const aspect = camera.aspect;
        
        // Calculate distance needed for height (with extra padding for spawn)
        const heightDistance = (size.y + SPAWN_ZOOM_PADDING) / (2 * Math.tan(fov / 2));
        
        // Calculate distance needed for width/depth (with extra padding for spawn)
        const baseDiagonal = Math.sqrt(size.x * size.x + size.z * size.z);
        const widthDistance = (baseDiagonal + SPAWN_ZOOM_PADDING) / (2 * Math.tan(fov / 2) * aspect);
        
        // Use the larger distance and apply multiplier for extra zoom out
        const requiredDistance = Math.max(heightDistance, widthDistance) * SPAWN_ZOOM_MULTIPLIER;
        targetRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, requiredDistance));
    }
    
    // Smooth interpolation with heavier feel (momentum/inertia)
    // Lower smoothing = slower acceleration/deceleration = heavier feel
    const smoothing = isGeneratingLevel ? 0.25 : 0.04; // Much slower during gameplay for heavy feel
    currentRadius += (targetRadius - currentRadius) * smoothing;
    currentAzimuth += (targetAzimuth - currentAzimuth) * smoothing;
    currentElevation += (targetElevation - currentElevation) * smoothing;
    
    // Update camera position
    updateCameraPosition();
    
    // Update lights to follow camera angle
    updateLightsForCamera(lights, currentAzimuth, currentElevation, towerCenter.clone().add(towerPositionOffset));
    
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
        
        // Update melt animations (for blocks being removed)
        // Check ALL blocks, not just non-removed ones
        // Update melt animations (for blocks being removed)
        // Check ALL blocks, not just non-removed ones
        for (const block of blocks) {
            if (block.updateMeltAnimation && block.removalStartTime && !block.isRemoved) {
                try {
                    block.updateMeltAnimation(deltaTime);
                } catch (e) {
                    console.error('Error updating melt animation:', e, block);
                }
            }
        }
        
        // Periodically check for blocks that lost support (continuous monitoring)
        if (currentTime - lastSupportCheckTime > SUPPORT_CHECK_INTERVAL) {
            lastSupportCheckTime = currentTime;
            checkAndTriggerFalling(blocks);
        }
        
        // Clean up removed blocks and update solution tracking
        for (let i = blocks.length - 1; i >= 0; i--) {
            const block = blocks[i];
            
            // Melt animation cleanup is handled in updateMeltAnimation function
            
            if (block.isRemoved) {
                // Ensure block is removed from towerGroup (in case remove() didn't work)
                if (block.group.parent) {
                    block.group.parent.remove(block.group);
                }
                
                // Clean up physics body if it exists
                if (block.physicsBody && block.physicsBody.body) {
                    import('./physics.js').then(({ removePhysicsBody }) => {
                        removePhysicsBody(physics, block.physicsBody.body);
                    });
                }
                
                // Block was removed (fell off) - advance solution if we're tracking
                if (window.puzzleSolution && window.solutionStep < window.puzzleSolution.length) {
                    window.solutionStep++;
                    // Update highlight after a short delay to ensure cleanup is done
                    setTimeout(() => {
                        highlightNextBlock();
                    }, 100);
                }
                
                // Remove from move history if present
                moveHistory = moveHistory.filter(m => m.block !== block);
                
                blocks.splice(i, 1);
            }
        }
        
        // Check for level completion (all blocks cleared)
        // Only check if not generating a new level and level complete hasn't been shown yet
        if (blocks.length === 0 && currentLevel >= 0 && !isGeneratingLevel && !levelCompleteShown) {
            levelCompleteShown = true;
            stopTimer(); // Stop timer when level is complete
            // Save progress for the next level (currentLevel + 1) since they'll advance
            // This ensures progress is saved even if they close the browser before clicking "Next Level"
            // We save the next level directly to localStorage without modifying currentLevel
            try {
                const nextLevel = currentLevel + 1;
                localStorage.setItem(STORAGE_KEY, nextLevel.toString());
                // Also update highest level if needed
                const highestLevel = parseInt(localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) || '0', 10);
                if (nextLevel > highestLevel) {
                    localStorage.setItem(STORAGE_HIGHEST_LEVEL_KEY, nextLevel.toString());
                }
                console.log(`Progress saved: Level ${nextLevel} (completed level ${currentLevel})`);
            } catch (e) {
                console.warn('Failed to save progress on level completion:', e);
            }
            showLevelCompleteModal(currentLevel);
        }
        
    }
    
    renderer.render(scene, camera);
}

// Test function to verify block counts across levels
window.testBlockCounts = async function(maxLevel = 5) {
    console.log('🧪 Testing block counts for levels 0-' + maxLevel);
    console.log('='.repeat(60));
    
    const results = [];
    
    for (let level = 0; level <= maxLevel; level++) {
        const targetCount = getBlocksForLevel(level);
        console.log(`\n📊 Level ${level}: Target = ${targetCount}`);
        
        // Generate the level
        await generateSolvablePuzzle(level);
        
        // Wait a bit for placement to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const actualCount = blocks.length;
        const match = actualCount === targetCount;
        
        results.push({
            level,
            target: targetCount,
            actual: actualCount,
            match,
            difference: targetCount - actualCount
        });
        
        if (match) {
            console.log(`✅ Level ${level}: PASS (${actualCount} blocks)`);
        } else {
            console.error(`❌ Level ${level}: FAIL - Expected ${targetCount}, got ${actualCount} (difference: ${targetCount - actualCount})`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 SUMMARY:');
    const passed = results.filter(r => r.match).length;
    const failed = results.filter(r => !r.match).length;
    console.log(`✅ Passed: ${passed}/${results.length}`);
    console.log(`❌ Failed: ${failed}/${results.length}`);
    
    if (failed > 0) {
        console.log('\n❌ Failed levels:');
        results.filter(r => !r.match).forEach(r => {
            console.log(`  Level ${r.level}: Expected ${r.target}, got ${r.actual} (diff: ${r.difference})`);
        });
    }
    
    return results;
};

animate();

