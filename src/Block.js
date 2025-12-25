import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createPhysicsBlock, removePhysicsBody, isPhysicsStepping, deferBodyCreation, deferBodyModification } from './physics.js';

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
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d]; // Red, Teal, Yellow
        
        const blockMaterial = new THREE.MeshStandardMaterial({ 
            color: colors[length - 1],
            roughness: 0.1, // Low roughness for shiny plastic
            metalness: 0.0 // No metalness for plastic
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
        
        // Create arrow with matching block color
        this.createArrow(arrowStyle, colors[length - 1]);
        
        // Create forward/backward indicators
        this.createDirectionIndicators(colors[length - 1], arrowStyle);
        
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
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissive: blockColor,
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissive: blockColor,
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissive: blockColor,
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissive: blockColor,
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
                    emissive: blockColor,
                    emissiveIntensity: 0, // Base is 0, pulsing animation will add glow
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
        
        // Small offset from surface to avoid z-fighting
        const surfaceOffset = 0.01;
        
        // Create forward-facing dot (small filled circle)
        const dotRadius = 0.08;
        const dotShape = new THREE.Shape();
        dotShape.arc(0, 0, dotRadius, 0, Math.PI * 2, false);
        
        // Get arrow material properties based on style
        let roughness, metalness;
        if (arrowStyle === 1) {
            roughness = 0.3;
            metalness = 0.6;
        } else if (arrowStyle === 2) {
            roughness = 0.4;
            metalness = 0.3;
        } else if (arrowStyle === 3) {
            roughness = 0.5; // Default for MeshStandardMaterial
            metalness = 0.0;
        } else if (arrowStyle === 4) {
            roughness = 0.2;
            metalness = 0.8;
        } else if (arrowStyle === 5) {
            roughness = 0.3;
            metalness = 0.4;
        } else if (arrowStyle === 6) {
            roughness = 0.4;
            metalness = 0.3;
        } else if (arrowStyle === 7) {
            roughness = 0.35;
            metalness = 0.4;
        } else if (arrowStyle === 8) {
            roughness = 0.45;
            metalness = 0.25;
        } else {
            // Default to style 2 properties
            roughness = 0.4;
            metalness = 0.3;
        }
        
        // Create 3D extruded dot (like arrows)
        const dotExtrudeSettings = {
            depth: 0.04,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 4
        };
        
        const dotGeometry = new THREE.ExtrudeGeometry(dotShape, dotExtrudeSettings);
        // Match arrow material properties
        const dotMaterial = new THREE.MeshStandardMaterial({
            color: blockColor,
            emissive: blockColor,
            emissiveIntensity: 0, // Match arrow base emissive
            roughness: roughness,
            metalness: metalness
        });
        
        const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
        dotMesh.castShadow = true;
        dotMesh.receiveShadow = true;
        
        // Create backward-facing outlined circle - 3D extruded
        const circleRadius = 0.18;
        const circleShape = new THREE.Shape();
        circleShape.arc(0, 0, circleRadius, 0, Math.PI * 2, false);
        
        // Create hole for outline effect
        const hole = new THREE.Path();
        hole.arc(0, 0, circleRadius - 0.02, 0, Math.PI * 2, true);
        circleShape.holes.push(hole);
        
        const circleExtrudeSettings = {
            depth: 0.04,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 4
        };
        
        const circleGeometry = new THREE.ExtrudeGeometry(circleShape, circleExtrudeSettings);
        // Match arrow material properties
        const circleMaterial = new THREE.MeshStandardMaterial({
            color: blockColor,
            emissive: blockColor,
            emissiveIntensity: 0, // Match arrow base emissive
            roughness: roughness,
            metalness: metalness
        });
        
        const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
        circleMesh.castShadow = true;
        circleMesh.receiveShadow = true;
        
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
        
        // Update arrow color (use arrowColor if provided, otherwise use block color)
        const finalArrowColor = arrowColor !== null ? arrowColor : newColor;
        // Arrow structure: this.arrow (Group) -> topArrow (Group) -> topArrowMesh (Mesh with material)
        if (this.arrow && this.arrow.children.length > 0) {
            const topArrow = this.arrow.children[0];
            if (topArrow && topArrow.children && topArrow.children.length > 0) {
                const topArrowMesh = topArrow.children[0];
                if (topArrowMesh && topArrowMesh.material) {
                    topArrowMesh.material.color.setHex(finalArrowColor);
                    // Only update emissive if it exists (some arrow styles don't have emissive)
                    if (topArrowMesh.material.emissive) {
                        topArrowMesh.material.emissive.setHex(finalArrowColor);
                    }
                }
            }
        }
        
        // Update direction indicators color to match arrow
        if (this.directionIndicators && this.directionIndicators.children.length >= 2) {
            const dotMesh = this.directionIndicators.children[0];
            const circleMesh = this.directionIndicators.children[1];
            if (dotMesh && dotMesh.material) {
                dotMesh.material.color.setHex(finalArrowColor);
                if (dotMesh.material.emissive) {
                    dotMesh.material.emissive.setHex(finalArrowColor);
                }
            }
            if (circleMesh && circleMesh.material) {
                circleMesh.material.color.setHex(finalArrowColor);
                if (circleMesh.material.emissive) {
                    circleMesh.material.emissive.setHex(finalArrowColor);
                }
            }
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
            // Get block color from original material
            const blockColor = this.originalMaterial ? this.originalMaterial.color.getHex() : 0xffffff;
            this.createDirectionIndicators(blockColor, this.arrowStyle);
        }
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
                const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                
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
                    const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                    
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
                const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                
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
                    const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                    
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
            // Physics body gives world coordinates, but group.position is relative to towerGroup
            // Convert world coordinates to local coordinates by subtracting towerGroup's world position
            const towerCenterOffset = this.gridSize * this.cubeSize / 2; // 3.5 for 7x7 grid
            this.group.position.set(
                x - towerCenterOffset, 
                y - sizeY / 2, 
                z - towerCenterOffset
            );
            this.group.quaternion.set(qx, qy, qz, qw);
            
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
        const newGridX = this.gridX + this.direction.x;
        const newGridZ = this.gridZ + this.direction.z;
        
        if (this.isVertical) {
            if (newGridX < 0 || newGridX >= this.gridSize || newGridZ < 0 || newGridZ >= this.gridSize) {
                return 'fall';
            }
            
            // Check for 3D overlaps: blocks cannot move to a position where they would overlap with another block
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
                const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
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
            
            // Check for 3D overlaps: blocks cannot move to a position where they would overlap with another block
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
                const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
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
        let headOnCollision = null; // Track head-on collision: {block, gridX, gridZ, originalDirection, stepsToCollision}
        
        // Count steps until blocked or edge
        // Continue moving until block entirely leaves the board (all cubes off) or hits an obstacle
        while (true) {
            const nextGridX = tempGridX + this.direction.x;
            const nextGridZ = tempGridZ + this.direction.z;
            
            // Check for collisions with other blocks first
            // Check for 3D overlaps: blocks cannot move to a position where they would overlap with another block
            // This includes checking blocks at different Y levels that might overlap in 3D space
            let blocked = false;
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
                const yRangesOverlap = !(thisYTop <= otherYBottom || thisYBottom >= otherYTop);
                
                // If Y ranges don't overlap, blocks can't collide (they're at different heights)
                if (!yRangesOverlap) continue;
                
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
                // Check if this is a head-on collision (only for single cube or vertical blocks)
                const isSingleOrVertical = (this.length === 1) || this.isVertical;
                const isHeadOn = isSingleOrVertical && collidedBlock && 
                    this.direction.x === -collidedBlock.direction.x && 
                    this.direction.z === -collidedBlock.direction.z;
                
                if (isHeadOn) {
                    // Head-on collision detected: record collision info for animation
                    headOnCollision = {
                        block: collidedBlock,
                        gridX: tempGridX,
                        gridZ: tempGridZ,
                        originalDirection: { x: this.direction.x, z: this.direction.z },
                        stepsToCollision: stepsToObstacle
                    };
                    
                    // Update grid position to collision position
                    this.gridX = tempGridX;
                    this.gridZ = tempGridZ;
                    
                    // Rotate direction immediately (for movement calculation)
                    this.rotateDirectionClockwise();
                    
                    // Continue moving with the new rotated direction from current position
                    // Don't update tempGridX/tempGridZ - stay at current position
                    // The next iteration will calculate nextGridX/nextGridZ using the rotated direction
                    continue; // Skip updating tempGridX/tempGridZ, continue with rotated direction
                } else {
                    // Regular collision: stop
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
        if (stepsToObstacle === 0 && hitObstacle) {
            this.addBounceEffect(blocks);
            return; // Can't move
        }
        
        // If no movement possible, return
        if (stepsToObstacle === 0) {
            return;
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
            const directionX = finalX - startX;
            const directionZ = finalZ - startZ;
            const directionLength = Math.sqrt(directionX * directionX + directionZ * directionZ);
            
            if (directionLength > 0) {
                // Normalize direction
                const normalizedX = directionX / directionLength;
                const normalizedZ = directionZ / directionLength;
                
                // Extend final position by at least 2x the board size to ensure complete disappearance
                // Use block's maximum dimension (length * cubeSize) to ensure it's fully off screen
                const extensionDistance = Math.max(gridSize * this.cubeSize * 2, this.length * this.cubeSize * 3);
                finalX = finalX + normalizedX * extensionDistance;
                finalZ = finalZ + normalizedZ * extensionDistance;
            }
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
        
        // All movements use constant speed (linear interpolation)
        let duration;
        if (hasHeadOnCollision) {
            // Head-on collision: calculate distance to collision + distance after + rotation pause
            const distanceToCollision = Math.sqrt((collisionX - startX) ** 2 + (collisionZ - startZ) ** 2);
            const distanceAfterCollision = Math.sqrt((finalX - collisionX) ** 2 + (finalZ - collisionZ) ** 2);
            const totalDistance = distanceToCollision + distanceAfterCollision;
            duration = (totalDistance / constantSpeed) + rotationPauseDuration;
            collisionProgress = (distanceToCollision / constantSpeed) / duration;
        } else if (isCatapult) {
            // Blocks going off board: use constant speed (linear) - no easing
            duration = recalculatedTotalDistance / constantSpeed;
        } else {
            // Normal movement: use constant speed (linear) - no easing
            duration = recalculatedTotalDistance / constantSpeed;
        }
        
        // Update grid position to final valid position
        // For head-on collisions, direction was already rotated during movement calculation
        this.gridX = finalGridX;
        this.gridZ = finalGridZ;
        
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
        
        const startTime = performance.now();
        
        // Track rotation animation state for head-on collisions
        let rotationStarted = false;
        let rotationCompleted = false;
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            let progress = Math.min(elapsed / duration, 1);
            
            if (hasHeadOnCollision) {
                if (progress < collisionProgress) {
                    // Before collision: animate to collision position
                    const preCollisionProgress = progress / collisionProgress;
                    this.group.position.x = startX + (collisionX - startX) * preCollisionProgress;
                    this.group.position.z = startZ + (collisionZ - startZ) * preCollisionProgress;
                    this.group.scale.set(1, 1, 1);
                } else {
                    // At or after collision: pause at collision position and rotate
                    const timeSinceCollision = (progress - collisionProgress) * duration;
                    
                    if (timeSinceCollision < rotationPauseDuration) {
                        // Pause at collision position
                        this.group.position.x = collisionX;
                        this.group.position.z = collisionZ;
                        
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
                        const endAngle = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
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
                        // After rotation: continue to final position
                        const postRotationProgress = (timeSinceCollision - rotationPauseDuration) / (duration - (collisionProgress * duration) - rotationPauseDuration);
                        const clampedPostProgress = Math.max(0, Math.min(1, postRotationProgress));
                        this.group.position.x = collisionX + (finalX - collisionX) * clampedPostProgress;
                        this.group.position.z = collisionZ + (finalZ - collisionZ) * clampedPostProgress;
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
    
    fall(horizontalVelX = null, horizontalVelZ = null, verticalVelY = null) {
        if (this.isFalling) return;
        
        this.isFalling = true;
        this.fallingStartTime = Date.now();
        
        // Check if this is a catapult launch (has upward velocity)
        const isCatapult = verticalVelY !== null && verticalVelY > 0;
        
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

