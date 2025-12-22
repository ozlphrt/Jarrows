import * as THREE from 'three';
import { createPhysicsBlock, removePhysicsBody } from './physics.js';

export class Block {
    constructor(length, gridX, gridZ, direction, isVertical, arrowStyle, scene, physics, gridSize, cubeSize) {
        this.length = length;
        this.gridX = gridX;
        this.gridZ = gridZ;
        this.direction = direction;
        this.isVertical = isVertical;
        this.isAnimating = false;
        this.isFalling = false;
        this.scene = scene;
        this.physics = physics;
        this.gridSize = gridSize;
        this.cubeSize = cubeSize;
        
        this.group = new THREE.Group();
        
        // Create cubes with rounded edges
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 4, 4, 4);
        
        // Apply edge rounding
        const positionAttribute = cubeGeometry.attributes.position;
        const vertex = new THREE.Vector3();
        const radius = 0.05;
        
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            
            const signs = {
                x: Math.sign(vertex.x),
                y: Math.sign(vertex.y),
                z: Math.sign(vertex.z)
            };
            
            const absVertex = {
                x: Math.abs(vertex.x),
                y: Math.abs(vertex.y),
                z: Math.abs(vertex.z)
            };
            
            const halfSize = cubeSize / 2;
            const threshold = halfSize - radius;
            
            if (absVertex.x > threshold && absVertex.y > threshold && absVertex.z > threshold) {
                const cornerDist = Math.sqrt(
                    Math.pow(absVertex.x - threshold, 2) +
                    Math.pow(absVertex.y - threshold, 2) +
                    Math.pow(absVertex.z - threshold, 2)
                );
                if (cornerDist > 0) {
                    const scale = radius / cornerDist;
                    vertex.x = signs.x * (threshold + (absVertex.x - threshold) * scale);
                    vertex.y = signs.y * (threshold + (absVertex.y - threshold) * scale);
                    vertex.z = signs.z * (threshold + (absVertex.z - threshold) * scale);
                }
            } else if (absVertex.x > threshold && absVertex.y > threshold) {
                const edgeDist = Math.sqrt(
                    Math.pow(absVertex.x - threshold, 2) +
                    Math.pow(absVertex.y - threshold, 2)
                );
                if (edgeDist > 0) {
                    const scale = radius / edgeDist;
                    vertex.x = signs.x * (threshold + (absVertex.x - threshold) * scale);
                    vertex.y = signs.y * (threshold + (absVertex.y - threshold) * scale);
                }
            } else if (absVertex.x > threshold && absVertex.z > threshold) {
                const edgeDist = Math.sqrt(
                    Math.pow(absVertex.x - threshold, 2) +
                    Math.pow(absVertex.z - threshold, 2)
                );
                if (edgeDist > 0) {
                    const scale = radius / edgeDist;
                    vertex.x = signs.x * (threshold + (absVertex.x - threshold) * scale);
                    vertex.z = signs.z * (threshold + (absVertex.z - threshold) * scale);
                }
            } else if (absVertex.y > threshold && absVertex.z > threshold) {
                const edgeDist = Math.sqrt(
                    Math.pow(absVertex.y - threshold, 2) +
                    Math.pow(absVertex.z - threshold, 2)
                );
                if (edgeDist > 0) {
                    const scale = radius / edgeDist;
                    vertex.y = signs.y * (threshold + (absVertex.y - threshold) * scale);
                    vertex.z = signs.z * (threshold + (absVertex.z - threshold) * scale);
                }
            }
            
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        cubeGeometry.computeVertexNormals();
        
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d];
        const cubeMaterial = new THREE.MeshStandardMaterial({ 
            color: colors[length - 1],
            roughness: 0.7,
            metalness: 0.2
        });
        
        this.cubes = [];
        
        for (let i = 0; i < length; i++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.receiveShadow = true;
            
            if (this.isVertical) {
                cube.position.set(0, cubeSize / 2 + i * cubeSize, 0);
            } else {
                const isXAligned = Math.abs(direction.x) > 0;
                if (isXAligned) {
                    cube.position.set(i * cubeSize, cubeSize / 2, 0);
                } else {
                    cube.position.set(0, cubeSize / 2, i * cubeSize);
                }
            }
            
            this.cubes.push(cube);
            this.group.add(cube);
        }
        
        // Create arrow
        this.createArrow(arrowStyle, colors[length - 1]);
        
        // Position block on grid
        this.updateWorldPosition();
        
        // Create physics body
        this.createPhysicsBody();
        
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
            true // dynamic
        );
        
        this.physicsBody = physicsBody.body;
        this.physicsCollider = physicsBody.collider;
        
        // Lock rotation and Y position initially (grid-based movement)
        // Lock all rotations (X, Y, Z axes)
        this.physicsBody.setEnabledRotations(false, false, false, true);
        const RAPIER = this.physics.RAPIER;
        this.physicsBody.setLinvel(new RAPIER.Vector3(0, 0, 0), true);
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
        
        const topArrow = new THREE.Group();
        const topArrowData = createArrowGeometry(style);
        const topArrowMesh = new THREE.Mesh(topArrowData.geometry, topArrowData.material);
        
        if (style === 1) topArrowMesh.position.z = -0.015;
        else if (style === 2) topArrowMesh.position.z = -0.0125;
        else if (style === 4) topArrowMesh.position.z = -0.015;
        else if (style === 5) topArrowMesh.position.z = -0.025;
        else if (style === 6) topArrowMesh.position.z = -0.03;
        else if (style === 7) topArrowMesh.position.z = -0.025;
        else if (style === 8) topArrowMesh.position.z = -0.0275;
        
        topArrow.add(topArrowMesh);
        
        if (this.isVertical) {
            topArrow.position.set(0, this.length * this.cubeSize + 0.02, 0);
        } else {
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
    
    updateWorldPosition() {
        this.group.position.set(
            this.gridX * this.cubeSize + this.cubeSize / 2,
            0,
            this.gridZ * this.cubeSize + this.cubeSize / 2
        );
        
        // Sync physics body position
        if (this.physicsBody && !this.isFalling) {
            const sizeY = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
            const RAPIER = this.physics.RAPIER;
            const translation = new RAPIER.Vector3(
                this.group.position.x,
                this.group.position.y + sizeY / 2,
                this.group.position.z
            );
            this.physicsBody.setTranslation(translation, true);
        }
    }
    
    updateFromPhysics() {
        if (!this.physicsBody || !this.isFalling) return;
        
        const translation = this.physicsBody.translation();
        const sizeY = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
        
        this.group.position.set(
            translation.x,
            translation.y - sizeY / 2,
            translation.z
        );
        
        // Remove if fallen too far
        if (translation.y < -5) {
            this.remove();
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
        
        this.isAnimating = true;
        
        let stepsToMove = 0;
        let tempGridX = this.gridX;
        let tempGridZ = this.gridZ;
        
        while (true) {
            tempGridX += this.direction.x;
            tempGridZ += this.direction.z;
            
            let willFall = false;
            let willBlock = false;
            
            if (this.isVertical) {
                if (tempGridX < 0 || tempGridX >= gridSize || tempGridZ < 0 || tempGridZ >= gridSize) {
                    willFall = true;
                } else {
                    for (const other of blocks) {
                        if (other === this || other.isFalling) continue;
                        
                        if (other.isVertical) {
                            if (tempGridX === other.gridX && tempGridZ === other.gridZ) {
                                willBlock = true;
                                break;
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
                                
                                if (tempGridX === otherX && tempGridZ === otherZ) {
                                    willBlock = true;
                                    break;
                                }
                            }
                        }
                        if (willBlock) break;
                    }
                }
            } else {
                const isXAligned = Math.abs(this.direction.x) > 0;
                
                for (let i = 0; i < this.length; i++) {
                    let checkX = tempGridX;
                    let checkZ = tempGridZ;
                    
                    if (isXAligned) {
                        checkX += i;
                    } else {
                        checkZ += i;
                    }
                    
                    if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
                        willFall = true;
                        break;
                    }
                    
                    for (const other of blocks) {
                        if (other === this || other.isFalling) continue;
                        
                        if (other.isVertical) {
                            if (checkX === other.gridX && checkZ === other.gridZ) {
                                willBlock = true;
                                break;
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
                                    willBlock = true;
                                    break;
                                }
                            }
                        }
                        if (willBlock) break;
                    }
                    if (willBlock) break;
                }
            }
            
            if (willBlock) {
                break;
            }
            
            stepsToMove++;
            
            if (willFall) {
                break;
            }
        }
        
        if (stepsToMove === 0) {
            this.isAnimating = false;
            return;
        }
        
        const startTime = Date.now();
        const duration = stepsToMove * 150;
        
        const startX = this.group.position.x;
        const startZ = this.group.position.z;
        
        this.gridX += this.direction.x * stepsToMove;
        this.gridZ += this.direction.z * stepsToMove;
        
        const endX = this.gridX * this.cubeSize + this.cubeSize / 2;
        const endZ = this.gridZ * this.cubeSize + this.cubeSize / 2;
        
        const willFallOff = (
            this.gridX < 0 || this.gridX >= gridSize || 
            this.gridZ < 0 || this.gridZ >= gridSize
        );
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            this.group.position.x = startX + (endX - startX) * progress;
            this.group.position.z = startZ + (endZ - startZ) * progress;
            
            // Update physics body during animation
            if (this.physicsBody && !willFallOff) {
                const sizeY = this.isVertical ? this.length * this.cubeSize : this.cubeSize;
                const RAPIER = this.physics.RAPIER;
                const translation = new RAPIER.Vector3(
                    this.group.position.x,
                    this.group.position.y + sizeY / 2,
                    this.group.position.z
                );
                this.physicsBody.setTranslation(translation, true);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                if (willFallOff) {
                    this.fall();
                } else {
                    this.updateWorldPosition();
                }
            }
        };
        
        animate();
    }
    
    fall() {
        if (this.isFalling) return;
        
        this.isFalling = true;
        
        // Enable physics for falling
        if (this.physicsBody) {
            // Enable all rotations (X, Y, Z axes)
            this.physicsBody.setEnabledRotations(true, true, true, true);
            // Apply slight initial velocity for rotation
            const RAPIER = this.physics.RAPIER;
            this.physicsBody.setAngvel(new RAPIER.Vector3(2, 1, 0.5), true);
        }
    }
    
    remove() {
        if (this.physicsBody) {
            removePhysicsBody(this.physics, this.physicsBody);
        }
        this.scene.remove(this.group);
    }
}

