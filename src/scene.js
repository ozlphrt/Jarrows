import * as THREE from 'three';

export function createLights(scene) {
    // Professional 3-point lighting setup
    
    // Ambient Light - provides base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Key Light (Main Light) - primary light source, casts shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(10, 20, 10);
    keyLight.castShadow = true;
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -15;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);
    
    // Fill Light - softer light from opposite side, fills shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-8, 12, -8);
    scene.add(fillLight);
    
    // Rim/Back Light - highlights edges, creates depth
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(-5, 8, -15);
    scene.add(rimLight);
    
    // Additional accent light from above for better top-down visibility
    const topLight = new THREE.DirectionalLight(0xffffff, 0.2);
    topLight.position.set(0, 25, 0);
    scene.add(topLight);
    
    return { 
        ambientLight, 
        keyLight,      // Main directional light (renamed from dirLight)
        fillLight,     // Fill light
        rimLight,      // Rim/back light
        topLight       // Top accent light
    };
}

export function createGrid(scene) {
    const gridSize = 7;
    const cubeSize = 1;
    
    // Grid base
    const baseGeometry = new THREE.BoxGeometry(gridSize * cubeSize, 0.2, gridSize * cubeSize);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(gridSize * cubeSize / 2, -0.1, gridSize * cubeSize / 2);
    base.receiveShadow = true;
    scene.add(base);
    
    // Grid lines
    const gridHelper = new THREE.GridHelper(gridSize * cubeSize, gridSize, 0x888888, 0x666666);
    gridHelper.position.set(gridSize * cubeSize / 2, 0, gridSize * cubeSize / 2);
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

