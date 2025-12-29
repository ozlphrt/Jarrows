import * as THREE from 'three';

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
 * @param {boolean} isDarkTheme - Whether dark theme is active
 */
export function setupFog(scene, isDarkTheme) {
    // Fog removed - set to null to disable
    scene.fog = null;
}

export function createLights(scene) {
    // Dramatic lighting setup: low ambient, strong key light, minimal fill
    
    // Ambient Light - reduced for more dramatic shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08); // Reduced from 0.15 for darker shadows
    scene.add(ambientLight);
    
    // Key Light (Main Light) - primary light source, casts dramatic shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased from 1.5 for stronger light
    keyLight.position.set(10, 20, 10);
    keyLight.castShadow = true;
    // Expanded shadow camera bounds to cover the scene
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 100;
    // Position shadow camera to look at the scene center
    keyLight.shadow.camera.position.set(0, 25, 0);
    keyLight.shadow.camera.lookAt(0, 0, 0);
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.radius = 2; // Sharper shadows (reduced from 3) for more dramatic definition
    keyLight.shadow.normalBias = 0.02; // Reduce shadow acne
    scene.add(keyLight);
    
    // Fill Light - minimal fill light for dramatic contrast (reduced significantly)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.1); // Reduced from 0.3 for more dramatic shadows
    fillLight.position.set(-8, 12, -8);
    scene.add(fillLight);
    
    return { 
        ambientLight, 
        keyLight,      // Main directional light (casts shadows)
        fillLight      // Fill light (minimal for dramatic contrast)
    };
}

export function createGrid(scene) {
    const gridSize = 7;
    const cubeSize = 1;
    
    // Grid base
    const baseGeometry = new THREE.BoxGeometry(gridSize * cubeSize, 0.2, gridSize * cubeSize);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.3, // Lower roughness for subtle reflections
        metalness: 0.1 // Slight metalness for depth
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(gridSize * cubeSize / 2, -0.1, gridSize * cubeSize / 2);
    base.receiveShadow = true;
    scene.add(base);
    
    // Grid lines with improved anti-aliasing
    const gridHelper = new THREE.GridHelper(gridSize * cubeSize, gridSize, 0x888888, 0x666666);
    gridHelper.position.set(gridSize * cubeSize / 2, 0.01, gridSize * cubeSize / 2); // Slightly above base to prevent z-fighting
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

