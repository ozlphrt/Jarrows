import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createPhysicsBlock, removePhysicsBody, isPhysicsStepping, deferBodyCreation, deferBodyModification } from './physics.js';

/**
 * Movement/collision Y-overlap rules.
 *
 * IMPORTANT: `canMove()` and `move()` must use the SAME overlap logic, otherwise we get:
 * - canMove() === "ok" but move() no-ops (false blocker)
 * - or worse: real overlaps in the grid (impossible puzzle states)
 *
 * We treat blocks as 3D volumes. To avoid float drift causing phantom overlaps at boundaries
 * (e.g. yOffset=2.00168 should be treated as yOffset=2 when it's essentially landed),
 * we "snap" yBottom to the nearest integer layer when it's close enough.
 */
function snapLayerY(y) {
    // Snap only when already very close to an integer layer.
    // This fixes accumulated float drift from animations/support calculations.
    const r = Math.round(y);
    return Math.abs(y - r) < 0.01 ? r : y;
}

function yRangesOverlapForMovement(_thisBlock, _otherBlock, thisYBottom, thisYTop, otherYBottom, otherYTop) {
    const EPSILON = 0.001;

    const thisHeight = thisYTop - thisYBottom;
    const otherHeight = otherYTop - otherYBottom;

    const aBottom = snapLayerY(thisYBottom);
    const bBottom = snapLayerY(otherYBottom);
    const aTop = aBottom + thisHeight;
    const bTop = bBottom + otherHeight;

    // Strict overlap with epsilon: boundaries that merely touch are NOT overlapping.
    return (aTop - bBottom > EPSILON) && (bTop - aBottom > EPSILON);
}

/**
 * Determine if a collision is head-on.
 * Head-on collision occurs when:
 * - Moving block's leading edge (head) hits the other block
 * - AND either:
 *   a) The other block is stationary (direction is {0,0}), OR
 *   b) The other block is moving in the opposite direction
 * 
 * @param {Block} movingBlock - The block that is moving
 * @param {Block} otherBlock - The block being hit
 * @param {number} collisionX - The X grid coordinate where collision occurs
 * @param {number} collisionZ - The Z grid coordinate where collision occurs
 * @param {number} currentX - The current X position of the moving block (defaults to gridX)
 * @param {number} currentZ - The current Z position of the moving block (defaults to gridZ)
 * @returns {boolean} True if this is a head-on collision
 */
function isHeadOnCollision(movingBlock, otherBlock, collisionX, collisionZ, currentX = null, currentZ = null) {
    // Only single-cell, vertical, or horizontal multi-cell blocks can have head-on collisions
    const isSingleOrVertical = (movingBlock.length === 1) || movingBlock.isVertical;
    const isHorizontalMultiCell = !movingBlock.isVertical && movingBlock.length > 1;
    
    if (!isSingleOrVertical && !isHorizontalMultiCell) {
        return false;
    }
    
    // Use provided current position or fall back to gridX/gridZ
    const blockX = currentX !== null ? currentX : movingBlock.gridX;
    const blockZ = currentZ !== null ? currentZ : movingBlock.gridZ;
    
    // Check if the collision point is at the "head" (leading edge) of the moving block
    // For vertical blocks, the head is the block itself (blockX, blockZ)
    // For horizontal blocks, the head is the cell in the direction of movement
    
    let isAtHead = false;
    
    if (movingBlock.isVertical) {
        // Vertical block: head is at (blockX, blockZ), and collision is at (blockX + direction.x, blockZ + direction.z)
        // So collision is at head if it's one step in the direction from the block position
        isAtHead = (collisionX === blockX + movingBlock.direction.x && collisionZ === blockZ + movingBlock.direction.z);
    } else {
        // Horizontal block: head is the cell in the direction of movement
        const isXAligned = Math.abs(movingBlock.direction.x) > 0;
        if (isXAligned) {
            // Moving in X direction: head is the rightmost (if +x) or leftmost (if -x) cell
            const headX = movingBlock.direction.x > 0 
                ? blockX + movingBlock.length - 1 
                : blockX;
            // Collision occurs when moving one step, so head would be at headX + direction.x
            isAtHead = (collisionX === headX + movingBlock.direction.x && collisionZ === blockZ);
        } else {
            // Moving in Z direction: head is the frontmost (if +z) or backmost (if -z) cell
            const headZ = movingBlock.direction.z > 0 
                ? blockZ + movingBlock.length - 1 
                : blockZ;
            // Collision occurs when moving one step, so head would be at headZ + direction.z
            isAtHead = (collisionX === blockX && collisionZ === headZ + movingBlock.direction.z);
        }
    }
    
    if (!isAtHead) {
        return false; // Not hitting at the head, so not head-on
    }
    
    // Now check if the other block is stationary or moving in opposite direction
    const otherIsStationary = otherBlock.direction.x === 0 && otherBlock.direction.z === 0;
    const otherIsOpposite = !otherIsStationary && 
        movingBlock.direction.x === -otherBlock.direction.x && 
        movingBlock.direction.z === -otherBlock.direction.z;
    
    return otherIsStationary || otherIsOpposite;
}

export class Block {
    constructor(length, gridX, gridZ, direction, isVertical, arrowStyle, scene, physics, gridSize, cubeSize, yOffset = 0, level = 1) {
        this.length = length;
        this.gridX = gridX;
        this.gridZ = gridZ;
        this.direction = direction;
        this.isVertical = isVertical;
        this.isAnimating = false;
        this.isFalling = false;
        this.needsTransitionToFalling = false;
        this.needsStop = false;
        // Catapult shadow policy (Battery preset only): suppress shadows only while a catapulted block is moving.
        this.wasCatapulted = false;
        this._catapultShadowSuppressed = false;
        this._catapultRestStartMs = 0;
        // Block lock state (for collision penalties)
        this.isLocked = false;
        this.lockEndTime = 0; // Timestamp when lock expires
        this.lockStartTime = 0; // Timestamp when lock started (for auto-unlock protection)
        this.originalColor = null; // Store original color for restoration
        this.originalOpacity = 1.0; // Store original opacity for restoration
        this.opacityAnimationId = null; // Track opacity animation frame ID
        this.unlockAnimationId = null; // Track unlock transition animation frame ID
        this.isUnlocking = false; // Track if unlock animation is in progress
        this.lockFillMesh = null; // Fill mesh for lock time visualization
        this.lockFillGlowMesh = null; // Glow mesh for fill effect
        this.lockFillProgress = 0; // Fill progress (0.0 to 1.0)
        this.scene = scene;
        this.physics = physics;
        this.gridSize = gridSize;
        this.cubeSize = cubeSize;
        this.yOffset = yOffset;
        this.level = level; // Track which level this block belongs to
        this.arrowStyle = arrowStyle; // Store arrow style for indicator material matching
        
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
        
        // Use Classic palette as default: original natural colors
        const colors = [0xff6b6b, 0x4ecdc4, 0xffc125]; // Red, Teal, Golden Yellow
        const whiteColor = 0xffffff;
        
        // Check global setting for default block color
        const useColored = (typeof window !== 'undefined' && window.useColoredBlocksDefault !== undefined) 
            ? window.useColoredBlocksDefault 
            : false; // Default to white blocks
        
        const blockColor = useColored ? colors[length - 1] : whiteColor;
        // Arrow color always uses length-based colors (for visibility)
        const arrowColor = colors[length - 1];
        
        const blockMaterial = new THREE.MeshStandardMaterial({ 
            color: blockColor,
            roughness: 0.1, // Low roughness for shiny plastic
            metalness: 0.0, // No metalness for plastic
            opacity: 1.0, // Explicitly set opacity
            transparent: false // Will be set to true when locked
        });
        
        // Create single mesh for the entire block
        const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        
        // Position block mesh (centered at origin in group, vertically at half height)
        // For horizontal blocks: mesh bottom should be at yOffset, so position at half height
        // For vertical blocks: mesh bottom should be at yOffset, so position at half height
        blockMesh.position.set(0, blockHeight / 2, 0);
        
        // Store mesh for raycasting
        this.cubes = [blockMesh];
        this.group.add(blockMesh);
        
        // Store original material for highlighting
        this.originalMaterial = blockMaterial;
        this.isHighlighted = false;
        
        // Store original color for lock/unlock color restoration
        this.originalColor = blockColor;
        
        // Create arrow with colored arrow (always colored for visibility)
        this.createArrow(arrowStyle, arrowColor);
        
        // Create forward/backward indicators with colored arrows (always colored for visibility)
        this.createDirectionIndicators(arrowColor, arrowStyle);
        
        // Position block on grid
        this.updateWorldPosition();
        
        // Don't create physics body yet - only create when block falls
        this.physicsBody = null;
        this.physicsCollider = null;
        
        // Add to scene (will be moved to towerGroup later)
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
        
        // Get world position (accounting for towerGroup position)
        const worldPos = new THREE.Vector3();
        this.group.getWorldPosition(worldPos);
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
                    depth: 0.06,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
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
                    depth: 0.05,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
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
                arrowMaterial = new THREE.MeshStandardMaterial({ 
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
                    depth: 0.06,
                    bevelEnabled: false
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor
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
                    depth: 0.08,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.03,
                    bevelSegments: 5
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor
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
                    depth: 0.09,
                    bevelEnabled: true,
                    bevelThickness: 0.035,
                    bevelSize: 0.035,
                    bevelSegments: 4
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor
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
                    depth: 0.08,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.03,
                    bevelSegments: 3
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor
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
                    depth: 0.08,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.03,
                    bevelSegments: 2
                };
                
                arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
                arrowMaterial = new THREE.MeshStandardMaterial({ 
                    color: blockColor
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
        
        // Store original emissiveIntensity for later color updates
        if (topArrowMesh.material.emissive) {
            topArrowMesh.material._originalEmissiveIntensity = topArrowMesh.material.emissiveIntensity !== undefined 
                ? topArrowMesh.material.emissiveIntensity 
                : 0;
        }
        
        // Battery/perf: keep arrows receiving shadows, but avoid adding more shadow casters.
        // The main block body already casts; these small details multiply shadow-map cost on mobile.
        topArrowMesh.castShadow = false;
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
    
    createDirectionIndicators(blockColor, arrowStyle = 2) {
        const indicatorsGroup = new THREE.Group();
        
        // Calculate block dimensions
        let blockWidth, blockHeight, blockDepth;
        const isXAligned = Math.abs(this.direction.x) > 0;
        
        if (this.isVertical) {
            blockWidth = this.cubeSize;
            blockHeight = this.length * this.cubeSize;
            blockDepth = this.cubeSize;
        } else if (isXAligned) {
            blockWidth = this.length * this.cubeSize;
            blockHeight = this.cubeSize;
            blockDepth = this.cubeSize;
        } else {
            blockWidth = this.cubeSize;
            blockHeight = this.cubeSize;
            blockDepth = this.length * this.cubeSize;
        }
        
        // Increased offset from surface to match how arrows stand out (arrows are at cubeSize + 0.02 above block)
        // Use larger offset to make dots/circles stand out the same way
        const surfaceOffset = 0.03;
        
        // Use full arrowColor for all indicators (no darkening)
        const indicatorColor = blockColor; // blockColor is already arrowColor when passed
        
        // Create forward-facing dot (small filled circle)
        const dotRadius = 0.2;
        const dotShape = new THREE.Shape();
        dotShape.arc(0, 0, dotRadius, 0, Math.PI * 2, false);
        
        // Get arrow extrude settings based on arrow style to match emboss/bevel
        // Use style 2 as default (most common), but match the bevel pattern
        let dotExtrudeSettings;
        if (arrowStyle === 1) {
            dotExtrudeSettings = {
                depth: 0.06,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelSegments: 2
            };
        } else if (arrowStyle === 2) {
            dotExtrudeSettings = {
                depth: 0.05,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelSegments: 3
            };
        } else if (arrowStyle === 3) {
            dotExtrudeSettings = {
                depth: 0.05,
                bevelEnabled: false
            };
        } else if (arrowStyle === 4) {
            dotExtrudeSettings = {
                depth: 0.06,
                bevelEnabled: false
            };
        } else if (arrowStyle === 5) {
            dotExtrudeSettings = {
                depth: 0.08,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.03,
                bevelSegments: 5
            };
        } else if (arrowStyle === 6) {
            dotExtrudeSettings = {
                depth: 0.09,
                bevelEnabled: true,
                bevelThickness: 0.035,
                bevelSize: 0.035,
                bevelSegments: 4
            };
        } else if (arrowStyle === 7) {
            dotExtrudeSettings = {
                depth: 0.08,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.03,
                bevelSegments: 3
            };
        } else if (arrowStyle === 8) {
            dotExtrudeSettings = {
                depth: 0.08,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.03,
                bevelSegments: 2
            };
        } else {
            // Default to style 2
            dotExtrudeSettings = {
                depth: 0.05,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelSegments: 3
            };
        }
        
        const dotGeometry = new THREE.ExtrudeGeometry(dotShape, dotExtrudeSettings);
        const dotMaterial = new THREE.MeshStandardMaterial({
            color: indicatorColor,
            side: THREE.DoubleSide
        });
        
        const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
        // Battery/perf: receive only (avoid extra shadow casters for tiny details)
        dotMesh.castShadow = false;
        dotMesh.receiveShadow = true;
        
        // Get Z offset to push indicators away from surface
        const zOffset = 0.01;
        
        // Create backward-facing outlined circle - 3D extruded
        const circleRadius = 0.25;
        const circleShape = new THREE.Shape();
        circleShape.arc(0, 0, circleRadius, 0, Math.PI * 2, false);
        
        // Create hole for outline effect
        const hole = new THREE.Path();
        const holeOffset = 0.06;
        hole.arc(0, 0, circleRadius - holeOffset, 0, Math.PI * 2, true);
        circleShape.holes.push(hole);
        
        // Use same extrude settings as dot
        const circleExtrudeSettings = dotExtrudeSettings;
        
        const circleGeometry = new THREE.ExtrudeGeometry(circleShape, circleExtrudeSettings);
        const circleMaterial = new THREE.MeshStandardMaterial({
            color: indicatorColor,
            side: THREE.DoubleSide
        });
        
        const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
        // Battery/perf: receive only (avoid extra shadow casters for tiny details)
        circleMesh.castShadow = false;
        circleMesh.receiveShadow = true;
        
        // Apply Z offset to make the circle stand out from the surface
        circleMesh.position.z = zOffset;
        
        // Position indicators based on block orientation and direction
        // ShapeGeometry creates shapes in XY plane (Z=0), so we need to rotate them to align with surfaces
        // For surfaces facing X: rotate around Y to face X, then rotate around Z to align with surface
        // For surfaces facing Z: rotate around Y to face Z, then rotate around X to align with surface
        // For surfaces facing Y: already in correct plane, just rotate around Z
        
        if (this.isVertical) {
            // Vertical block: forward/backward are side faces
            // Forward face is in the direction of this.direction
            // Position dot on forward face
            if (this.direction.x > 0) {
                // East face (+X) - shape needs to be in YZ plane facing +X
                dotMesh.position.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
                dotMesh.rotation.set(0, -Math.PI / 2, 0); // Rotate to YZ plane, face +X
            } else if (this.direction.x < 0) {
                // West face (-X) - shape needs to be in YZ plane facing -X
                dotMesh.position.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
                dotMesh.rotation.set(0, Math.PI / 2, 0); // Rotate to YZ plane, face -X
            } else if (this.direction.z > 0) {
                // South face (+Z) - shape needs to be in XY plane facing +Z
                dotMesh.position.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
                dotMesh.rotation.set(0, Math.PI, 0); // Rotate to face +Z
            } else if (this.direction.z < 0) {
                // North face (-Z) - shape needs to be in XY plane facing -Z
                dotMesh.position.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
                dotMesh.rotation.set(0, 0, 0); // Already facing -Z (default)
            }
            
            // Position circle on backward face (opposite direction)
            if (this.direction.x > 0) {
                // Backward is West face (-X)
                circleMesh.position.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
                circleMesh.rotation.set(0, Math.PI / 2, 0);
            } else if (this.direction.x < 0) {
                // Backward is East face (+X)
                circleMesh.position.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
                circleMesh.rotation.set(0, -Math.PI / 2, 0);
            } else if (this.direction.z > 0) {
                // Backward is North face (-Z)
                circleMesh.position.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
                circleMesh.rotation.set(0, 0, 0);
            } else if (this.direction.z < 0) {
                // Backward is South face (+Z)
                circleMesh.position.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
                circleMesh.rotation.set(0, Math.PI, 0);
            }
        } else {
            // Horizontal block - indicators go on end faces (forward/backward)
            if (isXAligned) {
                // Block extends in X direction, indicators on X end faces (YZ planes)
                if (this.direction.x > 0) {
                    // Forward face is East (+X) - dot on +X end face
                    dotMesh.position.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
                    dotMesh.rotation.set(0, -Math.PI / 2, 0); // YZ plane, face +X
                    
                    // Backward face is West (-X) - circle on -X end face
                    circleMesh.position.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
                    circleMesh.rotation.set(0, Math.PI / 2, 0); // YZ plane, face -X
                } else {
                    // Forward face is West (-X) - dot on -X end face
                    dotMesh.position.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
                    dotMesh.rotation.set(0, Math.PI / 2, 0); // YZ plane, face -X
                    
                    // Backward face is East (+X) - circle on +X end face
                    circleMesh.position.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
                    circleMesh.rotation.set(0, -Math.PI / 2, 0); // YZ plane, face +X
                }
            } else {
                // Block extends in Z direction, indicators on Z end faces (XY planes)
                if (this.direction.z > 0) {
                    // Forward face is South (+Z) - dot on +Z end face
                    dotMesh.position.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
                    dotMesh.rotation.set(0, Math.PI, 0); // XY plane, face +Z
                    
                    // Backward face is North (-Z) - circle on -Z end face
                    circleMesh.position.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
                    circleMesh.rotation.set(0, 0, 0); // XY plane, face -Z
                } else {
                    // Forward face is North (-Z) - dot on -Z end face
                    dotMesh.position.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
                    dotMesh.rotation.set(0, 0, 0); // XY plane, face -Z
                    
                    // Backward face is South (+Z) - circle on +Z end face
                    circleMesh.position.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
                    circleMesh.rotation.set(0, Math.PI, 0); // XY plane, face +Z
                }
            }
        }
        
        indicatorsGroup.add(dotMesh);
        indicatorsGroup.add(circleMesh);
        this.group.add(indicatorsGroup);
        this.directionIndicators = indicatorsGroup;
        
        // Debug: Verify indicators are created
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            console.log('Direction indicators created:', {
                dotMesh: !!dotMesh,
                circleMesh: !!circleMesh,
                indicatorsGroup: indicatorsGroup.children.length
            });
        }
    }
    
    // Update block color (material and arrow)
    updateBlockColor(newColor, arrowColor = null) {
        // Update block material color
        if (this.originalMaterial) {
            this.originalMaterial.color.setHex(newColor);
            // Keep shiny plastic properties for all blocks
            this.originalMaterial.roughness = 0.1; // Shiny plastic
            this.originalMaterial.metalness = 0.0; // Plastic, not metal
        }
        
        // Update arrow color - ALWAYS use length-based color (for visibility), ignore passed arrowColor
        const colors = [0xff6b6b, 0x4ecdc4, 0xffc125]; // Red, Teal, Golden Yellow
        const finalArrowColor = colors[this.length - 1] || colors[0];
        // Arrow structure: this.arrow (Group) -> topArrow (Group) -> topArrowMesh (Mesh with material)
        if (this.arrow && this.arrow.children.length > 0) {
            const topArrow = this.arrow.children[0];
            if (topArrow && topArrow.children && topArrow.children.length > 0) {
                const topArrowMesh = topArrow.children[0];
                if (topArrowMesh && topArrowMesh.material) {
                    // Update arrow color ONLY - do not touch emissive properties
                    // This prevents arrows from becoming luminescent when switching block colors
                    topArrowMesh.material.color.setHex(finalArrowColor);
                    // Do NOT update emissive color or intensity - leave them as originally set
                    // The emissive properties should remain unchanged from initial creation
                }
            }
        }
        
        // Use full arrow color for indicators
        const indicatorColor = finalArrowColor;
        
        if (this.directionIndicators && this.directionIndicators.children.length >= 2) {
            const dotMesh = this.directionIndicators.children[0];
            const circleMesh = this.directionIndicators.children[1];
            if (dotMesh && dotMesh.material) {
                dotMesh.material.color.setHex(indicatorColor);
            }
            if (circleMesh && circleMesh.material) {
                circleMesh.material.color.setHex(indicatorColor);
            }
        }
    }
    
    /**
     * Calculate lock duration based on level (fallback for non-timer modes)
     * Formula: baseTime + (level * scalingFactor)
     * Early levels (1-10): ~8-16s
     * Mid levels (11-25): ~16-32s
     * Late levels (26-50): ~24-48s
     * Post-50: ~32-64s (continues scaling)
     */
    static calculateLockDuration(level) {
        const baseTime = 8.0; // Base lock time in seconds (4x increase: 2.0 * 4)
        const scalingFactor = 0.4; // 0.4s per level (4x increase: 0.1 * 4)
        return baseTime + (level * scalingFactor);
    }
    
    /**
     * Lock this block for a duration
     * In timer modes: lock duration proportional to block length
     *   - Red (length 1): 1/10 of remaining time (10%)
     *   - Teal (length 2): 1/5 of remaining time (20%)
     *   - Yellow (length 3): 1/3 of remaining time (33.333%)
     * In Free Flow mode: uses level-based calculation
     * Applies dark grey tint with smooth color transition
     */
    lockBlock(level, remainingTime = null) {
        console.log('[Lock] lockBlock called for block at', this.gridX, this.gridZ, 'isLocked:', this.isLocked, 'isFalling:', this.isFalling, 'isRemoved:', this.isRemoved);
        
        if (this.isLocked || this.isFalling || this.isRemoved) {
            console.log('[Lock] Block already locked/falling/removed, skipping');
            return;
        }
        
        let lockDuration;
        const isTimerMode = remainingTime !== null && remainingTime > 0;
        if (isTimerMode) {
            // Timer mode: lock duration proportional to block length
            // Red (length 1): 1/10 = 10%
            // Teal (length 2): 1/5 = 20%
            // Yellow (length 3): 1/3 = 33.333%
            if (this.length === 1) {
                lockDuration = remainingTime / 10; // Red: 1/10th
            } else if (this.length === 2) {
                lockDuration = remainingTime / 5; // Teal: 1/5th
            } else {
                lockDuration = remainingTime / 3; // Yellow: 1/3rd (length 3)
            }
        } else {
            // Free Flow mode: use level-based calculation
            lockDuration = Block.calculateLockDuration(level);
        }
        
        console.log('[Lock] Setting lock duration:', lockDuration, 'seconds');
        
        // Show explanation modal on first lock (if function is available)
        if (typeof window !== 'undefined' && typeof window.showLockExplanationModal === 'function') {
            window.showLockExplanationModal(lockDuration, isTimerMode, this.length);
        }
        
        this.isLocked = true;
        this.lockStartTime = performance.now();
        this.lockEndTime = performance.now() + (lockDuration * 1000);
        
        // Ensure original color is stored (should be set in constructor, but fallback here)
        if (this.originalColor === null && this.originalMaterial) {
            this.originalColor = this.originalMaterial.color.getHex();
        }
        
        // Use length-based color for tint (same as arrow color) - define early so it's available for fill mesh
        const colors = [0xff6b6b, 0x4ecdc4, 0xffc125]; // Red, Teal, Golden Yellow
        const tintColorHex = colors[this.length - 1] || colors[0];
        const tintColorObj = new THREE.Color(tintColorHex);
        
        // Apply oscillating transparency (2% to 90% opacity)
        // Use both opacity AND color darkening for maximum visibility
        console.log('[Lock] Starting transparency effect, cubes count:', this.cubes.length);
        if (this.cubes.length > 0) {
            // Ensure each mesh has its own material (clone if shared)
            for (const cube of this.cubes) {
                if (cube.material) {
                    // Clone material to ensure it's unique to this block
                    if (!cube.material.userData.isBlockMaterial) {
                        cube.material = cube.material.clone();
                        cube.material.userData.isBlockMaterial = true;
                    }
                    
                    // Store original values
                    if (cube.material.userData.originalOpacity === undefined) {
                        cube.material.userData.originalOpacity = cube.material.opacity !== undefined ? cube.material.opacity : 1.0;
                    }
                    if (cube.material.userData.originalColor === undefined) {
                        cube.material.userData.originalColor = cube.material.color.clone();
                    }
                    
                    // Enable transparency
                    cube.material.transparent = true;
                    cube.material.opacity = 1.0;
                }
            }
            
            // Apply static transparency with visible color tint (no oscillation)
            const staticOpacity = 0.7; // Increased opacity so colors are more visible
            const brightnessFactor = 0.5; // Reduce brightness to 50% (darker appearance)
            
            // Detect iOS for enhanced emissive visibility
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
            
            for (const cube of this.cubes) {
                if (cube.material) {
                    if (!cube.material.userData.originalColor) {
                        cube.material.userData.originalColor = cube.material.color.clone();
                    }
                    
                    // Store original emissive properties for restoration
                    if (cube.material.userData.originalEmissive === undefined) {
                        cube.material.userData.originalEmissive = cube.material.emissive ? cube.material.emissive.clone() : new THREE.Color(0x000000);
                    }
                    if (cube.material.userData.originalEmissiveIntensity === undefined) {
                        cube.material.userData.originalEmissiveIntensity = cube.material.emissiveIntensity !== undefined ? cube.material.emissiveIntensity : 0.0;
                    }
                    
                    // Set static opacity
                    cube.material.transparent = true;
                    cube.material.opacity = staticOpacity;
                    
                    // Apply tint: mix original block color with length-based tint color
                    // This ensures visible tint even for white blocks
                    const originalColorObj = cube.material.userData.originalColor.clone();
                    
                    // Check if original color is white (or very close to white) - use stronger tint mix
                    const isWhite = originalColorObj.r > 0.95 && originalColorObj.g > 0.95 && originalColorObj.b > 0.95;
                    const tintMix = isWhite ? 0.50 : 0.35; // Reduced tint mix (50% for white, 35% for colored blocks)
                    
                    const tintedColor = originalColorObj.clone().lerp(tintColorObj, tintMix);
                    cube.material.color.copy(tintedColor).multiplyScalar(brightnessFactor);
                    
                    // Add emissive glow using length-based tint color - stronger on iOS for visibility
                    cube.material.emissive.copy(tintColorObj);
                    cube.material.emissiveIntensity = isIOS ? 0.25 : 0.15; // Increased emissive on iOS (0.25) vs desktop (0.15)
                    cube.material.needsUpdate = true;
                }
            }
            
            console.log('[Lock] Applied static transparency and darkening effect');
        } else {
            console.log('[Lock] WARNING: No cubes found, cannot apply transparency effect');
        }
        
        // Create fill mesh for lock time visualization
        this.createLockFillMesh(tintColorObj);
    }
    
    /**
     * Create fill mesh that visualizes remaining lock time
     * Fill uses block's tint color and fills along the long axis
     */
    createLockFillMesh(tintColorObj) {
        // Calculate block dimensions (same logic as constructor)
        const isXAligned = Math.abs(this.direction.x) > 0;
        let blockWidth, blockHeight, blockDepth;
        
        if (this.isVertical) {
            blockWidth = this.cubeSize;
            blockHeight = this.length * this.cubeSize;
            blockDepth = this.cubeSize;
        } else if (isXAligned) {
            blockWidth = this.length * this.cubeSize;
            blockHeight = this.cubeSize;
            blockDepth = this.cubeSize;
        } else {
            blockWidth = this.cubeSize;
            blockHeight = this.cubeSize;
            blockDepth = this.length * this.cubeSize;
        }
        
        // Create fill geometry with padding
        // Bottom/end padding: 3% (reduced from 10%)
        // Side padding: 15% (more padding around)
        const bottomEndPaddingRatio = 0.03;
        const sidePaddingRatio = 0.15;
        
        // Calculate fill dimensions with different padding for sides vs bottom/end
        let fillWidth, fillHeight, fillDepth;
        if (this.isVertical) {
            // Vertical: padding on X/Z sides, and Y bottom/end
            fillWidth = blockWidth * (1 - 2 * sidePaddingRatio);
            fillHeight = blockHeight * (1 - 2 * bottomEndPaddingRatio);
            fillDepth = blockDepth * (1 - 2 * sidePaddingRatio);
        } else if (isXAligned) {
            // X-aligned: padding on Y/Z sides, and X start/end
            fillWidth = blockWidth * (1 - 2 * bottomEndPaddingRatio);
            fillHeight = blockHeight * (1 - 2 * sidePaddingRatio);
            fillDepth = blockDepth * (1 - 2 * sidePaddingRatio);
        } else {
            // Z-aligned: padding on X/Y sides, and Z start/end
            fillWidth = blockWidth * (1 - 2 * sidePaddingRatio);
            fillHeight = blockHeight * (1 - 2 * sidePaddingRatio);
            fillDepth = blockDepth * (1 - 2 * bottomEndPaddingRatio);
        }
        
        // Use RoundedBoxGeometry for rounded edges and corners (matching blocks)
        const radius = 0.08; // Same rounding radius as blocks
        const segments = 4; // Same segments as blocks
        const fillGeometry = new RoundedBoxGeometry(fillWidth, fillHeight, fillDepth, segments, radius);
        
        // Create material with tint color, slightly darker, highly emissive
        const darkerTintColor = tintColorObj.clone().multiplyScalar(0.7); // Darken by 30%
        const fillMaterial = new THREE.MeshStandardMaterial({
            color: darkerTintColor,
            emissive: darkerTintColor,
            emissiveIntensity: 2.0, // Increased emissive for stronger glow
            roughness: 0.1,
            metalness: 0.0,
            opacity: 1.0, // Fully opaque
            transparent: false, // Not transparent
            depthWrite: true, // Write to depth buffer for proper occlusion
            depthTest: true
        });
        
        // Create glow geometry (slightly larger for glow effect)
        const glowScale = 1.15; // 15% larger for glow
        const glowGeometry = new RoundedBoxGeometry(
            fillWidth * glowScale, 
            fillHeight * glowScale, 
            fillDepth * glowScale, 
            segments, 
            radius * glowScale
        );
        
        // Create glow material (semi-transparent, highly emissive)
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: darkerTintColor,
            emissive: darkerTintColor,
            emissiveIntensity: 3.0, // Very high emissive for glow
            roughness: 0.1,
            metalness: 0.0,
            opacity: 0.4, // Semi-transparent for glow effect
            transparent: true,
            depthWrite: false, // Don't write to depth for glow
            depthTest: true
        });
        
        // Create glow mesh (renders behind fill mesh)
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.castShadow = false; // Glow doesn't cast shadow
        glowMesh.receiveShadow = false; // Glow doesn't receive shadow
        glowMesh.renderOrder = 0; // Render before fill mesh
        
        // Create fill mesh
        const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
        fillMesh.castShadow = true; // Fill casts shadow
        fillMesh.receiveShadow = true; // Fill receives shadow
        fillMesh.renderOrder = 1; // Render after block mesh (which is at default 0)
        
        // Position and scale fill based on block orientation
        // Block mesh is positioned at (0, blockHeight/2, 0), so bottom is at y=0, top at y=blockHeight
        if (this.isVertical) {
            // Vertical block: fill from bottom to top along Y axis
            // Start at bottom with padding (y = padding + fillHeight/2 so bottom edge is at y=padding)
            const paddingY = blockHeight * bottomEndPaddingRatio;
            const posY = paddingY + fillHeight / 2;
            fillMesh.position.set(0, posY, 0);
            glowMesh.position.set(0, posY, 0);
            fillMesh.scale.set(1, 0, 1); // Start with 0 height
            glowMesh.scale.set(1, 0, 1); // Start with 0 height
        } else if (isXAligned) {
            // Horizontal X-aligned: fill along X axis
            // Position at start based on direction with padding
            const paddingX = blockWidth * bottomEndPaddingRatio;
            const startX = this.direction.x > 0 
                ? -blockWidth / 2 + paddingX + fillWidth / 2  // Start at left with padding if moving right
                : blockWidth / 2 - paddingX - fillWidth / 2;  // Start at right with padding if moving left
            fillMesh.position.set(startX, blockHeight / 2, 0);
            glowMesh.position.set(startX, blockHeight / 2, 0);
            fillMesh.scale.set(0, 1, 1); // Start with 0 width
            glowMesh.scale.set(0, 1, 1); // Start with 0 width
        } else {
            // Horizontal Z-aligned: fill along Z axis
            // Position at start based on direction with padding
            const paddingZ = blockDepth * bottomEndPaddingRatio;
            const startZ = this.direction.z > 0
                ? -blockDepth / 2 + paddingZ + fillDepth / 2  // Start at back with padding if moving forward
                : blockDepth / 2 - paddingZ - fillDepth / 2;   // Start at front with padding if moving back
            fillMesh.position.set(0, blockHeight / 2, startZ);
            glowMesh.position.set(0, blockHeight / 2, startZ);
            fillMesh.scale.set(1, 1, 0); // Start with 0 depth
            glowMesh.scale.set(1, 1, 0); // Start with 0 depth
        }
        
        // Add glow and fill meshes to block group (glow first so it renders behind)
        this.group.add(glowMesh);
        this.group.add(fillMesh);
        this.lockFillMesh = fillMesh;
        this.lockFillGlowMesh = glowMesh; // Store glow mesh reference
        this.lockFillProgress = 0;
        
        console.log('[Lock] Created fill mesh for lock time visualization');
    }
    
    /**
     * Unlock this block with gradual transition back to original appearance
     */
    unlockBlock() {
        if (!this.isLocked && !this.isUnlocking) return;
        
        // If already unlocking, don't start another animation
        if (this.isUnlocking) return;
        
        // Remove and dispose fill mesh
        if (this.lockFillMesh) {
            this.group.remove(this.lockFillMesh);
            if (this.lockFillMesh.geometry) {
                this.lockFillMesh.geometry.dispose();
            }
            if (this.lockFillMesh.material) {
                this.lockFillMesh.material.dispose();
            }
            this.lockFillMesh = null;
        }
        if (this.lockFillGlowMesh) {
            this.group.remove(this.lockFillGlowMesh);
            if (this.lockFillGlowMesh.geometry) {
                this.lockFillGlowMesh.geometry.dispose();
            }
            if (this.lockFillGlowMesh.material) {
                this.lockFillGlowMesh.material.dispose();
            }
            this.lockFillGlowMesh = null;
        }
        this.lockFillProgress = 0;
        
        this.isLocked = false;
        this.lockEndTime = 0;
        this.isUnlocking = true;
        
        // Detect iOS for emissive intensity calculation
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
        
        // Recalculate locked state values using same logic as lock (for accurate animation)
        const originalColorObj = this.cubes[0]?.material?.userData?.originalColor?.clone() ?? new THREE.Color(0xffffff);
        const isWhite = originalColorObj.r > 0.95 && originalColorObj.g > 0.95 && originalColorObj.b > 0.95;
        const tintMix = isWhite ? 0.50 : 0.35; // Match lock logic (reduced tint mix)
        const emissiveIntensity = isIOS ? 0.25 : 0.15; // Match lock logic
        
        // Store current locked state values for animation
        const lockedState = {
            opacity: 0.7, // Current locked opacity
            brightnessFactor: 0.5, // Current locked brightness
            tintMix: tintMix, // Current tint mix (matches lock logic)
            emissiveIntensity: emissiveIntensity // Current emissive intensity (matches lock logic)
        };
        
        // Get target values (original state)
        const targetState = {
            opacity: this.cubes[0]?.material?.userData?.originalOpacity ?? 1.0,
            color: this.cubes[0]?.material?.userData?.originalColor?.clone() ?? new THREE.Color(0xffffff),
            emissive: this.cubes[0]?.material?.userData?.originalEmissive?.clone() ?? new THREE.Color(0x000000),
            emissiveIntensity: this.cubes[0]?.material?.userData?.originalEmissiveIntensity ?? 0.0
        };
        
        // Get length-based tint color for interpolation
        const colors = [0xff6b6b, 0x4ecdc4, 0xffc125]; // Red, Teal, Golden Yellow
        const tintColorHex = colors[this.length - 1] || colors[0];
        const tintColorObj = new THREE.Color(tintColorHex);
        
        // Animation parameters
        const duration = 500; // 500ms transition
        const startTime = performance.now();
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            
            // Easing function (ease-out for smooth transition)
            const eased = 1 - Math.pow(1 - progress, 3);
            
            // Interpolate opacity
            const currentOpacity = lockedState.opacity + (targetState.opacity - lockedState.opacity) * eased;
            
            // Interpolate color (from tinted to original)
            const currentTintMix = lockedState.tintMix + (0 - lockedState.tintMix) * eased;
            const currentBrightness = lockedState.brightnessFactor + (1.0 - lockedState.brightnessFactor) * eased;
            
            // Interpolate emissive intensity
            const currentEmissiveIntensity = lockedState.emissiveIntensity + (targetState.emissiveIntensity - lockedState.emissiveIntensity) * eased;
            
            // Apply to all cubes
            for (const cube of this.cubes) {
                if (cube.material) {
                    // Update opacity
                    cube.material.opacity = currentOpacity;
                    cube.material.transparent = currentOpacity < 1.0;
                    
                    // Update color: interpolate from tinted to original
                    if (cube.material.userData.originalColor) {
                        const originalColor = cube.material.userData.originalColor.clone();
                        const tintedColor = originalColor.clone().lerp(tintColorObj, currentTintMix);
                        cube.material.color.copy(tintedColor).multiplyScalar(currentBrightness);
                    }
                    
                    // Update emissive: interpolate from tint color to original
                    const currentEmissive = new THREE.Color().lerpColors(
                        tintColorObj,
                        targetState.emissive,
                        eased
                    );
                    cube.material.emissive.copy(currentEmissive);
                    cube.material.emissiveIntensity = currentEmissiveIntensity;
                    cube.material.needsUpdate = true;
                }
            }
            
            if (progress < 1.0) {
                this.unlockAnimationId = requestAnimationFrame(animate);
            } else {
                // Animation complete - ensure final values are exactly correct
                for (const cube of this.cubes) {
                    if (cube.material && cube.material.userData.originalOpacity !== undefined) {
                        const origOpacity = cube.material.userData.originalOpacity;
                        cube.material.opacity = origOpacity;
                        cube.material.transparent = origOpacity < 1.0;
                        if (cube.material.userData.originalColor) {
                            cube.material.color.copy(cube.material.userData.originalColor);
                        }
                        // Restore original emissive properties
                        if (cube.material.userData.originalEmissive !== undefined) {
                            cube.material.emissive.copy(cube.material.userData.originalEmissive);
                        }
                        if (cube.material.userData.originalEmissiveIntensity !== undefined) {
                            cube.material.emissiveIntensity = cube.material.userData.originalEmissiveIntensity;
                        }
                        cube.material.needsUpdate = true;
                    }
                }
                this.isUnlocking = false;
                this.unlockAnimationId = null;
            }
        };
        
        // Start animation
        this.unlockAnimationId = requestAnimationFrame(animate);
    }
    
    /**
     * Update fill progress based on remaining lock time
     */
    updateLockFillProgress() {
        if (!this.isLocked || !this.lockFillMesh || !this.lockStartTime || !this.lockEndTime) {
            return;
        }
        
        const now = performance.now();
        const remainingMs = this.lockEndTime - now;
        const totalDuration = this.lockEndTime - this.lockStartTime;
        
        if (totalDuration <= 0) {
            return;
        }
        
        // Calculate progress: 0.0 = just locked, 1.0 = about to unlock
        const progress = Math.max(0.0, Math.min(1.0, 1.0 - (remainingMs / totalDuration)));
        
        // Update fill mesh scale and position based on block orientation
        const isXAligned = Math.abs(this.direction.x) > 0;
        
        // Use minimum scale to ensure visibility (0.01 instead of 0)
        const minScale = 0.01;
        const effectiveProgress = Math.max(minScale, progress);
        
        // Padding constants (matches createLockFillMesh)
        const bottomEndPaddingRatio = 0.03;
        const sidePaddingRatio = 0.15;
        
        // Calculate block dimensions
        let blockWidth, blockHeight, blockDepth;
        if (this.isVertical) {
            blockWidth = this.cubeSize;
            blockHeight = this.length * this.cubeSize;
            blockDepth = this.cubeSize;
        } else if (isXAligned) {
            blockWidth = this.length * this.cubeSize;
            blockHeight = this.cubeSize;
            blockDepth = this.cubeSize;
        } else {
            blockWidth = this.cubeSize;
            blockHeight = this.cubeSize;
            blockDepth = this.length * this.cubeSize;
        }
        
        // Calculate fill dimensions (same as in createLockFillMesh)
        let fillWidth, fillHeight, fillDepth;
        if (this.isVertical) {
            fillWidth = blockWidth * (1 - 2 * sidePaddingRatio);
            fillHeight = blockHeight * (1 - 2 * bottomEndPaddingRatio);
            fillDepth = blockDepth * (1 - 2 * sidePaddingRatio);
        } else if (isXAligned) {
            fillWidth = blockWidth * (1 - 2 * bottomEndPaddingRatio);
            fillHeight = blockHeight * (1 - 2 * sidePaddingRatio);
            fillDepth = blockDepth * (1 - 2 * sidePaddingRatio);
        } else {
            fillWidth = blockWidth * (1 - 2 * sidePaddingRatio);
            fillHeight = blockHeight * (1 - 2 * sidePaddingRatio);
            fillDepth = blockDepth * (1 - 2 * bottomEndPaddingRatio);
        }
        
        if (this.isVertical) {
            // Vertical: scale Y and adjust position to keep bottom-aligned with padding
            const paddingY = blockHeight * bottomEndPaddingRatio;
            const posY = paddingY + (fillHeight * effectiveProgress) / 2;
            this.lockFillMesh.scale.y = effectiveProgress;
            this.lockFillMesh.position.y = posY;
            if (this.lockFillGlowMesh) {
                this.lockFillGlowMesh.scale.y = effectiveProgress;
                this.lockFillGlowMesh.position.y = posY;
            }
        } else if (isXAligned) {
            // Horizontal X-aligned: scale X and adjust position with padding
            const paddingX = blockWidth * bottomEndPaddingRatio;
            let posX;
            if (this.direction.x > 0) {
                // Moving right: fill from left (negative X) with padding
                posX = -blockWidth / 2 + paddingX + (fillWidth * effectiveProgress) / 2;
            } else {
                // Moving left: fill from right (positive X) with padding
                posX = blockWidth / 2 - paddingX - (fillWidth * effectiveProgress) / 2;
            }
            this.lockFillMesh.scale.x = effectiveProgress;
            this.lockFillMesh.position.x = posX;
            if (this.lockFillGlowMesh) {
                this.lockFillGlowMesh.scale.x = effectiveProgress;
                this.lockFillGlowMesh.position.x = posX;
            }
        } else {
            // Horizontal Z-aligned: scale Z and adjust position with padding
            const paddingZ = blockDepth * bottomEndPaddingRatio;
            let posZ;
            if (this.direction.z > 0) {
                // Moving forward: fill from back (negative Z) with padding
                posZ = -blockDepth / 2 + paddingZ + (fillDepth * effectiveProgress) / 2;
            } else {
                // Moving back: fill from front (positive Z) with padding
                posZ = blockDepth / 2 - paddingZ - (fillDepth * effectiveProgress) / 2;
            }
            this.lockFillMesh.scale.z = effectiveProgress;
            this.lockFillMesh.position.z = posZ;
            if (this.lockFillGlowMesh) {
                this.lockFillGlowMesh.scale.z = effectiveProgress;
                this.lockFillGlowMesh.position.z = posZ;
            }
        }
        
        this.lockFillProgress = progress;
    }
    
    /**
     * Update lock state - check if lock has expired and unlock if needed
     * Should be called regularly (e.g., in animation loop)
     */
    updateLockState() {
        // Update fill progress before checking expiration
        if (this.isLocked) {
            this.updateLockFillProgress();
        }
        
        if (this.isLocked && performance.now() >= this.lockEndTime) {
            this.unlockBlock();
        }
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
    
    animateRotationClockwise(duration = 400, callback = null) {
        // Animate the arrow rotation smoothly
        if (!this.arrow || !this.arrow.children.length > 0) {
            // If no arrow, just rotate direction immediately
            this.rotateDirectionClockwise();
            if (callback) callback();
            return;
        }
        
        const topArrow = this.arrow.children[0];
        if (!topArrow) {
            this.rotateDirectionClockwise();
            if (callback) callback();
            return;
        }
        
        // Calculate start and end rotation angles
        const startAngle = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
        const newX = -this.direction.z;
        const newZ = this.direction.x;
        const endAngle = Math.atan2(newX, newZ) + Math.PI;
        
        // Update direction immediately (for movement logic)
        this.direction = { x: newX, z: newZ };
        
        // Animate arrow rotation
        const startTime = performance.now();
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-in-out for smooth rotation
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            const currentAngle = startAngle + (endAngle - startAngle) * eased;
            topArrow.rotation.z = currentAngle;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final angle is exact
                topArrow.rotation.z = endAngle;
                if (callback) callback();
            }
        };
        
        animate();
    }
    
    // Update arrow rotation to match current direction
    updateArrowRotation() {
        if (this.arrow && this.arrow.children.length > 0) {
            const topArrow = this.arrow.children[0];
            if (topArrow) {
                topArrow.rotation.z = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
            }
        }
        
        // Update direction indicators position when direction changes
        if (this.directionIndicators) {
            // Remove old indicators and recreate with new positions
            this.group.remove(this.directionIndicators);
            // Use arrow color (length-based colored version) instead of block color
            // This preserves the colored dots/circles that match the arrow
            const colors = [0xff6b6b, 0x4ecdc4, 0xffc125]; // Red, Teal, Golden Yellow
            const arrowColor = colors[this.length - 1] || colors[0];
            this.createDirectionIndicators(arrowColor, this.arrowStyle);
        }
    }
    
    // Animate random spin: fast rotation that slows down and stops at random direction
    animateRandomSpin(duration = 1800, callback = null) {
        // Vertical blocks, single-cell blocks, and horizontal multi-cell blocks can spin
        // Horizontal multi-cell blocks can only rotate 180 degrees (flip direction)
        const isHorizontalMultiCell = !this.isVertical && this.length > 1;
        
        if (!this.isVertical && this.length !== 1 && !isHorizontalMultiCell) {
            if (callback) callback();
            return;
        }
        
        // If no arrow, just set direction immediately
        if (!this.arrow || !this.arrow.children.length > 0) {
            let targetDirection;
            if (isHorizontalMultiCell) {
                // Horizontal multi-cell: flip 180 degrees (opposite direction)
                targetDirection = { x: -this.direction.x, z: -this.direction.z };
            } else {
                // Vertical or single-cell: random direction
                const directions = [{x: 1, z: 0}, {x: -1, z: 0}, {x: 0, z: 1}, {x: 0, z: -1}];
                targetDirection = directions[Math.floor(Math.random() * directions.length)];
            }
            this.direction = targetDirection;
            this.updateArrowRotation();
            if (callback) callback();
            return;
        }
        
        const topArrow = this.arrow.children[0];
        if (!topArrow) {
            let targetDirection;
            if (isHorizontalMultiCell) {
                // Horizontal multi-cell: flip 180 degrees (opposite direction)
                targetDirection = { x: -this.direction.x, z: -this.direction.z };
            } else {
                // Vertical or single-cell: random direction
                const directions = [{x: 1, z: 0}, {x: -1, z: 0}, {x: 0, z: 1}, {x: 0, z: -1}];
                targetDirection = directions[Math.floor(Math.random() * directions.length)];
            }
            this.direction = targetDirection;
            this.updateArrowRotation();
            if (callback) callback();
            return;
        }
        
        // Determine target direction based on block type
        let targetDirection;
        if (isHorizontalMultiCell) {
            // Horizontal multi-cell: flip 180 degrees (opposite direction)
            targetDirection = { x: -this.direction.x, z: -this.direction.z };
        } else {
            // Vertical or single-cell: random direction (one of 4 cardinal directions)
            const directions = [{x: 1, z: 0}, {x: -1, z: 0}, {x: 0, z: 1}, {x: 0, z: -1}];
            targetDirection = directions[Math.floor(Math.random() * directions.length)];
        }
        
        // Calculate start and end angles
        const startAngle = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
        const targetAngle = Math.atan2(targetDirection.x, targetDirection.z) + Math.PI;
        
        // Calculate number of full rotations (2-4 rotations for visual effect)
        // For horizontal multi-cell blocks, ensure we rotate exactly 180 degrees + full rotations
        const numRotations = 2 + Math.random() * 2; // 2-4 rotations
        const totalRotation = numRotations * Math.PI * 2;
        
        // Determine shortest path to target angle
        let angleDiff = targetAngle - startAngle;
        // Normalize to [-PI, PI] range
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // For horizontal multi-cell blocks, angleDiff should be exactly PI (180 degrees)
        // But we allow some tolerance in case of floating point issues
        if (isHorizontalMultiCell) {
            // Ensure we rotate exactly 180 degrees (PI radians)
            angleDiff = Math.PI; // Always 180 degrees for horizontal multi-cell
        }
        
        // Add full rotations in the same direction as the shortest path
        // If angleDiff is positive, rotate clockwise (positive); if negative, rotate counter-clockwise (negative)
        const rotationDirection = angleDiff >= 0 ? 1 : -1;
        const endAngle = startAngle + (rotationDirection * totalRotation) + angleDiff;
        
        // Normalize endAngle to be equivalent to targetAngle (modulo 2π) to prevent flick
        // This ensures smooth transition from spin to oscillation
        const normalizedEndAngle = targetAngle + (Math.round((endAngle - targetAngle) / (Math.PI * 2)) * Math.PI * 2);
        
        // Update direction to target immediately (for movement logic)
        this.direction = { x: targetDirection.x, z: targetDirection.z };
        
        // Animate arrow rotation with ease-out curve (fast start, slow end)
        const startTime = performance.now();
        const spinDuration = duration * 0.7; // Use 70% of duration for spin, 30% for oscillation
        const oscillationDuration = duration * 0.3; // 30% for compass needle oscillation
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const spinProgress = Math.min(elapsed / spinDuration, 1);
            
            if (spinProgress < 1) {
                // Spin phase: fast start, slow end
                // Using cubic ease-out: 1 - (1 - t)^3
                const eased = 1 - Math.pow(1 - spinProgress, 3);
                const currentAngle = startAngle + (normalizedEndAngle - startAngle) * eased;
                topArrow.rotation.z = currentAngle;
                requestAnimationFrame(animate);
            } else {
                // Ensure smooth transition: set to normalized end angle (equivalent to targetAngle)
                topArrow.rotation.z = normalizedEndAngle;
                
                // Oscillation phase: compass needle effect (magnetic settling)
                const oscillationStartTime = performance.now();
                const oscillationAmplitude = Math.PI / 10; // ~18 degrees for smoother oscillation
                const oscillationCycles = 3; // Back to 3 cycles as requested
                
                const oscillate = () => {
                    const oscillationElapsed = performance.now() - oscillationStartTime;
                    const oscillationProgress = Math.min(oscillationElapsed / oscillationDuration, 1);
                    
                    if (oscillationProgress < 1) {
                        // Even smoother damping: use cubic ease-out for very gradual settling
                        // This creates the smoothest, most natural settling motion
                        const easeOutDamping = 1 - Math.pow(1 - oscillationProgress, 3); // Cubic ease-out for smoother damping
                        const dampingFactor = 1 - easeOutDamping; // Invert so amplitude decreases very gradually
                        
                        // Slow down oscillation frequency at the start for smoother initial motion
                        // Use a slower frequency multiplier that increases over time
                        const frequencyMultiplier = 0.5 + (oscillationProgress * 0.5); // Start at 0.5x, end at 1.0x speed
                        
                        // Oscillate with decreasing amplitude and gradually increasing frequency
                        // Use normalizedEndAngle (which equals targetAngle) as base for smooth continuity
                        const oscillation = Math.sin(oscillationProgress * Math.PI * oscillationCycles * 2 * frequencyMultiplier) * oscillationAmplitude * dampingFactor;
                        topArrow.rotation.z = normalizedEndAngle + oscillation;
                        requestAnimationFrame(oscillate);
                    } else {
                        // Final settle: ensure exact target angle
                        topArrow.rotation.z = targetAngle;
                        // Update indicators to match final direction
                        this.updateArrowRotation();
                        if (callback) callback();
                    }
                };
                
                // Start oscillation immediately
                oscillate();
            }
        };
        
        animate();
    }
    
    // Helper function to check rotation safety with specific directions (for recursive head-on collisions)
    canRotateSafelyAtWithDirection(gridX, gridZ, currentDir, newDir, blocks, gridSize, collidedBlock = null) {
        const newGridX = gridX + newDir.x;
        const newGridZ = gridZ + newDir.z;
        
        if (this.isVertical) {
            if (newGridX < 0 || newGridX >= gridSize || newGridZ < 0 || newGridZ >= gridSize) {
                return true;
            }
            // Check for 3D overlaps: blocks cannot rotate to a position where they would overlap with another block
            for (const other of blocks) {
                // Skip blocks that are falling, removed, or being removed
                if (other === this || other === collidedBlock || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                
                // Calculate Y ranges for both blocks to check for 3D overlap
                const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                const thisYBottom = this.yOffset;
                const thisYTop = this.yOffset + thisHeight;
                
                const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                const otherYBottom = other.yOffset;
                const otherYTop = other.yOffset + otherHeight;
                
                // Check if Y ranges overlap (blocks are at different Y levels but might overlap in 3D)
                // Use strict inequality to avoid false positives when blocks are just touching
                // Blocks overlap if: thisYTop > otherYBottom AND thisYBottom < otherYTop
                const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
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
                // Check for 3D overlaps: blocks cannot rotate to a position where they would overlap with another block
                for (const other of blocks) {
                    // Skip blocks that are falling, removed, or being removed
                if (other === this || other === collidedBlock || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                    
                    // Calculate Y ranges for both blocks to check for 3D overlap
                    const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                    const thisYBottom = this.yOffset;
                    const thisYTop = this.yOffset + thisHeight;
                    
                    const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                    const otherYBottom = other.yOffset;
                    const otherYTop = other.yOffset + otherHeight;
                    
                    // Check if Y ranges overlap (blocks are at different Y levels but might overlap in 3D)
                    // Check if Y ranges overlap - use strict inequality to avoid false positives
                    // Blocks overlap if: thisYTop > otherYBottom AND thisYBottom < otherYTop
                    const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                    
                    // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                    if (!yRangesOverlap) continue;
                    
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
            // Check for 3D overlaps: blocks cannot rotate to a position where they would overlap with another block
            for (const other of blocks) {
                // Skip blocks that are falling, removed, or being removed
                if (other === this || other === collidedBlock || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                
                // Calculate Y ranges for both blocks to check for 3D overlap
                const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                const thisYBottom = this.yOffset;
                const thisYTop = this.yOffset + thisHeight;
                
                const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                const otherYBottom = other.yOffset;
                const otherYTop = other.yOffset + otherHeight;
                
                // Check if Y ranges overlap (blocks are at different Y levels but might overlap in 3D)
                // Use strict inequality to avoid false positives when blocks are just touching
                // Blocks overlap if: thisYTop > otherYBottom AND thisYBottom < otherYTop
                const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
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
                // Check for 3D overlaps: blocks cannot rotate to a position where they would overlap with another block
                for (const other of blocks) {
                    // Skip blocks that are falling, removed, or being removed
                if (other === this || other === collidedBlock || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                    
                    // Calculate Y ranges for both blocks to check for 3D overlap
                    const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                    const thisYBottom = this.yOffset;
                    const thisYTop = this.yOffset + thisHeight;
                    
                    const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                    const otherYBottom = other.yOffset;
                    const otherYTop = other.yOffset + otherHeight;
                    
                    // Check if Y ranges overlap (blocks are at different Y levels but might overlap in 3D)
                    // Check if Y ranges overlap - use strict inequality to avoid false positives
                    // Blocks overlap if: thisYTop > otherYBottom AND thisYBottom < otherYTop
                    const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                    
                    // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                    if (!yRangesOverlap) continue;
                    
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
        
        // Blocks are positioned relative to towerGroup, which is centered at (3.5, 0, 3.5)
        // So we need to offset block positions by -3.5 to center them correctly
        const towerCenterOffset = this.gridSize * this.cubeSize / 2; // 3.5 for 7x7 grid
        this.group.position.set(
            centerX - towerCenterOffset, 
            this.yOffset, 
            centerZ - towerCenterOffset
        );
        
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
            let lvx = 0, lvy = 0, lvz = 0, avx = 0, avy = 0, avz = 0;
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

            // Best-effort velocity reads (used for Battery-mode catapult shadow suppression).
            // If reads fail, we default to "moving" semantics only if already suppressed.
            try {
                if (!isPhysicsStepping()) {
                    const lv = this.physicsBody.linvel();
                    if (lv) { lvx = lv.x; lvy = lv.y; lvz = lv.z; }
                }
            } catch {
                // ignore
            }
            try {
                if (!isPhysicsStepping()) {
                    const av = this.physicsBody.angvel();
                    if (av) { avx = av.x; avy = av.y; avz = av.z; }
                }
            } catch {
                // ignore
            }
            
            if (!readSuccess) return;
            
            const sizeY = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
            
            // Falling block - update position and rotation
            // Physics body gives world coordinates, but group.position is relative to towerGroup
            // Convert world coordinates to local coordinates by subtracting towerGroup's world position
            const towerCenterOffset = this.gridSize * this.cubeSize / 2; // 3.5 for 7x7 grid
            this.group.position.set(
                x - towerCenterOffset, 
                y - sizeY / 2, 
                z - towerCenterOffset
            );
            this.group.quaternion.set(qx, qy, qz, qw);

            // Remove shadows ONLY from catapulted blocks, and only while they are moving.
            // Space note: this only affects shading (renderer shadow terms), not physics; no transforms involved.
            try {
                if (this.wasCatapulted && this.cubes && this.cubes[0]) {
                    const linSpeed = Math.sqrt(lvx * lvx + lvy * lvy + lvz * lvz);
                    const angSpeed = Math.sqrt(avx * avx + avy * avy + avz * avz);
                    const isMoving = linSpeed > 0.06 || angSpeed > 0.06;
                    const now = performance.now();

                    if (isMoving) {
                        this._catapultRestStartMs = 0;
                        if (!this._catapultShadowSuppressed) {
                            this.cubes[0].castShadow = false;
                            this.cubes[0].receiveShadow = false;
                            this._catapultShadowSuppressed = true;
                        }
                    } else {
                        if (!this._catapultRestStartMs) this._catapultRestStartMs = now;
                        // Require a short stable window before restoring to avoid flicker on near-zero jitter.
                        if (this._catapultShadowSuppressed && (now - this._catapultRestStartMs) > 250) {
                            this.cubes[0].castShadow = true;
                            this.cubes[0].receiveShadow = true;
                            this._catapultShadowSuppressed = false;
                        }
                    }
                }
            } catch {
                // best-effort
            }
            
            // Remove block if:
            // 1. It has fallen well below the grid (y < -2, accounting for block height)
            // 2. It has moved too far horizontally from the grid center (beyond reasonable bounds)
            // 3. It has been falling for too long (safety timeout)
            // Note: x, y, z are world coordinates from physics body
            // Grid center in world coordinates is at (3.5, 0, 3.5) due to towerGroup position
            const gridCenterWorld = (this.gridSize * this.cubeSize) / 2; // 3.5 for 7x7 grid
            const maxDistanceFromGrid = this.gridSize * this.cubeSize * 1.5; // 1.5x grid size = 10.5
            const distanceFromCenter = Math.sqrt(
                Math.pow(x - gridCenterWorld, 2) + Math.pow(z - gridCenterWorld, 2)
            );
            
            const shouldRemove = y < -2 || distanceFromCenter > maxDistanceFromGrid || (Date.now() - this.fallingStartTime > 5000);
            
            if (shouldRemove && !this.isRemoved) {
                console.log(`Removing block: y=${y.toFixed(2)}, distance=${distanceFromCenter.toFixed(2)}, maxDist=${maxDistanceFromGrid.toFixed(2)}, time=${Date.now() - this.fallingStartTime}ms`);
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
        // Locked blocks cannot move
        if (this.isLocked) {
            return 'blocked';
        }
        
        const newGridX = this.gridX + this.direction.x;
        const newGridZ = this.gridZ + this.direction.z;
        
        // Debug mode: store detailed blocking information
        if (window.debugMoveMode) {
            window.debugMoveInfo = {
                block: { gridX: this.gridX, gridZ: this.gridZ, yOffset: this.yOffset, isVertical: this.isVertical, length: this.length, direction: {...this.direction} },
                targetPos: { x: newGridX, z: newGridZ },
                blockers: [],
                yRangeChecks: []
            };
        }
        
        if (this.isVertical) {
            if (newGridX < 0 || newGridX >= this.gridSize || newGridZ < 0 || newGridZ >= this.gridSize) {
                if (window.debugMoveMode) {
                    window.debugMoveInfo.result = 'fall';
                    window.debugMoveInfo.reason = `Out of bounds: (${newGridX}, ${newGridZ})`;
                }
                return 'fall';
            }
            
            // Calculate Y ranges for this block
            const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
            const thisYBottom = this.yOffset;
            const thisYTop = this.yOffset + thisHeight;
            
            // Check for 3D overlaps: blocks cannot move to a position where they would overlap with another block
            for (const other of blocks) {
                // Skip blocks that are falling, removed, or being removed
                if (other === this || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                
                // Calculate Y ranges for both blocks to check for 3D overlap
                const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                const otherYBottom = other.yOffset;
                const otherYTop = other.yOffset + otherHeight;
                
                // 3D overlap check (MUST match move() logic)
                const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                
                if (window.debugMoveMode) {
                    // Only log Y-range checks for blocks at the target position to reduce noise
                    const atTargetPosition = newGridX === other.gridX && newGridZ === other.gridZ;
                    if (atTargetPosition || yRangesOverlap) {
                        window.debugMoveInfo.yRangeChecks.push({
                            other: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, isVertical: other.isVertical, length: other.length },
                            thisYRange: { bottom: thisYBottom, top: thisYTop, height: thisHeight },
                            otherYRange: { bottom: otherYBottom, top: otherYTop, height: otherHeight },
                            overlaps: yRangesOverlap,
                            atTargetPosition: atTargetPosition
                        });
                    }
                }
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
                if (other.isVertical) {
                    if (newGridX === other.gridX && newGridZ === other.gridZ) {
                        // Check if this is a head-on collision
                        // Block is currently at (this.gridX, this.gridZ), collision would be at (newGridX, newGridZ)
                        const isHeadOn = isHeadOnCollision(this, other, newGridX, newGridZ, this.gridX, this.gridZ);
                        
                        if (isHeadOn) {
                            if (window.debugMoveMode) {
                                window.debugMoveInfo.blockers.push({
                                    block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset },
                                    reason: 'Head-on collision (allowed)',
                                    isHeadOn: true
                                });
                            }
                            // Head-on collision: block can move (will rotate and continue)
                            continue; // Skip this collision, allow movement
                        }
                        
                        if (window.debugMoveMode) {
                            window.debugMoveInfo.result = 'blocked';
                            window.debugMoveInfo.blockers.push({
                                block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, isVertical: other.isVertical, length: other.length, direction: {...other.direction} },
                                reason: 'Vertical block at same position',
                                isHeadOn: false
                            });
                        }
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
                            // Check if this is a head-on collision
                            // Block is currently at (this.gridX, this.gridZ), collision would be at (otherX, otherZ)
                            const isHeadOn = isHeadOnCollision(this, other, otherX, otherZ, this.gridX, this.gridZ);
                            
                            if (isHeadOn) {
                                if (window.debugMoveMode) {
                                    window.debugMoveInfo.blockers.push({
                                        block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, length: other.length, direction: {...other.direction} },
                                        reason: 'Head-on collision (allowed)',
                                        isHeadOn: true
                                    });
                                }
                                // Head-on collision: block can move (will rotate and continue)
                                continue; // Skip this collision, allow movement
                            }
                            
                            if (window.debugMoveMode) {
                                window.debugMoveInfo.result = 'blocked';
                                window.debugMoveInfo.blockers.push({
                                    block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, isVertical: other.isVertical, length: other.length, direction: {...other.direction} },
                                    cell: { x: otherX, z: otherZ },
                                    reason: 'Horizontal block occupies target cell',
                                    isHeadOn: false
                                });
                            }
                            return 'blocked';
                        }
                    }
                }
            }
            
            if (window.debugMoveMode) {
                window.debugMoveInfo.result = 'ok';
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
                if (window.debugMoveMode) {
                    window.debugMoveInfo.result = 'fall';
                    window.debugMoveInfo.reason = `Out of bounds: cell ${i} at (${checkX}, ${checkZ})`;
                }
                return 'fall';
            }
            
            // Calculate Y ranges for this block
            const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
            const thisYBottom = this.yOffset;
            const thisYTop = this.yOffset + thisHeight;
            
            // Check for 3D overlaps: blocks cannot move to a position where they would overlap with another block
            for (const other of blocks) {
                // Skip blocks that are falling, removed, or being removed
                if (other === this || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                
                // Calculate Y ranges for both blocks to check for 3D overlap
                const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                const otherYBottom = other.yOffset;
                const otherYTop = other.yOffset + otherHeight;
                
                // 3D overlap check (MUST match move() logic)
                const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                
                if (window.debugMoveMode && i === 0) {
                    window.debugMoveInfo.yRangeChecks.push({
                        other: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, isVertical: other.isVertical, length: other.length },
                        thisYRange: { bottom: thisYBottom, top: thisYTop, height: thisHeight },
                        otherYRange: { bottom: otherYBottom, top: otherYTop, height: otherHeight },
                        overlaps: yRangesOverlap,
                        cellIndex: i,
                        checkCell: { x: checkX, z: checkZ }
                    });
                }
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
                        if (other.isVertical) {
                            if (checkX === other.gridX && checkZ === other.gridZ) {
                                // Check if this is a head-on collision
                                // Block is currently at (this.gridX, this.gridZ), collision would be at (checkX, checkZ)
                                const isHeadOn = isHeadOnCollision(this, other, checkX, checkZ, this.gridX, this.gridZ);
                                
                                if (isHeadOn) {
                                    if (window.debugMoveMode) {
                                        window.debugMoveInfo.blockers.push({
                                            block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset },
                                            cell: { x: checkX, z: checkZ, index: i },
                                            reason: 'Head-on collision (allowed)',
                                            isHeadOn: true
                                        });
                                    }
                                    // Head-on collision: block can move (will rotate and continue)
                                    continue; // Skip this collision, allow movement
                                }
                        
                        if (window.debugMoveMode) {
                            window.debugMoveInfo.result = 'blocked';
                            window.debugMoveInfo.blockers.push({
                                block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, isVertical: other.isVertical, length: other.length, direction: {...other.direction} },
                                cell: { x: checkX, z: checkZ, index: i },
                                reason: 'Vertical block at cell position',
                                isHeadOn: false
                            });
                        }
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
                            // Check if this is a head-on collision
                            // Block is currently at (this.gridX, this.gridZ), collision would be at (checkX, checkZ)
                            const isHeadOn = isHeadOnCollision(this, other, checkX, checkZ, this.gridX, this.gridZ);
                            
                            if (isHeadOn) {
                                if (window.debugMoveMode) {
                                    window.debugMoveInfo.blockers.push({
                                        block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, length: other.length, direction: {...other.direction} },
                                        cell: { x: checkX, z: checkZ, index: i },
                                        reason: 'Head-on collision (allowed)',
                                        isHeadOn: true
                                    });
                                }
                                // Head-on collision: block can move (will rotate and continue)
                                continue; // Skip this collision, allow movement
                            }
                            
                            if (window.debugMoveMode) {
                                window.debugMoveInfo.result = 'blocked';
                                window.debugMoveInfo.blockers.push({
                                    block: { gridX: other.gridX, gridZ: other.gridZ, yOffset: other.yOffset, isVertical: other.isVertical, length: other.length, direction: {...other.direction} },
                                    cell: { x: checkX, z: checkZ, index: i },
                                    reason: 'Horizontal block occupies cell',
                                    isHeadOn: false
                                });
                            }
                            return 'blocked';
                        }
                    }
                }
            }
        }
        
        if (window.debugMoveMode) {
            window.debugMoveInfo.result = 'ok';
        }
        return 'ok';
    }
    
    move(blocks, gridSize) {
        // Don't move if already animating, falling, or locked
        if (this.isAnimating || this.isFalling || this.isLocked) return;

        // Snapshot state for Undo BEFORE any move logic mutates direction/yOffset/etc.
        const preMoveState = {
            gridX: this.gridX,
            gridZ: this.gridZ,
            yOffset: this.yOffset,
            direction: { ...this.direction },
            isVertical: this.isVertical,
        };
        
        // Log movement start
        if (window.debugMovementLog) {
            window.debugMovementLog({
                type: 'move-start',
                blockIndex: blocks.indexOf(this),
                initialPosition: { x: this.gridX, z: this.gridZ, y: this.yOffset },
                direction: { ...this.direction },
                isVertical: this.isVertical,
                length: this.length,
            });
        }
        
        // Calculate how many steps the block can move before hitting something
        let stepsToObstacle = 0;
        let tempGridX = this.gridX;
        let tempGridZ = this.gridZ;
        let hitObstacle = false;
        let hitEdge = false;
        let collidedBlock = null; // Track which block we collided with
        let headOnCollision = null; // Track head-on collision: {block, gridX, gridZ, originalDirection, stepsToCollision}
        let headOnCollisionCount = 0; // Safety counter to prevent infinite head-on collision loops
        const MAX_HEAD_ON_COLLISIONS = 10; // Maximum number of head-on collisions allowed in one move
        
        // Count steps until blocked or edge
        // Continue moving until block entirely leaves the board (all cubes off) or hits an obstacle
        while (true) {
            const nextGridX = tempGridX + this.direction.x;
            const nextGridZ = tempGridZ + this.direction.z;
            
            // Check if ANY cube would be off the board at the next position BEFORE moving
            // This prevents blocks from stopping at the edge when they should fall
            let anyCubeOff = false;
            
            if (this.isVertical) {
                if (nextGridX < 0 || nextGridX >= gridSize || nextGridZ < 0 || nextGridZ >= gridSize) {
                    anyCubeOff = true;
                }
            } else {
                const isXAligned = Math.abs(this.direction.x) > 0;
                for (let i = 0; i < this.length; i++) {
                    const checkX = nextGridX + (isXAligned ? i : 0);
                    const checkZ = nextGridZ + (isXAligned ? 0 : i);
                    if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                        anyCubeOff = true;
                        break;
                    }
                }
            }
            
            // If any cube would be off the board at next position, allow one more step then trigger fall
            if (anyCubeOff) {
                hitEdge = true;
                // Allow the block to move one step toward the edge before falling
                // This ensures blocks at n-1 position can still move to the edge and fall
                tempGridX = nextGridX;
                tempGridZ = nextGridZ;
                stepsToObstacle++;
                break; // Now fall from this position (one step closer to edge)
            }
            
            // Check for collisions with other blocks first
            // Check for 3D overlaps: blocks cannot move to a position where they would overlap with another block
            // This includes checking blocks at different Y levels that might overlap in 3D space
            let blocked = false;
            let collisionCellX = null; // Track the specific cell that collided (for horizontal blocks)
            let collisionCellZ = null; // Track the specific cell that collided (for horizontal blocks)
            
            for (const other of blocks) {
                // Skip blocks that are falling, removed, or being removed
                if (other === this || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                
                // Calculate Y ranges for both blocks to check for 3D overlap
                const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                const thisYBottom = this.yOffset;
                const thisYTop = this.yOffset + thisHeight;
                
                const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                const otherYBottom = other.yOffset;
                const otherYTop = other.yOffset + otherHeight;
                
                // Check if Y ranges overlap (blocks are at different Y levels but might overlap in 3D)
                // Use strict inequality to avoid false positives when blocks are just touching
                // Blocks overlap if: thisYTop > otherYBottom AND thisYBottom < otherYTop
                const yRangesOverlap = yRangesOverlapForMovement(this, other, thisYBottom, thisYTop, otherYBottom, otherYTop);
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
                if (this.isVertical) {
                    if (other.isVertical) {
                        if (nextGridX === other.gridX && nextGridZ === other.gridZ) {
                            blocked = true;
                            collidedBlock = other;
                            collisionCellX = nextGridX;
                            collisionCellZ = nextGridZ;
                        }
                    } else {
                        const otherIsXAligned = Math.abs(other.direction.x) > 0;
                        for (let j = 0; j < other.length; j++) {
                            const otherX = other.gridX + (otherIsXAligned ? j : 0);
                            const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                            if (nextGridX === otherX && nextGridZ === otherZ) {
                                blocked = true;
                                collidedBlock = other;
                                collisionCellX = nextGridX;
                                collisionCellZ = nextGridZ;
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
                                collisionCellX = checkX; // Track the specific cell that collided
                                collisionCellZ = checkZ; // Track the specific cell that collided
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
                                    collisionCellX = checkX; // Track the specific cell that collided
                                    collisionCellZ = checkZ; // Track the specific cell that collided
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
                // Use the actual collision cell coordinates (for horizontal blocks, this is the specific cell that collided)
                const collisionX = collisionCellX !== null ? collisionCellX : nextGridX;
                const collisionZ = collisionCellZ !== null ? collisionCellZ : nextGridZ;
                
                const isHeadOn = collidedBlock && isHeadOnCollision(this, collidedBlock, collisionX, collisionZ, tempGridX, tempGridZ);
                
                // Log collision event for debugging
                if (window.debugCollisionLog && collidedBlock) {
                    const collidedBlockIndex = blocks.indexOf(collidedBlock);
                    window.debugCollisionLog({
                        type: isHeadOn ? 'head-on' : 'side',
                        movingBlock: {
                            id: `block_${blocks.indexOf(this)}_${this.gridX}_${this.gridZ}_${this.length}`,
                            index: blocks.indexOf(this),
                            gridX: this.gridX,
                            gridZ: this.gridZ,
                            yOffset: this.yOffset,
                            direction: { ...this.direction },
                            isVertical: this.isVertical,
                            length: this.length,
                        },
                        collidedBlock: {
                            id: `block_${collidedBlockIndex}_${collidedBlock.gridX}_${collidedBlock.gridZ}_${collidedBlock.length}`,
                            index: collidedBlockIndex,
                            gridX: collidedBlock.gridX,
                            gridZ: collidedBlock.gridZ,
                            yOffset: collidedBlock.yOffset,
                            direction: { ...collidedBlock.direction },
                            isVertical: collidedBlock.isVertical,
                            length: collidedBlock.length,
                        },
                        collisionCell: { x: collisionX, z: collisionZ },
                        positionBefore: { x: tempGridX, z: tempGridZ },
                        positionAfter: { x: nextGridX, z: nextGridZ },
                        stepsToObstacle: stepsToObstacle,
                    });
                }
                
                if (isHeadOn) {
                    // Safety check: prevent infinite head-on collision loops
                    headOnCollisionCount++;
                    if (headOnCollisionCount > MAX_HEAD_ON_COLLISIONS) {
                        // Too many head-on collisions - treat as regular collision to prevent infinite loop
                        console.warn(`Block at (${this.gridX}, ${this.gridZ}) hit maximum head-on collisions (${MAX_HEAD_ON_COLLISIONS}), stopping movement`);
                        hitObstacle = true;
                        break;
                    }
                    
                    // Head-on collision detected: record collision info for animation
                    // For both horizontal and vertical blocks, we stay at tempGridX/tempGridZ (position before collision, adjacent to other block)
                    // This prevents overlap with the collided block
                    const finalGridX = tempGridX;
                    const finalGridZ = tempGridZ;
                    
                    headOnCollision = {
                        block: collidedBlock,
                        gridX: finalGridX,
                        gridZ: finalGridZ,
                        originalDirection: { x: this.direction.x, z: this.direction.z },
                        stepsToCollision: stepsToObstacle,
                        originalYOffset: this.yOffset // Store original Y level before drop
                    };
                    
                    // Update grid position: stay at pre-collision position (adjacent, no overlap)
                    // This prevents the block from being positioned at the same cell as the collided block
                    this.gridX = finalGridX;
                    this.gridZ = finalGridZ;
                    // Also update tempGridX/tempGridZ so the continue loop starts from the correct position
                    tempGridX = finalGridX;
                    tempGridZ = finalGridZ;
                    
                    // Rotate direction immediately (for movement calculation)
                    // Horizontal multi-cell blocks rotate 180 degrees (flip direction)
                    // Single-cube and vertical blocks rotate clockwise
                    const isHorizontalMultiCell = !this.isVertical && this.length > 1;
                    if (isHorizontalMultiCell) {
                        // Flip direction 180 degrees: negate both x and z
                        this.direction = { x: -this.direction.x, z: -this.direction.z };
                        this.updateArrowRotation();
                    } else {
                        // Single-cube or vertical: rotate clockwise
                        this.rotateDirectionClockwise();
                    }
                    
                    // Drop down one level after head-on collision
                    // But first check if dropping would cause an overlap
                    const originalYOffset = this.yOffset;
                    const newYOffset = Math.max(0, this.yOffset - this.cubeSize);
                    const thisHeight = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                    const newYBottom = newYOffset;
                    const newYTop = newYOffset + thisHeight;
                    
                    // Log movement calculation for head-on collision
                    if (window.debugMovementLog) {
                        window.debugMovementLog({
                            type: 'head-on-collision',
                            blockIndex: blocks.indexOf(this),
                            positionBefore: { x: tempGridX, z: tempGridZ, y: originalYOffset },
                            positionAfter: { x: finalGridX, z: finalGridZ, y: newYOffset },
                            directionBefore: { ...headOnCollision.originalDirection },
                            directionAfter: { ...this.direction },
                            rotationType: isHorizontalMultiCell ? '180-degree-flip' : 'clockwise',
                        });
                    }
                    
                    // Check if dropping would cause overlap with any block at the block's position
                    // For horizontal blocks, check all cells; for vertical blocks, check the single cell
                    let wouldOverlap = false;
                    const overlappingBlocks = [];
                    for (const other of blocks) {
                        if (other === this || other === collidedBlock || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                        
                        // Check if other block overlaps with this block's cells at the final position
                        let cellsOverlap = false;
                        if (this.isVertical) {
                            // Vertical block: check if other block is at the same cell
                            if (other.isVertical) {
                                cellsOverlap = (other.gridX === finalGridX && other.gridZ === finalGridZ);
                            } else {
                                const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                for (let j = 0; j < other.length; j++) {
                                    const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                    const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                    if (otherX === finalGridX && otherZ === finalGridZ) {
                                        cellsOverlap = true;
                                        break;
                                    }
                                }
                            }
                        } else {
                            // Horizontal block: check if any cell of other block overlaps with any cell of this block
                            const thisIsXAligned = Math.abs(this.direction.x) > 0;
                            const otherIsXAligned = Math.abs(other.direction.x) > 0;
                            for (let i = 0; i < this.length; i++) {
                                const thisX = finalGridX + (thisIsXAligned ? i : 0);
                                const thisZ = finalGridZ + (thisIsXAligned ? 0 : i);
                                
                                if (other.isVertical) {
                                    if (other.gridX === thisX && other.gridZ === thisZ) {
                                        cellsOverlap = true;
                                        break;
                                    }
                                } else {
                                    for (let j = 0; j < other.length; j++) {
                                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                        if (otherX === thisX && otherZ === thisZ) {
                                            cellsOverlap = true;
                                            break;
                                        }
                                    }
                                    if (cellsOverlap) break;
                                }
                            }
                        }
                        
                        if (cellsOverlap) {
                            const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                            const otherYBottom = other.yOffset;
                            const otherYTop = other.yOffset + otherHeight;
                            
                            // Check if Y ranges would overlap
                            if (newYTop > otherYBottom && newYBottom < otherYTop) {
                                wouldOverlap = true;
                                overlappingBlocks.push({
                                    index: blocks.indexOf(other),
                                    gridX: other.gridX,
                                    gridZ: other.gridZ,
                                    yOffset: other.yOffset,
                                    height: otherHeight,
                                });
                                break;
                            }
                        }
                    }
                    
                    // Log overlap check result
                    if (window.debugCollisionLog) {
                        window.debugCollisionLog({
                            type: 'overlap-check',
                            blockIndex: blocks.indexOf(this),
                            position: { x: finalGridX, z: finalGridZ, y: newYOffset },
                            wouldOverlap: wouldOverlap,
                            overlappingBlocks: overlappingBlocks,
                        });
                    }
                    
                    if (!wouldOverlap) {
                        this.yOffset = newYOffset;
                    } else {
                        // Can't drop one level - stay at current level
                        // After a head-on collision, blocks should only drop one level if supported
                        // If that's not possible, they stay at the current level
                        // Don't try to find a lower level - that would allow falling through blocks
                        this.yOffset = this.yOffset;
                    }
                    
                    // Check if the block's current position (after head-on collision) overlaps with any other blocks
                    // If it does, stop movement instead of continuing
                    let positionOverlaps = false;
                    const currentYBottom = this.yOffset;
                    const currentYTop = this.yOffset + thisHeight;
                    
                    for (const other of blocks) {
                        if (other === this || other === collidedBlock || other.isFalling || other.isRemoved || other.removalStartTime) continue;
                        
                        // Check if other block overlaps with this block's cells at the current position
                        // Use this.gridX and this.gridZ since those are the actual position after the head-on collision
                        let cellsOverlap = false;
                        if (this.isVertical) {
                            // Vertical block: check if other block is at the same cell
                            if (other.isVertical) {
                                cellsOverlap = (other.gridX === this.gridX && other.gridZ === this.gridZ);
                            } else {
                                const otherIsXAligned = Math.abs(other.direction.x) > 0;
                                for (let j = 0; j < other.length; j++) {
                                    const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                    const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                    if (otherX === this.gridX && otherZ === this.gridZ) {
                                        cellsOverlap = true;
                                        break;
                                    }
                                }
                            }
                        } else {
                            // Horizontal block: check if any cell of other block overlaps with any cell of this block
                            const thisIsXAligned = Math.abs(this.direction.x) > 0;
                            const otherIsXAligned = Math.abs(other.direction.x) > 0;
                            for (let i = 0; i < this.length; i++) {
                                const thisX = this.gridX + (thisIsXAligned ? i : 0);
                                const thisZ = this.gridZ + (thisIsXAligned ? 0 : i);
                                
                                if (other.isVertical) {
                                    if (other.gridX === thisX && other.gridZ === thisZ) {
                                        cellsOverlap = true;
                                        break;
                                    }
                                } else {
                                    for (let j = 0; j < other.length; j++) {
                                        const otherX = other.gridX + (otherIsXAligned ? j : 0);
                                        const otherZ = other.gridZ + (otherIsXAligned ? 0 : j);
                                        if (otherX === thisX && otherZ === thisZ) {
                                            cellsOverlap = true;
                                            break;
                                        }
                                    }
                                    if (cellsOverlap) break;
                                }
                            }
                        }
                        
                        if (cellsOverlap) {
                            const otherHeight = other.isVertical ? other.length * other.cubeSize : other.cubeSize;
                            const otherYBottom = other.yOffset;
                            const otherYTop = other.yOffset + otherHeight;
                            
                            // Check if Y ranges overlap
                            if (currentYTop > otherYBottom && currentYBottom < otherYTop) {
                                positionOverlaps = true;
                                break;
                            }
                        }
                    }
                    
                    // If the current position overlaps with another block, stop movement
                    if (positionOverlaps) {
                        hitObstacle = true;
                        break;
                    }
                    
                    // Continue moving with the new rotated direction from current position
                    // Don't update tempGridX/tempGridZ - stay at current position
                    // The next iteration will calculate nextGridX/nextGridZ using the rotated direction
                    continue; // Skip updating tempGridX/tempGridZ, continue with rotated direction
                } else {
                    // Regular side collision: stop and lock both blocks
                    hitObstacle = true;
                    
                    // Get remaining time if in timer mode (Time Challenge or Inferno)
                    let remainingTime = null;
                    if (typeof window !== 'undefined' && window.timeLeftSec !== undefined) {
                        remainingTime = window.timeLeftSec;
                    }
                    
                    // Lock both blocks: the moving block (this) and the stationary block (collidedBlock)
                    if (collidedBlock && !collidedBlock.isLocked && !collidedBlock.isFalling && !collidedBlock.isRemoved) {
                        collidedBlock.lockBlock(this.level, remainingTime);
                    }
                    // Lock the moving block as well
                    if (!this.isLocked && !this.isFalling && !this.isRemoved) {
                        this.lockBlock(this.level, remainingTime);
                    }
                    
                    break;
                }
            }
            
            // Move to next position (only reached if no edge detected above)
            stepsToObstacle++;
            tempGridX = nextGridX;
            tempGridZ = nextGridZ;
        }
        
        // If blocked immediately with no movement, add bounce effect
        if (stepsToObstacle === 0 && hitObstacle) {
            this.addBounceEffect(blocks);
            return; // Can't move
        }
        
        // If no movement possible, return (unless hitting edge - edge blocks should still fall)
        if (stepsToObstacle === 0 && !hitEdge) {
            return;
        }

        // Record this move for Undo (single source of truth, independent of input handler)
        if (typeof window !== 'undefined' && typeof window.recordMoveState === 'function') {
            window.recordMoveState(this, preMoveState);
        }
        
        this.isAnimating = true;
        
        let finalGridX = tempGridX;
        let finalGridZ = tempGridZ;
        
        // Calculate start position first (needed for extension calculation)
        // startX/startZ are in local coordinates relative to towerGroup (already offset)
        const startX = this.group.position.x;
        const startZ = this.group.position.z;
        
        // Calculate final position (centered on block) - MUST be in same coordinate space as startX/startZ
        // Blocks are positioned relative to towerGroup, so we need to subtract towerCenterOffset
        const towerCenterOffset = this.gridSize * this.cubeSize / 2; // 3.5 for 7x7 grid
        
        let finalX, finalZ;
        if (this.isVertical) {
            finalX = finalGridX * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
            finalZ = finalGridZ * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
        } else {
            const isXAligned = Math.abs(this.direction.x) > 0;
            if (isXAligned) {
                const startGridX = finalGridX * this.cubeSize + this.cubeSize / 2;
                const endGridX = (finalGridX + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                finalX = (startGridX + endGridX) / 2 - towerCenterOffset;
                finalZ = finalGridZ * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
            } else {
                finalX = finalGridX * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                const startGridZ = finalGridZ * this.cubeSize + this.cubeSize / 2;
                const endGridZ = (finalGridZ + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                finalZ = (startGridZ + endGridZ) / 2 - towerCenterOffset;
            }
        }
        
        // If block is going off the board, extend final position far enough to completely disappear
        // Calculate direction vector for extension
        if (hitEdge) {
            let directionX = finalX - startX;
            let directionZ = finalZ - startZ;
            let directionLength = Math.sqrt(directionX * directionX + directionZ * directionZ);
            
            // If no movement (stepsToObstacle === 0), use block's direction vector instead
            if (directionLength === 0 || stepsToObstacle === 0) {
                // Use block's movement direction to calculate extension direction
                const dirX = this.direction.x;
                const dirZ = this.direction.z;
                directionLength = Math.sqrt(dirX * dirX + dirZ * dirZ);
                if (directionLength > 0) {
                    directionX = dirX / directionLength;
                    directionZ = dirZ / directionLength;
                } else {
                    // Fallback: use a default direction if direction is invalid
                    directionX = 1;
                    directionZ = 0;
                    directionLength = 1;
                }
            } else {
                // Normalize direction from position difference
                directionX = directionX / directionLength;
                directionZ = directionZ / directionLength;
            }
            
            // Extend final position by at least 2x the board size to ensure complete disappearance
            // Use block's maximum dimension (length * cubeSize) to ensure it's fully off screen
            const extensionDistance = Math.max(gridSize * this.cubeSize * 2, this.length * this.cubeSize * 3);
            finalX = finalX + directionX * extensionDistance;
            finalZ = finalZ + directionZ * extensionDistance;
        }
        
        // Smooth easing function (ease-out cubic for smooth deceleration)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        // Catapult easing: fast acceleration then maintain speed
        const easeInQuad = (t) => t * t;
        const catapultEase = (t) => {
            // Quick wind-up (0-15%), then explosive launch (15-100%)
            if (t < 0.15) {
                return easeInQuad(t / 0.15) * 0.05; // Compress/wind-up phase
            }
            return 0.05 + (t - 0.15) / 0.85 * 0.95; // Linear launch phase
        };
        
        // Animation parameters
        const totalDistance = Math.sqrt((finalX - startX) ** 2 + (finalZ - startZ) ** 2);
        
        // Recalculate total distance after potential extension for blocks going off board
        const recalculatedTotalDistance = Math.sqrt((finalX - startX) ** 2 + (finalZ - startZ) ** 2);
        const isCatapult = hitEdge; // Catapult when flying off edge
        // Hide shadows for catapulted blocks during motion (includes this off-board animation phase).
        if (isCatapult) {
            this.wasCatapulted = true;
            this._catapultRestStartMs = 0;
            try {
                if (this.cubes && this.cubes[0]) {
                    this.cubes[0].castShadow = false;
                    this.cubes[0].receiveShadow = false;
                    this._catapultShadowSuppressed = true;
                }
            } catch {
                // best-effort
            }
        }
        
        // Constant speed for all block movements (linear interpolation)
        // Speed: pixels per millisecond (adjust for desired speed)
        const constantSpeed = 0.05; // pixels per ms (50 pixels per second) - slow, visible motion
        
        // Calculate collision position for head-on collision animation
        let collisionX, collisionZ, collisionProgress = 0;
        let rotationPauseDuration = 200; // 200ms pause for rotation animation
        const hasHeadOnCollision = headOnCollision !== null;
        
        if (hasHeadOnCollision) {
            // Calculate collision position in world coordinates
            const collisionGridX = headOnCollision.gridX;
            const collisionGridZ = headOnCollision.gridZ;
            
            if (this.isVertical) {
                collisionX = collisionGridX * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                collisionZ = collisionGridZ * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
            } else {
                // Use original direction for collision position calculation
                const originalDir = headOnCollision.originalDirection;
                const isXAligned = Math.abs(originalDir.x) > 0;
                if (isXAligned) {
                    const startGridX = collisionGridX * this.cubeSize + this.cubeSize / 2;
                    const endGridX = (collisionGridX + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                    collisionX = (startGridX + endGridX) / 2 - towerCenterOffset;
                    collisionZ = collisionGridZ * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                } else {
                    collisionX = collisionGridX * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                    const startGridZ = collisionGridZ * this.cubeSize + this.cubeSize / 2;
                    const endGridZ = (collisionGridZ + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                    collisionZ = (startGridZ + endGridZ) / 2 - towerCenterOffset;
                }
            }
        }
        
        // Update grid position to final valid position
        // For head-on collisions, direction was already rotated during movement calculation
        this.gridX = finalGridX;
        this.gridZ = finalGridZ;
        
        // Log movement completion
        if (window.debugMovementLog) {
            window.debugMovementLog({
                type: 'move-complete',
                blockIndex: blocks.indexOf(this),
                initialPosition: { x: preMoveState.gridX, z: preMoveState.gridZ, y: preMoveState.yOffset },
                finalPosition: { x: this.gridX, z: this.gridZ, y: this.yOffset },
                directionBefore: { ...preMoveState.direction },
                directionAfter: { ...this.direction },
                stepsToObstacle: stepsToObstacle,
                hitObstacle: hitObstacle,
                hitEdge: hitEdge,
                headOnCollision: headOnCollision ? {
                    collidedBlockIndex: blocks.indexOf(headOnCollision.block),
                    stepsToCollision: headOnCollision.stepsToCollision,
                } : null,
            });
        }
        
        // For head-on collisions, ensure final position uses rotated direction
        if (hasHeadOnCollision) {
            // Recalculate finalX/finalZ using rotated direction (already updated)
            if (this.isVertical) {
                finalX = finalGridX * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                finalZ = finalGridZ * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
            } else {
                const isXAligned = Math.abs(this.direction.x) > 0;
                if (isXAligned) {
                    const startGridX = finalGridX * this.cubeSize + this.cubeSize / 2;
                    const endGridX = (finalGridX + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                    finalX = (startGridX + endGridX) / 2 - towerCenterOffset;
                    finalZ = finalGridZ * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                } else {
                    finalX = finalGridX * this.cubeSize + this.cubeSize / 2 - towerCenterOffset;
                    const startGridZ = finalGridZ * this.cubeSize + this.cubeSize / 2;
                    const endGridZ = (finalGridZ + this.length - 1) * this.cubeSize + this.cubeSize / 2;
                    finalZ = (startGridZ + endGridZ) / 2 - towerCenterOffset;
                }
            }
        }
        
        // All movements use constant speed (linear interpolation)
        let duration;
        let timeToCollision = 0;
        let timeAfterCollision = 0;
        if (hasHeadOnCollision) {
            // Head-on collision: calculate time to collision and time after collision separately
            // to maintain same constant speed before and after collision
            // IMPORTANT: Calculate distanceAfterCollision AFTER finalX/finalZ are recalculated with rotated direction
            const distanceToCollision = Math.sqrt((collisionX - startX) ** 2 + (collisionZ - startZ) ** 2);
            const distanceAfterCollision = Math.sqrt((finalX - collisionX) ** 2 + (finalZ - collisionZ) ** 2);
            timeToCollision = distanceToCollision / constantSpeed;
            timeAfterCollision = distanceAfterCollision / constantSpeed;
            duration = timeToCollision + rotationPauseDuration + timeAfterCollision;
            collisionProgress = timeToCollision / duration;
        } else if (isCatapult) {
            // Blocks going off board: use constant speed (linear) - no easing
            duration = recalculatedTotalDistance / constantSpeed;
        } else {
            // Normal movement: use constant speed (linear) - no easing
            duration = recalculatedTotalDistance / constantSpeed;
        }
        
        const startTime = performance.now();
        
        // Track rotation animation state for head-on collisions
        let rotationStarted = false;
        let rotationCompleted = false;
        
        const animate = () => {
            // Allow external cancellation (used by Undo)
            if (this.needsStop) {
                this.needsStop = false;
                this.isAnimating = false;
                this.group.scale.set(1, 1, 1);
                this.updateWorldPosition();
                if (typeof window !== 'undefined' && typeof window.updateUndoButtonState === 'function') {
                    window.updateUndoButtonState();
                }
                return;
            }

            const elapsed = performance.now() - startTime;
            let progress = Math.min(elapsed / duration, 1);
            
            if (hasHeadOnCollision) {
                // Use actual elapsed time for accurate speed calculation
                const elapsedTime = elapsed;
                const collisionTime = timeToCollision;
                
                if (elapsedTime < collisionTime) {
                    // Before collision: animate to collision position at constant speed
                    const preCollisionProgress = elapsedTime / collisionTime;
                    this.group.position.x = startX + (collisionX - startX) * preCollisionProgress;
                    this.group.position.z = startZ + (collisionZ - startZ) * preCollisionProgress;
                    // Keep Y position at original level before collision (group Y = yOffset, mesh bottom at yOffset)
                    const originalYOffset = headOnCollision.originalYOffset;
                    this.group.position.y = originalYOffset;
                    this.group.scale.set(1, 1, 1);
                } else {
                    const timeSinceCollision = elapsedTime - collisionTime;
                    
                    if (timeSinceCollision < rotationPauseDuration) {
                        // Pause at collision position (still at original Y level)
                        this.group.position.x = collisionX;
                        this.group.position.z = collisionZ;
                        // Keep Y at original level during rotation pause (group Y = yOffset, mesh bottom at yOffset)
                        const originalYOffset = headOnCollision.originalYOffset;
                        this.group.position.y = originalYOffset;
                        
                        // Mark rotation as started
                        if (!rotationStarted) {
                            rotationStarted = true;
                        }
                        
                        // Animate arrow rotation during pause
                        const rotationProgress = timeSinceCollision / rotationPauseDuration;
                        const rotationEased = rotationProgress < 0.5 
                            ? 2 * rotationProgress * rotationProgress 
                            : 1 - Math.pow(-2 * rotationProgress + 2, 2) / 2;
                        
                        const originalDir = headOnCollision.originalDirection;
                        const startAngle = Math.atan2(originalDir.x, originalDir.z) + Math.PI;
                        // For horizontal multi-cell blocks, end angle is 180 degrees from start (flip)
                        // For single-cube/vertical blocks, end angle is clockwise rotation
                        const isHorizontalMultiCell = !this.isVertical && this.length > 1;
                        let endAngle;
                        if (isHorizontalMultiCell) {
                            // 180 degree flip: add PI radians
                            endAngle = startAngle + Math.PI;
                        } else {
                            // Clockwise rotation
                            endAngle = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
                        }
                        const currentAngle = startAngle + (endAngle - startAngle) * rotationEased;
                        
                        if (this.arrow && this.arrow.children.length > 0) {
                            const topArrow = this.arrow.children[0];
                            if (topArrow) {
                                topArrow.rotation.z = currentAngle;
                            }
                        }
                        
                        // Subtle bounce effect during rotation
                        const bounce = Math.sin(rotationProgress * Math.PI) * 0.08;
                        this.group.scale.set(1 + bounce, 1 + bounce, 1 + bounce);
                        
                        if (rotationProgress >= 0.99 && !rotationCompleted) {
                            rotationCompleted = true;
                        }
                    } else {
                        // After rotation: continue to final position at same constant speed
                        const timeAfterRotation = timeSinceCollision - rotationPauseDuration;
                        // Use same constant speed calculation as pre-collision
                        const postRotationProgress = timeAfterCollision > 0 ? Math.min(timeAfterRotation / timeAfterCollision, 1) : 1;
                        
                        // Move from collision position to final position at constant speed
                        this.group.position.x = collisionX + (finalX - collisionX) * postRotationProgress;
                        this.group.position.z = collisionZ + (finalZ - collisionZ) * postRotationProgress;
                        
                        // Animate Y position drop during post-rotation movement
                        // Group Y position = yOffset (mesh bottom at yOffset, center at yOffset + blockHeight/2)
                        const originalYOffset = headOnCollision.originalYOffset;
                        const newYOffset = this.yOffset;
                        const currentY = originalYOffset + (newYOffset - originalYOffset) * postRotationProgress;
                        this.group.position.y = currentY;
                        
                        this.group.scale.set(1, 1, 1);
                    }
                }
            } else if (isCatapult) {
                // Blocks going off board: constant speed (linear interpolation) - no easing
                // Use linear progress for constant speed throughout
                this.group.position.x = startX + (finalX - startX) * progress;
                this.group.position.z = startZ + (finalZ - startZ) * progress;
                
                // Keep scale normal (no compression/stretch effects)
                this.group.scale.set(1, 1, 1);
            } else {
                // Normal movement: use linear interpolation (constant speed)
                this.group.position.x = startX + (finalX - startX) * progress;
                this.group.position.z = startZ + (finalZ - startZ) * progress;
                
                // Keep scale normal (no visual effects for constant speed)
                this.group.scale.set(1, 1, 1);
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
                    if (typeof window !== 'undefined' && typeof window.updateUndoButtonState === 'function') {
                        window.updateUndoButtonState();
                    }
                    
                    let velX, velZ, velY;
                    
                    // Use this.direction directly - it represents the arrow direction
                    // Direction values: {x: 1, z: 0} = East, {x: -1, z: 0} = West, {x: 0, z: 1} = South, {x: 0, z: -1} = North
                    // These are direction vectors in grid space, which map directly to world space velocities
                    const dirX = this.direction.x;
                    const dirZ = this.direction.z;
                    
                    if (isCatapult) {
                        // CATAPULT: explosive launch with high velocity and upward arc
                        const catapultSpeed = 8.0; // Much faster horizontal speed
                        const launchAngle = 0.3; // Upward arc (radians, ~17 degrees)
                        
                        // Apply velocity in the direction of the arrow
                        velX = dirX * catapultSpeed;
                        velZ = dirZ * catapultSpeed;
                        velY = Math.sin(launchAngle) * catapultSpeed * 0.6; // Upward velocity for arc
                        
                        this.fall(velX, velZ, velY);
                    } else {
                        // Normal fall: use direction with moderate speed
                        const fallSpeed = 3.5; // Moderate speed for natural continuation
                        
                        // Apply velocity in the direction of the arrow
                        velX = dirX * fallSpeed;
                        velZ = dirZ * fallSpeed;
                        
                        this.fall(velX, velZ);
                    }
            } else {
                // Normal completion - snap to exact grid position
                // Reset scale before snapping
                this.group.scale.set(1, 1, 1);
                
                // Normal completion - snap to exact grid position (same for all movement types)
                // Grid positions and direction are already set correctly before animation started
                // updateWorldPosition() will recalculate based on current gridX/gridZ/direction
                this.updateWorldPosition();
                
                this.isAnimating = false;
                if (typeof window !== 'undefined' && typeof window.updateUndoButtonState === 'function') {
                    window.updateUndoButtonState();
                }
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
        const shakeAmplitude = 0.08; // Increased from 0.06 for slightly more visible shake
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
            // Allow external cancellation (used by Undo)
            if (this.needsStop) {
                this.needsStop = false;
                this.isAnimating = false;
                this.group.scale.set(1, 1, 1);
                this.updateWorldPosition();
                if (typeof window !== 'undefined' && typeof window.updateUndoButtonState === 'function') {
                    window.updateUndoButtonState();
                }
                return;
            }

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
                if (typeof window !== 'undefined' && typeof window.updateUndoButtonState === 'function') {
                    window.updateUndoButtonState();
                }
                
                // Snap back surrounding blocks
                for (const block of surroundingBlocks) {
                    block.updateWorldPosition();
                }
            }
        };
        
        bounce();
    }
    
    fall(horizontalVelX = null, horizontalVelZ = null, verticalVelY = null) {
        if (this.isFalling) return;
        
        this.isFalling = true;
        this.fallingStartTime = Date.now();
        
        // Check if this is a catapult launch (has upward velocity)
        const isCatapult = verticalVelY !== null && verticalVelY > 0;

        // Remove shadows ONLY from catapulted blocks, and only while they are moving.
        // We mark the block as catapulted here and let updateFromPhysics() restore when it settles.
        this.wasCatapulted = !!isCatapult;
        this._catapultRestStartMs = 0;
        if (!isCatapult && this._catapultShadowSuppressed && this.cubes && this.cubes[0]) {
            // Defensive: if this instance gets reused/resurrected, restore default shadow behavior.
            this.cubes[0].castShadow = true;
            this.cubes[0].receiveShadow = true;
            this._catapultShadowSuppressed = false;
        }
        try {
            if (isCatapult && this.cubes && this.cubes[0]) {
                this.cubes[0].castShadow = false;
                this.cubes[0].receiveShadow = false;
                this._catapultShadowSuppressed = true;
            }
        } catch {
            // best-effort
        }
        
        // Calculate initial velocities for natural tumbling
        const isXAligned = Math.abs(this.direction.x) > 0;
        const moveDir = isXAligned ? this.direction.x : this.direction.z;
        
        // Primary rotation: tumble around axis perpendicular to movement (like rolling off edge)
        // Secondary rotation: add some wobble/precession for natural motion
        let angularVelX = 0;
        let angularVelY = 0;
        let angularVelZ = 0;
        
        // Catapult gets more dramatic spin
        const spinMultiplier = isCatapult ? 1.8 : 1.0;
        
        if (this.isVertical) {
            // Vertical blocks: tumble around horizontal axis in direction of movement
            if (isXAligned) {
                angularVelZ = moveDir * 3.5 * spinMultiplier;
                angularVelX = (Math.random() - 0.5) * 2.5 * spinMultiplier;
            } else {
                angularVelX = -moveDir * 3.5 * spinMultiplier;
                angularVelZ = (Math.random() - 0.5) * 2.5 * spinMultiplier;
            }
            angularVelY = (Math.random() - 0.5) * 1.5 * spinMultiplier;
        } else {
            // Horizontal blocks: tumble around axis perpendicular to movement
            if (isXAligned) {
                angularVelZ = moveDir * 4.5 * spinMultiplier;
                angularVelY = (Math.random() - 0.5) * 2.0 * spinMultiplier;
                angularVelX = (Math.random() - 0.5) * 1.5 * spinMultiplier;
            } else {
                angularVelX = -moveDir * 4.5 * spinMultiplier;
                angularVelY = (Math.random() - 0.5) * 2.0 * spinMultiplier;
                angularVelZ = (Math.random() - 0.5) * 1.5 * spinMultiplier;
            }
        }
        
        // Store velocities to apply after body creation
        this.pendingAngularVel = { x: angularVelX, y: angularVelY, z: angularVelZ };
        
        // Use provided velocities if available (from animation), otherwise use direction-based default
        if (horizontalVelX !== null && horizontalVelZ !== null) {
            const yVel = verticalVelY !== null ? verticalVelY : 0;
            this.pendingLinearVel = { x: horizontalVelX, y: yVel, z: horizontalVelZ };
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
            // Create bright golden yellow highlighted material - make it VERY visible
            const highlightMaterial = this.originalMaterial.clone();
            highlightMaterial.emissive = new THREE.Color(0xffc125); // Golden yellow
            highlightMaterial.emissiveIntensity = 2.0; // Very bright
            highlightMaterial.color = new THREE.Color(0xffc125); // Change base color to golden yellow
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
        
        // Remove from parent (could be scene or towerGroup)
        // Blocks are now in towerGroup, so remove from parent
        if (this.group.parent) {
            this.group.parent.remove(this.group);
        } else {
            // Fallback: try removing from scene if no parent
            this.scene.remove(this.group);
        }
    }
}

