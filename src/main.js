import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initPhysics, createPhysicsBlock, updatePhysics } from './physics.js';
import { Block } from './Block.js';
import { createLights, createGrid } from './scene.js';

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
controls.update();

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

function createRandomBlocks() {
    const occupiedCells = new Set();
    
    function isCellOccupied(x, z) {
        return occupiedCells.has(`${x},${z}`);
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
    
    const numBlocks = 8 + Math.floor(Math.random() * 5);
    let attempts = 0;
    const maxAttempts = 100;
    
    while (blocks.length < numBlocks && attempts < maxAttempts) {
        attempts++;
        
        const length = Math.floor(Math.random() * 3) + 1;
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const isVertical = length > 1 && Math.random() < 0.4;
        
        let gridX, gridZ;
        
        if (isVertical) {
            gridX = Math.floor(Math.random() * gridSize);
            gridZ = Math.floor(Math.random() * gridSize);
            
            if (!isCellOccupied(gridX, gridZ)) {
                const block = new Block(length, gridX, gridZ, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize);
                blocks.push(block);
                occupyCells(block);
            }
        } else {
            const isXAligned = Math.abs(direction.x) > 0;
            const maxX = isXAligned ? gridSize - length : gridSize - 1;
            const maxZ = isXAligned ? gridSize - 1 : gridSize - length;
            
            gridX = Math.floor(Math.random() * (maxX + 1));
            gridZ = Math.floor(Math.random() * (maxZ + 1));
            
            let canPlace = true;
            for (let i = 0; i < length; i++) {
                const checkX = gridX + (isXAligned ? i : 0);
                const checkZ = gridZ + (isXAligned ? 0 : i);
                if (isCellOccupied(checkX, checkZ)) {
                    canPlace = false;
                    break;
                }
            }
            
            if (canPlace) {
                const block = new Block(length, gridX, gridZ, direction, isVertical, currentArrowStyle, scene, physics, gridSize, cubeSize);
                blocks.push(block);
                occupyCells(block);
            }
        }
    }
}

createRandomBlocks();

// Raycasting for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    for (const block of blocks) {
        if (block.isAnimating || block.isFalling) continue;
        
        const intersects = raycaster.intersectObjects(block.cubes, true);
        
        if (intersects.length > 0) {
            block.move(blocks, gridSize);
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
function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Step physics simulation
    updatePhysics(physics, deltaTime);
    
    // Update block visuals from physics
    for (const block of blocks) {
        block.updateFromPhysics();
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

