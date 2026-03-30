import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Lighting system v5.0.0 - Updated default values

/**
 * Create a gradient background texture
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} topColor - Top color (hex)
 * @param {number} bottomColor - Bottom color (hex)
 */
export function setGradientBackground(scene, topColor, bottomColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create gradient from top to bottom
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    
    // Convert hex to RGB
    const topR = (topColor >> 16) & 0xff;
    const topG = (topColor >> 8) & 0xff;
    const topB = topColor & 0xff;
    
    const bottomR = (bottomColor >> 16) & 0xff;
    const bottomG = (bottomColor >> 8) & 0xff;
    const bottomB = bottomColor & 0xff;
    
    gradient.addColorStop(0, `rgb(${topR}, ${topG}, ${topB})`);
    gradient.addColorStop(1, `rgb(${bottomR}, ${bottomG}, ${bottomB})`);
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
}

/**
 * Set up fog for the scene
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number|null} near - Fog near distance
 * @param {number|null} far - Fog far distance
 * @param {number} color - Fog color (hex)
 */
export function setupFog(scene, near = null, far = null, color = 0x000000) {
    if (near === null || far === null) {
        scene.fog = null;
    } else {
        scene.fog = new THREE.Fog(color, near, far);
    }
}

export function createLights(scene) {
    // Platform/perf heuristics (iOS shadow tier)
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

    // Dramatic lighting setup: low ambient, strong key light, minimal fill
    
    // Ambient Light
    // Default intensity: 0.45 (Balanced Default)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);
    
    // Default intensity: 1, position: (22.5, 35.5, 19.5) - Raised for taller towers
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(22.5, 35.5, 19.5);
    keyLight.castShadow = true;
    // Shadow camera bounds: keep tight for better precision + less wasted shadow-map area.
    // The board is ~7x7 centered around (3.5, 0, 3.5). These values are tuned to cover
    // typical tower height without wasting a huge frustum (which makes shadows blurrier AND more costly).
    // Slightly looser than the previous tight bounds to reduce shadow clipping/popping as the tower grows.
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 22;
    keyLight.shadow.camera.bottom = -22;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = isIOS ? 75.0 : 65.0;
    // Position shadow camera to look at the scene center
    keyLight.shadow.camera.position.set(0, 25, 0);
    keyLight.shadow.camera.lookAt(0, 0, 0);
    // Shadow map size tier: iOS gets a smaller map for battery/thermals.
    const shadowSize = isIOS ? 1024 : 2048;
    keyLight.shadow.mapSize.width = shadowSize;
    keyLight.shadow.mapSize.height = shadowSize;
    keyLight.shadow.bias = -0.0001;
    // Soften edges a bit (effective when using PCFSoftShadowMap).
    // iOS Balanced/Battery may use PCFShadowMap (radius ignored), but Performance switches to PCFSoft.
    keyLight.shadow.radius = isIOS ? 2 : 3;
    keyLight.shadow.normalBias = 0.02; // Reduce shadow acne
    scene.add(keyLight);
    
    // Fill Light - default intensity: 0.75, position: (-17.5, 12.5, -11)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
    fillLight.position.set(-17.5, 12.5, -11);
    scene.add(fillLight);
    
    return { 
        ambientLight, 
        keyLight,      // Main directional light (casts shadows)
        fillLight      // Fill light (minimal for dramatic contrast)
    };
}

/**
 * Professional Lighting Presets - Optimized for depth and subtle, dramatic shadows
 * These presets DO NOT modify background or fog, only lights.
 */
export const LIGHT_PRESETS = {
    'default': {
        name: 'Balanced',
        ambient: { color: 0xffffff, intensity: 0.45 },
        key: { color: 0xffffff, intensity: 1.0, pos: [22.5, 35.5, 19.5] },
        fill: { color: 0xffffff, intensity: 0.75, pos: [-17.5, 12.5, -11] }
    },
    'desert-dawn': {
        name: 'Desert Dawn',
        variant: 'warm',
        ambient: { color: 0xfff4e0, intensity: 0.35 },
        key: { color: 0xffd1a4, intensity: 1.4, pos: [30, 20, 10] }, 
        fill: { color: 0xffe0b2, intensity: 0.5, pos: [-15, 10, -15] }
    },
    'golden-hour': {
        name: 'Golden Hour',
        variant: 'warm',
        ambient: { color: 0xffefcc, intensity: 0.38 },
        key: { color: 0xffcc33, intensity: 1.6, pos: [25, 25, 25] },
        fill: { color: 0xffd966, intensity: 0.55, pos: [-20, 15, -10] }
    },
    'misty-morning': {
        name: 'Misty Morning',
        variant: 'cool',
        ambient: { color: 0xf0f7ff, intensity: 0.42 },
        key: { color: 0xd9eaff, intensity: 1.1, pos: [15, 35, 15] },
        fill: { color: 0xc4daff, intensity: 0.65, pos: [-15, 20, -15] }
    },
    'moonlight-glow': {
        name: 'Moonlight',
        variant: 'cool',
        ambient: { color: 0xe8f1ff, intensity: 0.32 },
        key: { color: 0xaec6ff, intensity: 1.3, pos: [-25, 40, 10] },
        fill: { color: 0x7c9eff, intensity: 0.45, pos: [20, 15, -20] }
    },
    'arctic-cool': {
        name: 'Arctic Cool',
        variant: 'cool',
        ambient: { color: 0xffffff, intensity: 0.45 },
        key: { color: 0xe3f2fd, intensity: 0.9, pos: [10, 45, 10] },
        fill: { color: 0xbbdefb, intensity: 0.7, pos: [-20, 20, -20] }
    },
    'soft-studio': {
        name: 'Soft Studio',
        variant: 'neutral',
        ambient: { color: 0xffffff, intensity: 0.4 },
        key: { color: 0xffffff, intensity: 1.25, pos: [20, 30, 20] },
        fill: { color: 0xeeeeee, intensity: 0.8, pos: [-20, 15, -20] }
    },
    'warm-indoor': {
        name: 'Warm Indoor',
        variant: 'warm',
        ambient: { color: 0xfff8e1, intensity: 0.48 },
        key: { color: 0xffecb3, intensity: 1.1, pos: [15, 35, -5] },
        fill: { color: 0xffcc80, intensity: 0.65, pos: [-10, 10, 20] }
    },
    'cool-quartz': {
        name: 'Cool Quartz',
        variant: 'cool',
        ambient: { color: 0xf3e5f5, intensity: 0.4 },
        key: { color: 0xe1bee7, intensity: 1.3, pos: [25, 25, 0] },
        fill: { color: 0xce93d8, intensity: 0.5, pos: [-15, 15, 15] }
    },
    'eventide': {
        name: 'Eventide',
        variant: 'neutral',
        ambient: { color: 0xf5f5f5, intensity: 0.35 },
        key: { color: 0xe0e0e0, intensity: 1.2, pos: [35, 15, 35] },
        fill: { color: 0xbdbdbd, intensity: 0.4, pos: [-25, 5, -25] }
    }
};

/**
 * Apply a specific lighting preset to the scene with optional smooth transition
 * Note: Only affects lights, preserves background/fog
 */
export function applyLightPreset(scene, lights, presetId, instant = false) {
    const preset = LIGHT_PRESETS[presetId] || LIGHT_PRESETS['default'];
    
    // 1. Update Lights
    if (lights.ambientLight) {
        lights.ambientLight.color.setHex(preset.ambient.color);
        lights.ambientLight.intensity = preset.ambient.intensity;
    }
    
    if (lights.keyLight) {
        lights.keyLight.color.setHex(preset.key.color);
        lights.keyLight.intensity = preset.key.intensity;
        lights.keyLight.position.set(...preset.key.pos);
    }
    
    if (lights.fillLight) {
        lights.fillLight.color.setHex(preset.fill.color);
        lights.fillLight.intensity = preset.fill.intensity;
        lights.fillLight.position.set(...preset.fill.pos);
    }
    
    return preset.name;
}

export function createGrid(scene) {
    const gridSize = 7;
    const cubeSize = 1;
    
    // Base plate - single 21x21 plate (simple extension from original 7x7)
    const visualBaseSize = 21;
    const baseGeometry = new THREE.BoxGeometry(visualBaseSize * cubeSize, 0.2, visualBaseSize * cubeSize);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.8, // Higher roughness for matte/non-reflective surface
        metalness: 0.0 // No metalness for non-metallic appearance
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    // Position centered at the 7x7 grid center (will be reset to 0,0,0 when added to towerGroup)
    base.position.set(gridSize * cubeSize / 2, -0.1, gridSize * cubeSize / 2);
    base.receiveShadow = true;
    base.castShadow = true;
    scene.add(base);
    
    // Single grid helper for the entire 21x21 base plate with 1x1 unit spacing
    // GridHelper(size, divisions) creates a grid centered at the helper's position
    // With size=21 and divisions=21, it creates lines at: -10.5, -9.5, ..., -0.5, 0.5, ..., 9.5, 10.5 (relative to grid center)
    // Blocks are positioned at: (gridX * cubeSize + cubeSize/2) - (gridSize * cubeSize / 2)
    // For gridX=0: block center at 0.5 - 3.5 = -3.0 (relative to towerGroup)
    // For gridX=1: block center at 1.5 - 3.5 = -2.0 (relative to towerGroup)
    // Cell boundaries should be at: -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5 (relative to towerGroup)
    // GridHelper lines are already at half-integers, which match cell boundaries!
    // Position grid at (3.5, 0.01, 3.5) initially (will be reset to (0, 0.01, 0) when added to towerGroup)
    const gridHelper = new THREE.GridHelper(visualBaseSize * cubeSize, visualBaseSize, 0x888888, 0x666666);
    // Position at grid center - will be reset to (0, 0.01, 0) when added to towerGroup
    gridHelper.position.set(gridSize * cubeSize / 2, 0.01, gridSize * cubeSize / 2);
    // Improve grid line rendering
    if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.8;
    }
    scene.add(gridHelper);
    
    return { base, gridHelper, gridSize, cubeSize };
}

/**
 * Create visual helpers for camera pivot point
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} pivotX - X coordinate of pivot point
 * @param {number} pivotY - Y coordinate of pivot point
 * @param {number} pivotZ - Z coordinate of pivot point
 * @param {number} gridSize - Size of the grid (for scaling helpers)
 * @returns {Object} Object containing helper elements for toggling visibility
 */
export function createCameraPivotHelpers(scene, pivotX, pivotY, pivotZ, gridSize = 7) {
    const helpersGroup = new THREE.Group();
    helpersGroup.name = 'CameraPivotHelpers';
    
    // 1. Pivot point marker - small sphere at the center
    const pivotMarkerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const pivotMarkerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.8 
    });
    const pivotMarker = new THREE.Mesh(pivotMarkerGeometry, pivotMarkerMaterial);
    pivotMarker.position.set(pivotX, pivotY, pivotZ);
    helpersGroup.add(pivotMarker);
    
    // 2. Vertical line showing pivot axis (extends upward)
    const lineHeight = gridSize * 2; // Extend well above the grid
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pivotX, pivotY, pivotZ),
        new THREE.Vector3(pivotX, pivotY + lineHeight, pivotZ)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.5,
        linewidth: 2
    });
    const pivotLine = new THREE.Line(lineGeometry, lineMaterial);
    helpersGroup.add(pivotLine);
    
    // 3. Axes helper at pivot point (shows X, Y, Z axes)
    const axesHelper = new THREE.AxesHelper(gridSize * 0.5);
    axesHelper.position.set(pivotX, pivotY, pivotZ);
    helpersGroup.add(axesHelper);
    
    // 4. Crosshair on the ground plane (XZ plane at pivot Y)
    const crosshairSize = gridSize * 0.3;
    const crosshairMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.4 
    });
    
    // Horizontal line (X axis)
    const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pivotX - crosshairSize, pivotY, pivotZ),
        new THREE.Vector3(pivotX + crosshairSize, pivotY, pivotZ)
    ]);
    const xLine = new THREE.Line(xLineGeometry, crosshairMaterial);
    helpersGroup.add(xLine);
    
    // Vertical line in XZ plane (Z axis)
    const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pivotX, pivotY, pivotZ - crosshairSize),
        new THREE.Vector3(pivotX, pivotY, pivotZ + crosshairSize)
    ]);
    const zLine = new THREE.Line(zLineGeometry, crosshairMaterial);
    helpersGroup.add(zLine);
    
    scene.add(helpersGroup);
    
    // Return helpers object with toggle function
    return {
        group: helpersGroup,
        pivotMarker,
        pivotLine,
        axesHelper,
        crosshairX: xLine,
        crosshairZ: zLine,
        setVisible: (visible) => {
            helpersGroup.visible = visible;
        },
        toggle: () => {
            helpersGroup.visible = !helpersGroup.visible;
            return helpersGroup.visible;
        }
    };
}
