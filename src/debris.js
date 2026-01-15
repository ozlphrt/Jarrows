/**
 * Debris System for Game Over Animation
 * 
 * Creates small broken pieces from exploded blocks that fall and scatter
 * across the base plate using physics simulation.
 */

import * as THREE from 'three';
import { createPhysicsBlock, deferBodyCreation, deferBodyModification, removePhysicsBody } from './physics.js';

/**
 * DebrisPiece class - represents a small broken fragment of a block
 */
export class DebrisPiece {
    constructor(position, color, physics, scene, size = null) {
        this.physics = physics;
        this.scene = scene;
        
        // Random piece size (0.1-0.3 units)
        this.size = size || (0.1 + Math.random() * 0.2);
        
        // Create mesh
        const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        const material = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.3,
            metalness: 0.1
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Set initial position
        this.mesh.position.copy(position);
        scene.add(this.mesh);
        
        // Physics body will be created via deferred creation
        this.physicsBody = null;
        this.physicsCollider = null;
        this.initialVelocity = null;
        
        // Create physics body with deferred creation
        this.createPhysicsBody(position);
    }
    
    createPhysicsBody(position) {
        // Calculate random explosion velocity - BIGGER EXPLOSION, push debris FARTHER AWAY
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI * 0.7; // -63 to +63 degrees (wider spread)
        
        // Separate horizontal and vertical speeds to control spread
        // Horizontal speed: MUCH FASTER to push debris farther away
        const horizontalSpeed = 5.0 + Math.random() * 6.0; // 5.0-11.0 m/s horizontal (much faster)
        // Vertical speed: stronger upward for bigger explosion
        const verticalSpeed = 2.5 + Math.random() * 3.5; // 2.5-6.0 m/s upward
        
        this.initialVelocity = new THREE.Vector3(
            Math.cos(angle) * horizontalSpeed, // Horizontal spread - FARTHER
            verticalSpeed + Math.abs(elevation) * 1.5, // Upward with elevation boost
            Math.sin(angle) * horizontalSpeed  // Horizontal spread - FARTHER
        );
        
        // Defer physics body creation to avoid conflicts during step
        const size = { 
            x: this.size / 2, 
            y: this.size / 2, 
            z: this.size / 2 
        };
        
        deferBodyCreation(() => {
            try {
                const { body, collider } = createPhysicsBlock(
                    this.physics,
                    position,
                    size,
                    true, // isDynamic
                    true  // useFallingWorld
                );
                
                this.physicsBody = body;
                this.physicsCollider = collider;
                
                // Set initial velocity after body is created
                if (this.physicsBody && this.initialVelocity) {
                    deferBodyModification(() => {
                        if (this.physicsBody) {
                            this.physicsBody.setLinvel({
                                x: this.initialVelocity.x,
                                y: this.initialVelocity.y,
                                z: this.initialVelocity.z
                            });
                            
                            // Add random angular velocity for spinning - BIGGER EXPLOSION
                            this.physicsBody.setAngvel({
                                x: (Math.random() - 0.5) * 20, // Faster spinning
                                y: (Math.random() - 0.5) * 20,
                                z: (Math.random() - 0.5) * 20
                            });
                        }
                    });
                }
            } catch (e) {
                console.warn('Failed to create debris physics body:', e);
            }
        });
    }
    
    /**
     * Update debris piece position from physics body
     */
    update() {
        if (this.physicsBody && this.mesh) {
            const translation = this.physicsBody.translation();
            this.mesh.position.set(translation.x, translation.y, translation.z);
            
            // Update rotation from physics body
            const rotation = this.physicsBody.rotation();
            this.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
        }
    }
    
    /**
     * Remove debris piece from scene and physics
     */
    dispose() {
        // Remove mesh
        if (this.mesh) {
            if (this.mesh.parent) {
                this.mesh.parent.remove(this.mesh);
            } else {
                this.scene.remove(this.mesh);
            }
            
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh.material) {
                this.mesh.material.dispose();
            }
            this.mesh = null;
        }
        
        // Remove physics body (will be deferred)
        if (this.physicsBody) {
            removePhysicsBody(this.physics, this.physicsBody, true);
            this.physicsBody = null;
            this.physicsCollider = null;
        }
    }
}

/**
 * DebrisManager - manages all debris pieces
 */
export class DebrisManager {
    constructor(physics, scene) {
        this.physics = physics;
        this.scene = scene;
        this.pieces = [];
        this.maxPieces = 500; // Limit total pieces for performance
    }
    
    /**
     * Create debris pieces from a block explosion
     * @param {THREE.Vector3} position - Block center position
     * @param {THREE.Color} color - Block color
     * @param {number} pieceCount - Number of pieces to create (20-50)
     * @returns {Array<DebrisPiece>} Array of created debris pieces
     */
    createDebrisFromBlock(position, color, pieceCount) {
        const pieces = [];
        const actualCount = Math.min(pieceCount, this.maxPieces - this.pieces.length);
        
        if (actualCount <= 0) {
            return pieces; // Too many pieces already
        }
        
        for (let i = 0; i < actualCount; i++) {
            // Add slight random offset to position for variety
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            const piecePosition = position.clone().add(offset);
            
            const piece = new DebrisPiece(piecePosition, color, this.physics, this.scene);
            pieces.push(piece);
            this.pieces.push(piece);
        }
        
        return pieces;
    }
    
    /**
     * Update all debris pieces (call in render loop)
     */
    update() {
        for (const piece of this.pieces) {
            if (piece) {
                piece.update();
            }
        }
    }
    
    /**
     * Clean up all debris pieces
     */
    cleanup() {
        for (const piece of this.pieces) {
            if (piece) {
                piece.dispose();
            }
        }
        this.pieces = [];
    }
    
    /**
     * Clean up debris pieces that have settled (below a certain threshold)
     * @param {number} thresholdY - Y position below which pieces are considered settled
     * @param {number} minAge - Minimum age in seconds before cleanup
     */
    cleanupSettled(thresholdY = -0.5, minAge = 10) {
        const now = performance.now() / 1000;
        const piecesToRemove = [];
        
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const piece = this.pieces[i];
            if (!piece || !piece.mesh) continue;
            
            // Check if piece has settled below threshold
            if (piece.mesh.position.y < thresholdY) {
                // Check if enough time has passed
                if (!piece.settleTime) {
                    piece.settleTime = now;
                } else if (now - piece.settleTime > minAge) {
                    piecesToRemove.push(i);
                }
            }
        }
        
        // Remove settled pieces
        for (const index of piecesToRemove) {
            const piece = this.pieces[index];
            if (piece) {
                piece.dispose();
            }
            this.pieces.splice(index, 1);
        }
    }
    
    /**
     * Get current piece count
     */
    getPieceCount() {
        return this.pieces.length;
    }
}
