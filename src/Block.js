import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createPhysicsBlock, removePhysicsBody, isPhysicsStepping, deferBodyCreation, deferBodyModification } from './physics.js';

export class Block {
    constructor(length, gridX, gridZ, direction, isVertical, arrowStyle, scene, physics, gridSize, cubeSize, yOffset = 0) {
        this.length = length;
        this.gridX = gridX;
        this.gridZ = gridZ;
        this.direction = direction;
        this.isVertical = isVertical;
        this.isAnimating = false;
        this.isFalling = false;
        this.needsTransitionToFalling = false;
        this.needsStop = false;
        this.scene = scene;
        this.physics = physics;
        this.gridSize = gridSize;
        this.cubeSize = cubeSize;
        this.yOffset = yOffset;
        
        this.group = new THREE.Group();
        
        // Create a single connected block geometry instead of separate cubes
        const radius = 0.08; // Rounding radius for edges and corners
        const segments = 4; // Number of segments for smooth rounding
        
        // Calculate block dimensions
        let blockWidth, blockHeight, blockDepth;
        const isXAligned = Math.abs(direction.x) > 0;
        
        if (this.isVertical) {
            blockWidth = cubeSize;
            blockHeight = length * cubeSize;
            blockDepth = cubeSize;
        } else if (isXAligned) {
            blockWidth = length * cubeSize;
            blockHeight = cubeSize;
            blockDepth = cubeSize;
        } else {
            blockWidth = cubeSize;
            blockHeight = cubeSize;
            blockDepth = length * cubeSize;
        }
        
        // Create single connected block with rounded edges
        const blockGeometry = new RoundedBoxGeometry(
            blockWidth,
            blockHeight,
            blockDepth,
            segments,
            radius
        );
        
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d];
        const blockMaterial = new THREE.MeshStandardMaterial({ 
            color: colors[length - 1],
            roughness: 0.1,
            metalness: 0.0
        });
        
        // Create single mesh for the entire block
        const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        
        // Position block mesh (centered at origin in group, vertically at half height)
        blockMesh.position.set(0, blockHeight / 2, 0);
        
        // Store mesh for raycasting
        this.cubes = [blockMesh];
        this.group.add(blockMesh);
        
        // Store original material for highlighting
        this.originalMaterial = blockMaterial;
        this.isHighlighted = false;
        
        // Create arrow
        this.createArrow(arrowStyle, colors[length - 1]);
        
        // Position block on grid
        this.updateWorldPosition();
        
        // Don't create physics body yet - only create when block falls
        this.physicsBody = null;
        this.physicsCollider = null;
        
        scene.add(this.group);
    }
    
    createPhysicsBody() {
        // Calculate block dimensions
        let sizeX, sizeY, sizeZ;
        
        if (this.isVertical) {
            sizeX = this.cubeSize;
            sizeY = this.length * this.cubeSize;
            sizeZ = this.cubeSize;
        } else {
            const isXAligned = Math.abs(this.direction.x) > 0;
            if (isXAligned) {
                sizeX = this.length * this.cubeSize;
                sizeY = this.cubeSize;
                sizeZ = this.cubeSize;
            } else {
                sizeX = this.cubeSize;
                sizeY = this.cubeSize;
                sizeZ = this.length * this.cubeSize;
            }
        }
        
        const worldPos = this.group.position;
        const physicsBody = createPhysicsBlock(
            this.physics,
            { x: worldPos.x, y: worldPos.y + sizeY / 2, z: worldPos.z },
            { x: sizeX, y: sizeY, z: sizeZ },
            true, // dynamic
            true  // use falling world
        );
        
        this.physicsBody = physicsBody.body;
        this.physicsCollider = physicsBody.collider;
        
        // Don't lock anything here - physics body is only created when falling
        // Initial state will be set in updateFromPhysics after creation
    }
    
    createArrow(style = 1, blockColor = 0xffffff) {
        const arrowGroup = new THREE.Group();
        
        const createArrowGeometry = (style) => {
            let arrowShape, extrudeSettings, arrowGeometry, arrowMaterial;
            
            if (style === 1) {
                arrowShape = new THREE.Shape();
                const width = 0.25;
                const length = 0.35;
                const thickness = 0.06;
                
                arrowShape.moveTo(0, length);
                arrowShape.lineTo(width, length - width);
                arrowShape.lineTo(width - thickness, length - width);
                arrowShape.lineTo(0, length - thickness);
                arrowShape.lineTo(-width + thickness, length - width);
                arrowShape.lineTo(-width, length - width);
                arrowShape.lineTo(0, length);
                
                arrowShape.moveTo(thickness / 2, length - width);
                arrowShape.lineTo(thickness / 2, -length * 0.3);
                arrowShape.lineTo(-thickness / 2, -length * 0.3);
                arrowShape.lineTo(-thickness / 2, length - width);
                
                extrudeSettings = {
                    depth: 0.03,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.01,
                    bevelSegments: 2
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    emissive: blockColor,
                    emissiveIntensity: 0.3,
                    roughness: 0.3,
                    metalness: 0.6,
                    side: THREE.DoubleSide
                });
                
            } else if (style === 2) {
                arrowShape = new THREE.Shape();
                arrowShape.moveTo(0, 0.35);
                arrowShape.lineTo(-0.2, 0);
                arrowShape.lineTo(-0.06, 0);
                arrowShape.lineTo(-0.06, -0.25);
                arrowShape.lineTo(0.06, -0.25);
                arrowShape.lineTo(0.06, 0);
                arrowShape.lineTo(0.2, 0);
                arrowShape.lineTo(0, 0.35);
                
                extrudeSettings = {
                    depth: 0.025,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.01,
                    bevelSegments: 3
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    roughness: 0.4,
                    metalness: 0.3
                });
                
            } else if (style === 3) {
                arrowShape = new THREE.Shape();
                const lineWidth = 0.05;
                
                arrowShape.moveTo(-lineWidth/2, -0.2);
                arrowShape.lineTo(lineWidth/2, -0.2);
                arrowShape.lineTo(lineWidth/2, 0.1);
                arrowShape.lineTo(-lineWidth/2, 0.1);
                
                arrowShape.moveTo(0, 0.35);
                arrowShape.lineTo(-0.15, 0.05);
                arrowShape.lineTo(-0.08, 0.05);
                arrowShape.lineTo(0, 0.2);
                arrowShape.lineTo(0.08, 0.05);
                arrowShape.lineTo(0.15, 0.05);
                arrowShape.lineTo(0, 0.35);
                
                arrowGeometry = new THREE.ShapeGeometry(arrowShape);
                arrowMaterial = new THREE.MeshBasicMaterial({ 
                    color: blockColor,
                    side: THREE.DoubleSide
                });
                
            } else if (style === 4) {
                arrowShape = new THREE.Shape();
                const outer = 0.3;
                const inner = 0.22;
                const thickness = 0.06;
                
                arrowShape.moveTo(0, outer);
                arrowShape.lineTo(-outer, -0.05);
                arrowShape.lineTo(-thickness, -0.05);
                arrowShape.lineTo(-thickness, -0.25);
                arrowShape.lineTo(thickness, -0.25);
                arrowShape.lineTo(thickness, -0.05);
                arrowShape.lineTo(outer, -0.05);
                arrowShape.lineTo(0, outer);
                
                const hole = new THREE.Path();
                hole.moveTo(0, inner);
                hole.lineTo(-inner + 0.05, 0.02);
                hole.lineTo(0, 0.12);
                hole.lineTo(inner - 0.05, 0.02);
                hole.lineTo(0, inner);
                arrowShape.holes.push(hole);
                
                extrudeSettings = {
                    depth: 0.03,
                    bevelEnabled: false
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    emissive: blockColor,
                    emissiveIntensity: 0.5,
                    roughness: 0.2,
                    metalness: 0.8
                });
                
            } else if (style === 5) {
                arrowShape = new THREE.Shape();
                
                arrowShape.moveTo(0, 0.35);
                arrowShape.lineTo(-0.18, 0.05);
                arrowShape.quadraticCurveTo(-0.18, 0, -0.12, 0);
                arrowShape.lineTo(-0.07, 0);
                arrowShape.lineTo(-0.07, -0.2);
                arrowShape.quadraticCurveTo(-0.07, -0.25, 0, -0.25);
                arrowShape.quadraticCurveTo(0.07, -0.25, 0.07, -0.2);
                arrowShape.lineTo(0.07, 0);
                arrowShape.lineTo(0.12, 0);
                arrowShape.quadraticCurveTo(0.18, 0, 0.18, 0.05);
                arrowShape.lineTo(0, 0.35);
                
                extrudeSettings = {
                    depth: 0.05,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 5
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    roughness: 0.3,
                    metalness: 0.4
                });
                
            } else if (style === 6) {
                arrowShape = new THREE.Shape();
                
                arrowShape.moveTo(0, 0.38);
                arrowShape.lineTo(-0.2, 0.05);
                arrowShape.quadraticCurveTo(-0.2, -0.02, -0.1, -0.02);
                arrowShape.lineTo(-0.09, -0.02);
                arrowShape.lineTo(-0.09, -0.22);
                arrowShape.quadraticCurveTo(-0.09, -0.28, 0, -0.28);
                arrowShape.quadraticCurveTo(0.09, -0.28, 0.09, -0.22);
                arrowShape.lineTo(0.09, -0.02);
                arrowShape.lineTo(0.1, -0.02);
                arrowShape.quadraticCurveTo(0.2, -0.02, 0.2, 0.05);
                arrowShape.lineTo(0, 0.38);
                
                extrudeSettings = {
                    depth: 0.06,
                    bevelEnabled: true,
                    bevelThickness: 0.025,
                    bevelSize: 0.025,
                    bevelSegments: 4
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    emissive: blockColor,
                    emissiveIntensity: 0.2,
                    roughness: 0.4,
                    metalness: 0.3
                });
                
            } else if (style === 7) {
                arrowShape = new THREE.Shape();
                
                arrowShape.moveTo(0, 0.36);
                arrowShape.lineTo(-0.22, -0.02);
                arrowShape.lineTo(-0.11, -0.02);
                arrowShape.lineTo(-0.11, -0.06);
                arrowShape.lineTo(-0.08, -0.06);
                arrowShape.lineTo(-0.08, -0.24);
                arrowShape.quadraticCurveTo(-0.08, -0.27, 0, -0.27);
                arrowShape.quadraticCurveTo(0.08, -0.27, 0.08, -0.24);
                arrowShape.lineTo(0.08, -0.06);
                arrowShape.lineTo(0.11, -0.06);
                arrowShape.lineTo(0.11, -0.02);
                arrowShape.lineTo(0.22, -0.02);
                arrowShape.lineTo(0, 0.36);
                
                extrudeSettings = {
                    depth: 0.05,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 3
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    roughness: 0.35,
                    metalness: 0.4
                });
                
            } else if (style === 8) {
                arrowShape = new THREE.Shape();
                
                arrowShape.moveTo(0, 0.4);
                arrowShape.lineTo(-0.24, 0.02);
                arrowShape.lineTo(-0.1, 0.02);
                arrowShape.lineTo(-0.1, -0.24);
                arrowShape.lineTo(0.1, -0.24);
                arrowShape.lineTo(0.1, 0.02);
                arrowShape.lineTo(0.24, 0.02);
                arrowShape.lineTo(0, 0.4);
                
                extrudeSettings = {
                    depth: 0.055,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 2
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor,
                    roughness: 0.45,
                    metalness: 0.25
                });
            }
            
            return { geometry: arrowGeometry, material: arrowMaterial };
        };
        
        const isXAligned = Math.abs(this.direction.x) > 0;
        const centerOffset = (this.length - 1) * this.cubeSize / 2;
        
        // Calculate arrow center offset for each style
        // Arrow geometries extend from negative Y (tail) to positive Y (head)
        // Origin is at y=0, center is at (tail + head) / 2
        let arrowCenterOffset = 0;
        if (style === 1) {
            // Tail: -0.105, Head: 0.35, Center: (-0.105 + 0.35) / 2 = 0.1225
            arrowCenterOffset = 0.1225;
        } else if (style === 2) {
            // Tail: -0.25, Head: 0.35, Center: (-0.25 + 0.35) / 2 = 0.05
            arrowCenterOffset = 0.05;
        } else if (style === 3) {
            // Tail: -0.2, Head: 0.35, Center: (-0.2 + 0.35) / 2 = 0.075
            arrowCenterOffset = 0.075;
        } else if (style === 4) {
            // Tail: -0.25, Head: 0.3, Center: (-0.25 + 0.3) / 2 = 0.025
            arrowCenterOffset = 0.025;
        } else if (style === 5) {
            // Tail: -0.25, Head: 0.35, Center: (-0.25 + 0.35) / 2 = 0.05
            arrowCenterOffset = 0.05;
        } else if (style === 6) {
            // Tail: -0.28, Head: 0.38, Center: (-0.28 + 0.38) / 2 = 0.05
            arrowCenterOffset = 0.05;
        } else if (style === 7) {
            // Tail: -0.27, Head: 0.36, Center: (-0.27 + 0.36) / 2 = 0.045
            arrowCenterOffset = 0.045;
        } else if (style === 8) {
            // Tail: -0.24, Head: 0.4, Center: (-0.24 + 0.4) / 2 = 0.08
            arrowCenterOffset = 0.08;
        }
        
        const topArrow = new THREE.Group();
        const topArrowData = createArrowGeometry(style);
        const topArrowMesh = new THREE.Mesh(topArrowData.geometry, topArrowData.material);
        
        // Enable shadows on arrow mesh
        topArrowMesh.castShadow = true;
        topArrowMesh.receiveShadow = true;
        
        if (style === 1) topArrowMesh.position.z = -0.015;
        else if (style === 2) topArrowMesh.position.z = -0.0125;
        else if (style === 4) topArrowMesh.position.z = -0.015;
        else if (style === 5) topArrowMesh.position.z = -0.025;
        else if (style === 6) topArrowMesh.position.z = -0.03;
        else if (style === 7) topArrowMesh.position.z = -0.025;
        else if (style === 8) topArrowMesh.position.z = -0.0275;
        
        // Offset arrow mesh in local Y direction to center it
        // Arrow center is at arrowCenterOffset in local +Y, so move it back by that amount
        topArrowMesh.position.y = -arrowCenterOffset;
        
        topArrow.add(topArrowMesh);
        
        if (this.isVertical) {
            topArrow.position.set(0, this.length * this.cubeSize + 0.02, 0);
        } else {
            // Position arrow group at block center
            if (isXAligned) {
                topArrow.position.set(centerOffset, this.cubeSize + 0.02, 0);
            } else {
                topArrow.position.set(0, this.cubeSize + 0.02, centerOffset);
            }
        }
        
        topArrow.rotation.x = -Math.PI / 2;
        topArrow.rotation.z = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
        arrowGroup.add(topArrow);
        
        this.group.add(arrowGroup);
        this.arrow = arrowGroup;
    }
    
    // Rotate direction clockwise: East->South->West->North->East
    rotateDirectionClockwise() {
        // Clockwise rotation:
        // {x: 1, z: 0} (East) -> {x: 0, z: 1} (South)
        // {x: 0, z: 1} (South) -> {x: -1, z: 0} (West)
        // {x: -1, z: 0} (West) -> {x: 0, z: -1} (North)
        // {x: 0, z: -1} (North) -> {x: 1, z: 0} (East)
        const newX = -this.direction.z;
        const newZ = this.direction.x;
        this.direction = { x: newX, z: newZ };
        this.updateArrowRotation();
    }
    
    // Update arrow rotation to match current direction
    updateArrowRotation() {
        if (this.arrow && this.arrow.children.length > 0) {
            const topArrow = this.arrow.children[0];
            if (topArrow) {
                topArrow.rotation.z = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
            }
        }
    }
    
    // Check if this block collides head-on with another block
    isHeadOnCollision(other) {
        // Head-on collision: arrows point at each other (opposite directions)
        return this.direction.x === -other.direction.x && 
               this.direction.z === -other.direction.z;
    }
    
    // Helper function to check rotation safety with specific directions (for recursive head-on collisions)
    canRotateSafelyAtWithDirection(gridX, gridZ, currentDir, newDir, blocks, gridSize, collidedBlock = null) {
        const newGridX = gridX + newDir.x;
        const newGridZ = gridZ + newDir.z;
        
        if (this.isVertical) {
            if (newGridX < 0 || newGridX >= gridSize || newGridZ < 0 || newGridZ >= gridSize) {
                return true;
            }
            for (const other of blocks) {
                if (other === this || other === collidedBlock || other.isFalling) continue;
                if (other.isVertical) {
                    if (newGridX === other.gridX && newGridZ === other.gridZ) {
                        return false;
                    }
                } else {
                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                    for (let j = 0; j < other.length; j++) {
                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                        if (newGridX === otherX && newGridZ === otherZ) {
                            return false;
                        }
                    }
                }
            }
            return true;
        } else {
            const newIsXAligned = Math.abs(newDir.x) > 0;
            for (let i = 0; i < this.length; i++) {
                const checkX = newGridX + (newIsXAligned ? i : 0);
                const checkZ = newGridZ + (newIsXAligned ? 0 : i);
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    return true;
                }
                for (const other of blocks) {
                    if (other === this || other === collidedBlock || other.isFalling) continue;
                    if (other.isVertical) {
                        if (checkX === other.gridX && checkZ === other.gridZ) {
                            return false;
                        }
                    } else {
                        const otherIsXAligned = Math.abs(other.direction.x) > 0;
                        for (let j = 0; j < other.length; j++) {
                            const otherX = other.gridX + (otherIsXAligned ? j : 0);
                            const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                            if (checkX === otherX && checkZ === otherZ) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
    }
    
    // Check if rotation is safe at a given position (no blocking blocks in new direction)
    // Excludes the collidedBlock from the check since it's the one we're colliding with
    canRotateSafelyAt(gridX, gridZ, blocks, gridSize, collidedBlock = null) {
        // Calculate what the new direction would be after clockwise rotation
        const newDirection = { x: -this.direction.z, z: this.direction.x };
        
        // Check if block can move in the new direction from this position
        // For horizontal blocks, after rotation the alignment changes, so we need to check
        // if the block can move one step in the new direction
        
        if (this.isVertical) {
            // Vertical block stays vertical after rotation
            const newGridX = gridX + newDirection.x;
            const newGridZ = gridZ + newDirection.z;
            
            // Check bounds
            if (newGridX < 0 || newGridX >= gridSize || newGridZ < 0 || newGridZ >= gridSize) {
                return true; // Can exit, rotation is safe
            }
            
            // Check collision with other blocks (excluding this block and the collided block)
            for (const other of blocks) {
                if (other === this || other === collidedBlock || other.isFalling) continue;
                
                if (other.isVertical) {
                    if (newGridX === other.gridX && newGridZ === other.gridZ) {
                        return false; // Blocked, rotation not safe
                    }
                } else {
                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                    for (let j = 0; j < other.length; j++) {
                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                        if (newGridX === otherX && newGridZ === otherZ) {
                            return false; // Blocked, rotation not safe
                        }
                    }
                }
            }
            return true; // No blocking blocks, rotation is safe
        } else {
            // Horizontal block - after rotation, alignment changes
            // Current block is at gridX, gridZ with current alignment
            // After rotation to newDirection, check if it can move one step in new direction
            
            // Calculate where block would be after moving one step in new direction
            const newGridX = gridX + newDirection.x;
            const newGridZ = gridZ + newDirection.z;
            
            // After rotation, the block's alignment is based on newDirection
            const newIsXAligned = Math.abs(newDirection.x) > 0;
            
            // Check all cells the block would occupy after moving in new direction
            for (let i = 0; i < this.length; i++) {
                const checkX = newGridX + (newIsXAligned ? i : 0);
                const checkZ = newGridZ + (newIsXAligned ? 0 : i);
                
                // Check bounds
                if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                    return true; // Can exit, rotation is safe
                }
                
                // Check collision with other blocks (excluding this block and the collided block)
                for (const other of blocks) {
                    if (other === this || other === collidedBlock || other.isFalling) continue;
                    
                    if (other.isVertical) {
                        if (checkX === other.gridX && checkZ === other.gridZ) {
                            return false; // Blocked, rotation not safe
                        }
                    } else {
                        const otherIsXAligned = Math.abs(other.direction.x) > 0;
                        for (let j = 0; j < other.length; j++) {
                            const otherX = other.gridX + (otherIsXAligned ? j : 0);
                            const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                            if (checkX === otherX && checkZ === otherZ) {
                                return false; // Blocked, rotation not safe
                            }
                        }
                    }
                }
            }
            return true; // No blocking blocks, rotation is safe
        }
    }
    
    updateWorldPosition() {
        // Calculate the center position of the entire block
        // For vertical blocks: center is at grid position (single cell)
        // For horizontal blocks: center is at the midpoint of all cubes
        let centerX, centerZ;
        
        if (this.isVertical) {
            centerX = this.gridX * this.cubeSize + this.cubeSize / 2;
            centerZ = this.gridZ * this.cubeSize + this.cubeSize / 2;
        } else {
            const isXAligned = Math.abs(this.direction.x) > 0;
            if (isXAligned) {
                // X-aligned: center is at midpoint of X range
                const startX = this.gridX * this.cubeSize + this.cubeSize / 2;
                const endX = (this.gridX + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                centerX = (startX + endX) / 2;
                centerZ = this.gridZ * this.cubeSize + this.cubeSize / 2;
            } else {
                // Z-aligned: center is at midpoint of Z range
                centerX = this.gridX * this.cubeSize + this.cubeSize / 2;
                const startZ = this.gridZ * this.cubeSize + this.cubeSize / 2;
                const endZ = (this.gridZ + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                centerZ = (startZ + endZ) / 2;
            }
        }
        
        this.group.position.set(centerX, this.yOffset, centerZ);
        
        // Don't sync physics during grid movement - physics only used when falling
    }
    
    updateFromPhysics() {
        if (!this.isFalling) return;
        if (this.isRemoved) return; // Don't update if removed
        
        // Create physics body if needed - defer to safe time
        if (this.needsPhysicsBody && !this.physicsBody) {
            deferBodyCreation(() => {
                this.createPhysicsBody();
                this.needsPhysicsBody = false;
                
                // Apply stored velocities after creation
                if (this.physicsBody && this.pendingAngularVel) {
                    const RAPIER = this.physics.RAPIER;
                    
                    this.physicsBody.setAngvel(
                        new RAPIER.Vector3(
                            this.pendingAngularVel.x,
                            this.pendingAngularVel.y,
                            this.pendingAngularVel.z
                        ),
                        true
                    );
                    
                    this.physicsBody.setEnabledRotations(true, true, true, true);
                    
                    if (this.pendingLinearVel) {
                        this.physicsBody.setLinvel(
                            new RAPIER.Vector3(
                                this.pendingLinearVel.x,
                                this.pendingLinearVel.y,
                                this.pendingLinearVel.z
                            ),
                            true
                        );
                    }
                    
                    // Clear pending velocities
                    this.pendingAngularVel = null;
                    this.pendingLinearVel = null;
                }
            });
            return; // Wait for next frame to read position
        }
        
        if (!this.physicsBody) return;
        
        // Only read if physics is not currently stepping
        if (isPhysicsStepping()) return;
        
        try {
            // Verify physics body is still valid before reading
            if (!this.physicsBody) return;
            if (isPhysicsStepping()) return;
            
            // Read all values with individual try-catch for each operation
            let x, y, z, qx, qy, qz, qw;
            let readSuccess = false;
            
            try {
                if (isPhysicsStepping()) return;
                // CRITICAL: Copy values immediately, don't hold references
                const translation = this.physicsBody.translation();
                if (!translation) return;
                x = translation.x;
                y = translation.y;
                z = translation.z;
                readSuccess = true;
                // Translation object is dropped here
            } catch (e) {
                // Physics body might be invalid, skip this update
                return;
            }
            
            try {
                if (isPhysicsStepping()) return;
                // CRITICAL: Copy values immediately, don't hold references
                const rotation = this.physicsBody.rotation();
                if (!rotation) return;
                qx = rotation.x;
                qy = rotation.y;
                qz = rotation.z;
                qw = rotation.w;
                // Rotation object is dropped here
            } catch (e) {
                // If rotation read fails, use default values
                qx = 0; qy = 0; qz = 0; qw = 1;
            }
            
            if (!readSuccess) return;
            
            const sizeY = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
            
            // Falling block - update position and rotation
            this.group.position.set(x, y - sizeY / 2, z);
            this.group.quaternion.set(qx, qy, qz, qw);
            
            // Remove block if:
            // 1. It has fallen well below the grid (y < -2, accounting for block height)
            // 2. It has moved too far horizontally from the grid center (beyond reasonable bounds)
            // 3. It has been falling for too long (safety timeout)
            const gridCenter = (this.gridSize * this.cubeSize) / 2;
            const maxDistanceFromGrid = this.gridSize * this.cubeSize * 1.5; // 1.5x grid size
            const distanceFromCenter = Math.sqrt(
                Math.pow(x - gridCenter, 2) + Math.pow(z - gridCenter, 2)
            );
            
            if (y < -2 || distanceFromCenter > maxDistanceFromGrid || (Date.now() - this.fallingStartTime > 5000)) {
                this.remove();
            }
            
            // Apply state transitions that were detected during read phase
            // These are deferred to avoid modifying during read
            if (this.needsTransitionToFalling && this.physicsBody) {
                this.needsTransitionToFalling = false;
                deferBodyModification(() => {
                    if (this.physicsBody) {
                        this.physicsBody.setEnabledRotations(true, true, true, true);
                        
                        // Add natural tumbling rotation
                        const isXAligned = Math.abs(this.direction.x) > 0;
                        const moveDir = isXAligned ? this.direction.x : this.direction.z;
                        let angularVelX = 0, angularVelY = 0, angularVelZ = 0;
                        
                        if (this.isVertical) {
                            // Vertical blocks: tumble around horizontal axis
                            if (isXAligned) {
                                angularVelZ = moveDir * 3.5;
                                angularVelX = (Math.random() - 0.5) * 2.5;
                            } else {
                                angularVelX = -moveDir * 3.5;
                                angularVelZ = (Math.random() - 0.5) * 2.5;
                            }
                            angularVelY = (Math.random() - 0.5) * 1.5;
                        } else {
                            // Horizontal blocks: tumble around axis perpendicular to movement
                            if (isXAligned) {
                                angularVelZ = moveDir * 4.5;
                                angularVelY = (Math.random() - 0.5) * 2.0;
                                angularVelX = (Math.random() - 0.5) * 1.5;
                            } else {
                                angularVelX = -moveDir * 4.5;
                                angularVelY = (Math.random() - 0.5) * 2.0;
                                angularVelZ = (Math.random() - 0.5) * 1.5;
                            }
                        }
                        this.physicsBody.setAngvel(new this.physics.RAPIER.Vector3(angularVelX, angularVelY, angularVelZ), true);
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to update physics:', e);
        }
    }
    
    canMove(blocks) {
        const newGridX = this.gridX + this.direction.x;
        const newGridZ = this.gridZ + this.direction.z;
        
        if (this.isVertical) {
            if (newGridX < 0 || newGridX >= this.gridSize || newGridZ < 0 || newGridZ >= this.gridSize) {
                return 'fall';
            }
            
            for (const other of blocks) {
                if (other === this || other.isFalling) continue;
                
                if (other.isVertical) {
                    if (newGridX === other.gridX && newGridZ === other.gridZ) {
                        return 'blocked';
                    }
                } else {
                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                    for (let j = 0; j < other.length; j++) {
                        let otherX = other.gridX;
                        let otherZ = other.gridZ;
                        
                        if (otherIsXAligned) {
                            otherX += j;
                        } else {
                            otherZ += j;
                        }
                        
                        if (newGridX === otherX && newGridZ === otherZ) {
                            return 'blocked';
                        }
                    }
                }
            }
            
            return 'ok';
        }
        
        const isXAligned = Math.abs(this.direction.x) > 0;
        
        for (let i = 0; i < this.length; i++) {
            let checkX = newGridX;
            let checkZ = newGridZ;
            
            if (isXAligned) {
                checkX += i;
            } else {
                checkZ += i;
            }
            
            if (checkX < 0 || checkX >= this.gridSize || checkZ < 0 || checkZ >= this.gridSize) {
                return 'fall';
            }
            
            for (const other of blocks) {
                if (other === this || other.isFalling) continue;
                
                if (other.isVertical) {
                    if (checkX === other.gridX && checkZ === other.gridZ) {
                        return 'blocked';
                    }
                } else {
                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                    
                    for (let j = 0; j < other.length; j++) {
                        let otherX = other.gridX;
                        let otherZ = other.gridZ;
                        
                        if (otherIsXAligned) {
                            otherX += j;
                        } else {
                            otherZ += j;
                        }
                        
                        if (checkX === otherX && checkZ === otherZ) {
                            return 'blocked';
                        }
                    }
                }
            }
        }
        
        return 'ok';
    }
    
    move(blocks, gridSize) {
        if (this.isAnimating || this.isFalling) return;
        
        // Calculate how many steps the block can move before hitting something
        let stepsToObstacle = 0;
        let tempGridX = this.gridX;
        let tempGridZ = this.gridZ;
        let hitObstacle = false;
        let hitEdge = false;
        let collidedBlock = null; // Track which block we collided with
        let headOnCollision = null; // Track head-on collision details: {block, position: {x, z}}
        
        // Count steps until blocked or edge
        // Continue moving until block entirely leaves the board (all cubes off) or hits an obstacle
        while (true) {
            const nextGridX = tempGridX + this.direction.x;
            const nextGridZ = tempGridZ + this.direction.z;
            
            // Check for collisions with other blocks first
            let blocked = false;
            for (const other of blocks) {
                if (other === this || other.isFalling) continue;
                
                if (this.isVertical) {
                    if (other.isVertical) {
                        if (nextGridX === other.gridX && nextGridZ === other.gridZ) {
                            blocked = true;
                            collidedBlock = other;
                        }
                    } else {
                        const otherIsXAligned = Math.abs(other.direction.x) > 0;
                        for (let j = 0; j < other.length; j++) {
                            const otherX = other.gridX + (otherIsXAligned ? j : 0);
                            const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                            if (nextGridX === otherX && nextGridZ === otherZ) {
                                blocked = true;
                                collidedBlock = other;
                                break;
                            }
                        }
                    }
                } else {
                    const isXAligned = Math.abs(this.direction.x) > 0;
                    for (let i = 0; i < this.length; i++) {
                        const checkX = nextGridX + (isXAligned ? i : 0);
                        const checkZ = nextGridZ + (isXAligned ? 0 : i);
                        
                        if (other.isVertical) {
                            if (checkX === other.gridX && checkZ === other.gridZ) {
                                blocked = true;
                                collidedBlock = other;
                                break;
                            }
                        } else {
                            const otherIsXAligned = Math.abs(other.direction.x) > 0;
                            for (let j = 0; j < other.length; j++) {
                                const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                if (checkX === otherX && checkZ === otherZ) {
                                    blocked = true;
                                    collidedBlock = other;
                                    break;
                                }
                            }
                        }
                        if (blocked) break;
                    }
                }
                if (blocked) break;
            }
            
            if (blocked) {
                // Check if this is a head-on collision
                // Rule: Head-on collision and clockwise rotation rule does NOT apply to horizontal 2x and 3x blocks
                // If they are vertical, rule applies as is
                const isHeadOn = collidedBlock && this.isHeadOnCollision(collidedBlock);
                const isHorizontalMultiCube = !this.isVertical && (this.length === 2 || this.length === 3);
                
                if (isHeadOn && !isHorizontalMultiCube) {
                    // Head-on collision: stop at position BEFORE collision (don't move into collided block's cell)
                    // tempGridX, tempGridZ is already at the position before collision
                    
                    console.log(`Head-on collision detected: Block at (${this.gridX}, ${this.gridZ}) dir (${this.direction.x}, ${this.direction.z}) collides with block at (${collidedBlock.gridX}, ${collidedBlock.gridZ}) dir (${collidedBlock.direction.x}, ${collidedBlock.direction.z})`);
                    console.log(`Block length: ${this.length}, isVertical: ${this.isVertical}`);
                    
                    // Check if rotation is safe at current position (before collision, exclude the collided block from check)
                    const rotationSafe = this.canRotateSafelyAt(tempGridX, tempGridZ, blocks, gridSize, collidedBlock);
                    console.log(`Rotation safe check at (${tempGridX}, ${tempGridZ}): ${rotationSafe}`);
                    
                    if (!rotationSafe) {
                        // Debug: show what's blocking
                        const newDirection = { x: -this.direction.z, z: this.direction.x };
                        const newGridX = tempGridX + newDirection.x;
                        const newGridZ = tempGridZ + newDirection.z;
                        console.log(`Would rotate to dir (${newDirection.x}, ${newDirection.z}), checking position (${newGridX}, ${newGridZ})`);
                        const newIsXAligned = Math.abs(newDirection.x) > 0;
                        for (let i = 0; i < this.length; i++) {
                            const checkX = newGridX + (newIsXAligned ? i : 0);
                            const checkZ = newGridZ + (newIsXAligned ? 0 : i);
                            console.log(`  Checking cell (${checkX}, ${checkZ})`);
                            for (const other of blocks) {
                                if (other === this || other === collidedBlock || other.isFalling) continue;
                                if (other.isVertical) {
                                    if (checkX === other.gridX && checkZ === other.gridZ) {
                                        console.log(`    BLOCKED by vertical block at (${other.gridX}, ${other.gridZ})`);
                                    }
                                } else {
                                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                    for (let j = 0; j < other.length; j++) {
                                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                        if (checkX === otherX && checkZ === otherZ) {
                                            console.log(`    BLOCKED by horizontal block at (${other.gridX}, ${other.gridZ}) dir (${other.direction.x}, ${other.direction.z}) length ${other.length}, cell (${otherX}, ${otherZ})`);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    if (rotationSafe) {
                        // Rotation is safe: record it for special animation
                        // Position is the cell BEFORE collision (where block currently is)
                        headOnCollision = {
                            block: collidedBlock,
                            position: { x: tempGridX, z: tempGridZ } // Position before collision
                        };
                        console.log(`Head-on collision: rotation will happen at (${tempGridX}, ${tempGridZ})`);
                        // Stop here - rotation will happen during animation at this position
                        hitObstacle = false; // Not a regular obstacle, it's a head-on collision
                        break;
                    } else {
                        // Rotation not immediately safe - check if blocking block is also a head-on collision
                        const newDirection = { x: -this.direction.z, z: this.direction.x };
                        const newGridX = tempGridX + newDirection.x;
                        const newGridZ = tempGridZ + newDirection.z;
                        const newIsXAligned = Math.abs(newDirection.x) > 0;
                        
                        // Find the blocking block
                        let blockingBlock = null;
                        for (let i = 0; i < this.length; i++) {
                            const checkX = newGridX + (newIsXAligned ? i : 0);
                            const checkZ = newGridZ + (newIsXAligned ? 0 : i);
                            
                            for (const other of blocks) {
                                if (other === this || other === collidedBlock || other.isFalling) continue;
                                
                                if (other.isVertical) {
                                    if (checkX === other.gridX && checkZ === other.gridZ) {
                                        blockingBlock = other;
                                        break;
                                    }
                                } else {
                                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                    for (let j = 0; j < other.length; j++) {
                                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                        if (checkX === otherX && checkZ === otherZ) {
                                            blockingBlock = other;
                                            break;
                                        }
                                    }
                                }
                                if (blockingBlock) break;
                            }
                            if (blockingBlock) break;
                        }
                        
                        // Check if blocking block is in head-on collision with rotated direction
                        if (blockingBlock && newDirection.x === -blockingBlock.direction.x && 
                            newDirection.z === -blockingBlock.direction.z) {
                            // Chain head-on collision: allow rotation, will handle second collision during post-rotation movement
                            console.log(`Head-on collision: rotation blocked by another head-on collision with block at (${blockingBlock.gridX}, ${blockingBlock.gridZ}), allowing rotation`);
                            headOnCollision = {
                                block: collidedBlock,
                                position: { x: tempGridX, z: tempGridZ } // Position before collision
                            };
                            hitObstacle = false; // Not a regular obstacle, it's a head-on collision chain
                            break;
                        } else {
                            // Rotation not safe (blocking blocks in new direction): treat as regular collision
                            console.log(`Head-on collision: rotation NOT safe, treating as regular collision`);
                            hitObstacle = true;
                            break;
                        }
                    }
                } else {
                    // Regular collision: stop
                    if (collidedBlock) {
                        console.log(`Regular collision: Block at (${this.gridX}, ${this.gridZ}) dir (${this.direction.x}, ${this.direction.z}) collides with block at (${collidedBlock.gridX}, ${collidedBlock.gridZ}) dir (${collidedBlock.direction.x}, ${collidedBlock.direction.z}) - NOT head-on`);
                    }
                    hitObstacle = true;
                    break;
                }
            }
            
            // Move to next position
            stepsToObstacle++;
            tempGridX = nextGridX;
            tempGridZ = nextGridZ;
            
            // Check if all cubes are now off the board at this new position
            let allCubesOff = true;
            
            if (this.isVertical) {
                if (tempGridX >= 0 && tempGridX < gridSize && tempGridZ >= 0 && tempGridZ < gridSize) {
                    allCubesOff = false;
                }
            } else {
                const isXAligned = Math.abs(this.direction.x) > 0;
                
                for (let i = 0; i < this.length; i++) {
                    const checkX = tempGridX + (isXAligned ? i : 0);
                    const checkZ = tempGridZ + (isXAligned ? 0 : i);
                    if (checkX >= 0 && checkX < gridSize && checkZ >= 0 && checkZ < gridSize) {
                        // At least one cube is still on the board
                        allCubesOff = false;
                        break;
                    }
                }
            }
            
            // If all cubes are off the board, stop and fall
            if (allCubesOff) {
                hitEdge = true;
                break; // Block has entirely left the board
            }
        }
        
        // If blocked immediately with no movement, add bounce effect
        // Exception: head-on collision with rotation is allowed even if stepsToObstacle is 0
        if (stepsToObstacle === 0 && hitObstacle && !headOnCollision) {
            this.addBounceEffect(blocks);
            return; // Can't move
        }
        
        // If no movement possible, return
        // Exception: head-on collision with rotation needs animation even if stepsToObstacle is 0
        if (stepsToObstacle === 0 && !headOnCollision) {
            return;
        }
        
        // For head-on collision at starting position, we still need to animate rotation and continuation
        if (headOnCollision && stepsToObstacle === 0) {
            console.log(`Head-on collision at starting position, will animate rotation and continuation`);
        }
        
        this.isAnimating = true;
        
        // For head-on collision, we need to calculate final position after rotation
        // Store original direction to calculate post-rotation movement
        const originalDirection = { x: this.direction.x, z: this.direction.z };
        let finalGridX = tempGridX;
        let finalGridZ = tempGridZ;
        
        // If head-on collision, calculate where block ends up after rotation
        if (headOnCollision) {
            // Calculate new direction after rotation
            const rotatedDirection = { x: -originalDirection.z, z: originalDirection.x };
            
            // Continue movement from position BEFORE collision (where rotation happens) with rotated direction
            let postRotationX = headOnCollision.position.x; // This is the position before collision
            let postRotationZ = headOnCollision.position.z;
            
            // Move in new direction from position before collision until blocked or edge
            while (true) {
                const nextX = postRotationX + rotatedDirection.x;
                const nextZ = postRotationZ + rotatedDirection.z;
                
                // Check if out of bounds - for rotated blocks, continue until ALL cubes are off
                let allCubesOff = false;
                if (this.isVertical) {
                    if (nextX < 0 || nextX >= gridSize || nextZ < 0 || nextZ >= gridSize) {
                        // Vertical block is completely off at this position
                        allCubesOff = true;
                    }
                } else {
                    const isXAligned = Math.abs(rotatedDirection.x) > 0;
                    allCubesOff = true; // Assume all off, check if any are still on
                    for (let i = 0; i < this.length; i++) {
                        const checkX = nextX + (isXAligned ? i : 0);
                        const checkZ = nextZ + (isXAligned ? 0 : i);
                        if (checkX >= 0 && checkX < gridSize && checkZ >= 0 && checkZ < gridSize) {
                            // At least one cube is still on the board
                            allCubesOff = false;
                            break;
                        }
                    }
                }
                
                if (allCubesOff) {
                    // Block has completely left the board - continue moving one more step to ensure it's off
                    finalGridX = nextX;
                    finalGridZ = nextZ;
                    break;
                }
                
                // Check for collisions
                let blocked = false;
                for (const other of blocks) {
                    if (other === this || other.isFalling || other === headOnCollision.block) continue;
                    
                    if (this.isVertical) {
                        if (other.isVertical) {
                            if (nextX === other.gridX && nextZ === other.gridZ) {
                                blocked = true;
                                break;
                            }
                        } else {
                            const otherIsXAligned = Math.abs(other.direction.x) > 0;
                            for (let j = 0; j < other.length; j++) {
                                const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                if (nextX === otherX && nextZ === otherZ) {
                                    blocked = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        const isXAligned = Math.abs(rotatedDirection.x) > 0;
                        for (let i = 0; i < this.length; i++) {
                            const checkX = nextX + (isXAligned ? i : 0);
                            const checkZ = nextZ + (isXAligned ? 0 : i);
                            
                            if (other.isVertical) {
                                if (checkX === other.gridX && checkZ === other.gridZ) {
                                    blocked = true;
                                    break;
                                }
                            } else {
                                const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                for (let j = 0; j < other.length; j++) {
                                    const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                    const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                    if (checkX === otherX && checkZ === otherZ) {
                                        blocked = true;
                                        break;
                                    }
                                }
                            }
                            if (blocked) break;
                        }
                    }
                    if (blocked) break;
                }
                
                if (blocked) {
                    // Check if this is another head-on collision
                    let collidedBlockAfterRotation = null;
                    // Find which block is blocking
                    for (const other of blocks) {
                        if (other === this || other.isFalling || other === headOnCollision.block) continue;
                        
                        if (this.isVertical) {
                            if (other.isVertical) {
                                if (nextX === other.gridX && nextZ === other.gridZ) {
                                    collidedBlockAfterRotation = other;
                                    break;
                                }
                            } else {
                                const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                for (let j = 0; j < other.length; j++) {
                                    const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                    const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                    if (nextX === otherX && nextZ === otherZ) {
                                        collidedBlockAfterRotation = other;
                                        break;
                                    }
                                }
                            }
                        } else {
                            const isXAligned = Math.abs(rotatedDirection.x) > 0;
                            for (let i = 0; i < this.length; i++) {
                                const checkX = nextX + (isXAligned ? i : 0);
                                const checkZ = nextZ + (isXAligned ? 0 : i);
                                
                                if (other.isVertical) {
                                    if (checkX === other.gridX && checkZ === other.gridZ) {
                                        collidedBlockAfterRotation = other;
                                        break;
                                    }
                                } else {
                                    const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                    for (let j = 0; j < other.length; j++) {
                                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                        if (checkX === otherX && checkZ === otherZ) {
                                            collidedBlockAfterRotation = other;
                                            break;
                                        }
                                    }
                                }
                                if (collidedBlockAfterRotation) break;
                            }
                        }
                        if (collidedBlockAfterRotation) break;
                    }
                    
                    // Check if it's a head-on collision with the rotated direction
                    // Rule: Head-on collision and clockwise rotation rule does NOT apply to horizontal 2x and 3x blocks
                    if (collidedBlockAfterRotation) {
                        const isHeadOn = (rotatedDirection.x === -collidedBlockAfterRotation.direction.x && 
                                         rotatedDirection.z === -collidedBlockAfterRotation.direction.z);
                        const isHorizontalMultiCube = !this.isVertical && (this.length === 2 || this.length === 3);
                        
                        if (isHeadOn && !isHorizontalMultiCube) {
                            // Another head-on collision: check if rotation is safe
                            const nextRotatedDirection = { x: -rotatedDirection.z, z: rotatedDirection.x };
                            const canRotateAgain = this.canRotateSafelyAtWithDirection(
                                postRotationX, postRotationZ, rotatedDirection, nextRotatedDirection, 
                                blocks, gridSize, collidedBlockAfterRotation
                            );
                            
                            if (canRotateAgain) {
                                // Rotate again and continue
                                rotatedDirection.x = nextRotatedDirection.x;
                                rotatedDirection.z = nextRotatedDirection.z;
                                // Don't move to nextX - stay at postRotationX and continue with new direction
                                continue; // Continue loop with new rotated direction
                            } else {
                                // Can't rotate again - stop
                                finalGridX = postRotationX;
                                finalGridZ = postRotationZ;
                                break;
                            }
                        } else {
                            // Regular collision - stop (either not head-on, or horizontal 2x/3x block)
                            finalGridX = postRotationX;
                            finalGridZ = postRotationZ;
                            break;
                        }
                    } else {
                        // Regular collision - stop
                        finalGridX = postRotationX;
                        finalGridZ = postRotationZ;
                        break;
                    }
                }
                
                postRotationX = nextX;
                postRotationZ = nextZ;
            }
            
            // finalGridX and finalGridZ are already set by the break statements in the while loop above
            console.log(`Post-rotation movement: Block will end at (${finalGridX}, ${finalGridZ}) after rotating from (${headOnCollision.position.x}, ${headOnCollision.position.z})`);
            
            // Check if final position after rotation is off the board
            // Recalculate rotated direction (may have been modified in while loop)
            rotatedDirection.x = -originalDirection.z;
            rotatedDirection.z = originalDirection.x;
            const isXAligned = Math.abs(rotatedDirection.x) > 0;
            let allCubesOffAfterRotation = false;
            
            if (this.isVertical) {
                if (finalGridX < 0 || finalGridX >= gridSize || finalGridZ < 0 || finalGridZ >= gridSize) {
                    allCubesOffAfterRotation = true;
                }
            } else {
                allCubesOffAfterRotation = true; // Assume all off, check if any are still on
                for (let i = 0; i < this.length; i++) {
                    const checkX = finalGridX + (isXAligned ? i : 0);
                    const checkZ = finalGridZ + (isXAligned ? 0 : i);
                    if (checkX >= 0 && checkX < gridSize && checkZ >= 0 && checkZ < gridSize) {
                        allCubesOffAfterRotation = false;
                        break;
                    }
                }
            }
            
            if (allCubesOffAfterRotation) {
                hitEdge = true;
            }
        }
        
        // Calculate final world position (centered on block)
        let finalX, finalZ;
        if (this.isVertical) {
            finalX = finalGridX * this.cubeSize + this.cubeSize / 2;
            finalZ = finalGridZ * this.cubeSize + this.cubeSize / 2;
        } else {
            // For head-on collision, use rotated direction for alignment
            // For normal movement, use current direction
            let directionForAlignment = originalDirection;
            if (headOnCollision) {
                // After rotation, direction changes
                directionForAlignment = { x: -originalDirection.z, z: originalDirection.x };
            }
            const isXAligned = Math.abs(directionForAlignment.x) > 0;
            if (isXAligned) {
                const startGridX = finalGridX * this.cubeSize + this.cubeSize / 2;
                const endGridX = (finalGridX + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                finalX = (startGridX + endGridX) / 2;
                finalZ = finalGridZ * this.cubeSize + this.cubeSize / 2;
            } else {
                finalX = finalGridX * this.cubeSize + this.cubeSize / 2;
                const startGridZ = finalGridZ * this.cubeSize + this.cubeSize / 2;
                const endGridZ = (finalGridZ + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                finalZ = (startGridZ + endGridZ) / 2;
            }
        }
        
        // Calculate start position
        const startX = this.group.position.x;
        const startZ = this.group.position.z;
        
        // Smooth easing function (ease-out cubic for smooth deceleration)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        
        // Animation parameters
        const totalDistance = Math.sqrt((finalX - startX) ** 2 + (finalZ - startZ) ** 2);
        
        // Check if we have a head-on collision - make it slower and more visible
        const hasHeadOnCollision = headOnCollision !== null;
        let duration;
        if (hasHeadOnCollision) {
            // Head-on collision: much slower animation (3x slower) and more visible
            duration = (150 + Math.sqrt(totalDistance) * 40) * 3;
        } else {
            duration = 150 + Math.sqrt(totalDistance) * 40;
        }
        
        const startTime = performance.now();
        
        // For head-on collision, calculate collision position
        let collisionX, collisionZ, collisionGridX, collisionGridZ, collisionProgress = 0;
        let rotationStartAngle = 0;
        let rotationEndAngle = 0;
        let rotationPauseDuration = 0.35; // 35% of total duration for rotation pause (increased from 15%)
        let rotationApplied = false; // Track if direction has been rotated
        if (hasHeadOnCollision) {
            collisionGridX = headOnCollision.position.x;
            collisionGridZ = headOnCollision.position.z;
            collisionX = collisionGridX * this.cubeSize + this.cubeSize / 2;
            collisionZ = collisionGridZ * this.cubeSize + this.cubeSize / 2;
            const distanceToCollision = Math.sqrt((collisionX - startX) ** 2 + (collisionZ - startZ) ** 2);
            collisionProgress = distanceToCollision / totalDistance; // When collision happens (0-1)
            
            // Calculate rotation angles for smooth arrow animation
            // Current arrow rotation (before rotation)
            rotationStartAngle = Math.atan2(originalDirection.x, originalDirection.z) + Math.PI;
            // Target arrow rotation (after clockwise rotation)
            const rotatedDirection = { x: -originalDirection.z, z: originalDirection.x };
            rotationEndAngle = Math.atan2(rotatedDirection.x, rotatedDirection.z) + Math.PI;
            
            // Update grid position to collision position initially
            this.gridX = collisionGridX;
            this.gridZ = collisionGridZ;
        } else {
            // Update grid position to final valid position
            this.gridX = finalGridX;
            this.gridZ = finalGridZ;
        }
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            let progress = Math.min(elapsed / duration, 1);
            let eased = easeOutCubic(progress);
            
            if (hasHeadOnCollision && progress < collisionProgress) {
                // Before collision: move normally but slower
                const preCollisionProgress = progress / collisionProgress;
                const preCollisionEased = easeOutCubic(preCollisionProgress);
                this.group.position.x = startX + (collisionX - startX) * preCollisionEased;
                this.group.position.z = startZ + (collisionZ - startZ) * preCollisionEased;
                } else if (hasHeadOnCollision && progress >= collisionProgress) {
                // At collision: pause at collision position and rotate
                const timeSinceCollision = progress - collisionProgress;
                if (timeSinceCollision < rotationPauseDuration) {
                    // Pause at collision for rotation animation (35% of total duration)
                    this.group.position.x = collisionX;
                    this.group.position.z = collisionZ;
                    
                    // Keep grid position at collision position during pause
                    this.gridX = collisionGridX;
                    this.gridZ = collisionGridZ;
                    
                    // Animate arrow rotation smoothly during pause
                    const rotationProgress = timeSinceCollision / rotationPauseDuration;
                    // Use ease-in-out for smooth rotation animation
                    const rotationEased = rotationProgress < 0.5 
                        ? 2 * rotationProgress * rotationProgress 
                        : 1 - Math.pow(-2 * rotationProgress + 2, 2) / 2;
                    
                    // Interpolate arrow rotation angle
                    const currentRotationAngle = rotationStartAngle + (rotationEndAngle - rotationStartAngle) * rotationEased;
                    if (this.arrow && this.arrow.children.length > 0) {
                        const topArrow = this.arrow.children[0];
                        if (topArrow) {
                            topArrow.rotation.z = currentRotationAngle;
                        }
                    }
                    
                    // Update direction only once at the end of rotation animation
                    if (rotationProgress >= 0.99 && !rotationApplied) {
                        this.rotateDirectionClockwise();
                        rotationApplied = true;
                    }
                    
                    // Subtle visual feedback during collision pause (reduced bounce)
                    const bounce = Math.sin(rotationProgress * Math.PI) * 0.08;
                    this.group.scale.set(1 + bounce, 1 + bounce, 1 + bounce);
                } else {
                    // After rotation pause: continue to final position with new direction
                    const postCollisionProgress = (progress - collisionProgress - rotationPauseDuration) / (1 - collisionProgress - rotationPauseDuration);
                    const postCollisionEased = easeOutCubic(postCollisionProgress);
                    this.group.position.x = collisionX + (finalX - collisionX) * postCollisionEased;
                    this.group.position.z = collisionZ + (finalZ - collisionZ) * postCollisionEased;
                    
                    // Update grid position to final position after collision
                    this.gridX = finalGridX;
                    this.gridZ = finalGridZ;
                    
                    // Ensure direction is updated (in case rotation wasn't triggered during animation)
                    if (!rotationApplied) {
                        this.rotateDirectionClockwise();
                        rotationApplied = true;
                    }
                    
                    // Reset scale
                    this.group.scale.set(1, 1, 1);
                }
            } else {
                // Normal movement
                this.group.position.x = startX + (finalX - startX) * eased;
                this.group.position.z = startZ + (finalZ - startZ) * eased;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // If hit obstacle, snap to exact grid position and add bounce effect
                if (hitObstacle) {
                    this.updateWorldPosition();
                    this.addBounceEffect(blocks);
                } else if (hitEdge) {
                    // Hit edge - start falling immediately without snapping to grid
                    // Position is already correct from animation, don't recalculate
                    this.isAnimating = false;
                    
                    // Calculate horizontal velocity from animation to maintain momentum
                    // Calculate average velocity during animation for natural continuation
                    // Ease-out cubic: v(t) = 3(1-t)^2 * distance / duration
                    // Average velocity over animation: integrate and average, or use midpoint velocity
                    const midProgress = 0.5; // Use midpoint for more representative velocity
                    const easeDerivative = 3 * Math.pow(1 - midProgress, 2); // Derivative at midpoint
                    const velocityScale = easeDerivative * (1000 / duration); // Convert to units per second
                    
                    // Calculate velocity components in direction of movement
                    const velX = (finalX - startX) * velocityScale;
                    const velZ = (finalZ - startZ) * velocityScale;
                    
                    this.fall(velX, velZ);
            } else {
                // Normal completion - snap to exact grid position
                this.updateWorldPosition();
                this.isAnimating = false;
            }
            }
        };
        
        animate();
    }
    
    addBounceEffect(blocks = []) {
        // Quick bounce/shake effect when hitting an obstacle
        const bounceDistance = 0.08; // Small bounce distance
        const bounceDuration = 200; // Quick bounce
        const shakeCount = 3;
        const shakeAmplitude = 0.06; // Increased from 0.02
        const surroundingBlockAmplitude = 0.04; // Reduced amplitude for surrounding blocks
        
        // Get cells occupied by this block
        const thisBlockCells = new Set();
        if (this.isVertical) {
            thisBlockCells.add(`${this.gridX},${this.gridZ}`);
        } else {
            const isXAligned = Math.abs(this.direction.x) > 0;
            for (let i = 0; i < this.length; i++) {
                const x = this.gridX + (isXAligned ? i : 0);
                const z = this.gridZ + (isXAligned ? 0 : i);
                thisBlockCells.add(`${x},${z}`);
            }
        }
        
        // Find surrounding blocks (adjacent to this block's cells)
        const surroundingBlocks = new Set();
        for (const cellKey of thisBlockCells) {
            const [cellX, cellZ] = cellKey.split(',').map(Number);
            
            // Check all 8 adjacent cells (including diagonals)
            for (let dx = -1; dx <= 1; dx++) {
                for (let dz = -1; dz <= 1; dz++) {
                    if (dx === 0 && dz === 0) continue; // Skip self
                    
                    const adjX = cellX + dx;
                    const adjZ = cellZ + dz;
                    const adjKey = `${adjX},${adjZ}`;
                    
                    // Skip if this is part of the current block
                    if (thisBlockCells.has(adjKey)) continue;
                    
                    // Find blocks that occupy this adjacent cell
                    for (const other of blocks) {
                        if (other === this || other.isFalling || other.isAnimating) continue;
                        if (surroundingBlocks.has(other)) continue;
                        
                        // Check if other block occupies this cell
                        let occupiesCell = false;
                        if (other.isVertical) {
                            if (other.gridX === adjX && other.gridZ === adjZ) {
                                occupiesCell = true;
                            }
                        } else {
                            const otherIsXAligned = Math.abs(other.direction.x) > 0;
                            for (let j = 0; j < other.length; j++) {
                                const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                if (otherX === adjX && otherZ === adjZ) {
                                    occupiesCell = true;
                                    break;
                                }
                            }
                        }
                        
                        if (occupiesCell) {
                            surroundingBlocks.add(other);
                        }
                    }
                }
            }
        }
        
        // Store original positions for this block
        const originalX = this.group.position.x;
        const originalZ = this.group.position.z;
        const bounceX = originalX - this.direction.x * bounceDistance;
        const bounceZ = originalZ - this.direction.z * bounceDistance;
        
        // Store original positions for surrounding blocks
        const surroundingBlockOriginals = new Map();
        for (const block of surroundingBlocks) {
            surroundingBlockOriginals.set(block, {
                x: block.group.position.x,
                z: block.group.position.z
            });
        }
        
        const startTime = performance.now();
        
        const bounce = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / bounceDuration, 1);
            
            if (progress < 0.5) {
                // Bounce back (main block only)
                const bounceProgress = progress * 2;
                const eased = 1 - Math.pow(1 - bounceProgress, 2); // Ease out
                this.group.position.x = originalX + (bounceX - originalX) * eased;
                this.group.position.z = originalZ + (bounceZ - originalZ) * eased;
            } else {
                // Shake effect for main block
                const shakeProgress = (progress - 0.5) * 2;
                const shakePhase = shakeProgress * Math.PI * shakeCount;
                const shakeAmount = shakeAmplitude * (1 - shakeProgress);
                const shakeX = Math.sin(shakePhase) * shakeAmount;
                const shakeZ = Math.cos(shakePhase) * shakeAmount;
                
                this.group.position.x = originalX + shakeX;
                this.group.position.z = originalZ + shakeZ;
                
                // Shake effect for surrounding blocks (delayed start, reduced amplitude)
                const surroundingShakeStart = 0.6; // Start shake a bit later
                if (progress > surroundingShakeStart) {
                    const surroundingShakeProgress = (progress - surroundingShakeStart) / (1 - surroundingShakeStart);
                    const surroundingShakePhase = surroundingShakeProgress * Math.PI * shakeCount;
                    const surroundingShakeAmount = surroundingBlockAmplitude * (1 - surroundingShakeProgress);
                    
                    for (const block of surroundingBlocks) {
                        const orig = surroundingBlockOriginals.get(block);
                        if (orig) {
                            const sShakeX = Math.sin(surroundingShakePhase) * surroundingShakeAmount;
                            const sShakeZ = Math.cos(surroundingShakePhase) * surroundingShakeAmount;
                            
                            block.group.position.x = orig.x + sShakeX;
                            block.group.position.z = orig.z + sShakeZ;
                        }
                    }
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(bounce);
            } else {
                // Snap back to exact grid position (main block)
                this.updateWorldPosition();
                this.isAnimating = false;
                
                // Snap back surrounding blocks
                for (const block of surroundingBlocks) {
                    block.updateWorldPosition();
                }
            }
        };
        
        bounce();
    }
    
    fall(horizontalVelX = null, horizontalVelZ = null) {
        if (this.isFalling) return;
        
        this.isFalling = true;
        this.fallingStartTime = Date.now();
        
        // Calculate initial velocities for natural tumbling
        const isXAligned = Math.abs(this.direction.x) > 0;
        const moveDir = isXAligned ? this.direction.x : this.direction.z;
        
        // Primary rotation: tumble around axis perpendicular to movement (like rolling off edge)
        // Secondary rotation: add some wobble/precession for natural motion
        let angularVelX = 0;
        let angularVelY = 0;
        let angularVelZ = 0;
        
        if (this.isVertical) {
            // Vertical blocks: tumble around horizontal axis in direction of movement
            if (isXAligned) {
                angularVelZ = moveDir * 3.5; // Primary: roll forward/backward
                angularVelX = (Math.random() - 0.5) * 2.5; // Secondary: side wobble
            } else {
                angularVelX = -moveDir * 3.5; // Primary: roll forward/backward
                angularVelZ = (Math.random() - 0.5) * 2.5; // Secondary: side wobble
            }
            angularVelY = (Math.random() - 0.5) * 1.5; // Tertiary: spin around vertical
        } else {
            // Horizontal blocks: tumble around axis perpendicular to movement
            if (isXAligned) {
                angularVelZ = moveDir * 4.5; // Primary: roll like a wheel
                angularVelY = (Math.random() - 0.5) * 2.0; // Secondary: yaw wobble
                angularVelX = (Math.random() - 0.5) * 1.5; // Tertiary: pitch variation
            } else {
                angularVelX = -moveDir * 4.5; // Primary: roll like a wheel
                angularVelY = (Math.random() - 0.5) * 2.0; // Secondary: yaw wobble
                angularVelZ = (Math.random() - 0.5) * 1.5; // Tertiary: pitch variation
            }
        }
        
        // Store velocities to apply after body creation
        this.pendingAngularVel = { x: angularVelX, y: angularVelY, z: angularVelZ };
        
        // Use provided horizontal velocity if available (from animation), otherwise use direction-based default
        if (horizontalVelX !== null && horizontalVelZ !== null) {
            this.pendingLinearVel = { x: horizontalVelX, y: 0, z: horizontalVelZ };
        } else {
            // Fallback: use direction with moderate speed for natural continuation
            this.pendingLinearVel = { x: this.direction.x * 3.5, y: 0, z: this.direction.z * 3.5 };
        }
        
        // Mark that we need a physics body - will be created safely in updatePhysics
        this.needsPhysicsBody = true;
    }
    
    setHighlight(highlighted) {
        if (this.isHighlighted === highlighted) return;
        this.isHighlighted = highlighted;
        
        if (!this.cubes || !this.cubes[0]) {
            console.warn('Block.setHighlight: No cubes found');
            return;
        }
        
        const mesh = this.cubes[0];
        if (!mesh.material) {
            console.warn('Block.setHighlight: No material found');
            return;
        }
        
        if (highlighted) {
            // Create bright yellow highlighted material - make it VERY visible
            const highlightMaterial = this.originalMaterial.clone();
            highlightMaterial.emissive = new THREE.Color(0xffff00); // Bright yellow
            highlightMaterial.emissiveIntensity = 2.0; // Very bright
            highlightMaterial.color = new THREE.Color(0xffff00); // Change base color to yellow
            highlightMaterial.roughness = 0.1; // Make it shiny
            mesh.material = highlightMaterial;
            
            // Add pulsing animation
            if (!this.highlightAnimation) {
                this.highlightAnimation = { time: 0 };
            }
            
            console.log(`Block at (${this.gridX}, ${this.gridZ}) highlighted - material updated`);
        } else {
            // Restore original material
            mesh.material = this.originalMaterial;
            this.highlightAnimation = null;
        }
    }
    
    updateHighlightAnimation(deltaTime) {
        if (this.isHighlighted && this.cubes && this.cubes[0] && this.cubes[0].material) {
            if (!this.highlightAnimation) {
                this.highlightAnimation = { time: 0 };
            }
            
            this.highlightAnimation.time += deltaTime;
            const pulse = Math.sin(this.highlightAnimation.time * 3) * 0.3 + 0.7; // Pulse between 0.4 and 1.0
            this.cubes[0].material.emissiveIntensity = pulse;
        }
    }
    
    remove() {
        // Mark as removed first to prevent any further physics reads
        this.isRemoved = true;
        
        if (this.physicsBody) {
            removePhysicsBody(this.physics, this.physicsBody, true);
            this.physicsBody = null;
            this.physicsCollider = null;
        }
        this.scene.remove(this.group);
    }
}

