import * as THREE from 'three';

export function createLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    scene.add(dirLight);
    
    return { ambientLight, dirLight };
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

