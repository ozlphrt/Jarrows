import * as THREE from 'three';
import { initPhysics, createPhysicsBlock, updatePhysics, isPhysicsStepping, hasPendingOperations, isPhysicsProcessing, removePhysicsBody } from './physics.js';
import { Block } from './Block.js';
import { createLights, createGrid, setGradientBackground, setupFog } from './scene.js';
import { validateStructure, validateSolvability, calculateDifficulty, getBlockCells, fixOverlappingBlocks, checkAndFixAllOverlaps, canBlockExit } from './puzzle_validation.js';
import { initStats, startLevelStats, trackMove, trackSpin, trackBlockRemoved, completeLevel, getLevelComparison, getElapsedTime } from './stats/stats.js';
import { updateLevelCompleteModal, showOfflineIndicator, hideOfflineIndicator, showPersonalHistoryModal, showProfileModal } from './stats/statsUI.js';
import { isOnline, isLocalOnlyMode } from './stats/statsAPI.js';
import { initAudio, playSound, toggleAudio, isAudioEnabled } from './audio.js';
import { getInfernoDifficultyConfig } from './inferno_difficulty.js';
import { showMilestoneModal, showFeatureModal, showLevelUpdateModal } from './inferno_modals.js';
import appVersionRaw from '../VERSION?raw';

// Build-time constant injected by Vite (see vite.config.js). Falls back to '' if not defined.
// eslint-disable-next-line no-undef
const JARROWS_GIT_SHA = (typeof __JARROWS_GIT_SHA__ !== 'undefined') ? __JARROWS_GIT_SHA__ : '';

function parseVersionString(raw) {
    if (!raw) return '';
    // VERSION file on Windows may accidentally be saved as UTF-16 (BOM + NUL bytes).
    // Normalize: drop NULs, BOMs, and non-printable chars, then extract the numeric version.
    const normalized = String(raw)
        .replace(/\u0000/g, '')
        .replace(/^\uFEFF/, '')
        .replace(/[^\x20-\x7E]/g, '')
        .trim();
    const m = normalized.match(/[0-9]+(?:\.[0-9]+)*/);
    return m ? m[0] : '';
}

function sanitizeGitSha(raw) {
    if (!raw) return '';
    const s = String(raw).trim().match(/[0-9a-f]+/i);
    return s ? s[0].slice(0, 12) : '';
}

// Silent debug telemetry helper (fails silently to avoid console noise)
function debugTelemetry(data) {
    // Only attempt if explicitly enabled via URL param or localStorage
    const debugEnabled = typeof window !== 'undefined' && (
        new URLSearchParams(window.location.search).has('debug') ||
        localStorage.getItem('jarrows_debug_telemetry') === '1'
    );
    if (!debugEnabled) return;
    
    // Silently fail - don't show errors in console
    fetch('http://127.0.0.1:7242/ingest/0b1046b5-cc01-4f54-9eee-ab789885ebe3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(() => { /* Silently ignore */ });
}

// Platform/perf heuristics (battery-focused, especially for iPhone ProMotion)
const isIOS = (() => {
    try {
        return (
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        );
    } catch {
        return false;
    }
})();
const isMobileLike = (() => {
    try {
        return matchMedia('(pointer: coarse)').matches;
    } catch {
        return false;
    }
})();

// Quality presets (Battery / Balanced / Performance)
function loadQualityPreset() {
    try {
        const saved = localStorage.getItem('jarrows_quality');
        return (saved === 'battery' || saved === 'balanced' || saved === 'performance') ? saved : 'balanced';
    } catch {
        return 'balanced';
    }
}

function getQualityCaps(preset) {
    // iPhone 13 Pro tuned breakeven:
    // - Performance: 60fps active, higher DPR cap (sharper)
    // - Balanced: 60fps active, moderate DPR cap (recommended default)
    // - Battery: keep interaction smooth (60fps), save power via lower DPR + aggressive idle downclock + less shadow work
    //
    // These are caps; actual FPS depends on device load.
    if (preset === 'performance') {
        return { activeFps: isIOS ? 60 : 60, idleFps: isIOS ? 30 : 30, dprCap: isIOS ? 2.0 : 2 };
    }
    if (preset === 'battery') {
        // Battery mode: avoid the very noticeable "30fps drag" feeling; instead reduce internal resolution a bit
        // and rely on idle downclock + shadow gating for battery savings.
        return { activeFps: isIOS ? 60 : 60, idleFps: isIOS ? 10 : 30, dprCap: isIOS ? 1.45 : 2 };
    }
    // balanced (default)
    return { activeFps: isIOS ? 60 : 60, idleFps: isIOS ? 24 : 30, dprCap: isIOS ? 1.6 : 2 };
}

let qualityPreset = loadQualityPreset();
let qualityCaps = getQualityCaps(qualityPreset);

// Check quality preset from localStorage for renderer initialization (before renderer is created)
const initialQualityPreset = qualityPreset;

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
// Expose app version (from root VERSION file) for Settings UI
window.jarrowsVersion = parseVersionString(appVersionRaw);
window.jarrowsGitSha = sanitizeGitSha(JARROWS_GIT_SHA);

// Global arrow style
let currentArrowStyle = 2;


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    // AA is expensive on mobile and in battery mode; rely on lower DPR + post AA from browser compositor
    antialias: !isMobileLike && initialQualityPreset !== 'battery',
    powerPreference: (initialQualityPreset === 'battery' || isIOS || isMobileLike) ? 'low-power' : 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Limit pixel ratio via quality preset (keeps UI size the same; changes internal render resolution)
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qualityCaps.dprCap));
renderer.shadowMap.enabled = true;
// On iOS, prefer cheaper PCF shadows over PCFSoft (significant battery win)
renderer.shadowMap.type = isIOS ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
// Default: keep shadows "frozen" unless we explicitly need updates (camera interaction / falling blocks).
// We'll toggle autoUpdate during the animation loop.
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
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
let isRightDraggingFraming = false;

// Mouse controls for camera orbit
renderer.domElement.addEventListener('mousedown', (event) => {
    // Left-click: orbit (azimuth/elevation)
    if (event.button === 0) {
        // CRITICAL: Sync current values to target values when user starts dragging
        // This prevents camera jump when rotation starts (current and target may be out of sync)
        currentAzimuth = targetAzimuth;
        currentElevation = targetElevation;
        currentRadius = targetRadius;
        
        isDraggingCamera = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        // Track for block click detection
        mouseDownPos = { x: event.clientX, y: event.clientY };
        mouseDownTime = performance.now();
        isCameraDragging = false;
        wasCameraDragging = false; // Reset drag flag on new mouse down
        isRightDraggingFraming = false;
        return;
    }

    // Right-click: framing tilt (matches dual-touch non-pinch drag)
    if (event.button === 2) {
        event.preventDefault();
        isRightDraggingFraming = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        isDraggingCamera = false;
        // Prevent block click selection after a framing drag
        isCameraDragging = true;
        wasCameraDragging = true;
    }
}, { passive: false });

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
    } else if (isRightDraggingFraming) {
        const dy = event.clientY - lastMouseY;
        lastMouseY = event.clientY;

        // World-space framing tilt (look-at offset on +Y)
        const next = clampFramingOffsetY(framingOffsetY + (dy * TWO_FINGER_FRAMING_SENSITIVITY));
        if (next !== framingOffsetY) {
            framingOffsetY = next;
            if (typeof window !== 'undefined') window.framingOffsetY = framingOffsetY;
            updateCameraPosition();
            try {
                localStorage.setItem('jarrows_framing', framingOffsetY.toString());
            } catch {
                // ignore
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
    if (event.button === 2) {
        isRightDraggingFraming = false;
    }
    
    // Note: Don't reset wasCameraDragging here - let click handler check it first
    // Reset drag state after a short delay to allow click handler to check
    mouseDownPos = null;
    isCameraDragging = false;
});

renderer.domElement.addEventListener('mouseleave', () => {
    isDraggingCamera = false;
    isRightDraggingFraming = false;
    mouseDownPos = null;
    isCameraDragging = false;
    wasCameraDragging = false; // Reset on mouse leave
});

// Disable the native context menu on the canvas so right-drag feels like an intentional control.
renderer.domElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
}, { passive: false });

// Mouse wheel for zoom
renderer.domElement.addEventListener('wheel', (event) => {
    event.preventDefault();
    
    // CRITICAL: Sync current radius to target radius when user starts zooming
    // This prevents camera jump when zoom starts (current and target may be out of sync)
    currentRadius = targetRadius;
    
    const zoomSpeed = 0.1; // 10% per scroll step
    const zoomFactor = 1 + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed);
    targetRadius *= zoomFactor;
    targetRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, targetRadius));
    // Sync smoothed auto-zoom radius to manual zoom so auto-zoom doesn't fight when it re-enables
    smoothedAutoZoomRadius = targetRadius;
    
    // Disable auto-zoom when user manually zooms
    autoZoomDisabledUntilMs = performance.now() + AUTO_ZOOM_DISABLE_DURATION_MS;
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
// Target tower position offset for smooth interpolation (prevents camera jumps)
let targetTowerPositionOffset = new THREE.Vector3(0, 0, 0);

// Function to center the tower (reset pan offset)
function centerTower() {
    towerPositionOffset.set(0, 0, 0);
    targetTowerPositionOffset.set(0, 0, 0);
}

// Function to vertically center the tower based on block positions
function centerTowerVertically() {
    // #region agent log
    debugTelemetry({location:'main.js:centerTowerVertically:entry',message:'centerTowerVertically called',data:{blocksCount:blocks.length,isGeneratingLevel:isGeneratingLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
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
    
    // #region agent log
    const oldOffsetY = towerPositionOffset.y;
    // #endregion
    
    // Adjust target tower position offset to center vertically (negative because we want to move the tower down)
    // Use target value for smooth interpolation instead of immediate change
    targetTowerPositionOffset.y = -centerY;
    
    // Note: Actual towerPositionOffset.y will be interpolated smoothly in the animation loop
    // This prevents camera jumps when recentering
    
    // #region agent log
    debugTelemetry({location:'main.js:centerTowerVertically:exit',message:'Tower offset target changed',data:{minY:minY.toFixed(2),maxY:maxY.toFixed(2),centerY:centerY.toFixed(2),oldOffsetY:oldOffsetY.toFixed(2),newTargetOffsetY:targetTowerPositionOffset.y.toFixed(2),currentOffsetY:towerPositionOffset.y.toFixed(2),deltaY:(targetTowerPositionOffset.y-oldOffsetY).toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    
    console.log(`Tower vertically centered: minY=${minY.toFixed(2)}, maxY=${maxY.toFixed(2)}, centerY=${centerY.toFixed(2)}, targetOffsetY=${targetTowerPositionOffset.y.toFixed(2)}, currentOffsetY=${towerPositionOffset.y.toFixed(2)}`);
}

// Camera system constants
const MIN_RADIUS = 5;
const MAX_RADIUS = 50;
const MIN_ELEVATION = -Math.PI / 2 + 0.1;
const MAX_ELEVATION = Math.PI / 2 - 0.1;
const ZOOM_PADDING = 2;
const AUTO_ZOOM_MIN_BOUNDING_SIZE = 3; // Minimum bounding box size to prevent zooming in too much with few blocks
const SPAWN_ZOOM_PADDING = 4; // Extra padding during spawn to show all blocks
const SPAWN_ZOOM_MULTIPLIER = 1.3; // Additional multiplier for spawn zoom
// Auto-zoom multiplier: platform-aware - larger on desktop (zoom out more), smaller on mobile (zoom in more)
// Desktop needs more zoom-out to prevent blocks going out of frame
// Mobile can zoom in more to reduce wasted space on sides
const AUTO_ZOOM_MULTIPLIER_DESKTOP = 1.4; // Desktop: minimal zoom to keep all blocks visible with minimal padding
const AUTO_ZOOM_MULTIPLIER_MOBILE = 0.75; // Mobile: minimal zoom to keep all blocks visible with minimal padding
// Desktop-specific padding multiplier to ensure all blocks stay visible
const DESKTOP_ZOOM_PADDING_MULTIPLIER = 1.15; // Minimal padding for desktop to keep all blocks visible
// During generation, computing a world-space bounding box by expanding each block object
// (updateMatrixWorld + expandByObject) is expensive. Throttle it to avoid long rAF frames.
const SPAWN_ZOOM_UPDATE_INTERVAL_MS = 120;
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
    // #region agent log
    debugTelemetry({location:'main.js:calculateInitialCameraPosition:entry',message:'Initial camera position calculation',data:{isGeneratingLevel:isGeneratingLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'});
    // #endregion
    // Ensure camera aspect is up to date
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Base plate dimensions
    const basePlateSize = gridSize * cubeSize; // 7 units
    const basePlateDiagonal = Math.sqrt(basePlateSize * basePlateSize * 2);
    
    // Calculate required distance to fit base plate in view
    // Account for both horizontal and vertical FOV
    const fov = camera.fov * (Math.PI / 180); // Convert to radians
    const aspect = camera.aspect;
    
    // Calculate for horizontal (width/depth) - use diagonal and aspect ratio
    const horizontalDistance = (basePlateDiagonal + ZOOM_PADDING) / (2 * Math.tan(fov / 2) * aspect);
    
    // Calculate for vertical (height) - assume initial tower height estimate
    const estimatedTowerHeight = 10; // Conservative estimate for initial positioning
    const verticalDistance = (estimatedTowerHeight + ZOOM_PADDING) / (2 * Math.tan(fov / 2));
    
    // Use the larger distance with safety margin to ensure everything fits
    const requiredDistance = Math.max(horizontalDistance, verticalDistance) * 1.3; // 30% safety margin
    
    // Set initial values
    cameraRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, requiredDistance));
    cameraElevation = Math.PI / 4; // 45°
    cameraAzimuth = Math.PI / 4; // 45° (diagonal view)
    
    // #region agent log
    const oldTargetRadius = targetRadius;
    // #endregion
    
    // Set target and current values
    targetRadius = cameraRadius;
    targetAzimuth = cameraAzimuth;
    targetElevation = cameraElevation;
    currentRadius = cameraRadius;
    currentAzimuth = cameraAzimuth;
    currentElevation = cameraElevation;
    // Initialize smoothed auto-zoom radius
    smoothedAutoZoomRadius = cameraRadius;
    
    // #region agent log
    debugTelemetry({location:'main.js:calculateInitialCameraPosition:exit',message:'Initial camera position set',data:{basePlateDiagonal:basePlateDiagonal.toFixed(2),horizontalDistance:horizontalDistance.toFixed(2),verticalDistance:verticalDistance.toFixed(2),requiredDistance:requiredDistance.toFixed(2),oldTargetRadius:oldTargetRadius.toFixed(2),newTargetRadius:targetRadius.toFixed(2),currentRadius:currentRadius.toFixed(2),elevation:(cameraElevation*180/Math.PI).toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'});
    // #endregion
}

// Update camera position from spherical coordinates
const _effectiveTowerCenter = new THREE.Vector3();
const _lookAtOffset = new THREE.Vector3();
const _lookAtTarget = new THREE.Vector3();
const _towerGroupWorldCenter = new THREE.Vector3();
const _spawnZoomBox = new THREE.Box3();
const _spawnZoomSize = new THREE.Vector3();
let lastSpawnZoomUpdateMs = 0;

// Auto-zoom bounding box and timing (for gameplay, excluding catapulted blocks)
const _autoZoomBox = new THREE.Box3();
const _autoZoomSize = new THREE.Vector3();
const AUTO_ZOOM_UPDATE_INTERVAL_MS = 200; // Throttle expensive bounding box calculations
let lastAutoZoomUpdateMs = 0;
// User override: disable auto-zoom after manual zoom for this duration
const AUTO_ZOOM_DISABLE_DURATION_MS = 5000; // 5 seconds
let autoZoomDisabledUntilMs = 0; // Timestamp when auto-zoom should re-enable
// Smoothed auto-zoom target: auto-zoom calculates desired radius, we smooth it before setting targetRadius
let smoothedAutoZoomRadius = cameraRadius;

// Camera framing (tilt) via look-at offset in WORLD space.
// Spaces:
// - towerCenter/towerPositionOffset: world
// - lookAt target: world
// - Matrix trace: vec_ndc = projection * view * model * vec_local
const DEFAULT_FRAMING_OFFSET_Y = 6.5;
const MIN_FRAMING_OFFSET_Y = 2.5;
const MAX_FRAMING_OFFSET_Y = 10.5;
// Two-finger drag (non-pinch): pixels → world-Y offset mapping:
// value_next = clamp(value_prev + sensitivity * delta_pixels, min, max)
const TWO_FINGER_FRAMING_SENSITIVITY = 0.02; // world-units per pixel

function clampFramingOffsetY(value) {
    return Math.max(MIN_FRAMING_OFFSET_Y, Math.min(MAX_FRAMING_OFFSET_Y, value));
}

function loadFramingOffsetY() {
    try {
        const saved = localStorage.getItem('jarrows_framing');
        const parsed = saved !== null ? parseFloat(saved) : NaN;
        if (!Number.isFinite(parsed)) return DEFAULT_FRAMING_OFFSET_Y;
        return clampFramingOffsetY(parsed);
    } catch {
        return DEFAULT_FRAMING_OFFSET_Y;
    }
}

let framingOffsetY = loadFramingOffsetY();
// Expose for debugging and any legacy consumers.
if (typeof window !== 'undefined') {
    window.framingOffsetY = framingOffsetY;
}

function updateCameraPosition() {
    // Calculate effective tower center (with offset)
    _effectiveTowerCenter.copy(towerCenter).add(towerPositionOffset);
    
    // Convert spherical to Cartesian coordinates
    const x = currentRadius * Math.sin(currentElevation) * Math.cos(currentAzimuth);
    const y = currentRadius * Math.cos(currentElevation);
    const z = currentRadius * Math.sin(currentElevation) * Math.sin(currentAzimuth);
    
    // Set camera position
    camera.position.set(
        _effectiveTowerCenter.x + x,
        _effectiveTowerCenter.y + y,
        _effectiveTowerCenter.z + z
    );
    
    // Look at a point above tower center to move base plate down in frame (closer to bottom).
    // Two-finger drag adjusts this by changing the WORLD-space look-at target.
    _lookAtOffset.set(0, framingOffsetY, 0);
    _lookAtTarget.copy(_effectiveTowerCenter).add(_lookAtOffset);
    camera.lookAt(_lookAtTarget);
    
    // Update tower group position
    towerGroup.position.copy(towerCenter.clone().add(towerPositionOffset));
    towerGroup.rotation.set(0, 0, 0); // Always locked to zero
    
    // #region agent log
    // REMOVED: Per-frame telemetry call was causing ERR_INSUFFICIENT_RESOURCES
    // This was making fetch requests every frame, overwhelming the browser
    // If telemetry is needed, use debugTelemetry() with proper throttling instead
    // const cameraPosDelta = camera.position.distanceTo(oldCameraPos);
    // const lookAtDelta = _lookAtTarget.distanceTo(oldLookAtTarget);
    // if (cameraPosDelta > 0.1 || lookAtDelta > 0.1) {
    //     fetch('http://127.0.0.1:7242/ingest/0b1046b5-cc01-4f54-9eee-ab789885ebe3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:updateCameraPosition',message:'Camera position updated',data:{oldPosX:oldCameraPos.x.toFixed(2),oldPosY:oldCameraPos.y.toFixed(2),oldPosZ:oldCameraPos.z.toFixed(2),newPosX:camera.position.x.toFixed(2),newPosY:camera.position.y.toFixed(2),newPosZ:camera.position.z.toFixed(2),posDelta:cameraPosDelta.toFixed(2),oldLookAtX:oldLookAtTarget.x.toFixed(2),oldLookAtY:oldLookAtTarget.y.toFixed(2),oldLookAtZ:oldLookAtTarget.z.toFixed(2),newLookAtX:_lookAtTarget.x.toFixed(2),newLookAtY:_lookAtTarget.y.toFixed(2),newLookAtZ:_lookAtTarget.z.toFixed(2),lookAtDelta:lookAtDelta.toFixed(2),towerOffsetY:towerPositionOffset.y.toFixed(2),currentRadius:currentRadius.toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // }
    // #endregion
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
    
    // Store target position for smooth interpolation (prevents jitter in battery mode)
    targetKeyLightPosition = center.clone().add(keyLightPos);
    
    // Fill light: minimal fill light for dramatic shadows (positioned opposite to key light)
    const fillLightDistance = 25;
    let fillLightPos = cameraDirection.clone().multiplyScalar(-fillLightDistance);
    fillLightPos.y += 6; // Keep it elevated but lower for more shadow contrast
    
    // Ensure minimum 30° angle above base plate
    const fillHorizontalDist = Math.sqrt(fillLightPos.x * fillLightPos.x + fillLightPos.z * fillLightPos.z);
    const minFillY = fillHorizontalDist * minTanAngle;
    if (fillLightPos.y < minFillY) {
        fillLightPos.y = minFillY;
    }
    
    targetFillLightPosition = center.clone().add(fillLightPos);
}

// Initialize Rapier physics
const physics = await initPhysics();

// Initialize stats system
await initStats();

// Initialize audio system
await initAudio();

// Set up offline indicator
// In strict local-only mode, we don't show any connectivity banner.
if (!isLocalOnlyMode()) {
    if (!isOnline()) {
        showOfflineIndicator();
    }
    window.addEventListener('online', () => {
        hideOfflineIndicator();
    });
    window.addEventListener('offline', () => {
        showOfflineIndicator();
    });
}

// History button should work immediately when the level-complete modal appears.
// (The modal is shown before async stats processing finishes.)
const historyButton = document.getElementById('history-button');
if (historyButton) {
    historyButton.addEventListener('click', () => showPersonalHistoryModal({ focusLevel: currentLevel }));
}

const profileToggle = document.getElementById('profile-toggle');
if (profileToggle) {
    profileToggle.addEventListener('click', () => {
        showProfileModal();
        // Hide settings menu if open
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu) settingsMenu.style.display = 'none';
    });
}

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

// Expose debug function to jump to a specific level
window.debugJumpToLevel = async (level) => {
    if (isGeneratingLevel) {
        console.warn('Cannot jump to level while generating');
        return;
    }
    if (isNaN(level) || level < 0) {
        console.error('Invalid level:', level);
        return;
    }
    console.log(`[Debug] Jumping to level ${level}`);
    setCurrentLevel(level);
    saveProgress();
    await generateSolvablePuzzle(level, false);
};

const directions = [
    {x: 1, z: 0},   // East
    {x: -1, z: 0},  // West
    {x: 0, z: 1},   // South
    {x: 0, z: -1}   // North
];

// Leveling system
let currentLevel = 0;
let _isStartingNewGame = false; // Flag to allow setting currentLevel to 0 only when starting new game

// Safeguard function to set currentLevel - prevents accidental reset to 0
function getStorageKey() {
    if (isTimeChallengeMode()) return STORAGE_KEY_TIME_CHALLENGE;
    if (isInfernoMode()) return STORAGE_KEY_INFERNO;
    return STORAGE_KEY;
}

function setCurrentLevel(newLevel, allowZero = false) {
    if (newLevel === 0 && !allowZero && !_isStartingNewGame) {
        const stack = new Error().stack;
        console.error(`🚨 BLOCKED: Attempted to set currentLevel to 0!`);
        console.error(`  Current level: ${currentLevel}`);
        console.error(`  New level: ${newLevel}`);
        console.error(`  Stack trace:`, stack);
        // Try to recover from localStorage
        const storageKey = getStorageKey();
        const savedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
        if (savedLevel > 0) {
            console.warn(`🚨 Recovery: Using saved level ${savedLevel} instead of 0`);
            currentLevel = savedLevel;
            return;
        }
        console.error(`🚨 Cannot recover - all sources invalid. Blocking set to 0.`);
        return; // Block the assignment
    }
    currentLevel = newLevel;
}
let isGeneratingLevel = false; // Prevent multiple simultaneous level generations
let levelCompleteShown = false; // Prevent showing level complete modal multiple times

// Remove mode state
let removeModeActive = false;

// Random spin counter (3 spins per game)
let remainingSpins = 3;

// Game mode (persisted)
const GAME_MODE_KEY = 'jarrows_game_mode'; // 'free_flow' | 'time_challenge' | 'inferno'
const TIME_RULES_SEEN_KEY = 'jarrows_time_rules_seen';
const INFERNO_RULES_SEEN_KEY = 'jarrows_inferno_rules_seen';
const MODE_FREE_FLOW = 'free_flow';
const MODE_TIME_CHALLENGE = 'time_challenge';
const MODE_INFERNO = 'inferno';

let gameMode = MODE_FREE_FLOW;

// Time Challenge (survival) state
const TIME_CHALLENGE_START_SECONDS = 30;
let timeLeftSec = TIME_CHALLENGE_START_SECONDS; // carryover across levels in this mode
let timeChallengeActive = false;
let timeChallengeRemovals = 0; // blocks removed in current run
let timeChallengeResidualSec = 0; // Time left from previous level (carries over to next level)
let timeChallengeInitialTime = 0; // Initial time when level started (for calculating time collected)
let timeChallengeTimeCollected = 0; // Total time collected from block removals this level
let timeChallengeTimeCollectedAllTime = 0; // Cumulative time collected across all levels in this run
let timeChallengeTimeCarriedOverAllTime = 0; // Cumulative time carried over across all levels in this run
let timeChallengeSpinCost = 0; // Total time spent on spins this level
let timeChallengeCarriedOverHistory = []; // Array of { level, carriedOver, unused, collected, spin } for graph
let timeFreezeReasons = new Set();
let timeUpShown = false;

// Progress persistence using localStorage
const STORAGE_KEY = 'jarrows_progress';
const STORAGE_KEY_TIME_CHALLENGE = 'jarrows_progress_time_challenge'; // Separate key for Time Challenge
const STORAGE_KEY_INFERNO = 'jarrows_progress_inferno'; // Separate key for Inferno
const STORAGE_HIGHEST_LEVEL_KEY = 'jarrows_highest_level';
const STORAGE_VERSION_KEY = 'jarrows_storage_version';
const RESET_FLAG_KEY = 'jarrows_reset_completed';
const CURRENT_STORAGE_VERSION = '2.0'; // Increment to reset all users

// One-time reset: Clear all existing progress for all users
// This ensures everyone starts from level 1
// Uses a flag to ensure reset only happens once per version
// NOTE: This function is now deprecated - we preserve user progress by default
function resetAllProgress() {
    try {
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const resetFlag = localStorage.getItem(RESET_FLAG_KEY);
        const hasExistingProgress = localStorage.getItem(STORAGE_KEY) !== null || 
                                    localStorage.getItem(STORAGE_KEY_TIME_CHALLENGE) !== null ||
                                    localStorage.getItem(STORAGE_KEY_INFERNO) !== null ||
                                    localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) !== null;
        
        // Only reset if user has no existing progress (new user)
        // Otherwise, just update version without clearing
        if (storedVersion !== CURRENT_STORAGE_VERSION) {
            if (!hasExistingProgress) {
                // New user - set version and flag
                console.log('New user - setting storage version');
                localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
                localStorage.setItem(RESET_FLAG_KEY, 'true');
                return false; // No reset needed (no progress to reset)
            } else {
                // Existing user - preserve progress, just update version
                console.log('Updating storage version, preserving existing progress');
                localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
                localStorage.setItem(RESET_FLAG_KEY, 'true');
                return false; // No reset - progress preserved
            }
        }
    } catch (e) {
        console.warn('Failed to update storage version:', e);
    }
    return false; // No reset needed
}

function isTimeChallengeMode() {
    return gameMode === MODE_TIME_CHALLENGE;
}

function isInfernoMode() {
    return gameMode === MODE_INFERNO;
}

function isTimeBasedMode() {
    return isTimeChallengeMode() || isInfernoMode();
}

function setBodyModeClass() {
    try {
        // Remove all mode classes first
        document.body.classList.remove('mode-time-challenge', 'mode-inferno', 'mode-free-flow');
        
        // Add appropriate mode class
        if (isTimeChallengeMode()) {
            document.body.classList.add('mode-time-challenge');
        } else if (isInfernoMode()) {
            document.body.classList.add('mode-inferno');
        } else {
            document.body.classList.add('mode-free-flow');
        }
        
        // Update game mode display
        updateGameModeDisplay();
    } catch {
        // ignore
    }
}

function updateGameModeDisplay() {
    try {
        const modeValueEl = document.getElementById('game-mode-value');
        if (!modeValueEl) return;
        
        let displayText = 'FREE FLOW';
        if (isTimeChallengeMode()) {
            displayText = 'TIME CHALLENGE';
        } else if (isInfernoMode()) {
            displayText = 'INFERNO';
        }
        
        modeValueEl.textContent = displayText;
    } catch {
        // ignore
    }
}

function loadGameMode() {
    try {
        const saved = localStorage.getItem(GAME_MODE_KEY);
        if (saved === MODE_TIME_CHALLENGE) return MODE_TIME_CHALLENGE;
        if (saved === MODE_INFERNO) return MODE_INFERNO;
        return MODE_FREE_FLOW;
    } catch {
        return MODE_FREE_FLOW;
    }
}

function saveGameMode(mode) {
    try {
        localStorage.setItem(GAME_MODE_KEY, mode);
    } catch {
        // ignore
    }
}

function setTimeFrozen(reason, frozen) {
    if (!reason) return;
    if (frozen) timeFreezeReasons.add(reason);
    else timeFreezeReasons.delete(reason);
}

function isTimeFrozen() {
    return timeFreezeReasons.size > 0;
}

// Animate time addition smoothly over duration
let timeAnimationActive = false;
let timeAnimationStart = 0;
let timeAnimationTarget = 0;
let timeAnimationDuration = 600; // 600ms animation

function animateTimeAddition(deltaSeconds) {
    if (!isTimeBasedMode() || !timeChallengeActive) {
        console.log('[Time Challenge] Animation skipped - mode check failed:', { isTimeChallengeMode: isTimeChallengeMode(), isInfernoMode: isInfernoMode(), timeChallengeActive });
        return;
    }
    
    const deltaInt = Math.trunc(deltaSeconds);
    if (deltaInt === 0) {
        console.log('[Time Challenge] Animation skipped - delta is 0');
        return;
    }
    
    // If animation is already running, add to target
    if (timeAnimationActive) {
        console.log('[Time Challenge] Animation already running, adding to target:', deltaInt);
        timeAnimationTarget += deltaInt;
        return;
    }
    
    // Start new animation
    console.log('[Time Challenge] Starting animation:', { deltaInt, from: timeLeftSec, to: timeLeftSec + deltaInt });
    timeAnimationActive = true;
    timeAnimationStart = timeLeftSec;
    timeAnimationTarget = timeLeftSec + deltaInt;
    
    const startTime = performance.now();
    
    function animate(currentTime) {
        if (!timeAnimationActive) {
            // Animation was cancelled, exit
            return;
        }
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / timeAnimationDuration, 1.0);
        
        // Ease-out curve for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate time value (countdown is paused during animation, so safe to set directly)
        const newTime = timeAnimationStart + (timeAnimationTarget - timeAnimationStart) * eased;
        timeLeftSec = Math.max(0, newTime); // Ensure non-negative
        // Force immediate update during animation (bypass throttling)
        updateTimerDisplay();
        // Also update lastTimerUiMs to prevent throttling from skipping this update
        lastTimerUiMs = currentTime;
        
        if (progress < 1.0) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete - snap to final value
            timeLeftSec = Math.max(0, timeAnimationTarget);
            updateTimerDisplay();
            timeAnimationActive = false;
            console.log('[Time Challenge] Animation complete, final time:', timeLeftSec);
            
            // Check if there's more to animate (if target was updated during animation)
            // This shouldn't happen since we add to target, but just in case
            const finalTarget = timeAnimationTarget;
            if (finalTarget > timeLeftSec) {
                const remaining = finalTarget - timeLeftSec;
                if (remaining > 0.1) { // Small threshold to avoid infinite loops
                    console.log('[Time Challenge] More time to animate, continuing:', remaining);
                    animateTimeAddition(remaining);
                }
            }
        }
    }
    
    // Start animation immediately
    requestAnimationFrame(animate);
}

function flashTimerDelta(deltaSeconds) {
    const timerEl = document.getElementById('timer-value');
    const deltaEl = document.getElementById('timer-delta');
    if (!timerEl || !deltaEl) return;

    const deltaInt = Math.trunc(deltaSeconds);
    if (deltaInt === 0) return;

    const isGain = deltaInt > 0;
    const klass = isGain ? 'timer-gain' : 'timer-loss';

    timerEl.classList.remove('timer-gain', 'timer-loss');
    // Force reflow to restart animation
    void timerEl.offsetWidth;
    timerEl.classList.add(klass);

    deltaEl.textContent = (isGain ? `+${deltaInt}` : `${deltaInt}`) + 's';
    deltaEl.style.color = isGain ? '#7CFF9A' : '#FF7C7C';
    deltaEl.classList.remove('show');
    void deltaEl.offsetWidth;
    deltaEl.classList.add('show');
    window.setTimeout(() => deltaEl.classList.remove('show'), 720);
}

function showModeSelectModal() {
    const modal = document.getElementById('mode-select-modal');
    const freeBtn = document.getElementById('mode-pick-free');
    const timeBtn = document.getElementById('mode-pick-time');
    const infernoBtn = document.getElementById('mode-pick-inferno');
    const cancelBtn = document.getElementById('mode-select-cancel');
    if (!modal || !freeBtn || !timeBtn || !infernoBtn) return Promise.resolve(MODE_FREE_FLOW);

    setTimeFrozen('mode_select', true);
    modal.style.display = 'flex';

    return new Promise((resolve) => {
        const cleanup = (mode) => {
            modal.style.display = 'none';
            freeBtn.removeEventListener('click', onFree);
            timeBtn.removeEventListener('click', onTime);
            infernoBtn.removeEventListener('click', onInferno);
            if (cancelBtn) cancelBtn.removeEventListener('click', onCancel);
            setTimeFrozen('mode_select', false);
            resolve(mode);
        };
        const onFree = () => cleanup(MODE_FREE_FLOW);
        const onTime = () => cleanup(MODE_TIME_CHALLENGE);
        const onInferno = () => cleanup(MODE_INFERNO);
        const onCancel = () => cleanup(null); // Return null to indicate cancellation
        freeBtn.addEventListener('click', onFree);
        timeBtn.addEventListener('click', onTime);
        infernoBtn.addEventListener('click', onInferno);
        if (cancelBtn) cancelBtn.addEventListener('click', onCancel);
    });
}

function showTimeRulesModalIfNeeded() {
    const modal = document.getElementById('time-rules-modal');
    const okBtn = document.getElementById('time-rules-ok');
    if (!modal || !okBtn) return;

    let alreadySeen = false;
    try {
        alreadySeen = localStorage.getItem(TIME_RULES_SEEN_KEY) === '1';
    } catch {
        alreadySeen = false;
    }
    if (alreadySeen) return;

    setTimeFrozen('time_rules', true);
    modal.style.display = 'flex';

    const onOk = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', onOk);
        setTimeFrozen('time_rules', false);
        try {
            localStorage.setItem(TIME_RULES_SEEN_KEY, '1');
        } catch {
            // ignore
        }
    };
    okBtn.addEventListener('click', onOk);
}

function showInfernoRulesModalIfNeeded() {
    const modal = document.getElementById('inferno-rules-modal');
    const okBtn = document.getElementById('inferno-rules-ok');
    if (!modal || !okBtn) return;

    let alreadySeen = false;
    try {
        alreadySeen = localStorage.getItem(INFERNO_RULES_SEEN_KEY) === '1';
    } catch {
        alreadySeen = false;
    }
    if (alreadySeen) return;

    setTimeFrozen('inferno_rules', true);
    modal.style.display = 'flex';

    const onOk = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', onOk);
        setTimeFrozen('inferno_rules', false);
        try {
            localStorage.setItem(INFERNO_RULES_SEEN_KEY, '1');
        } catch {
            // ignore
        }
    };
    okBtn.addEventListener('click', onOk);
}

async function ensureModeSelected({ forcePrompt = false } = {}) {
    let mode = loadGameMode();

    let hasKey = true;
    try {
        hasKey = localStorage.getItem(GAME_MODE_KEY) !== null;
    } catch {
        hasKey = true;
    }

    if (forcePrompt || !hasKey) {
        const selectedMode = await showModeSelectModal();
        // If user cancelled (selectedMode is null), keep current mode and return null to indicate cancellation
        if (selectedMode === null) {
            return null; // Indicate cancellation
        }
        mode = selectedMode;
        saveGameMode(mode);
    }

    gameMode = mode;
    setBodyModeClass();

    if (isTimeChallengeMode()) {
        showTimeRulesModalIfNeeded();
    } else if (isInfernoMode()) {
        showInfernoRulesModalIfNeeded();
    }

    // Expose a simple hook for any UI callers
    if (typeof window !== 'undefined') {
        window.jarrowsGameMode = gameMode;
    }

    return gameMode;
}

function timeChallengeResetRun() {
    // This is called when starting a NEW RUN (level 1, fresh start)
    // For new levels within a run, use timeChallengeStartNewLevel() instead
    timeLeftSec = TIME_CHALLENGE_START_SECONDS;
    timeChallengeInitialTime = TIME_CHALLENGE_START_SECONDS;
    timeChallengeTimeCollected = 0;
    timeChallengeTimeCollectedAllTime = 0;
    timeChallengeTimeCarriedOverAllTime = 0;
    timeChallengeSpinCost = 0;
    timeChallengeRemovals = 0;
    timeChallengeResidualSec = 0;
    timeChallengeCarriedOverHistory = []; // Reset history for new run
    timeChallengeActive = true;
    timeUpShown = false;
    setTimeFrozen('time_up', false);
}

function timeChallengeStartNewLevel(blocksArray) {
    // #region agent log
    debugTelemetry({location:'main.js:timeChallengeStartNewLevel:entry',message:'timeChallengeStartNewLevel called',data:{isTimeBasedMode:isTimeBasedMode(),blocksCount:blocksArray?blocksArray.length:0,currentLevel:currentLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
    // #endregion
    if (!isTimeBasedMode()) return;
    
    // Calculate base time by summing actual block lengths
    // Length 1 (Red) = 1 second, Length 2 (Teal) = 2 seconds, Length 3+ (Yellow) = 3 seconds
    let calculatedTime = 0;
    for (const block of blocksArray) {
        calculatedTime += timeChallengeGetColorBonusSeconds(block.length);
    }
    
    const minTime = 30; // Minimum 30 seconds
    
    // Initial time = max(30, sum of block lengths) + residual from previous level
    timeLeftSec = Math.max(minTime, calculatedTime) + timeChallengeResidualSec;
    timeChallengeInitialTime = timeLeftSec; // Track initial time for this level
    // Track carried over time before resetting
    if (timeChallengeResidualSec > 0) {
        timeChallengeTimeCarriedOverAllTime += timeChallengeResidualSec;
    }
    timeChallengeTimeCollected = 0; // Reset time collected counter for this level
    timeChallengeSpinCost = 0; // Reset spin cost counter for this level
    timeChallengeResidualSec = 0; // Clear residual after using it
    
    // Keep removal counter cumulative across levels (for per-removal bonuses)
    // Don't reset timeChallengeRemovals here
    
    const wasActive = timeChallengeActive;
    timeChallengeActive = true;
    timeUpShown = false;
    setTimeFrozen('time_up', false);
    
    // #region agent log
    debugTelemetry({location:'main.js:timeChallengeStartNewLevel:exit',message:'timeChallengeStartNewLevel completed',data:{wasActive:wasActive,nowActive:timeChallengeActive,timeLeftSec:timeLeftSec},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
    // #endregion
    
    updateTimerDisplay();
}

function timeChallengeGetBaseSecondsForRemovalNumber(n) {
    // Survival table:
    // 1–25: +4s, 26–75: +3s, 76–150: +2s, 151–250: +1s, 251+: +0s
    if (n <= 25) return 4;
    if (n <= 75) return 3;
    if (n <= 150) return 2;
    if (n <= 250) return 1;
    return 0;
}

function timeChallengeGetColorBonusSeconds(blockLength) {
    // Block.js uses [Red, Teal, Yellow] mapping by length (1,2,3).
    // We treat any length >= 3 as Yellow for time bonus.
    if (blockLength >= 3) return 3; // Yellow
    if (blockLength === 2) return 2; // Teal
    return 1; // Red (default)
}

function timeChallengeAwardForBlockRemoved(blockLength) {
    if (!isTimeBasedMode() || !timeChallengeActive || timeUpShown) return;
    
    timeChallengeRemovals += 1;
    // Simplified: only use color bonus based on block length
    const gained = timeChallengeGetColorBonusSeconds(blockLength);
    timeChallengeTimeCollected += gained; // Track time collected this level
    timeChallengeTimeCollectedAllTime += gained; // Track cumulative time collected across all levels
    
    // Add time immediately (like spin does), then show flash animation
    const before = timeLeftSec;
    timeLeftSec += gained;
    
    // Play time added sound effect
    playSound('timeAdded', 0.6);
    
    // Show flash animation (same as spin)
    flashTimerDelta(gained);
    updateTimerDisplay();
}

function timeChallengeApplySpinCost() {
    if (!isTimeBasedMode() || timeUpShown) return;
    // Note: timeChallengeActive check removed - allow spin cost even if not yet active
    // (timeChallengeActive might not be set during initialization)
    
    // Get spin cost multiplier based on mode and level
    let multiplier = 1/3; // Default for Time Challenge
    if (isInfernoMode()) {
        const config = getInfernoDifficultyConfig(currentLevel);
        multiplier = config.spinCostMultiplier;
    }
    
    // Cost: multiplier of remaining time
    const before = timeLeftSec;
    timeLeftSec = timeLeftSec * (1 - multiplier);
    const delta = Math.trunc(timeLeftSec) - Math.trunc(before);
    // Prefer to show a clear negative number of seconds.
    const spent = Math.max(1, Math.ceil(before * multiplier));
    
    // Track total spin cost for this level
    timeChallengeSpinCost += spent;
    
    // Play time removed sound effect
    playSound('timeRemoved', 0.5);
    
    flashTimerDelta(-spent);
    updateTimerDisplay();
}

function showPauseModal() {
    const modal = document.getElementById('pause-modal');
    if (!modal) return;
    setTimeFrozen('user_pause', true);
    modal.style.display = 'flex';

    // Pause render loop too (and cancel any pending raf/timers).
    isPaused = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    if (frameCapTimeoutId !== null) {
        clearTimeout(frameCapTimeoutId);
        frameCapTimeoutId = null;
    }
}

function hidePauseModalAndResume() {
    const modal = document.getElementById('pause-modal');
    if (!modal) return;
    modal.style.display = 'none';
    setTimeFrozen('user_pause', false);

    // Resume render loop
    isPaused = false;
    lastTime = performance.now();
    lastFrameTick = lastTime;
    scheduleNextFrame();
}

function showTimeUpModal() {
    const modal = document.getElementById('time-up-modal');
    const summary = document.getElementById('time-up-summary');
    if (!modal || !summary) return;
    setTimeFrozen('time_up', true);
    timeUpShown = true;

    const stage = Math.floor(timeChallengeRemovals / 25);
    summary.innerHTML = `Stage <b>${stage}</b> • <b>${timeChallengeRemovals}</b> blocks removed`;
    modal.style.display = 'flex';
}

async function restartTimeChallengeLevelFromTimeUp() {
    const modal = document.getElementById('time-up-modal');
    if (modal) modal.style.display = 'none';
    setTimeFrozen('time_up', false);
    timeUpShown = false;
    
    if (isGeneratingLevel) return;
    
    // Save the initial time for this level before regenerating
    const savedInitialTime = timeChallengeInitialTime;
    
    // Reset level-specific stats (but keep run stats like timeChallengeRemovals, timeChallengeTimeCollectedAllTime)
    timeChallengeTimeCollected = 0;
    timeChallengeSpinCost = 0;
    
    // Clear move history
    moveHistory = [];
    totalMoves = 0;
    debugMoveHistory = []; // Clear debug move history
    
    // Reset stats tracking for current level
    startLevelStats(currentLevel);
    
    // Regenerate current level (this will recalculate initial time, but we'll restore it)
    await generateSolvablePuzzle(currentLevel);
    
    // Restore timer to the saved initial time for this level
    if (savedInitialTime > 0) {
        timeLeftSec = savedInitialTime;
        timeChallengeInitialTime = savedInitialTime;
        updateTimerDisplay();
    }
    
    updateUndoButtonState();
}

async function resetTimeChallengeRunFromTimeUp() {
    const modal = document.getElementById('time-up-modal');
    if (modal) modal.style.display = 'none';
    setTimeFrozen('time_up', false);
    timeChallengeResetRun();
    await startNewGame(); // starts from level 1
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
        
        // Save current level (use correct storage key for current mode)
        const storageKey = getStorageKey();
        
        // Safety check: Don't save level 0 or 1 unless there's a good reason (like starting new game)
        // Check if we're overwriting a higher level with 0 or 1
        const existingLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
        if ((currentLevel === 0 || currentLevel === 1) && existingLevel > 1) {
            console.warn(`[saveProgress] WARNING: Attempted to save level ${currentLevel} over existing level ${existingLevel}. This might be a bug. Stack trace:`, new Error().stack);
            // Don't save 0 or 1 over a higher level - this prevents accidental progress loss
            return;
        }
        
        localStorage.setItem(storageKey, currentLevel.toString());
        console.log(`Progress saved: Level ${currentLevel} (${isTimeChallengeMode() ? 'Time Challenge' : 'Free Flow'})`);
        
        // Also track highest level reached
        const highestLevel = parseInt(localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) || '0', 10);
        if (currentLevel > highestLevel) {
            localStorage.setItem(STORAGE_HIGHEST_LEVEL_KEY, currentLevel.toString());
            console.log(`New highest level reached: ${currentLevel}`);
        }
        
        // Verify save was successful
        const verify = localStorage.getItem(storageKey);
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
    // Check for debug level parameter in URL (e.g., ?level=40) - takes precedence over saved progress
    const urlParams = new URLSearchParams(window.location.search);
    const debugLevel = urlParams.get('level');
    if (debugLevel) {
        const level = parseInt(debugLevel, 10);
        if (!isNaN(level) && level >= 0) {
            console.log(`[Debug] Starting at level ${level} from URL parameter`);
            setCurrentLevel(level);
            return level;
        }
    }
    
    try {
        // Use different storage keys for different game modes
        const storageKey = getStorageKey();
        
        // Check if we need to update version (but preserve existing progress)
        const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
        const hasExistingProgress = localStorage.getItem(STORAGE_KEY) !== null || 
                                    localStorage.getItem(STORAGE_KEY_TIME_CHALLENGE) !== null ||
                                    localStorage.getItem(STORAGE_KEY_INFERNO) !== null ||
                                    localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) !== null;
        
        // Only update version - don't reset if user has existing progress
        if (storedVersion !== CURRENT_STORAGE_VERSION) {
            if (hasExistingProgress) {
                // User has progress - just update version without clearing
                console.log('Updating storage version, preserving existing progress');
                localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
                localStorage.setItem(RESET_FLAG_KEY, 'true');
            } else {
                // New user - set version and flag
                console.log('New user - setting storage version');
                localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
                localStorage.setItem(RESET_FLAG_KEY, 'true');
            }
        } else {
            // Version matches - ensure flag is set
            if (localStorage.getItem(RESET_FLAG_KEY) !== 'true') {
                localStorage.setItem(RESET_FLAG_KEY, 'true');
            }
        }
        
        // Now try to load saved progress
        const savedLevel = localStorage.getItem(storageKey);
        if (savedLevel !== null && savedLevel !== '') {
            const level = parseInt(savedLevel, 10);
            // Validate level is a valid number
            if (!isNaN(level) && level >= 0) {
                console.log(`Progress loaded: Level ${level} (${isTimeChallengeMode() ? 'Time Challenge' : 'Free Flow'})`);
                return level;
            } else {
                console.warn('Invalid saved level, resetting to 0');
                localStorage.removeItem(storageKey);
            }
        }
    } catch (e) {
        console.warn('Failed to load progress:', e);
    }
    console.log(`Starting from level 1 (no saved progress for ${isTimeChallengeMode() ? 'Time Challenge' : 'Free Flow'})`);
    return 1; // Default to level 1 if no saved progress
}

// Clear saved progress
function clearProgress() {
    try {
        // Clear progress for the current game mode
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        
        // Clear level update modal keys so modals show again on new game
        // Clear all level update keys (levels 1, 3, 5, 8, 12, 15, 20, 30, 40, 60, 75, 100)
        const levelUpdateIntervals = [1, 3, 5, 8, 12, 15, 20, 30, 40, 60, 75, 100];
        for (const level of levelUpdateIntervals) {
            localStorage.removeItem(`jarrows_level_update_${level}`);
        }
        
        // Keep storage version and highest level for tracking
        console.log(`Progress cleared - user will start from level 1 on next load (${isTimeChallengeMode() ? 'Time Challenge' : 'Free Flow'})`);
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
function createSolvableBlocks(yOffset = 0, lowerLayerCells = null, targetBlockCount = 10, level = 1, preferLongBlocks = false, difficultyConfig = null) {
    // Note: We don't clear blocks here - that's done in generateSolvablePuzzle
    // This allows us to add multiple layers
    // preferLongBlocks: If true, prefer longer blocks (2-3 cells) over single blocks
    // difficultyConfig: Optional Inferno mode difficulty configuration
    
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
                // Use difficulty config if available (Inferno mode), otherwise default to 70%
                let randomDir;
                const outwardPercentage = difficultyConfig ? difficultyConfig.outwardPercentage : 0.7;
                const preferOutward = Math.random() < outwardPercentage;
                if (preferOutward) {
                    // Try to get a direction pointing toward the nearest edge
                    const bestDir = getBestOutwardDirection(cell.x, cell.z, gridSize);
                    // 80% chance to use best direction, 20% chance to use random
                    randomDir = Math.random() < 0.8 ? bestDir : directions[Math.floor(Math.random() * directions.length)];
                } else {
                    randomDir = directions[Math.floor(Math.random() * directions.length)];
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
async function generateSolvablePuzzle(level = 1, isRestart = false) {
    if (isGeneratingLevel) {
        return;
    }
    
    // ABSOLUTE HARD STOP: If isRestart and level is 0, reject immediately
    // This is the last line of defense - should never be reached if restartCurrentLevel works correctly
    if (isRestart && level <= 0) {
        // Try emergency recovery
        const emergencyStorageKey = getStorageKey();
        const emergencyLevel = parseInt(localStorage.getItem(emergencyStorageKey) || '0', 10);
        if (emergencyLevel > 0) {
            level = emergencyLevel;
            currentLevel = emergencyLevel;
        } else {
            console.error(`[generateSolvablePuzzle] Cannot restart: level is 0 and no recovery possible`);
            alert(`Critical Error: Cannot restart level. Your progress may have been lost.`);
            return;
        }
    }
    
    // CRITICAL HARD GUARD: Never accept level 0 for restart
    // This prevents any possibility of restarting from level 0
    if (isRestart && (level <= 0 || isNaN(level))) {
        // Try to recover from localStorage
        const storageKey = getStorageKey();
        const savedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
        
        if (savedLevel > 0) {
            level = savedLevel;
            currentLevel = savedLevel;
        } else if (currentLevel > 0) {
            level = currentLevel;
        } else {
            console.error(`[generateSolvablePuzzle] Cannot restart: all level sources are invalid`);
            alert(`Error: Cannot restart level. Your progress appears to be lost. Please start a new game.`);
            return;
        }
    }
    
    // CRITICAL: Validate level parameter - never generate level 0 unless explicitly starting new game
    if (level <= 0 || isNaN(level)) {
        // Try to recover from localStorage (for both restart and initial load)
        const storageKey = getStorageKey();
        const savedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
        
        // If savedLevel > 0, we have progress - recover it (this shouldn't happen for new games)
        if (savedLevel > 0) {
            level = savedLevel;
            currentLevel = savedLevel;
        } else {
            // No saved progress (savedLevel is 0 or null)
            // This is OK for:
            // 1. Initial page load (boot) - new game
            // 2. startNewGame() - explicitly starting new game
            // But NOT OK for:
            // 3. restartCurrentLevel() - should never restart from 0
            if (!isRestart) {
                // Not a restart, so it's a new game - level 0 is valid
                level = 0;
                currentLevel = 0;
            } else {
                // This is a restart, but we have no saved progress - this is an error
                console.error(`[generateSolvablePuzzle] Cannot restart: savedLevel is invalid and isRestart=true`);
                alert(`Error: Cannot restart level. Your progress may have been lost. Please start a new game.`);
                return;
            }
        }
    }
    
    isGeneratingLevel = true;
    levelCompleteShown = false; // Reset level complete flag for new level
    
    // CRITICAL: Reset tower position offset at start of level to prevent camera jumps
    // This ensures smooth transition from previous level's offset
    towerPositionOffset.set(0, 0, 0);
    targetTowerPositionOffset.set(0, 0, 0);
    
    // CRITICAL: Set currentLevel to the level parameter
    // This ensures the level is preserved, especially when restarting
    currentLevel = level;
    
    // CRITICAL: If this is a restart, NEVER save 0 to localStorage
    // This prevents corruption if level parameter is somehow 0
    if (isRestart && currentLevel <= 0) {
        // Try to recover from localStorage one more time
        const storageKey = getStorageKey();
        const lastSavedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
        if (lastSavedLevel > 0) {
            currentLevel = lastSavedLevel;
            level = lastSavedLevel;
        } else {
            console.error(`[generateSolvablePuzzle] Cannot recover: all sources invalid`);
            alert(`Error: Cannot restart level. Your progress may have been lost.`);
            return;
        }
    }
    
    // IMMEDIATELY save to prevent any loss
    saveProgress();
    
    // Only reset spin counter for NEW level, not when restarting the same level
    // When restarting, preserve remainingSpins (game-level state)
    if (!isRestart) {
        if (!isTimeBasedMode()) {
            remainingSpins = 3;
        } else {
            remainingSpins = Number.POSITIVE_INFINITY;
        }
        updateSpinCounterDisplay();
    }
    
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
    
    // Framing control removed: no framing animation frames to cancel
    
    // Get target block count for this level
    const targetBlockCount = getBlocksForLevel(level);
    
    // Get Inferno mode difficulty configuration if applicable
    let difficultyConfig = null;
    if (isInfernoMode()) {
        difficultyConfig = getInfernoDifficultyConfig(level);
    }
    
    // Special case: Level 1 with head-on collisions for testing
    if (level === 1) {
        const headOnBlocks = createHeadOnCollisionBlocks(targetBlockCount);
        
        // Use the same animation system as normal generation
        await placeBlocksBatch(headOnBlocks);
        
        // Time-based modes: calculate initial time for this level based on actual block lengths
        if (isTimeBasedMode()) {
            timeChallengeStartNewLevel(headOnBlocks);
            console.log('[Time Challenge] Level started, timeChallengeActive:', timeChallengeActive, 'timeLeftSec:', timeLeftSec);
        }
        
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
            const layerBlocks = createSolvableBlocks(yOffset, lowerLayerCells, blocksForThisLayer, level, preferLongBlocks, difficultyConfig);
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
        
        // Inferno mode: Create multi-layer dependencies (upper blocks block lower exits)
        if (isInfernoMode() && difficultyConfig && difficultyConfig.multilayerBlockingPercentage > 0 && allBlocks.length > 0) {
            // Group blocks by layer (yOffset)
            const blocksByLayer = new Map();
            for (const block of allBlocks) {
                const layerKey = block.yOffset || 0;
                if (!blocksByLayer.has(layerKey)) {
                    blocksByLayer.set(layerKey, []);
                }
                blocksByLayer.get(layerKey).push(block);
            }
            
            // Sort layers by Y (lower to upper)
            const sortedLayers = Array.from(blocksByLayer.keys()).sort((a, b) => a - b);
            
            // For each upper layer, try to create dependencies with lower layers
            for (let i = 1; i < sortedLayers.length; i++) {
                const upperLayerY = sortedLayers[i];
                const upperBlocks = blocksByLayer.get(upperLayerY);
                const lowerBlocks = [];
                
                // Collect all blocks from lower layers
                for (let j = 0; j < i; j++) {
                    lowerBlocks.push(...blocksByLayer.get(sortedLayers[j]));
                }
                
                // Calculate how many upper blocks should block lower exits
                const targetBlockingCount = Math.floor(upperBlocks.length * difficultyConfig.multilayerBlockingPercentage);
                let blockingCount = 0;
                
                // Check each upper block to see if it blocks any lower block's exit
                for (const upperBlock of upperBlocks) {
                    if (blockingCount >= targetBlockingCount) break;
                    
                    // Check if this upper block is in the path of any lower block's exit
                    let blocksLowerExit = false;
                    for (const lowerBlock of lowerBlocks) {
                        if (lowerBlock.isFalling || lowerBlock.isRemoved) continue;
                        
                        // Get lower block's exit path
                        const lowerCells = getBlockCells(lowerBlock);
                        const lowerDir = lowerBlock.direction;
                        
                        // Check if upper block is in the path
                        for (const lowerCell of lowerCells) {
                            let checkX = lowerCell.x;
                            let checkZ = lowerCell.z;
                            const maxSteps = gridSize * 2;
                            
                            for (let step = 0; step < maxSteps; step++) {
                                checkX += lowerDir.x;
                                checkZ += lowerDir.z;
                                
                                // Check if we've reached the upper block's position
                                const upperCells = getBlockCells(upperBlock);
                                for (const upperCell of upperCells) {
                                    if (upperCell.x === checkX && upperCell.z === checkZ) {
                                        blocksLowerExit = true;
                                        break;
                                    }
                                }
                                
                                if (blocksLowerExit) break;
                                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) break;
                            }
                            
                            if (blocksLowerExit) break;
                        }
                        
                        if (blocksLowerExit) break;
                    }
                    
                    if (blocksLowerExit) {
                        blockingCount++;
                    } else {
                        // Try to move upper block to create a dependency
                        // Move block backward (opposite to direction) to get in the path
                        const backwardDir = {
                            x: -upperBlock.direction.x,
                            z: -upperBlock.direction.z
                        };
                        
                        // Try moving backward a few steps
                        let moved = false;
                        for (let steps = 1; steps <= 3 && !moved; steps++) {
                            const newX = upperBlock.gridX + backwardDir.x * steps;
                            const newZ = upperBlock.gridZ + backwardDir.z * steps;
                            
                            // Check bounds
                            if (newX >= 0 && newX < gridSize && newZ >= 0 && newZ < gridSize) {
                                // Check if this position would block a lower exit
                                let wouldBlock = false;
                                for (const lowerBlock of lowerBlocks) {
                                    if (lowerBlock.isFalling || lowerBlock.isRemoved) continue;
                                    
                                    const lowerCells = getBlockCells(lowerBlock);
                                    const lowerDir = lowerBlock.direction;
                                    
                                    for (const lowerCell of lowerCells) {
                                        let checkX = lowerCell.x;
                                        let checkZ = lowerCell.z;
                                        const maxSteps = gridSize * 2;
                                        
                                        for (let step = 0; step < maxSteps; step++) {
                                            checkX += lowerDir.x;
                                            checkZ += lowerDir.z;
                                            
                                            // Check if upper block at new position would be in path
                                            const upperCells = getBlockCells(upperBlock);
                                            for (const upperCell of upperCells) {
                                                const actualX = newX + (upperCell.x - upperBlock.gridX);
                                                const actualZ = newZ + (upperCell.z - upperBlock.gridZ);
                                                if (actualX === checkX && actualZ === checkZ) {
                                                    wouldBlock = true;
                                                    break;
                                                }
                                            }
                                            
                                            if (wouldBlock) break;
                                            if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) break;
                                        }
                                        
                                        if (wouldBlock) break;
                                    }
                                    
                                    if (wouldBlock) break;
                                }
                                
                                if (wouldBlock) {
                                    // Check if new position doesn't overlap with other blocks
                                    let canMove = true;
                                    const upperCells = getBlockCells(upperBlock);
                                    for (const otherBlock of allBlocks) {
                                        if (otherBlock === upperBlock || otherBlock.yOffset !== upperBlock.yOffset) continue;
                                        const otherCells = getBlockCells(otherBlock);
                                        for (const upperCell of upperCells) {
                                            const actualX = newX + (upperCell.x - upperBlock.gridX);
                                            const actualZ = newZ + (upperCell.z - upperBlock.gridZ);
                                            for (const otherCell of otherCells) {
                                                if (actualX === otherCell.x && actualZ === otherCell.z) {
                                                    canMove = false;
                                                    break;
                                                }
                                            }
                                            if (!canMove) break;
                                        }
                                        if (!canMove) break;
                                    }
                                    
                                    if (canMove) {
                                        // Move the block
                                        upperBlock.gridX = newX;
                                        upperBlock.gridZ = newZ;
                                        if (typeof upperBlock.updateWorldPosition === 'function') {
                                            upperBlock.updateWorldPosition();
                                        }
                                        blockingCount++;
                                        moved = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                
                console.log(`  Inferno: Created ${blockingCount}/${upperBlocks.length} multi-layer dependencies in layer ${i}`);
            }
        }
    } else {
        // Single layer generation (base layer at Y=0)
        allBlocks = createSolvableBlocks(0, null, targetBlockCount, level, false, difficultyConfig);
    }
    
    // Place all blocks in batches
    console.log(`  Placing ${allBlocks.length} blocks in batches...`);
    await placeBlocksBatch(allBlocks, 10, 10); // 10 blocks per batch, 10ms between batches
    console.log(`  Placement complete. Blocks array now has ${blocks.length} blocks`);
    
    // Time-based modes: calculate initial time for this level based on actual block lengths
    // NOTE: This must happen AFTER blocks are created and placed
    // to ensure we can sum the actual block lengths
    if (isTimeBasedMode()) {
        timeChallengeStartNewLevel(allBlocks);
        // #region agent log
        debugTelemetry({location:'main.js:generateSolvablePuzzle:timeChallengeStart',message:'Time challenge level started',data:{timeChallengeActive:timeChallengeActive,timeLeftSec:timeLeftSec,level:level},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
        // #endregion
        console.log('[Time Challenge] Level started, timeChallengeActive:', timeChallengeActive, 'timeLeftSec:', timeLeftSec);
        // Re-check button states after level start
        updateSpinCounterDisplay();
    }
    
    // CRITICAL: Support checking is already disabled by isGeneratingLevel flag
    // The flag will be set to false after a delay to ensure all blocks are initialized
    
    // Validate structure after placement to catch any overlaps
    const structureCheck = validateStructure(blocks, gridSize);
    if (!structureCheck.valid) {
        console.error(`✗ Structure validation failed: ${structureCheck.reason}`);
        console.error('  Regenerating puzzle...');
        // Regenerate if validation fails - preserve isRestart flag
        isGeneratingLevel = false;
        await generateSolvablePuzzle(level, isRestart);
        return;
    }
    
    // Inferno mode: Validate difficulty threshold (difficulty-based generation)
    if (isInfernoMode() && difficultyConfig) {
        let attempts = 0;
        const maxAttempts = 5;
        let difficulty = calculateDifficulty(blocks, gridSize);
        
        while (attempts < maxAttempts && difficulty.score < difficultyConfig.difficultyThreshold) {
            console.log(`⚠️ Inferno mode: Puzzle difficulty ${difficulty.score.toFixed(1)} below threshold ${difficultyConfig.difficultyThreshold.toFixed(1)}, regenerating... (attempt ${attempts + 1}/${maxAttempts})`);
            
            // Clear current blocks
            for (const block of blocks) {
                towerGroup.remove(block.group);
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
            
            // Regenerate with slightly adjusted parameters
            // Increase outward percentage reduction and length preference
            const adjustedConfig = { ...difficultyConfig };
            adjustedConfig.outwardPercentage = Math.max(0.05, difficultyConfig.outwardPercentage - 0.05);
            const lengthDist = adjustedConfig.lengthDistribution;
            adjustedConfig.lengthDistribution = {
                length1: Math.max(0.02, lengthDist.length1 - 0.05),
                length2: lengthDist.length2,
                length3: Math.min(0.78, lengthDist.length3 + 0.05)
            };
            // Normalize
            const sum = adjustedConfig.lengthDistribution.length1 + adjustedConfig.lengthDistribution.length2 + adjustedConfig.lengthDistribution.length3;
            adjustedConfig.lengthDistribution.length1 /= sum;
            adjustedConfig.lengthDistribution.length2 /= sum;
            adjustedConfig.lengthDistribution.length3 /= sum;
            
            // Regenerate
            if (needsMultipleLayers) {
                // Regenerate multi-layer (simplified - just regenerate single layer for now)
                allBlocks = createSolvableBlocks(0, null, targetBlockCount, level, false, adjustedConfig);
            } else {
                allBlocks = createSolvableBlocks(0, null, targetBlockCount, level, false, adjustedConfig);
            }
            
            // Place blocks
            await placeBlocksBatch(allBlocks, 10, 10);
            
            // Re-validate structure
            const newStructureCheck = validateStructure(blocks, gridSize);
            if (!newStructureCheck.valid) {
                console.error(`✗ Structure validation failed after difficulty adjustment: ${newStructureCheck.reason}`);
                break;
            }
            
            // Recalculate difficulty
            difficulty = calculateDifficulty(blocks, gridSize);
            attempts++;
        }
        
        if (difficulty.score < difficultyConfig.difficultyThreshold) {
            console.warn(`⚠️ Inferno mode: Could not reach difficulty threshold after ${maxAttempts} attempts. Using best attempt (${difficulty.score.toFixed(1)})`);
        } else {
            console.log(`✓ Inferno mode: Puzzle difficulty ${difficulty.score.toFixed(1)} meets threshold ${difficultyConfig.difficultyThreshold.toFixed(1)}`);
        }
    }
    
    // Show general level updates (all modes) - meaningful messages at key intervals
    showLevelUpdateModal(level);
    
    // Inferno mode: Show milestone and feature modals
    if (isInfernoMode() && difficultyConfig) {
        // Show milestone modal if applicable
        if (difficultyConfig.isMilestone) {
            showMilestoneModal(level);
        }
        
        // Show feature modals on first encounter
        // Check which features are active at this level
        if (difficultyConfig.outwardPercentage < 0.7 && level >= 6) {
            showFeatureModal('directional', level);
        }
        if (difficultyConfig.lengthDistribution.length3 > 0.2 && level >= 6) {
            showFeatureModal('length', level);
        }
        if (difficultyConfig.verticalPercentage < 0.3 && level >= 6) {
            showFeatureModal('vertical', level);
        }
        if (difficultyConfig.multilayerBlockingPercentage > 0 && level >= 11) {
            showFeatureModal('multilayer', level);
        }
        if (difficultyConfig.spinCostMultiplier > 1/3 && level >= 6) {
            showFeatureModal('spincost', level);
        }
        if (difficultyConfig.difficultyThreshold > 50 && level >= 10) {
            showFeatureModal('difficulty', level);
        }
    }
    
    // Update level counter display
    const levelValueElement = document.getElementById('level-value');
    if (levelValueElement) {
        levelValueElement.textContent = level;
    }
    
    // CRITICAL: Ensure currentLevel matches the level parameter
    // This is a safety check to prevent level from being wrong
    if (currentLevel !== level) {
        console.warn(`[generateSolvablePuzzle] Level mismatch: currentLevel=${currentLevel}, level=${level}. Fixing...`);
        currentLevel = level;
    }
    
    // Keep isGeneratingLevel true for a bit longer to prevent support checking from running
    // Blocks need time to fully initialize before support checking resumes
    setTimeout(() => {
        // #region agent log
        const oldIsGeneratingLevel = isGeneratingLevel;
        const oldTargetRadius = targetRadius;
        const oldCurrentRadius = currentRadius;
        // #endregion
        isGeneratingLevel = false;
        // #region agent log
        debugTelemetry({location:'main.js:generateSolvablePuzzle:isGeneratingLevelFalse',message:'isGeneratingLevel set to false',data:{oldIsGeneratingLevel:oldIsGeneratingLevel,newIsGeneratingLevel:isGeneratingLevel,oldTargetRadius:oldTargetRadius.toFixed(2),oldCurrentRadius:oldCurrentRadius.toFixed(2),currentTargetRadius:targetRadius.toFixed(2),currentCurrentRadius:currentRadius.toFixed(2),blocksCount:blocks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
        // #endregion
        console.log('  Level generation complete, support checking enabled');
        
        // Force immediate auto-zoom update after spawn ends to ensure smooth transition
        // This bypasses the throttle to prevent camera jump
        lastAutoZoomUpdateMs = 0; // Reset throttle to force immediate auto-zoom on next frame
        
        // Vertically center the tower after all blocks are spawned
        // Shadows are manual/gated; keep them updating briefly so the post-spawn recenter doesn't "pop" a new shadow band.
        try {
            shadowUpdateCooldownUntilMs = performance.now() + 800;
            lastLightUpdateMs = 0;
            lastShadowMapUpdateMs = 0;
            if (renderer.shadowMap) renderer.shadowMap.needsUpdate = true;
        } catch (e) {
            // best-effort
        }
        centerTowerVertically();
    }, 1500); // 1.5 seconds to ensure all blocks are initialized
    
    // Start timer for new level
    resetTimer();
    startTimer();
    // Reset move counter for new level
    totalMoves = 0;
    
    // Start stats tracking for new level
    startLevelStats(currentLevel);
    
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

// Debug investigation system: console log buffer and enhanced move history
const DEBUG_MOVE_HISTORY_SIZE = 5; // Store last 5 moves for investigation
let debugMoveHistory = []; // Enhanced move history with full block state
let consoleLogBuffer = []; // Buffer to store recent console logs
const CONSOLE_LOG_BUFFER_SIZE = 100; // Store last 100 console log entries

// Intercept console methods to capture logs
(function() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    function captureLog(level, args) {
        const timestamp = Date.now();
        const message = Array.from(args).map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        consoleLogBuffer.push({
            level,
            message,
            timestamp,
            stack: new Error().stack
        });
        
        // Keep buffer size limited
        if (consoleLogBuffer.length > CONSOLE_LOG_BUFFER_SIZE) {
            consoleLogBuffer.shift();
        }
    }
    
    console.log = function(...args) {
        captureLog('log', args);
        originalLog.apply(console, args);
    };
    
    console.warn = function(...args) {
        captureLog('warn', args);
        originalWarn.apply(console, args);
    };
    
    console.error = function(...args) {
        captureLog('error', args);
        originalError.apply(console, args);
    };
})();

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
    const timerLevelElement = document.getElementById('timer-level');
    if (!timerValueElement) return;

    // Update level display
    if (timerLevelElement) {
        timerLevelElement.textContent = String(currentLevel);
    }

    if (isTimeBasedMode() && timeChallengeActive) {
        // During animation, show precise value for smooth visual feedback
        // Otherwise, show ceil so players don't feel robbed at 0.1s remaining
        const displaySeconds = timeAnimationActive 
            ? Math.max(0, Math.round(timeLeftSec * 10) / 10) // Show 1 decimal during animation
            : Math.max(0, Math.ceil(timeLeftSec));
        timerValueElement.textContent = formatTime(displaySeconds);
        return;
    }

    let elapsedSeconds = timerPausedTime;
    
    if (isTimerRunning && timerStartTime !== null) {
        elapsedSeconds += (performance.now() / 1000) - timerStartTime;
    }
    
    timerValueElement.textContent = formatTime(elapsedSeconds);
}

// Save move state before a block moves
function saveMoveState(block) {
    // Deprecated: moves are now recorded from inside `Block.move()` to ensure all move paths are undoable.
    // Kept for compatibility with older call sites.
    moveHistory.push({
        block: block,
        gridX: block.gridX,
        gridZ: block.gridZ,
        yOffset: block.yOffset,
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

// Single source of truth for move history recording (called from `Block.move()`).
function recordMoveState(block, preMoveState) {
    const moveEntry = {
        block,
        gridX: preMoveState.gridX,
        gridZ: preMoveState.gridZ,
        yOffset: preMoveState.yOffset,
        direction: { ...preMoveState.direction },
        isVertical: preMoveState.isVertical,
        timestamp: performance.now(),
    };
    
    moveHistory.push(moveEntry);

    // Enhanced debug move history with full block state
    const blockIndex = blocks.indexOf(block);
    const debugMoveEntry = {
        timestamp: performance.now(),
        moveNumber: totalMoves + 1,
        block: {
            id: `block_${blockIndex}_${preMoveState.gridX}_${preMoveState.gridZ}_${block.length}`,
            index: blockIndex,
            length: block.length,
            gridX: preMoveState.gridX,
            gridZ: preMoveState.gridZ,
            yOffset: preMoveState.yOffset,
            direction: { ...preMoveState.direction },
            isVertical: preMoveState.isVertical,
            isAnimating: block.isAnimating,
            isFalling: block.isFalling,
            isRemoved: block.isRemoved || false,
        },
        gameState: {
            level: currentLevel,
            totalMoves: totalMoves + 1,
            blocksRemaining: blocks.filter(b => !b.isRemoved && !b.isFalling).length,
            blocksTotal: blocks.length,
            isGeneratingLevel: isGeneratingLevel,
            gameMode: gameMode || 'unknown',
        }
    };
    
    debugMoveHistory.push(debugMoveEntry);
    
    // Keep only last N moves for investigation
    if (debugMoveHistory.length > DEBUG_MOVE_HISTORY_SIZE) {
        debugMoveHistory.shift();
    }

    totalMoves++;

    if (moveHistory.length > 50) {
        moveHistory.shift();
    }

    // Track move for stats
    trackMove();

    updateUndoButtonState();
}

// Expose for `Block.js` (module boundary)
if (typeof window !== 'undefined') {
    window.recordMoveState = recordMoveState;
}

// Undo last move
function undoLastMove() {
    if (moveHistory.length === 0) return false;
    
    const lastMove = moveHistory.pop();
    const block = lastMove.block;
    if (!block) return false;
    
    // If the block is actively falling (physics sim still running), don't fight physics.
    // (If it already finished and was removed, we'll resurrect below.)
    if (block.isFalling && !block.isRemoved) return false;

    // If the block was removed (fell off / cleared), resurrect it so we can undo properly.
    if (block.isRemoved || !blocks.includes(block)) {
        // Ensure it exists in blocks array
        if (!blocks.includes(block)) {
            blocks.push(block);
        }

        // Ensure it is in the scene graph (towerGroup is the parent in current architecture)
        try {
            if (block.group && !block.group.parent && typeof towerGroup !== 'undefined' && towerGroup) {
                towerGroup.add(block.group);
            }
        } catch (e) {
            // best-effort
        }

        // Reset removal / physics flags
        block.isRemoved = false;
        block.isFalling = false;
        block.isAnimating = false;
        block.needsStop = true;
        block.removalStartTime = null;
        block.updateMeltAnimation = null;

        // Restore shadow casting (Battery mode may have disabled casting during fall).
        try {
            if (block.cubes && block.cubes[0]) {
                block.cubes[0].castShadow = true;
                block.cubes[0].receiveShadow = true;
            }
        } catch {
            // best-effort
        }
        
        // Reset catapult shadow state (Battery-mode catapult suppression)
        try {
            block.wasCatapulted = false;
            block._catapultShadowSuppressed = false;
            block._catapultRestStartMs = 0;
        } catch {
            // best-effort
        }

        // Physics state (falling uses physics bodies)
        block.physicsBody = null;
        block.physicsCollider = null;
        block.needsPhysicsBody = false;
        block.needsTransitionToFalling = false; // CRITICAL: Reset to prevent interference with replay
        block.pendingAngularVel = null;
        block.pendingLinearVel = null;

        // Reset transform (physics may have rotated it)
        if (block.group) {
            block.group.scale.set(1, 1, 1);
            block.group.rotation.set(0, 0, 0);
            block.group.quaternion.set(0, 0, 0, 1);
        }
    }
    
    // Stop any ongoing animations
    block.needsStop = true;
    block.isAnimating = false;
    
    // Restore block position
    block.gridX = lastMove.gridX;
    block.gridZ = lastMove.gridZ;
    block.yOffset = lastMove.yOffset ?? block.yOffset;
    block.direction = lastMove.direction;
    block.isVertical = lastMove.isVertical;
    
    // Reset scale and position immediately
    block.group.scale.set(1, 1, 1);
    block.updateWorldPosition();
    if (typeof block.updateArrowRotation === 'function') {
        block.updateArrowRotation();
    }

    // Undo should also undo the move counter for the level (clamp at 0)
    totalMoves = Math.max(0, totalMoves - 1);

    return true;
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
                // Track block removal for stats
                trackBlockRemoved();
                // Time Challenge: gaining time is based on block removals (efficient moves)
                timeChallengeAwardForBlockRemoved(this.length);
            }
            // Keep move history entries even if a block is removed.
            // Undo can resurrect the last-removed block back onto the board.
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
    // Don't reset game-level state (remainingSpins, currentLevel, etc.)
    // Only reset level-specific state
    if (isGeneratingLevel) {
        return;
    }
    
    // CRITICAL: Determine level to restart with PRIORITY system
    // PRIORITY 1: currentLevel (most recent state, most reliable)
    // PRIORITY 2: localStorage (persisted state, may be stale)
    // PRIORITY 3: Error if both invalid
    const storageKey = isTimeChallengeMode() ? STORAGE_KEY_TIME_CHALLENGE : STORAGE_KEY;
    const savedLevelBefore = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    // CRITICAL: Determine level to restart with PRIORITY system
    // PRIORITY 1: currentLevel (most recent state, most reliable)
    // PRIORITY 2: localStorage (persisted state, may be stale)
    // PRIORITY 3: Error if both invalid
    let levelToRestart;
    
    if (currentLevel > 0) {
        // PRIORITY 1: currentLevel is valid - use it
        levelToRestart = currentLevel;
        
        // Verify localStorage matches, fix if not
        if (savedLevelBefore !== currentLevel) {
            localStorage.setItem(storageKey, String(currentLevel));
            const verifyFix = parseInt(localStorage.getItem(storageKey) || '0', 10);
            if (verifyFix !== currentLevel) {
                console.error(`[Restart Level] Failed to fix localStorage! Expected ${currentLevel}, got ${verifyFix}`);
                alert(`Error: Cannot save progress. Please check your browser's localStorage settings.`);
                return;
            }
        }
    } else if (savedLevelBefore > 0) {
        // PRIORITY 2: currentLevel is invalid, but localStorage has valid level
        levelToRestart = savedLevelBefore;
        console.warn(`[Restart Level] currentLevel is invalid, using savedLevel ${savedLevelBefore} from localStorage`);
        currentLevel = savedLevelBefore; // Fix currentLevel
    } else {
        // PRIORITY 3: Both are invalid
        console.error(`[Restart Level] CRITICAL: Both currentLevel (${currentLevel}) and savedLevel (${savedLevelBefore}) are invalid!`);
        alert(`Cannot restart: No level found. You appear to be at level 0. Please start a new game or continue to the next level.`);
        return;
    }
    
    // ALWAYS sync currentLevel to the level we're restarting
    // This ensures consistency throughout the restart process
    if (currentLevel !== levelToRestart) {
        currentLevel = levelToRestart;
    }
    
    // Safety check: Don't allow restarting if level is 0 or invalid
    if (!levelToRestart || levelToRestart < 0 || isNaN(levelToRestart)) {
        console.error(`[Restart Level] Invalid level to restart: ${levelToRestart}`);
        alert(`Cannot restart: Invalid level (${levelToRestart}). Please start a new game.`);
        return;
    }
    
    // FINAL safety check: Never proceed if levelToRestart is 0
    if (levelToRestart <= 0) {
        console.error(`[Restart Level] FINAL CHECK FAILED: levelToRestart is ${levelToRestart}`);
        alert(`Error: Cannot restart level ${levelToRestart}. Your progress may have been lost.`);
        return;
    }
    
    // Clear move history for this level
    moveHistory = [];
    totalMoves = 0;
    debugMoveHistory = []; // Clear debug move history
    
    // Reset stats tracking for current level
    startLevelStats(levelToRestart);
    
    // CRITICAL: Set currentLevel BEFORE calling generateSolvablePuzzle
    // This ensures it's set correctly even if generateSolvablePuzzle has issues
    currentLevel = levelToRestart;
    
    // IMMEDIATELY save progress to prevent any loss
    saveProgress();
    const savedAfter = parseInt(localStorage.getItem(storageKey) || '0', 10);
    
    // Verify save was successful
    if (savedAfter !== levelToRestart) {
        console.error(`[Restart Level] Save verification failed! Saved ${savedAfter}, expected ${levelToRestart}. Retrying...`);
        currentLevel = levelToRestart;
        saveProgress();
        const verifyRetry = parseInt(localStorage.getItem(storageKey) || '0', 10);
        if (verifyRetry !== levelToRestart) {
            console.error(`[Restart Level] Retry also failed! Saved ${verifyRetry}, expected ${levelToRestart}`);
            alert(`Error: Failed to save progress. Cannot restart level.`);
            return;
        }
    }
    
    // FINAL FINAL SAFEGUARD: Read localStorage ONE MORE TIME right before generation
    // This is the absolute last chance to catch any corruption
    const finalCheckLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const finalCheckCurrent = currentLevel;
    
    // If ANY of these are 0 or invalid, we have a problem
    if (levelToRestart <= 0 || finalCheckCurrent <= 0 || finalCheckLevel <= 0) {
        console.error(`[Restart Level] FINAL CHECK FAILED: levelToRestart=${levelToRestart}, currentLevel=${finalCheckCurrent}, localStorage=${finalCheckLevel}`);
        
        // Try one last recovery attempt
        if (finalCheckLevel > 0) {
            levelToRestart = finalCheckLevel;
            currentLevel = finalCheckLevel;
            localStorage.setItem(storageKey, String(finalCheckLevel));
        } else if (finalCheckCurrent > 0) {
            levelToRestart = finalCheckCurrent;
            localStorage.setItem(storageKey, String(finalCheckCurrent));
        } else {
            console.error(`[Restart Level] ALL RECOVERY ATTEMPTS FAILED! Cannot proceed.`);
            alert(`Error: Cannot restart level. All level sources are invalid. Please start a new game.`);
            return;
        }
    }
    
    // Verify one more time that we have a valid level
    if (levelToRestart <= 0) {
        console.error(`[Restart Level] CRITICAL: levelToRestart is still 0 after all recovery attempts!`);
        alert(`Error: Cannot restart level. Please start a new game.`);
        return;
    }
    
    // Update currentLevel to match levelToRestart one final time
    currentLevel = levelToRestart;
    
    // Save one more time to ensure consistency
    saveProgress();
    
    // Regenerate current level (keeps same level number)
    // Pass isRestart=true to preserve game-level state (remainingSpins, etc.)
    await generateSolvablePuzzle(levelToRestart, true);
    
    // Ensure currentLevel is still correct after generation
    // This is a safety check in case something went wrong
    if (currentLevel !== levelToRestart) {
        console.error(`[Restart Level] CRITICAL: Level was changed from ${levelToRestart} to ${currentLevel}! Restoring...`);
        currentLevel = levelToRestart;
        saveProgress();
    }
    
    // Save progress to ensure it's persisted (with the correct level)
    saveProgress();
    
    // Final verification
    const finalSavedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
    if (finalSavedLevel !== levelToRestart) {
        console.error(`[Restart Level] CRITICAL: Final saved level (${finalSavedLevel}) doesn't match restart level (${levelToRestart})! Fixing...`);
        currentLevel = levelToRestart;
        saveProgress();
    }
    
    // Update level display to ensure it shows the correct level
    const levelValueElement = document.getElementById('level-value');
    if (levelValueElement) {
        levelValueElement.textContent = currentLevel;
    }
}

// Start new game (reset to level 1)
async function startNewGame() {
    if (isGeneratingLevel) return;
    
    console.log(`[startNewGame] Starting new game. Current level before reset: ${currentLevel}`);
    
    // Check for debug level parameter in URL (e.g., ?level=40)
    const urlParams = new URLSearchParams(window.location.search);
    const debugLevel = urlParams.get('level');
    const targetLevel = debugLevel ? parseInt(debugLevel, 10) : 1;
    
    // Clear saved progress FIRST (before resetting currentLevel)
    // This ensures localStorage is cleared before any validation checks
    clearProgress();
    
    // Reset to level 1 (or debug level if specified)
    currentLevel = targetLevel;
    levelCompleteShown = false;
    
    // Clear move history
    moveHistory = [];
    totalMoves = 0;
    debugMoveHistory = []; // Clear debug move history
    
    // Reset spin counter
    remainingSpins = isTimeBasedMode() ? Number.POSITIVE_INFINITY : 3;
    updateSpinCounterDisplay();
    
    // Hide level complete modal if visible
    hideLevelCompleteModal();
    
    // Reset stats tracking
    startLevelStats(currentLevel);
    
    // Verify localStorage is cleared
    const storageKey = isTimeChallengeMode() ? STORAGE_KEY_TIME_CHALLENGE : STORAGE_KEY;
    const savedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
    if (savedLevel !== 0) {
        console.warn(`[startNewGame] WARNING: localStorage still has level ${savedLevel} after clearProgress(). Clearing again...`);
        localStorage.removeItem(storageKey);
    }
    
    console.log(`[startNewGame] Generating level 1 (currentLevel=${currentLevel}, savedLevel=${parseInt(localStorage.getItem(storageKey) || '0', 10)})`);
    
    // Generate level 1 - pass isRestart=false explicitly to indicate this is a new game
    await generateSolvablePuzzle(1, false);
}

// Level completion modal functions
function showLevelCompleteModal(completedLevel) {
    const modal = document.getElementById('level-complete-modal');
    const message = document.getElementById('level-complete-message');
    const title = document.getElementById('level-complete-title');
    const levelNumber = document.getElementById('level-complete-level');
    const timeElement = document.getElementById('level-complete-time');
    const movesElement = document.getElementById('level-complete-moves');
    const blocksElement = document.getElementById('level-complete-blocks');
    
    if (modal) {
        // Per request: remove the "Outstanding performance" line.
        if (message) message.textContent = '';
        
        // Update title to include level number: "Level X Complete!" with styled number
        if (title) {
            title.innerHTML = `Level <span class="modal-level-number-inline">${completedLevel}</span> Complete!`;
        }
        
        // Hide the separate level number display since it's now in the title
        if (levelNumber) {
            levelNumber.style.display = 'none';
        }
        
        // Pause Time Challenge while modal is open
        if (isTimeBasedMode() && timeChallengeActive) {
            setTimeFrozen('level_complete', true);
        }

        // Get elapsed time in the level (for all modes)
        let timeString = '00:00';
        const elapsedSeconds = getElapsedTime();
        timeString = formatTime(elapsedSeconds);
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
        
        // Time Challenge/Inferno: save residual time for next level
        if (isTimeBasedMode() && timeChallengeActive) {
            timeChallengeResidualSec = Math.max(0, timeLeftSec);
            // Track carried over time for graph with all components
            timeChallengeCarriedOverHistory.push({
                level: completedLevel,
                carriedOver: timeChallengeResidualSec,
                unused: timeChallengeInitialTime || 0,
                collected: timeChallengeTimeCollected || 0,
                spin: timeChallengeSpinCost || 0
            });
        }
        
        // Play level complete sound effect
        playSound('levelComplete', 0.03);
        
        modal.style.display = 'flex';
    }
}

function hideLevelCompleteModal() {
    const modal = document.getElementById('level-complete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    if (isTimeBasedMode() && timeChallengeActive) {
        setTimeFrozen('level_complete', false);
    }
}

// Debug panel functions
function showDebugPanel() {
    const modal = document.getElementById('debug-panel-modal');
    const levelInput = document.getElementById('debug-level-input');
    if (modal) {
        modal.style.display = 'flex';
        // Set current level as default value
        if (levelInput) {
            levelInput.value = currentLevel;
        }
    }
}

function hideDebugPanel() {
    const modal = document.getElementById('debug-panel-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function toggleDebugPanel() {
    const modal = document.getElementById('debug-panel-modal');
    if (modal && modal.style.display === 'flex') {
        hideDebugPanel();
    } else {
        showDebugPanel();
    }
}

// Next level button handler
const nextLevelButton = document.getElementById('next-level-button');
if (nextLevelButton) {
    nextLevelButton.addEventListener('click', async () => {
        hideLevelCompleteModal();
        const previousLevel = currentLevel;
        currentLevel++;
        console.log(`[Next Level] Incremented from ${previousLevel} to ${currentLevel}`);
        moveHistory = []; // Clear move history for new level
        totalMoves = 0; // Reset move counter
        debugMoveHistory = []; // Clear debug move history for new level
        // CRITICAL: Save progress IMMEDIATELY after incrementing
        // This ensures localStorage always has the correct level
        saveProgress();
        // Verify save was successful
        const storageKey = getStorageKey();
        const savedLevel = parseInt(localStorage.getItem(storageKey) || '0', 10);
        if (savedLevel !== currentLevel) {
            console.error(`[Next Level] Save verification failed! Saved ${savedLevel}, expected ${currentLevel}. Retrying...`);
            currentLevel = savedLevel > currentLevel ? savedLevel : currentLevel; // Use higher value
            saveProgress();
        }
        console.log(`[Next Level] Starting level ${currentLevel} (saved: ${savedLevel})`);
        await generateSolvablePuzzle(currentLevel);
    });
}

// Debug panel button handlers
const debugJumpButton = document.getElementById('debug-jump-button');
if (debugJumpButton) {
    debugJumpButton.addEventListener('click', async () => {
        const levelInput = document.getElementById('debug-level-input');
        if (levelInput) {
            const targetLevel = parseInt(levelInput.value, 10);
            if (!isNaN(targetLevel) && targetLevel >= 0) {
                hideDebugPanel();
                await window.debugJumpToLevel(targetLevel);
            } else {
                alert('Please enter a valid level number (0 or greater)');
            }
        }
    });
}

const debugCloseButton = document.getElementById('debug-close-button');
if (debugCloseButton) {
    debugCloseButton.addEventListener('click', () => {
        hideDebugPanel();
    });
}

// Investigation function to capture bug report
async function investigateBug() {
    // Capture current game state
    const currentGameState = {
        level: currentLevel,
        totalMoves: totalMoves,
        gameMode: gameMode || 'unknown',
        blocks: blocks.map((block, index) => ({
            id: `block_${index}_${block.gridX}_${block.gridZ}_${block.length}`,
            index: index,
            length: block.length,
            gridX: block.gridX,
            gridZ: block.gridZ,
            yOffset: block.yOffset,
            direction: { ...block.direction },
            isVertical: block.isVertical,
            isAnimating: block.isAnimating,
            isFalling: block.isFalling,
            isRemoved: block.isRemoved || false,
        })),
        blocksRemaining: blocks.filter(b => !b.isRemoved && !b.isFalling).length,
        blocksTotal: blocks.length,
        isGeneratingLevel: isGeneratingLevel,
        timestamp: Date.now(),
    };
    
    // Get last N moves from debug history
    const recentMoves = debugMoveHistory.slice(-DEBUG_MOVE_HISTORY_SIZE);
    
    // Get recent console logs
    const recentLogs = consoleLogBuffer.slice(-50); // Last 50 log entries
    
    // Prompt user for description
    const userDescription = prompt(
        '🔍 Bug Investigation\n\n' +
        'Please describe what happened:\n' +
        '- What did you expect to happen?\n' +
        '- What actually happened?\n' +
        '- When did it occur? (e.g., "after moving block X")\n\n' +
        'Your description:'
    );
    
    if (userDescription === null) {
        // User cancelled
        return;
    }
    
    // Compile investigation report
    const investigationReport = {
        timestamp: new Date().toISOString(),
        userDescription: userDescription || 'No description provided',
        recentMoves: recentMoves,
        currentGameState: currentGameState,
        recentConsoleLogs: recentLogs,
        systemInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            gameVersion: 'current',
        }
    };
    
    // Display in console
    console.group('🔍 BUG INVESTIGATION REPORT');
    console.log('Timestamp:', investigationReport.timestamp);
    console.log('User Description:', investigationReport.userDescription);
    console.log('Recent Moves:', investigationReport.recentMoves);
    console.log('Current Game State:', investigationReport.currentGameState);
    console.log('Recent Console Logs:', investigationReport.recentConsoleLogs);
    console.log('System Info:', investigationReport.systemInfo);
    console.log('\n--- Full Report (JSON) ---');
    console.log(JSON.stringify(investigationReport, null, 2));
    console.groupEnd();
    
    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(JSON.stringify(investigationReport, null, 2));
        alert('✅ Investigation report copied to clipboard!\n\n' +
              'The full report has also been logged to the console.\n' +
              'You can now paste it wherever you need to report the bug.');
    } catch (err) {
        console.warn('Could not copy to clipboard:', err);
        alert('✅ Investigation report logged to console!\n\n' +
              'Please copy the JSON from the console manually.');
    }
    
    hideDebugPanel();
}

const debugInvestigateButton = document.getElementById('debug-investigate-button');
if (debugInvestigateButton) {
    debugInvestigateButton.addEventListener('click', () => {
        investigateBug();
    });
}

// Allow Enter key to trigger jump in debug panel
const debugLevelInput = document.getElementById('debug-level-input');
if (debugLevelInput) {
    debugLevelInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const targetLevel = parseInt(debugLevelInput.value, 10);
            if (!isNaN(targetLevel) && targetLevel >= 0) {
                hideDebugPanel();
                await window.debugJumpToLevel(targetLevel);
            } else {
                alert('Please enter a valid level number (0 or greater)');
            }
        }
    });
}

// Close debug panel when clicking outside
const debugPanelModal = document.getElementById('debug-panel-modal');
if (debugPanelModal) {
    debugPanelModal.addEventListener('click', (e) => {
        if (e.target === debugPanelModal) {
            hideDebugPanel();
        }
    });
}

// Game control button handlers (undo and remove buttons removed)

// --- DEBUG: movement diagnostics (headless) ---
// The UI debug toggle/button was removed in v4.5.1.
// To enable diagnostics manually, run in the browser console:
//   window.debugMoveMode = true
if (typeof window !== 'undefined') {
    window.debugMoveMode = !!window.debugMoveMode;
    window.debugNonMovingReports = Array.isArray(window.debugNonMovingReports) ? window.debugNonMovingReports : [];
}

function safeClone(value) {
    try {
        // Prefer structuredClone when available (keeps numbers, arrays, objects)
        if (typeof structuredClone === 'function') return structuredClone(value);
    } catch (_) {
        // Fall through to JSON clone
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (_) {
        return value;
    }
}

function downloadJson(data, filename) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (e) {
        console.warn('Failed to download debug JSON:', e);
    }
}

function getBlockCellsAt(block, baseGridX, baseGridZ) {
    if (block.isVertical) return [{ x: baseGridX, z: baseGridZ }];
    const isXAligned = Math.abs(block.direction.x) > 0;
    const cells = [];
    for (let i = 0; i < block.length; i++) {
        cells.push({
            x: baseGridX + (isXAligned ? i : 0),
            z: baseGridZ + (isXAligned ? 0 : i)
        });
    }
    return cells;
}

// Approximate the "first step" collision checks used by Block.move() (which uses a strict Y-range overlap check).
// This helps identify mismatches where canMove() says "ok" but move() still no-ops due to overlap math.
function computeFirstStepPotentialBlockers(block, allBlocks, preState) {
    const baseX = preState?.gridX ?? block.gridX;
    const baseZ = preState?.gridZ ?? block.gridZ;

    const nextBaseX = baseX + block.direction.x;
    const nextBaseZ = baseZ + block.direction.z;

    const nextCells = getBlockCellsAt(block, nextBaseX, nextBaseZ);

    const thisHeight = block.isVertical ? block.length * block.cubeSize : block.cubeSize;
    const thisYBottom = preState?.yOffset ?? block.yOffset;
    const thisYTop = thisYBottom + thisHeight;

    const blockers = [];
    for (const other of allBlocks) {
        if (!other || other === block || other.isFalling || other.isRemoved || other.removalStartTime) continue;

        const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
        const otherYBottom = other.yOffset;
        const otherYTop = otherYBottom + otherHeight;

        // NOTE: This is the stricter/older overlap check used in Block.move() (no EPSILON).
        const yRangesOverlap_move = (thisYTop > otherYBottom) && (thisYBottom < otherYTop);
        if (!yRangesOverlap_move) continue;

        const otherCells = getBlockCellsAt(other, other.gridX, other.gridZ);
        let overlappingCell = null;
        for (const c of nextCells) {
            if (otherCells.some(o => o.x === c.x && o.z === c.z)) {
                overlappingCell = c;
                break;
            }
        }
        if (!overlappingCell) continue;

        const directionsOpposed = (block.direction.x === -other.direction.x) && (block.direction.z === -other.direction.z);
        const headOnAllowed = directionsOpposed; // In current logic, opposite directions generally allow head-on continuation.

        blockers.push({
            other: {
                gridX: other.gridX,
                gridZ: other.gridZ,
                yOffset: other.yOffset,
                isVertical: other.isVertical,
                length: other.length,
                direction: other.direction ? { ...other.direction } : null
            },
            overlappingCell,
            yRangesOverlap_move,
            thisYRange: { bottom: thisYBottom, top: thisYTop, height: thisHeight },
            otherYRange: { bottom: otherYBottom, top: otherYTop, height: otherHeight },
            directionsOpposed,
            headOnAllowed
        });
    }

    return {
        nextBase: { x: nextBaseX, z: nextBaseZ },
        nextCells,
        blockers
    };
}

function snapshotPhysicsState(block) {
    const body = block?.physicsBody;
    if (!body) return null;
    try {
        const t = body.translation?.();
        const lv = body.linvel?.();
        const av = body.angvel?.();
        const sleeping = typeof body.isSleeping === 'function' ? body.isSleeping() : undefined;
        return {
            translation: t ? { x: t.x, y: t.y, z: t.z } : null,
            linvel: lv ? { x: lv.x, y: lv.y, z: lv.z } : null,
            angvel: av ? { x: av.x, y: av.y, z: av.z } : null,
            isSleeping: sleeping
        };
    } catch (e) {
        return { error: String(e?.message || e) };
    }
}

function recordNonMovingReport(report) {
    if (typeof window === 'undefined') return;
    window.debugNonMovingReports.push(report);

    console.groupCollapsed(
        `[DEBUG] Non-moving block click @ (${report.block?.gridX},${report.block?.gridZ}) y=${report.block?.yOffset} len=${report.block?.length} vertical=${report.block?.isVertical} result=${report.canMoveResult}`
    );
    console.log(report);
    console.groupEnd();

    // Auto-download a single JSON report for easy sharing.
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    downloadJson(report, `jarrows_non_moving_${ts}.json`);
}

const restartLevelButton = document.getElementById('restart-level-button');
if (restartLevelButton) {
    restartLevelButton.addEventListener('click', async () => {
        try {
            await restartCurrentLevel();
            updateUndoButtonState();
        } catch (error) {
            console.error('Error in restartCurrentLevel:', error);
            alert(`Error restarting level: ${error.message}`);
        }
    });
}

const newGameButton = document.getElementById('new-game-button');
if (newGameButton) {
    newGameButton.addEventListener('click', async () => {
        // Per requirement: New Game should re-prompt mode selection (user can switch modes easily).
        const selectedMode = await ensureModeSelected({ forcePrompt: true });
        // If user cancelled (selectedMode is null), don't start a new game
        if (selectedMode === null) {
            return;
        }
        if (isTimeBasedMode()) {
            timeChallengeResetRun();
            remainingSpins = Number.POSITIVE_INFINITY;
        } else {
            timeChallengeActive = false;
            timeFreezeReasons = new Set();
            timeUpShown = false;
            remainingSpins = 3;
        }
        updateSpinCounterDisplay();
        updateTimerDisplay();
        await startNewGame();
        updateUndoButtonState();
    });
}

const undoButton = document.getElementById('undo-button');
if (undoButton) {
    undoButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const didUndo = undoLastMove();
        if (didUndo) {
            updateUndoButtonState();
        }
    });
}

// Update spin counter display
function updateSpinCounterDisplay() {
    // #region agent log
    debugTelemetry({location:'main.js:updateSpinCounterDisplay:entry',message:'updateSpinCounterDisplay called',data:{isTimeBasedMode:isTimeBasedMode(),remainingSpins:remainingSpins},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
    // #endregion
    const spinCounter = document.getElementById('spin-counter');
    if (spinCounter) {
        if (isTimeBasedMode()) {
            // Unlimited spins in time-based modes
            spinCounter.textContent = '∞';
            spinCounter.setAttribute('data-infinity', 'true');
        } else {
            spinCounter.textContent = remainingSpins.toString();
            spinCounter.removeAttribute('data-infinity');
        }
    }

    const diceButton = document.getElementById('dice-button');
    if (diceButton) {
        const wasDisabled = diceButton.disabled;
        if (!isTimeBasedMode() && remainingSpins === 0) {
            diceButton.disabled = true;
            diceButton.style.opacity = '0.5';
            diceButton.style.cursor = 'not-allowed';
            // #region agent log
            debugTelemetry({location:'main.js:updateSpinCounterDisplay:disabled',message:'Dice button disabled',data:{wasDisabled:wasDisabled,nowDisabled:true,remainingSpins:remainingSpins},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
            // #endregion
        } else {
            diceButton.disabled = false;
            diceButton.style.opacity = '1';
            diceButton.style.cursor = 'pointer';
            // #region agent log
            debugTelemetry({location:'main.js:updateSpinCounterDisplay:enabled',message:'Dice button enabled',data:{wasDisabled:wasDisabled,nowDisabled:false,remainingSpins:remainingSpins},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
            // #endregion
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
    // #region agent log
    debugTelemetry({location:'main.js:spinRandomBlocks:entry',message:'spinRandomBlocks function called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
    // #endregion
    console.log('[Spin] ===== spinRandomBlocks FUNCTION CALLED =====');
    console.log('[Spin] Function entry - timestamp:', new Date().toISOString());
    
    // Log all state immediately
    console.log('[Spin] Mode checks:', {
        isTimeBasedMode: isTimeBasedMode(),
        isTimeChallengeMode: isTimeChallengeMode(),
        isInfernoMode: isInfernoMode(),
        gameMode: gameMode
    });
    console.log('[Spin] Time state:', {
        isTimeFrozen: isTimeFrozen(),
        timeFreezeReasons: Array.from(timeFreezeReasons),
        timeChallengeActive: timeChallengeActive,
        timeUpShown: timeUpShown,
        timeLeftSec: timeLeftSec
    });
    console.log('[Spin] Spin state:', {
        remainingSpins: remainingSpins,
        isTimeBasedMode: isTimeBasedMode()
    });
    console.log('[Spin] Block state:', {
        totalBlocks: blocks ? blocks.length : 'blocks is null/undefined',
        blocksDefined: typeof blocks !== 'undefined'
    });
    
    // Disallow spin while user-paused or in modal freezes (prevents weird UX and free actions)
    // BUT: Allow spin during level_complete freeze in Inferno mode (same as Time Challenge behavior)
    if (isTimeBasedMode() && isTimeFrozen()) {
        const freezeReasons = Array.from(timeFreezeReasons);
        // In Time Challenge and Inferno, allow spin during level_complete freeze
        // (the level complete modal doesn't prevent spinning)
        if (freezeReasons.includes('level_complete')) {
            // #region agent log
            debugTelemetry({location:'main.js:spinRandomBlocks:allowedDuringLevelComplete',message:'Spin allowed during level_complete freeze (Time Challenge behavior)',data:{reasons:freezeReasons},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'});
            // #endregion
            console.log('[Spin] ✅ Allowing spin during level_complete freeze (Time Challenge behavior)');
            // Continue execution - don't return
        } else {
            // #region agent log
            debugTelemetry({location:'main.js:spinRandomBlocks:blockedFrozen',message:'Spin blocked: time frozen (non-level_complete reason)',data:{reasons:freezeReasons},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'});
            // #endregion
            console.log('[Spin] ❌ BLOCKED: Time is frozen, reasons:', freezeReasons);
            return;
        }
    }
    
    // Check button state at function entry
    const diceButtonCheck = document.getElementById('dice-button');
    if (diceButtonCheck) {
        // #region agent log
        debugTelemetry({location:'main.js:spinRandomBlocks:buttonCheck',message:'Button state at spinRandomBlocks entry',data:{disabled:diceButtonCheck.disabled,hasHandler:diceButtonCheck.dataset.handlerAttached==='true',handlerExists:!!diceButtonClickHandler},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'});
        // #endregion
    }

    // Check if spins are available
    if (!isTimeBasedMode() && remainingSpins <= 0) {
        // #region agent log
        debugTelemetry({location:'main.js:spinRandomBlocks:blockedNoSpins',message:'Spin blocked: no spins remaining',data:{remainingSpins:remainingSpins},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
        // #endregion
        console.log('[Spin] ❌ BLOCKED: No spins remaining (remainingSpins:', remainingSpins, ')');
        return;
    }
    
    if (!blocks || blocks.length === 0) {
        // #region agent log
        debugTelemetry({location:'main.js:spinRandomBlocks:blockedNoBlocks',message:'Spin blocked: no blocks',data:{blocksExists:!!blocks,blocksLength:blocks?blocks.length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'});
        // #endregion
        console.log('[Spin] ❌ BLOCKED: No blocks array or empty blocks');
        return;
    }
    
    console.log('[Spin] ✅ Passed initial checks, total blocks:', blocks.length);
    
    // Filter for eligible blocks: vertical OR single-cell blocks OR horizontal multi-cell blocks
    // Horizontal multi-cell blocks can only rotate 180 degrees (flip direction)
    const eligibleBlocks = blocks.filter(block => 
        (block.isVertical || block.length === 1 || (!block.isVertical && block.length > 1)) &&
        !block.isFalling &&
        !block.isRemoved &&
        !block.removalStartTime &&
        !block.isAnimating
    );
    
    console.log('[Spin] Eligible blocks found:', eligibleBlocks.length);
    
    if (eligibleBlocks.length === 0) {
        console.log('[Spin] BLOCKED: No eligible blocks to spin');
        // Log why blocks are not eligible
        const reasons = {
            total: blocks.length,
            falling: blocks.filter(b => b.isFalling).length,
            removed: blocks.filter(b => b.isRemoved).length,
            hasRemovalStartTime: blocks.filter(b => b.removalStartTime).length,
            isAnimating: blocks.filter(b => b.isAnimating).length,
            notEligibleType: blocks.filter(b => !b.isVertical && b.length !== 1 && (b.isVertical || b.length <= 1)).length
        };
        console.log('[Spin] Block state breakdown:', reasons);
        return; // No eligible blocks to spin
    }
    
    // Time-based modes: spin is a "purchase" that costs time (unlimited spins).
    console.log('[Spin] Applying spin cost...');
    if (isTimeBasedMode() && !timeUpShown) {
        if (timeChallengeActive) {
            console.log('[Spin] Applying time cost (timeChallengeActive is true)');
            timeChallengeApplySpinCost();
        } else {
            // If timeChallengeActive is false but we're in time-based mode, 
            // still allow the spin (timeChallengeActive might not be set yet)
            // This can happen during level generation or initialization
            console.log('[Spin] ⚠️ Time-based mode but timeChallengeActive is false, allowing spin anyway');
        }
    } else {
        // Free Flow: Decrement spin counter
        console.log('[Spin] Decrementing spin counter (Free Flow mode)');
        remainingSpins--;
        updateSpinCounterDisplay();
    }
    
    // Track spin for stats
    console.log('[Spin] Tracking spin for stats...');
    try {
        trackSpin();
    } catch (error) {
        console.error('[Spin] Error tracking spin:', error);
    }
    
    // Spin each block with slight duration randomization for visual variety
    console.log('[Spin] Starting to spin', eligibleBlocks.length, 'blocks...');
    eligibleBlocks.forEach((block, index) => {
        // Add slight delay and duration variation for staggered effect
        const baseDuration = 1800; // 1.8 seconds base
        const durationVariation = 200; // ±200ms variation
        const duration = baseDuration + (Math.random() * 2 - 1) * durationVariation;
        
        // Small delay for staggered start (optional, creates wave effect)
        const delay = index * 20; // 20ms delay between each block
        
        setTimeout(() => {
            try {
                console.log('[Spin] Spinning block', index + 1, 'of', eligibleBlocks.length, ':', { isVertical: block.isVertical, length: block.length });
                if (typeof block.animateRandomSpin === 'function') {
                    block.animateRandomSpin(duration);
                    console.log('[Spin] ✅ Block', index + 1, 'spin animation started');
                } else {
                    console.error('[Spin] ❌ Block does not have animateRandomSpin method!', block);
                }
            } catch (error) {
                console.error('[Spin] ❌ Error spinning block', index + 1, ':', error);
                console.error('[Spin] Error stack:', error.stack);
            }
        }, delay);
    });
    
    console.log('[Spin] ===== spinRandomBlocks FUNCTION COMPLETE =====');
    
    // Check button state after function completes
    const diceButtonAfter = document.getElementById('dice-button');
    if (diceButtonAfter) {
        // #region agent log
        debugTelemetry({location:'main.js:spinRandomBlocks:buttonAfter',message:'Button state after spinRandomBlocks completes',data:{disabled:diceButtonAfter.disabled,hasHandler:diceButtonAfter.dataset.handlerAttached==='true',handlerExists:!!diceButtonClickHandler},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'});
        // #endregion
    }
}

// Pause button + pause modal (applies to both modes; timer freezes in Time Challenge)
const pauseButton = document.getElementById('pause-button');
if (pauseButton) {
    pauseButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showPauseModal();
    });
}

const pauseResumeButton = document.getElementById('pause-resume');
if (pauseResumeButton) {
    pauseResumeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hidePauseModalAndResume();
    });
}

// Settings: MODE toggle opens the mode picker. Changing mode starts a fresh run/game.
const modeToggleButton = document.getElementById('mode-toggle');
if (modeToggleButton) {
    modeToggleButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const prevMode = gameMode;
        const selectedMode = await ensureModeSelected({ forcePrompt: true });
        // If user cancelled (selectedMode is null), don't change mode or start new game
        if (selectedMode === null) {
            return;
        }
        if (gameMode !== prevMode) {
            if (isTimeBasedMode()) {
                timeChallengeResetRun();
                remainingSpins = Number.POSITIVE_INFINITY;
            } else {
                timeChallengeActive = false;
                timeFreezeReasons = new Set();
                timeUpShown = false;
                remainingSpins = 3;
            }
            updateSpinCounterDisplay();
            updateTimerDisplay();
            await startNewGame();
        }
    });
}

// Time Up modal button: restart current level
const timeUpRestartLevelBtn = document.getElementById('time-up-restart-level');
if (timeUpRestartLevelBtn) {
    timeUpRestartLevelBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await restartTimeChallengeLevelFromTimeUp();
    });
}

// Time Up modal button: start a new Time Challenge run
const timeUpNewGameBtn = document.getElementById('time-up-new-game');
if (timeUpNewGameBtn) {
    timeUpNewGameBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await resetTimeChallengeRunFromTimeUp();
    });
}

// Store the click handler functions so we can reattach them if buttons are recreated
let diceButtonClickHandler = null;

// Setup dice button handler - ensure DOM is ready
function setupDiceButton() {
    // #region agent log
    debugTelemetry({location:'main.js:setupDiceButton:entry',message:'setupDiceButton called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
    // #endregion
    const diceButton = document.getElementById('dice-button');
    if (diceButton) {
        // #region agent log
        debugTelemetry({location:'main.js:setupDiceButton:buttonFound',message:'Dice button found in DOM',data:{hasHandler:diceButton.dataset.handlerAttached==='true',disabled:diceButton.disabled,hasListener:!!diceButtonClickHandler},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
        // #endregion
        console.log('[Spin] Dice button found, attaching handler');
        // Check if handler already attached (avoid duplicates)
        if (diceButton.dataset.handlerAttached === 'true') {
            // #region agent log
            debugTelemetry({location:'main.js:setupDiceButton:alreadyAttached',message:'Handler already attached, skipping',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
            // #endregion
            console.log('[Spin] Handler already attached, skipping');
            return;
        }
        diceButton.dataset.handlerAttached = 'true';
        
        // Initialize spin counter display
        updateSpinCounterDisplay();
        
        // Store reference for debug
        window.debugDiceButton = diceButton;
        
        // Create handler function if it doesn't exist
        if (!diceButtonClickHandler) {
            diceButtonClickHandler = (e) => {
            // #region agent log
            debugTelemetry({location:'main.js:setupDiceButton:clickHandler',message:'Dice button click event fired',data:{disabled:diceButton.disabled,timeChallengeActive:timeChallengeActive},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
            // #endregion
            e.preventDefault();
            e.stopPropagation();
            console.log('[Spin] ===== DICE BUTTON CLICKED =====');
            console.log('[Spin] Button state - disabled:', diceButton.disabled, 'opacity:', diceButton.style.opacity, 'pointer-events:', window.getComputedStyle(diceButton).pointerEvents);
            console.log('[Spin] Event details:', { type: e.type, target: e.target, currentTarget: e.currentTarget });
            
            // Check if button is actually enabled
            if (diceButton.disabled) {
                console.log('[Spin] ❌ BUTTON IS DISABLED - click ignored');
                return;
            }
            
            try {
                spinRandomBlocks();
            } catch (error) {
                console.error('[Spin] ❌ ERROR in spinRandomBlocks:', error);
                console.error('[Spin] Error name:', error.name);
                console.error('[Spin] Error message:', error.message);
                console.error('[Spin] Error stack:', error.stack);
            }
                console.log('[Spin] ===== END DICE BUTTON CLICK =====');
            };
        }
        
        // Attach the handler
        // Remove any existing listeners first to avoid duplicates
        if (diceButtonClickHandler) {
            diceButton.removeEventListener('click', diceButtonClickHandler);
        }
        diceButton.addEventListener('click', diceButtonClickHandler);
        
        // Also add mousedown/touchstart listeners to catch if click isn't firing
        diceButton.addEventListener('mousedown', (e) => {
            // #region agent log
            debugTelemetry({location:'main.js:setupDiceButton:mousedown',message:'mousedown event on dice button',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'});
            // #endregion
            console.log('[Spin] 🔍 mousedown event on dice button');
        });
        diceButton.addEventListener('touchstart', (e) => {
            // #region agent log
            debugTelemetry({location:'main.js:setupDiceButton:touchstart',message:'touchstart event on dice button',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'});
            // #endregion
            console.log('[Spin] 🔍 touchstart event on dice button');
        }, { passive: true });
        
        // Verify handler is actually attached
        // #region agent log
        const hasClickListeners = diceButton.onclick !== null || diceButton.getEventListeners ? diceButton.getEventListeners('click') : 'unknown';
        debugTelemetry({location:'main.js:setupDiceButton:handlerAttached',message:'Handler attachment verified',data:{hasHandler:diceButton.dataset.handlerAttached==='true',handlerExists:!!diceButtonClickHandler,buttonId:diceButton.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'});
        // #endregion
        
        // #region agent log
        debugTelemetry({location:'main.js:setupDiceButton:success',message:'Dice button handler attached successfully',data:{handlerExists:!!diceButtonClickHandler},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
        // #endregion
        console.log('[Spin] ✅ Dice button handler attached successfully');
    } else {
        // #region agent log
        debugTelemetry({location:'main.js:setupDiceButton:notFound',message:'Dice button not found in DOM',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'});
        // #endregion
        console.error('[Spin] ❌ Dice button not found! Retrying...');
        // Retry after a short delay if button not found
        setTimeout(setupDiceButton, 100);
    }
}

// Debug button and functions removed - no longer needed

// MutationObserver to detect when buttons are recreated and reattach handlers
function setupButtonWatcher() {
    const gameControls = document.getElementById('game-controls');
    if (!gameControls) {
        // #region agent log
        debugTelemetry({location:'main.js:setupButtonWatcher:noContainer',message:'game-controls container not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'});
        // #endregion
        return;
    }
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // #region agent log
                        debugTelemetry({location:'main.js:setupButtonWatcher:nodeAdded',message:'Node added to game-controls',data:{nodeId:node.id,nodeTag:node.tagName,isDiceButton:node.id==='dice-button',isDebugButton:node.id==='debug-button'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'});
                        // #endregion
                        if (node.id === 'dice-button' || (node.id && node.id.includes('dice-button'))) {
                            // #region agent log
                            debugTelemetry({location:'main.js:setupButtonWatcher:diceButtonRecreated',message:'Dice button recreated, reattaching handler',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'});
                            // #endregion
                            setTimeout(() => setupDiceButton(), 50);
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(gameControls, { childList: true, subtree: true });
    // #region agent log
    debugTelemetry({location:'main.js:setupButtonWatcher:started',message:'Button watcher started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'});
    // #endregion
}

// Setup dice button when DOM is ready
// #region agent log
debugTelemetry({location:'main.js:buttonSetup:entry',message:'Button setup code executing',data:{readyState:document.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
// #endregion
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // #region agent log
        debugTelemetry({location:'main.js:buttonSetup:DOMContentLoaded',message:'DOMContentLoaded fired, setting up buttons',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
        // #endregion
        setupDiceButton();
        setupButtonWatcher();
    });
} else {
    // #region agent log
    debugTelemetry({location:'main.js:buttonSetup:immediate',message:'DOM already ready, setting up buttons immediately',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'});
    // #endregion
    setupDiceButton();
    setupButtonWatcher();
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'D') {
            e.preventDefault();
            console.log('[Debug] Keyboard shortcut triggered (Ctrl+Shift+Alt+D)');
            toggleDebugPanel();
        }
    });
}

// Framing control removed (was previously adjustable in Settings and via gestures).

function setupFramingSlider() {
    // Framing control removed
    return;
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

// Framing control removed (do not initialize slider)

// Update undo button state (enable/disable based on history)
function updateUndoButtonState() {
    const undoButton = document.getElementById('undo-button');
    if (!undoButton) return;

    const hasBlocks = Array.isArray(blocks) && blocks.length > 0;
    const hasActiveAnimations = hasBlocks
        ? blocks.some(b => b && (b.isFalling || b.isAnimating || b.removalStartTime))
        : false;

    const canUndo = moveHistory.length > 0 && !isGeneratingLevel && !hasActiveAnimations;
    undoButton.disabled = !canUndo;
    undoButton.style.opacity = canUndo ? '1' : '0.5';
    undoButton.style.cursor = canUndo ? 'pointer' : 'not-allowed';
}

// Allow Block animations (in `src/Block.js`) to refresh the Undo button once animations complete.
// This avoids the Undo button getting stuck disabled after a move while `isAnimating` was true.
if (typeof window !== 'undefined') {
    window.updateUndoButtonState = updateUndoButtonState;
}

// Initialize camera position
calculateInitialCameraPosition();
updateCameraPosition(); // Position camera immediately to avoid default (0,0,0) view on first frame

// Initialize game (mode selection before spawning the first puzzle)
(async function boot() {
    await ensureModeSelected({ forcePrompt: false });

    if (isTimeBasedMode()) {
        // Time-based modes: load saved progress (or start at level 0 if no progress)
        currentLevel = loadProgress();
        timeChallengeResetRun(); // This sets residual to 0 and initializes state
        // Initial time for the level will be calculated in generateSolvablePuzzle()
        remainingSpins = Number.POSITIVE_INFINITY;
    } else {
        // Free Flow uses saved progress.
        currentLevel = loadProgress();
        timeChallengeActive = false;
        remainingSpins = 3;
    }

    updateSpinCounterDisplay();
    updateTimerDisplay();
    await generateSolvablePuzzle(currentLevel);
})();

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
    
    // Don't process block clicks if any modal is visible
    const visibleModals = document.querySelectorAll('.extended-stats-modal-overlay[style*="flex"]');
    if (visibleModals.length > 0) {
        return; // Modal is open, don't process block clicks
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
        // Auto-fix attempt: if we already have overlaps, don't apply more moves on top of a broken state.
        const fixResult = fixOverlappingBlocks(blocks, gridSize);
        if (fixResult.fixed) {
            console.warn(`Fixed ${fixResult.movedBlocks.length} overlapping block(s). Please click again.`);
        } else {
            if (fixResult.failedOverlaps && fixResult.failedOverlaps.length > 0) {
                console.error(`Failed to fix ${fixResult.failedOverlaps.length} overlap(s) - manual intervention may be needed.`, fixResult.failedOverlaps);
            } else {
                console.error('Failed to fix overlaps - structure still invalid after fix attempt');
            }
            // Try to regenerate the level as a last resort
            // Capture current level to ensure we regenerate the same level, not level 0
            const levelToRegenerate = currentLevel;
            console.warn(`Attempting to regenerate level ${levelToRegenerate} to recover from invalid state...`);
            setTimeout(async () => {
                // Ensure we're using the captured level, not a potentially reset currentLevel
                currentLevel = levelToRegenerate;
                await generateSolvablePuzzle(levelToRegenerate);
                // Save progress after regeneration to ensure level is preserved
                saveProgress();
            }, 500);
        }
        return;
    }
    
    const debugEnabled = typeof window !== 'undefined' && !!window.debugMoveMode;
    const preAttempt = {
        gridX: block.gridX,
        gridZ: block.gridZ,
        yOffset: block.yOffset,
        direction: block.direction ? { ...block.direction } : null,
        length: block.length,
        isVertical: block.isVertical,
        isAnimating: block.isAnimating,
        isFalling: block.isFalling,
        isRemoved: block.isRemoved,
        removalStartTime: block.removalStartTime ?? null
    };

    let canMoveDebugInfo = null;
    if (debugEnabled) {
        // Reset per-attempt so we don't accidentally read stale info.
        window.debugMoveInfo = null;
    }

    // Store if this block will fall (to update solution tracking)
    const moveResult = block.canMove(blocks);
    const willFall = moveResult === 'fall';

    if (debugEnabled) {
        canMoveDebugInfo = safeClone(window.debugMoveInfo);
    }
    
    block.move(blocks, gridSize);

    if (debugEnabled) {
        const postAttempt = {
            gridX: block.gridX,
            gridZ: block.gridZ,
            yOffset: block.yOffset,
            direction: block.direction ? { ...block.direction } : null,
            isAnimating: block.isAnimating,
            isFalling: block.isFalling,
            isRemoved: block.isRemoved,
            removalStartTime: block.removalStartTime ?? null
        };

        const didStartMoving =
            postAttempt.isAnimating ||
            postAttempt.isFalling ||
            (postAttempt.gridX !== preAttempt.gridX) ||
            (postAttempt.gridZ !== preAttempt.gridZ) ||
            (!!postAttempt.removalStartTime);

        if (!didStartMoving) {
            const firstStep = computeFirstStepPotentialBlockers(block, blocks, preAttempt);
            const report = {
                meta: {
                    kind: 'non_moving_block_click',
                    timestamp: Date.now(),
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
                },
                input: {
                    click: { x: event?.clientX ?? null, y: event?.clientY ?? null }
                },
                canMoveResult: moveResult,
                preAttempt,
                postAttempt,
                block: {
                    gridX: block.gridX,
                    gridZ: block.gridZ,
                    yOffset: block.yOffset,
                    length: block.length,
                    isVertical: block.isVertical,
                    direction: block.direction ? { ...block.direction } : null,
                    isAnimating: block.isAnimating,
                    isFalling: block.isFalling,
                    isRemoved: block.isRemoved
                },
                support: {
                    hasSupport: typeof blockHasSupport === 'function' ? blockHasSupport(block, blocks) : null
                },
                physics: {
                    blockBody: snapshotPhysicsState(block)
                },
                diagnostics: {
                    canMoveDebugInfo,
                    moveFirstStepApprox: firstStep
                }
            };

            recordNonMovingReport(report);
        }
    }
    
    // After a block moves, validate structure and fix any overlaps
    setTimeout(() => {
        const structureCheck = validateStructure(blocks, gridSize);
        if (!structureCheck.valid) {
            console.warn('Overlap detected after move, attempting to fix...');
            const fixResult = fixOverlappingBlocks(blocks, gridSize);
            if (fixResult.fixed) {
                console.log(`Fixed ${fixResult.movedBlocks.length} overlapping block(s)`);
            } else {
                if (fixResult.failedOverlaps && fixResult.failedOverlaps.length > 0) {
                    console.error(`Failed to fix ${fixResult.failedOverlaps.length} overlap(s) after move`, fixResult.failedOverlaps);
                } else {
                    console.error('Failed to fix overlaps after move - structure still invalid');
                }
                // Regenerate current level to recover (preserve level)
                const levelToRegenerate = currentLevel;
                console.warn(`Regenerating level ${levelToRegenerate} to recover from post-move overlap...`);
                setTimeout(async () => {
                    currentLevel = levelToRegenerate;
                    await generateSolvablePuzzle(levelToRegenerate);
                    saveProgress();
                }, 500);
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
    // PHYSICS RULE: Blocks are solid and stack when there's at least one supporting cell underneath
    // Blocks on the ground (base plate) always have support
    if (block.yOffset === 0) {
        return true;
    }
    
    // PHYSICS RULE: Check ALL cells the block occupies, not just center/base
    // Any cell directly below any part of the block provides support
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
            
            // PHYSICS RULE: Check if the supporting block occupies this specific cell
            // This ensures support is checked for ALL cells, not just center
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
 * PHYSICS RULE: Check all blocks and trigger falling for those that lost support
 * Blocks fall until they reach the base plate (yOffset = 0) or another supporting block
 * CRITICAL: Blocks must not overlap during or after falling
 */
function checkAndTriggerFalling(blocks) {
    // Skip support checking during level generation to prevent false positives
    // Blocks are placed with proper support during generation, but the check might
    // run before all blocks are fully initialized, causing blocks to fall incorrectly
    if (isGeneratingLevel || window.supportCheckingEnabled === false) {
        return;
    }
    
    // IMPORTANT: Batch detect unsupported blocks so chain reactions happen simultaneously.
    // Without batching, the simulation becomes "stepped" (lower blocks fall first, then above),
    // because support evaluation is done against the current state and only discovers the next
    // unsupported block after the previous one lands.
    //
    // We treat blocks that are *also going to fall in this batch* as NOT providing support.
    // Then we compute final landing targets bottom→top and animate all affected blocks together.

    const eligible = blocks.filter(b => {
        if (b.isRemoved || b.isFalling) return false;
        if (b.isAnimating) return false; // don't fight other animations (move, etc.)
        return b.yOffset > 0; // only upper-layer blocks can lose support
    });

    // Compute closure of blocks that become unsupported if we remove all blocks already selected to fall.
    const toFall = new Set();
    let changed = true;
    while (changed) {
        changed = false;
        for (const b of eligible) {
            if (toFall.has(b)) continue;
            if (!blockHasSupportExcluding(b, blocks, toFall)) {
                toFall.add(b);
                changed = true;
            }
        }
    }

    if (toFall.size === 0) return;

    // Compute landing Y targets for each falling block, considering:
    // - static blocks (not in toFall)
    // - already-resolved falling blocks (using their computed target Y)
    const targets = computeSupportFallTargets(blocks, toFall);

    for (const [block, targetYOffset] of targets.entries()) {
        if (targetYOffset >= block.yOffset) continue;
        console.log(`Block at (${block.gridX}, ${block.gridZ}) yOffset=${block.yOffset} lost support, falling to yOffset=${targetYOffset}`);
        startBlockFallingToTarget(block, targetYOffset);
    }
}

/**
 * Like blockHasSupport, but treats blocks in `excluded` as if they don't exist (they provide no support).
 */
function blockHasSupportExcluding(block, allBlocks, excluded) {
    if (block.yOffset === 0) return true;
    const blockCells = getBlockCells(block);

    for (const cell of blockCells) {
        let cellHasSupport = false;
        for (const other of allBlocks) {
            if (other === block || other.isFalling || other.isRemoved) continue;
            if (excluded && excluded.has(other)) continue;
            if (other.yOffset >= block.yOffset) continue;

            const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
            const otherTop = other.yOffset + otherHeight;
            if (otherTop < block.yOffset - 0.01) continue;

            const otherCells = getBlockCells(other);
            for (const otherCell of otherCells) {
                if (otherCell.x === cell.x && otherCell.z === cell.z) {
                    cellHasSupport = true;
                    break;
                }
            }

            if (cellHasSupport) break;
        }
        if (cellHasSupport) return true;
    }
    return false;
}

/**
 * PHYSICS RULE: Compute final landing yOffset for every block in `toFall` (a Set), using a bottom→top pass.
 * This makes chain-reaction drops animate simultaneously while still landing in correct stacked order.
 * CRITICAL: Ensures blocks land at correct Y level without creating overlaps
 */
function computeSupportFallTargets(allBlocks, toFall) {
    const fallBlocks = Array.from(toFall);
    // Process bottom→top: lower blocks' targets must be known before higher blocks can land on them.
    // This ensures blocks can land on other falling blocks correctly
    fallBlocks.sort((a, b) => (a.yOffset - b.yOffset));

    const targets = new Map();

    // Helper to query the "top surface" of a support block.
    const getBlockTop = (b) => {
        const baseY = targets.has(b) ? targets.get(b) : b.yOffset;
        const h = b.isVertical ? b.length * b.cubeSize : b.cubeSize;
        return baseY + h;
    };

    for (const block of fallBlocks) {
        // PHYSICS RULE: Check ALL cells the block occupies to find highest support
        // Block lands at the highest support level found across all its cells
        const blockCells = getBlockCells(block);
        let targetYOffset = 0; // Start at base plate

        for (const cell of blockCells) {
            let highestSupportY = 0; // Base plate level
            for (const other of allBlocks) {
                if (other === block || other.isFalling || other.isRemoved) continue;

                const otherInFallSet = toFall.has(other);
                // Only allow other falling blocks to act as support if we've already computed their target.
                if (otherInFallSet && !targets.has(other)) continue;
                // Static supports must be below current bottom; resolved falling supports use their target position.
                const otherBaseY = otherInFallSet ? targets.get(other) : other.yOffset;
                if (otherBaseY >= block.yOffset) continue;

                // Check if other block occupies this cell
                const otherCells = getBlockCells(other);
                let occupiesCell = false;
                for (const otherCell of otherCells) {
                    if (otherCell.x === cell.x && otherCell.z === cell.z) {
                        occupiesCell = true;
                        break;
                    }
                }
                if (!occupiesCell) continue;

                // Calculate top of supporting block
                const otherTop = getBlockTop(other);
                if (otherTop > highestSupportY) highestSupportY = otherTop;
            }
            // Use highest support found across all cells
            if (highestSupportY > targetYOffset) targetYOffset = highestSupportY;
        }

        // Safety: never "fall up" (blocks can only fall down)
        targetYOffset = Math.min(targetYOffset, block.yOffset);
        targets.set(block, targetYOffset);
    }

    return targets;
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
    
    // Use the generic animation helper for consistency.
    startBlockFallingToTarget(block, targetYOffset);
}

/**
 * Animate a support-fall to a precomputed targetYOffset.
 * Used both for single-block support loss and batched chain reactions.
 */
function startBlockFallingToTarget(block, targetYOffset) {
    if (block.isFalling || block.isRemoved || block.isAnimating) return;
    if (targetYOffset >= block.yOffset) return;

    block.isAnimating = true;
    const startY = block.yOffset;
    const startTime = performance.now();
    const fallDistance = startY - targetYOffset;

    // Fast slam: higher effective gravity and tighter caps, with acceleration curve.
    // d = 1/2 g t^2 => t = sqrt(2d/g)
    const SUPPORT_FALL_EFFECTIVE_G = 85;
    const SUPPORT_FALL_MIN_MS = 80;
    const SUPPORT_FALL_MAX_MS = 450;
    const fallDuration = Math.min(
        SUPPORT_FALL_MAX_MS,
        Math.max(
            SUPPORT_FALL_MIN_MS,
            Math.sqrt((2 * Math.max(0.0001, fallDistance)) / SUPPORT_FALL_EFFECTIVE_G) * 1000
        )
    );

    let fallAnimationId = null;
    const animateFall = () => {
        if (block.isRemoved || !blocks.includes(block) || isGeneratingLevel) {
            if (fallAnimationId !== null) cancelAnimationFrame(fallAnimationId);
            block.isAnimating = false;
            return;
        }

        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / fallDuration, 1);
        const eased = progress * progress; // accelerating downward

        block.yOffset = startY + (targetYOffset - startY) * eased;
        block.updateWorldPosition();

        if (progress < 1) {
            fallAnimationId = requestAnimationFrame(animateFall);
        } else {
            block.yOffset = targetYOffset;
            block.updateWorldPosition();
            block.isAnimating = false;
            fallAnimationId = null;
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
    hadDoubleTouch: false, // Track if we ever had 2 touches in this gesture sequence (prevents block selection)
};

// Touch start handler
renderer.domElement.addEventListener('touchstart', (event) => {
    event.preventDefault();
    
    touchState.touches = Array.from(event.touches);
    touchState.isActive = true;
    
    touchState.hadDoubleTouch = false;
    
    if (touchState.touches.length === 1) {
        // Single touch - orbit mode
        // CRITICAL: Sync current values to target values when user starts dragging
        // This prevents camera jump when rotation starts (current and target may be out of sync)
        currentAzimuth = targetAzimuth;
        currentElevation = targetElevation;
        currentRadius = targetRadius;
        
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
        // Dual touch - pinch to zoom OR (non-pinch) framing tilt
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
        
        const PINCH_THRESHOLD = 0.05;
        // Determine gesture: pinch (distance change)
        if (distanceChange > PINCH_THRESHOLD) {
            if (!touchState.isPinching) {
                touchState.isPinching = true;
                // CRITICAL: Sync current radius to target radius when pinch starts
                // This prevents camera jump when zoom starts (current and target may be out of sync)
                currentRadius = targetRadius;
            }

            const zoomFactor = currentDistance / touchState.startDistance;
            targetRadius /= zoomFactor;
            targetRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, targetRadius));
            // Sync smoothed auto-zoom radius to manual zoom so auto-zoom doesn't fight when it re-enables
            smoothedAutoZoomRadius = targetRadius;
            touchState.startDistance = currentDistance;
            
            // Disable auto-zoom when user manually zooms
            autoZoomDisabledUntilMs = performance.now() + AUTO_ZOOM_DISABLE_DURATION_MS;
        } else {
            // Not pinching: treat as framing drag (vertical, center-of-two-fingers).
            touchState.isPinching = false;

            const deltaY = currentCenter.y - touchState.lastCenter.y;
            const next = clampFramingOffsetY(framingOffsetY + (deltaY * TWO_FINGER_FRAMING_SENSITIVITY));
            if (next !== framingOffsetY) {
                framingOffsetY = next;
                if (typeof window !== 'undefined') window.framingOffsetY = framingOffsetY;
                updateCameraPosition(); // apply immediately; light/shadow updates are gated elsewhere
                try {
                    localStorage.setItem('jarrows_framing', framingOffsetY.toString());
                } catch {
                    // ignore
                }
            }

            // Rebase distance so minor drift doesn't eventually trip the pinch threshold.
            touchState.startDistance = currentDistance;
        }

        touchState.lastCenter = currentCenter;
        
        touchState.touches = currentTouches;
    }
}, { passive: false });

// Touch end handler
renderer.domElement.addEventListener('touchend', (event) => {
    event.preventDefault();
    
    const remainingTouches = Array.from(event.touches);
    
    if (remainingTouches.length === 0) {
        // All touches ended - hadDoubleTouch will be cleared in onTouchEnd after check
        touchState.isActive = false;
        touchState.touches = [];
        touchState.isPinching = false;
    } else if (remainingTouches.length === 1) {
        // One touch ended, switch to single touch mode
        // Keep hadDoubleTouch flag true to prevent block selection from remaining touch
        touchState.touches = remainingTouches;
        const touch = remainingTouches[0];
        touchState.lastCenter = { x: touch.clientX, y: touch.clientY };
    }
}, { passive: false });

// Touch handler for mobile block interaction
let touchStartPos = null;
let touchStartTime = null;
const TOUCH_DRAG_THRESHOLD = 5; // pixels - minimum movement to consider it a drag

function onTouchEnd(event) {
    // Don't process block taps if any modal is visible
    const visibleModals = document.querySelectorAll('.extended-stats-modal-overlay[style*="flex"]');
    if (visibleModals.length > 0) {
        return; // Modal is open, don't process block taps
    }
    
    // Prevent block selection if we had a double touch gesture (pinch or framing control)
    // This ensures no blocks are selected after completing double touch gestures
    if (touchState.hadDoubleTouch) {
        // Only clear hadDoubleTouch when all touches have ended
        if (event.touches.length === 0) {
            touchState.hadDoubleTouch = false;
        }
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
                if (fixResult.failedOverlaps && fixResult.failedOverlaps.length > 0) {
                    console.error(`Failed to fix ${fixResult.failedOverlaps.length} overlap(s) after move`, fixResult.failedOverlaps);
                } else {
                    console.error('Failed to fix overlaps after move - structure still invalid');
                }
                // Regenerate current level to recover (preserve level)
                const levelToRegenerate = currentLevel;
                console.warn(`Regenerating level ${levelToRegenerate} to recover from post-move overlap...`);
                setTimeout(async () => {
                    currentLevel = levelToRegenerate;
                    await generateSolvablePuzzle(levelToRegenerate);
                    saveProgress();
                }, 500);
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
// Support check interval is now calculated dynamically based on quality preset

// Cache block state flags to avoid full iteration every frame
let cachedHasFallingBlocks = false;
let cachedHasActiveAnimations = false;
let cachedHasPhysicsBlocks = false;
let lastBlockStateCheckTime = 0;

// Battery/perf: cap frame rate on iOS (avoids 120Hz ProMotion drain) and downclock further when idle.
let ACTIVE_FRAME_MS = 1000 / qualityCaps.activeFps;
let IDLE_FRAME_MS = 1000 / qualityCaps.idleFps;
let nextFrameDelayMs = ACTIVE_FRAME_MS;
let lastFrameTick = performance.now();
let rafId = null;
let frameCapTimeoutId = null;
let isPaused = false;

let lastTimerUiMs = 0;
const TIMER_UI_INTERVAL_MS = 250; // 4Hz is enough; avoids per-frame DOM writes on mobile

// Shadow update gating: only update expensive shadow maps when interaction or physics motion occurs.
let lastLightUpdateMs = 0;
let LIGHT_UPDATE_INTERVAL_MS = isIOS ? 80 : 33; // iOS: conservative by default; adjusted by quality preset
let lastShadowMapUpdateMs = 0;
let SHADOW_MAP_UPDATE_INTERVAL_MS = isIOS ? 80 : 33;
let shadowUpdateCooldownUntilMs = 0;
// Shadow cooldown is now calculated dynamically based on battery mode and camera state

// Smooth light interpolation to prevent jitter in battery mode
// Store target positions that are updated at intervals, then interpolate smoothly every frame
let targetKeyLightPosition = null;
let targetFillLightPosition = null;

// FPS tracking
let fpsFrameCount = 0;
let fpsLastUpdate = performance.now();
let fpsUpdateInterval = 500; // Update FPS display every 500ms
const fpsElement = document.getElementById('fps-counter');

function applyQualityPreset(nextPreset) {
    const normalized = (nextPreset === 'battery' || nextPreset === 'balanced' || nextPreset === 'performance')
        ? nextPreset
        : 'balanced';

    qualityPreset = normalized;
    qualityCaps = getQualityCaps(qualityPreset);

    ACTIVE_FRAME_MS = 1000 / qualityCaps.activeFps;
    IDLE_FRAME_MS = 1000 / qualityCaps.idleFps;

    // Apply DPR immediately
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qualityCaps.dprCap));

    // Performance preset: improve shadow "motion" quality for fast-moving blocks (catapult/fall).
    // Root issue: with high FPS/DPR, the previous iOS shadow update cadence (~80ms) makes shadows step/flicker.
    if (isIOS) {
        if (qualityPreset === 'performance') {
            LIGHT_UPDATE_INTERVAL_MS = 33;           // ~30Hz light tracking while in the shadow update window
            SHADOW_MAP_UPDATE_INTERVAL_MS = 33;      // ~30Hz shadow refresh during motion
            // In performance mode, allow softer filtering on iOS (more natural penumbra at higher DPR).
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            // Increase iOS shadow map resolution for cleaner moving shadows (trade battery for quality).
            if (lights && lights.keyLight && lights.keyLight.shadow) {
                lights.keyLight.shadow.mapSize.set(2048, 2048);
                // Slightly softer edges for a less "cutout" look.
                lights.keyLight.shadow.radius = 3;
                // Force a resize by disposing existing shadow map if present.
                if (lights.keyLight.shadow.map) {
                    lights.keyLight.shadow.map.dispose();
                    lights.keyLight.shadow.map = null;
                }
                renderer.shadowMap.needsUpdate = true;
            }
        } else {
            // Battery/Balanced: keep conservative iOS shadow settings
            LIGHT_UPDATE_INTERVAL_MS = 80;
            SHADOW_MAP_UPDATE_INTERVAL_MS = 80;
            renderer.shadowMap.type = THREE.PCFShadowMap;
            if (lights && lights.keyLight && lights.keyLight.shadow) {
                lights.keyLight.shadow.mapSize.set(1024, 1024);
                lights.keyLight.shadow.radius = 1;
                if (lights.keyLight.shadow.map) {
                    lights.keyLight.shadow.map.dispose();
                    lights.keyLight.shadow.map = null;
                }
                renderer.shadowMap.needsUpdate = true;
            }
        }
        // Warm shadows briefly so the new settings take effect immediately.
        // Use normal cooldown for warm-up (not extended idle cooldown)
        const warmupCooldownMs = isIOS ? 600 : 350;
        shadowUpdateCooldownUntilMs = performance.now() + warmupCooldownMs;
        lastLightUpdateMs = 0;
        lastShadowMapUpdateMs = 0;
    }

    // Persist (Settings UI also persists, but keep engine robust)
    try {
        localStorage.setItem('jarrows_quality', qualityPreset);
    } catch {
        // ignore
    }
}

// Expose for Settings UI (index.html inline script)
if (typeof window !== 'undefined') {
    window.applyQualityPreset = applyQualityPreset;
}

// Apply saved preset once lights exist (ensures shadow-quality overrides can take effect)
applyQualityPreset(qualityPreset);

function scheduleNextFrame() {
    if (isPaused) return;
    if (isIOS) {
        // Use a timer to avoid running this callback at 120Hz on ProMotion devices.
        if (frameCapTimeoutId !== null) return;
        frameCapTimeoutId = window.setTimeout(() => {
            frameCapTimeoutId = null;
            rafId = requestAnimationFrame(animate);
        }, nextFrameDelayMs);
    } else {
        rafId = requestAnimationFrame(animate);
    }
}

function animate() {
    scheduleNextFrame();
    
    const currentTime = performance.now();
    // Extra guard for non-iOS browsers: skip work if called too quickly.
    if (!isIOS && (currentTime - lastFrameTick) < (nextFrameDelayMs - 0.5)) {
        return;
    }
    lastFrameTick = currentTime;

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Time Challenge countdown (survival)
    // - drains in real time (1.0x)
    // - pauses during user pause, rules/modal overlays, level-complete modal, background tab, and time animation
    // - does NOT drain during level generation (fairness)
    if (isTimeBasedMode() && timeChallengeActive && !timeUpShown) {
        const canDrain = !isTimeFrozen() && !isGeneratingLevel && !isPaused && !timeAnimationActive;
        if (canDrain) {
            timeLeftSec -= deltaTime;
            if (timeLeftSec <= 0) {
                timeLeftSec = 0;
                updateTimerDisplay();
                showTimeUpModal();
            }
        }
    }
    
    // Update tower group position
    _towerGroupWorldCenter.copy(towerCenter).add(towerPositionOffset);
    towerGroup.position.copy(_towerGroupWorldCenter);
    towerGroup.rotation.set(0, 0, 0); // Always locked to zero
    
    // Dynamic zoom during spawn - uses unified calculation with auto-zoom
    if (isGeneratingLevel && blocks.length > 0) {
        // For first blocks or when enough time has passed, update zoom immediately
        const timeSinceLastUpdate = currentTime - lastSpawnZoomUpdateMs;
        const shouldUpdateNow = lastSpawnZoomUpdateMs === 0 || timeSinceLastUpdate > SPAWN_ZOOM_UPDATE_INTERVAL_MS;
        
        if (shouldUpdateNow) {
            lastSpawnZoomUpdateMs = currentTime;

            _spawnZoomBox.makeEmpty();
            // Ensure all blocks have updated world matrices before calculating bounding box
            for (const block of blocks) {
                if (!block || !block.group) continue;
                block.group.updateMatrixWorld(true);
                _spawnZoomBox.expandByObject(block.group);
            }

            const size = _spawnZoomBox.getSize(_spawnZoomSize);
            
            // If bounding box is empty or invalid, skip this update
            if (_spawnZoomBox.isEmpty() || size.x === 0 || size.y === 0 || size.z === 0) {
                // Skip invalid bounding box
            } else {
                // Ensure minimum bounding box size to prevent zooming in too much
                if (size.x < AUTO_ZOOM_MIN_BOUNDING_SIZE) size.x = AUTO_ZOOM_MIN_BOUNDING_SIZE;
                if (size.y < AUTO_ZOOM_MIN_BOUNDING_SIZE) size.y = AUTO_ZOOM_MIN_BOUNDING_SIZE;
                if (size.z < AUTO_ZOOM_MIN_BOUNDING_SIZE) size.z = AUTO_ZOOM_MIN_BOUNDING_SIZE;

                // Use unified zoom calculation (same as auto-zoom)
                const fov = camera.fov * (Math.PI / 180);
                const aspect = camera.aspect;
                const effectivePadding = ZOOM_PADDING; // Use standard padding, not spawn-specific

                // Calculate distance needed for height (vertical FOV)
                const heightDistance = (size.y + effectivePadding) / (2 * Math.tan(fov / 2));

                // Calculate distance needed for width/depth (horizontal FOV)
                const horizontalDiagonal = Math.sqrt(size.x * size.x + size.z * size.z);
                const widthDistance = (horizontalDiagonal + effectivePadding) / (2 * Math.tan(fov / 2) * aspect);

                // Use the larger distance with a safety margin to ensure all blocks stay visible
                // This matches auto-zoom calculation for smooth transition
                const safetyMargin = 1.3; // 30% safety margin during spawn - ensure all blocks visible
                const requiredDistance = Math.max(heightDistance, widthDistance) * safetyMargin;
                const clampedRequiredDistance = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, requiredDistance));
                // During spawn, update smoothed auto-zoom immediately for responsive feel
                smoothedAutoZoomRadius = clampedRequiredDistance;
                // #region agent log
                const oldTargetRadius = targetRadius;
                // #endregion
                targetRadius = smoothedAutoZoomRadius;
                // #region agent log
                // Replaced with debugTelemetry to prevent ERR_INSUFFICIENT_RESOURCES
                // debugTelemetry({location:'main.js:animate:spawnZoom',message:'Spawn zoom update',data:{blocksCount:blocks.length,sizeX:size.x.toFixed(2),sizeY:size.y.toFixed(2),sizeZ:size.z.toFixed(2),heightDistance:heightDistance.toFixed(2),widthDistance:widthDistance.toFixed(2),requiredDistance:requiredDistance.toFixed(2),oldTargetRadius:oldTargetRadius.toFixed(2),newTargetRadius:targetRadius.toFixed(2),currentRadius:currentRadius.toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
                // #endregion
            }
        }
    }
    
    // Auto-zoom during gameplay (smoothly frame all blocks except catapulted ones)
    // Skip if user has manually zoomed recently (allow override) or if auto-zoom is disabled in settings
    const isAutoZoomDisabled = currentTime < autoZoomDisabledUntilMs;
    const isAutoZoomEnabled = (typeof window !== 'undefined' && window.autoZoomEnabled !== undefined) 
        ? window.autoZoomEnabled 
        : true; // Default to enabled if not set
    
    // #region agent log
    // Removed per-frame telemetry call to prevent ERR_INSUFFICIENT_RESOURCES
    // Use debugTelemetry() instead if debug telemetry is needed (it has proper throttling/guards)
    // if (!isGeneratingLevel && blocks.length > 0) {
    //     debugTelemetry({location:'main.js:animate:autoZoom:beforeThrottle',message:'Auto-zoom before throttle check',data:{isAutoZoomDisabled:isAutoZoomDisabled,isAutoZoomEnabled:isAutoZoomEnabled,timeSinceLastUpdate:currentTime-lastAutoZoomUpdateMs,willRun:(currentTime-lastAutoZoomUpdateMs)>AUTO_ZOOM_UPDATE_INTERVAL_MS,targetRadius:targetRadius.toFixed(2),currentRadius:currentRadius.toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'});
    // }
    // #endregion
    
    if (!isGeneratingLevel && blocks.length > 0 && !isAutoZoomDisabled && isAutoZoomEnabled) {
        // Throttle expensive bounding-box calculation to avoid long rAF frames
        if ((currentTime - lastAutoZoomUpdateMs) > AUTO_ZOOM_UPDATE_INTERVAL_MS) {
            lastAutoZoomUpdateMs = currentTime;

            _autoZoomBox.makeEmpty();
            let hasNonCatapultedBlocks = false;
            
            // Calculate effective tower center (with offset) for bounding box calculation
            _effectiveTowerCenter.copy(towerCenter).add(towerPositionOffset);
            
            for (const block of blocks) {
                if (!block || !block.group || block.isRemoved) continue;
                // Exclude catapulted blocks from auto-zoom calculation
                if (block.wasCatapulted) continue;
                
                block.group.updateMatrixWorld(true);
                _autoZoomBox.expandByObject(block.group);
                hasNonCatapultedBlocks = true;
            }

            // #region agent log
            // Replaced with debugTelemetry to prevent ERR_INSUFFICIENT_RESOURCES
            // debugTelemetry({location:'main.js:animate:autoZoom:beforeCheck',message:'Auto-zoom before condition check',data:{hasNonCatapultedBlocks:hasNonCatapultedBlocks,isEmpty:_autoZoomBox.isEmpty(),blocksCount:blocks.length,towerOffsetY:towerPositionOffset.y.toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
            // #endregion

            // Only update zoom if we have non-catapulted blocks to frame
            if (hasNonCatapultedBlocks && !_autoZoomBox.isEmpty()) {
                // Get bounding box size - this is in world space, which is correct
                // because the camera position is also in world space relative to effective tower center
                let size = _autoZoomBox.getSize(_autoZoomSize);
                
                // #region agent log
                // Replaced with debugTelemetry to prevent ERR_INSUFFICIENT_RESOURCES
                // const boxMin = _autoZoomBox.min;
                // const boxMax = _autoZoomBox.max;
                // debugTelemetry({location:'main.js:animate:autoZoom:boundingBox',message:'Auto-zoom bounding box',data:{sizeX:size.x.toFixed(2),sizeY:size.y.toFixed(2),sizeZ:size.z.toFixed(2),minX:boxMin.x.toFixed(2),minY:boxMin.y.toFixed(2),minZ:boxMin.z.toFixed(2),maxX:boxMax.x.toFixed(2),maxY:boxMax.y.toFixed(2),maxZ:boxMax.z.toFixed(2),towerOffsetY:towerPositionOffset.y.toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
                // #endregion

                // Ensure minimum bounding box size to prevent zooming in too much with few blocks
                // This ensures all blocks stay in frame even when there are very few blocks
                if (size.x < AUTO_ZOOM_MIN_BOUNDING_SIZE) size.x = AUTO_ZOOM_MIN_BOUNDING_SIZE;
                if (size.y < AUTO_ZOOM_MIN_BOUNDING_SIZE) size.y = AUTO_ZOOM_MIN_BOUNDING_SIZE;
                if (size.z < AUTO_ZOOM_MIN_BOUNDING_SIZE) size.z = AUTO_ZOOM_MIN_BOUNDING_SIZE;

                // Calculate required distance to fit all non-catapulted blocks
                // Use unified calculation (same as spawn zoom) for smooth transition
                const fov = camera.fov * (Math.PI / 180);
                const aspect = camera.aspect;
                const effectivePadding = ZOOM_PADDING; // Standard padding

                // Calculate distance needed for height (vertical FOV)
                const heightDistance = (size.y + effectivePadding) / (2 * Math.tan(fov / 2));

                // Calculate distance needed for width/depth (horizontal FOV)
                const horizontalDiagonal = Math.sqrt(size.x * size.x + size.z * size.z);
                const widthDistance = (horizontalDiagonal + effectivePadding) / (2 * Math.tan(fov / 2) * aspect);

                // Use the larger distance with a safety margin to ensure all blocks stay visible
                // This accounts for perspective distortion, camera lookAt offset, and edge cases
                // The camera looks at tower center + framingOffsetY, which may be offset from bounding box center
                // Use a larger margin (1.2 = 20% safety margin) to ensure all blocks visible
                const safetyMargin = 1.2; // 20% safety margin - accounts for lookAt offset and perspective
                const requiredDistance = Math.max(heightDistance, widthDistance) * safetyMargin;
                const clampedRequiredDistance = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, requiredDistance));
                // Smooth the auto-zoom target to prevent jerky movement when bounding box changes
                // This creates a stable target that gradually approaches the desired distance
                const AUTO_ZOOM_SMOOTHING = 0.3; // Smooth auto-zoom target updates
                smoothedAutoZoomRadius += (clampedRequiredDistance - smoothedAutoZoomRadius) * AUTO_ZOOM_SMOOTHING;
                // #region agent log
                const oldTargetRadius = targetRadius;
                // #endregion
                targetRadius = smoothedAutoZoomRadius;
                // #region agent log
                // Replaced with debugTelemetry to prevent ERR_INSUFFICIENT_RESOURCES
                // debugTelemetry({location:'main.js:animate:autoZoom',message:'Auto-zoom update',data:{blocksCount:blocks.length,sizeX:size.x.toFixed(2),sizeY:size.y.toFixed(2),sizeZ:size.z.toFixed(2),heightDistance:heightDistance.toFixed(2),widthDistance:widthDistance.toFixed(2),requiredDistance:requiredDistance.toFixed(2),oldTargetRadius:oldTargetRadius.toFixed(2),newTargetRadius:targetRadius.toFixed(2),currentRadius:currentRadius.toFixed(2),currentElevation:(currentElevation*180/Math.PI).toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
                // #endregion
                
                // Debug: log auto-zoom calculation (can be removed later)
                if (typeof window !== 'undefined' && window.jarrows_debug === '1') {
                    console.log('[Auto-zoom]', {
                        requiredDistance: requiredDistance.toFixed(2),
                        targetRadius: targetRadius.toFixed(2),
                        size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) }
                    });
                }
            }
        }
    }
    
    // Smooth interpolation - balanced for responsive yet smooth movement
    // Higher smoothing = faster response = smoother feel
    const smoothing = isGeneratingLevel ? 0.25 : 0.15; // Increased from 0.04 to 0.15 for smoother, more responsive camera
    // #region agent log
    const oldCurrentRadius = currentRadius;
    const oldTargetRadius = targetRadius;
    // #endregion
    currentRadius += (targetRadius - currentRadius) * smoothing;
    currentAzimuth += (targetAzimuth - currentAzimuth) * smoothing;
    currentElevation += (targetElevation - currentElevation) * smoothing;
    
    // Smooth interpolation of tower position offset to prevent camera jumps
    // Use faster smoothing during level generation for responsive feel
    const towerOffsetSmoothing = isGeneratingLevel ? 0.3 : 0.2;
    towerPositionOffset.x += (targetTowerPositionOffset.x - towerPositionOffset.x) * towerOffsetSmoothing;
    towerPositionOffset.y += (targetTowerPositionOffset.y - towerPositionOffset.y) * towerOffsetSmoothing;
    towerPositionOffset.z += (targetTowerPositionOffset.z - towerPositionOffset.z) * towerOffsetSmoothing;
    // #region agent log
    // Replaced with debugTelemetry to prevent ERR_INSUFFICIENT_RESOURCES
    // if (Math.abs(oldCurrentRadius - currentRadius) > 0.1 || Math.abs(oldTargetRadius - targetRadius) > 0.1) {
    //     debugTelemetry({location:'main.js:animate:interpolation',message:'Camera radius interpolation',data:{isGeneratingLevel:isGeneratingLevel,smoothing:smoothing.toFixed(3),oldCurrentRadius:oldCurrentRadius.toFixed(2),newCurrentRadius:currentRadius.toFixed(2),oldTargetRadius:oldTargetRadius.toFixed(2),newTargetRadius:targetRadius.toFixed(2),delta:Math.abs(currentRadius-oldCurrentRadius).toFixed(2)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
    // }
    // #endregion

    // Snap to target when close to avoid endless micro-updates (saves battery, stabilizes idle frames)
    const SNAP_EPS = 1e-4;
    const dr = Math.abs(targetRadius - currentRadius);
    const da = Math.abs(targetAzimuth - currentAzimuth);
    const de = Math.abs(targetElevation - currentElevation);
    if (dr < SNAP_EPS) currentRadius = targetRadius;
    if (da < SNAP_EPS) currentAzimuth = targetAzimuth;
    if (de < SNAP_EPS) currentElevation = targetElevation;
    
    // Only update camera if it's actually moving
    // This saves CPU when camera is stationary
    const cameraStillMoving = (dr >= SNAP_EPS) || (da >= SNAP_EPS) || (de >= SNAP_EPS);
    if (cameraStillMoving || 
        dr > SNAP_EPS ||
        da > SNAP_EPS ||
        de > SNAP_EPS) {
        updateCameraPosition();
    }
    
    // Determine if we need expensive shadow updates this frame
    const isBatteryQuality = qualityPreset === 'battery';
    const interacting = isDraggingCamera || (touchState && touchState.isActive);
    
    // Cache block state flags to avoid full iteration every frame
    // In battery mode when idle, only check block state periodically (every 100ms)
    // First check if we need to iterate based on simple conditions
    const BLOCK_STATE_CHECK_INTERVAL = isBatteryQuality ? 100 : 16;
    const needsFullIteration = interacting || 
                              cameraStillMoving ||
                              isGeneratingLevel ||
                              !isBatteryQuality ||
                              (isBatteryQuality && (currentTime - lastBlockStateCheckTime > BLOCK_STATE_CHECK_INTERVAL));
    
    if (needsFullIteration) {
        cachedHasFallingBlocks = false;
        cachedHasActiveAnimations = false;
        cachedHasPhysicsBlocks = false;
        for (const block of blocks) {
            if (!block) continue;
            if (block.isFalling) {
                cachedHasFallingBlocks = true;
                if (block.physicsBody) cachedHasPhysicsBlocks = true;
            }
            if (block.isAnimating || (block.removalStartTime && !block.isRemoved)) {
                cachedHasActiveAnimations = true;
            }
            if (cachedHasFallingBlocks && cachedHasActiveAnimations && cachedHasPhysicsBlocks) break;
        }
        lastBlockStateCheckTime = currentTime;
    }
    
    // Use cached values
    const hasFallingBlocks = cachedHasFallingBlocks;
    const hasActiveAnimations = cachedHasActiveAnimations;
    const hasPhysicsBlocks = cachedHasPhysicsBlocks;
    const isActiveFrame = interacting || hasFallingBlocks || cameraStillMoving || hasActiveAnimations || isGeneratingLevel;
    nextFrameDelayMs = isActiveFrame ? ACTIVE_FRAME_MS : IDLE_FRAME_MS;
    
    // Keep shadow updates "warm" while the camera is settling (smoothing) and for a short cooldown after interaction.
    // This prevents noticeable shadow direction/strength jumps when updates are gated too aggressively.
    // Battery preset: don't burn battery refreshing shadow maps during block motion/catapult/melt;
    // only update shadows during camera interaction/settle and during level generation.
    const shouldWarmShadows =
        isGeneratingLevel ||
        interacting ||
        cameraStillMoving ||
        (!isBatteryQuality && (hasFallingBlocks || hasActiveAnimations));

    // Calculate shadow cooldown based on battery mode and camera state
    // Extended cooldown when idle in battery mode to save battery
    const isCameraIdle = !cameraStillMoving && !interacting;
    const shadowCooldownMs = (isBatteryQuality && isCameraIdle) 
        ? 1200  // Extended cooldown when idle in battery mode
        : (isIOS ? 600 : 350);  // Normal cooldown

    if (shouldWarmShadows) {
        shadowUpdateCooldownUntilMs = currentTime + shadowCooldownMs;
    }
    const needShadowsThisFrame = currentTime < shadowUpdateCooldownUntilMs;

    // Update light target positions at intervals (rate-limited for battery savings)
    // Then smoothly interpolate actual light positions every frame to prevent jitter
    if (needShadowsThisFrame && (currentTime - lastLightUpdateMs) > LIGHT_UPDATE_INTERVAL_MS) {
        lastLightUpdateMs = currentTime;
        updateLightsForCamera(lights, currentAzimuth, currentElevation, _towerGroupWorldCenter);
        if (renderer.shadowMap) renderer.shadowMap.needsUpdate = true;
    }
    
    // Smoothly interpolate light positions every frame to prevent jitter (especially in battery mode)
    // This allows lights to follow the smoothly moving camera without discrete jumps
    // Only interpolate when position difference is significant to save battery
    if (lights && targetKeyLightPosition) {
        const keyLightDistanceSq = lights.keyLight.position.distanceToSquared(targetKeyLightPosition);
        const fillLightDistanceSq = lights.fillLight && targetFillLightPosition 
            ? lights.fillLight.position.distanceToSquared(targetFillLightPosition) 
            : 0;
        
        // Only interpolate if position difference is significant (> 0.001 units)
        if (keyLightDistanceSq > 0.001) {
            // Use faster interpolation in battery mode to reduce visible lag, but still smooth
            const lightSmoothing = isBatteryQuality ? 0.15 : 0.3;
            lights.keyLight.position.lerp(targetKeyLightPosition, lightSmoothing);
            
            // Update shadow camera to match interpolated light position
            if (lights.keyLight.shadow && lights.keyLight.shadow.camera) {
                lights.keyLight.shadow.camera.position.copy(lights.keyLight.position);
                lights.keyLight.shadow.camera.lookAt(_towerGroupWorldCenter);
                lights.keyLight.shadow.camera.updateMatrixWorld();
            }
        }
        
        if (lights.fillLight && targetFillLightPosition && fillLightDistanceSq > 0.001) {
            const lightSmoothing = isBatteryQuality ? 0.15 : 0.3;
            lights.fillLight.position.lerp(targetFillLightPosition, lightSmoothing);
        }
    }

    // Keep shadow maps in manual-update mode, but refresh periodically while motion/interaction is happening.
    // This avoids abrupt shadow pops from toggling autoUpdate on/off.
    if (renderer.shadowMap && needShadowsThisFrame && (currentTime - lastShadowMapUpdateMs) > SHADOW_MAP_UPDATE_INTERVAL_MS) {
        lastShadowMapUpdateMs = currentTime;
        renderer.shadowMap.needsUpdate = true;
    }
    
    // Update timer display (throttled; per-frame DOM updates cost battery on mobile)
    if (currentTime - lastTimerUiMs > TIMER_UI_INTERVAL_MS) {
        lastTimerUiMs = currentTime;
        updateTimerDisplay();
    }
    
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
    
    // CRITICAL: Only call updatePhysics ONCE per frame, before any reads
    // Process operations and step physics
    // In battery mode, skip physics when truly idle to save CPU
    const shouldUpdatePhysics = !physicsUpdatedThisFrame && 
                               (hasPhysicsBlocks || hasPendingOperations() || hasFallingBlocks) &&
                               !(isBatteryQuality && !isActiveFrame && !hasFallingBlocks);
    
    if (shouldUpdatePhysics) {
        updatePhysics(physics, deltaTime);
        physicsUpdatedThisFrame = true;
    }
    
    // Update block visuals from physics AFTER step completes
    // This is the read phase - modifications queued here will be processed NEXT frame
    if (!isPhysicsStepping() && !isPhysicsProcessing()) {
        // Include blocks that are falling, even if they don't have a physics body yet
        // (they need updateFromPhysics to create the physics body)
        for (const block of blocks) {
            if (!block || block.isRemoved || !block.isFalling) continue;
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
        // In battery mode, check less frequently to save battery (400ms vs 200ms)
        const supportCheckInterval = isBatteryQuality ? 400 : 200;
        if (currentTime - lastSupportCheckTime > supportCheckInterval) {
            lastSupportCheckTime = currentTime;
            checkAndTriggerFalling(blocks);
        }
        
        // Clean up removed blocks and update solution tracking
        for (let i = blocks.length - 1; i >= 0; i--) {
            const block = blocks[i];
            
            // Melt animation cleanup is handled in updateMeltAnimation function
            
            if (block.isRemoved) {
                // Distinguish between manual removal (has removalStartTime) and natural fall-off
                // Manual removals already handled stats/time in the melt animation completion callback
                // Natural fall-offs need stats/time tracking here
                const isNaturalFall = !block.removalStartTime;
                
                if (isNaturalFall) {
                    // Block fell off naturally - track stats and award time
                    trackBlockRemoved();
                    timeChallengeAwardForBlockRemoved(block.length);
                }
                
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
                
                // Keep move history entries even if a block is removed.
                // Undo can resurrect the last-removed block back onto the board.
                
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
                // FIX: Use correct storage key based on game mode
                const storageKey = getStorageKey();
                localStorage.setItem(storageKey, nextLevel.toString());
                // Also update highest level if needed
                const highestLevel = parseInt(localStorage.getItem(STORAGE_HIGHEST_LEVEL_KEY) || '0', 10);
                if (nextLevel > highestLevel) {
                    localStorage.setItem(STORAGE_HIGHEST_LEVEL_KEY, nextLevel.toString());
                }
                console.log(`Progress saved: Level ${nextLevel} (completed level ${currentLevel}, mode: ${isTimeChallengeMode() ? 'Time Challenge' : 'Free Flow'})`);
            } catch (e) {
                console.warn('Failed to save progress on level completion:', e);
            }
            // Get final time for stats
            let elapsedSeconds = timerPausedTime;
            if (isTimerRunning && timerStartTime !== null) {
                elapsedSeconds += (performance.now() / 1000) - timerStartTime;
            }
            
            // Show level complete modal immediately
            showLevelCompleteModal(currentLevel);
            
            // Complete level and get stats (non-blocking)
            (async () => {
                try {
                    const userStats = await completeLevel(elapsedSeconds);
                    // Add Time Challenge specific stats
                    if (isTimeBasedMode() && timeChallengeActive) {
                        userStats.timeUnusedLevel = timeChallengeInitialTime; // Initial time at start of level
                        userStats.timeCollectedLevel = timeChallengeTimeCollected;
                        // All-time includes current level (already cumulative from block removals)
                        userStats.timeCollectedAllTime = timeChallengeTimeCollectedAllTime;
                        // Calculate carried over from formula: unused + collected - spin
                        // Use current timeLeftSec if available, otherwise use timeChallengeResidualSec
                        const calculatedCarriedOver = timeChallengeInitialTime + timeChallengeTimeCollected - timeChallengeSpinCost;
                        userStats.timeCarriedOverLevel = Math.max(0, calculatedCarriedOver);
                        // Use actual spin cost (time spent on spins) instead of calculated lost time
                        userStats.timeLostLevel = timeChallengeSpinCost;
                        // Include carried over history for graph
                        userStats.carriedOverHistory = [...timeChallengeCarriedOverHistory];
                    }
                    const comparison = await getLevelComparison(userStats);
                    updateLevelCompleteModal(userStats, comparison);
                } catch (error) {
                    console.error('Error processing stats:', error);
                    // Modal already shown, so continue
                }
            })();
        }
        
    }
    
    // Only render when something is actually changing
    // In battery mode, skip rendering when truly idle to save GPU power
    const shouldRender = isActiveFrame || 
                       cameraStillMoving || 
                       hasFallingBlocks || 
                       hasActiveAnimations ||
                       !isBatteryQuality; // Always render in balanced/performance modes
    
    if (shouldRender) {
        renderer.render(scene, camera);
    }
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

// Pause render loop when tab is backgrounded / screen locked (big battery win on mobile)
document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
    // Time Challenge should pause when app is backgrounded.
    setTimeFrozen('hidden', document.hidden);
    if (isPaused) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        if (frameCapTimeoutId !== null) {
            clearTimeout(frameCapTimeoutId);
            frameCapTimeoutId = null;
        }
        return;
    }
    // Resume
    lastTime = performance.now();
    lastFrameTick = lastTime;
    scheduleNextFrame();
});

scheduleNextFrame();

