/**
 * Debris System for Game Over Animation
 * 
 * Creates small broken fragments from exploded blocks using high-performance
 * GPU InstancedMesh rendering combined with Rapier physics simulation.
 */

import * as THREE from 'three';
import { createPhysicsBlock, deferBodyCreation, deferBodyModification, removePhysicsBody } from './physics.js';

const _matrix = new THREE.Matrix4();
const _position = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
const _scale = new THREE.Vector3();

/**
 * DebrisManager - manages all debris pieces using a single InstancedMesh
 */
export class DebrisManager {
    constructor(physics, scene, maxPieces = 500) {
        this.physics = physics;
        this.scene = scene;
        this.maxPieces = maxPieces;
        this.pieces = []; // Array of { physicsBody, physicsCollider, size, color, spawnTime, position }

        // Single shared geometry and material
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.1
        });

        // Single instanced mesh for all fragments (1 draw call)
        this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.maxPieces);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.instancedMesh.castShadow = true;
        this.instancedMesh.receiveShadow = true;
        this.instancedMesh.count = 0;
        this.instancedMesh.visible = false;

        this.scene.add(this.instancedMesh);
    }

    /**
     * Create debris pieces from a block explosion
     * @param {THREE.Vector3} position - Block center position
     * @param {THREE.Color} color - Block color
     * @param {number} pieceCount - Number of pieces to create (20-50)
     * @returns {Array} Array of created debris data objects
     */
    createDebrisFromBlock(position, color, pieceCount) {
        const availableSlots = this.maxPieces - this.pieces.length;
        const actualCount = Math.min(pieceCount, availableSlots);
        if (actualCount <= 0) return [];

        if (typeof window !== 'undefined' && typeof window.markNeedsRender === 'function') {
            window.markNeedsRender(2500);
        }

        const created = [];
        const now = performance.now() / 1000;

        for (let i = 0; i < actualCount; i++) {
            const size = 0.1 + Math.random() * 0.2;
            const pieceColor = color instanceof THREE.Color ? color.clone() : new THREE.Color(color);

            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            const piecePosition = position.clone().add(offset);

            // Explosion velocity with natural 3D radial distribution
            const angle = Math.random() * Math.PI * 2;
            const horizontalSpeed = 4.0 + Math.random() * 5.0;
            const verticalSpeed = (Math.random() - 0.2) * 1.5;

            const initialVelocity = new THREE.Vector3(
                Math.cos(angle) * horizontalSpeed,
                verticalSpeed,
                Math.sin(angle) * horizontalSpeed
            );

            const piece = {
                size,
                color: pieceColor,
                spawnTime: now,
                position: piecePosition.clone(),
                physicsBody: null,
                physicsCollider: null
            };

            const halfSize = { x: size / 2, y: size / 2, z: size / 2 };

            deferBodyCreation(() => {
                try {
                    const { body, collider } = createPhysicsBlock(
                        this.physics,
                        piecePosition,
                        halfSize,
                        true, // isDynamic
                        true  // useFallingWorld
                    );
                    piece.physicsBody = body;
                    piece.physicsCollider = collider;

                    if (body) {
                        deferBodyModification(() => {
                            if (piece.physicsBody) {
                                piece.physicsBody.setLinvel({
                                    x: initialVelocity.x,
                                    y: initialVelocity.y,
                                    z: initialVelocity.z
                                });
                                piece.physicsBody.setAngvel({
                                    x: (Math.random() - 0.5) * 20,
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

            this.pieces.push(piece);
            created.push(piece);
        }

        if (this.pieces.length > 0) {
            this.instancedMesh.visible = true;
        }

        return created;
    }

    /**
     * Update all debris pieces matrices and colors from physics bodies
     */
    update() {
        const count = this.pieces.length;
        if (count === 0) {
            if (this.instancedMesh.visible) {
                this.instancedMesh.visible = false;
                this.instancedMesh.count = 0;
            }
            return;
        }

        this.instancedMesh.visible = true;
        this.instancedMesh.count = count;

        let needsMatrixUpdate = false;
        let needsColorUpdate = false;

        for (let i = 0; i < count; i++) {
            const piece = this.pieces[i];
            if (piece.physicsBody) {
                const trans = piece.physicsBody.translation();
                const rot = piece.physicsBody.rotation();
                _position.set(trans.x, trans.y, trans.z);
                _quaternion.set(rot.x, rot.y, rot.z, rot.w);
            } else {
                _position.copy(piece.position);
                _quaternion.identity();
            }

            _scale.set(piece.size, piece.size, piece.size);
            _matrix.compose(_position, _quaternion, _scale);
            this.instancedMesh.setMatrixAt(i, _matrix);
            needsMatrixUpdate = true;

            this.instancedMesh.setColorAt(i, piece.color);
            needsColorUpdate = true;
        }

        if (needsMatrixUpdate) {
            this.instancedMesh.instanceMatrix.needsUpdate = true;
        }
        if (needsColorUpdate && this.instancedMesh.instanceColor) {
            this.instancedMesh.instanceColor.needsUpdate = true;
        }
    }

    /**
     * Clean up debris pieces that have settled or fallen off the board
     * @param {number} thresholdY - Y position below which pieces are cleaned up
     * @param {number} minAge - Lifespan in seconds before removal
     */
    cleanupSettled(thresholdY = 0.2, minAge = 2.5) {
        const now = performance.now() / 1000;
        let removedAny = false;

        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const piece = this.pieces[i];
            if (!piece) continue;
            if (!piece.spawnTime) piece.spawnTime = now;

            let currentY = piece.position.y;
            if (piece.physicsBody) {
                currentY = piece.physicsBody.translation().y;
            }

            if (currentY < -1.0 || (now - piece.spawnTime > minAge)) {
                if (piece.physicsBody) {
                    removePhysicsBody(this.physics, piece.physicsBody, true);
                    piece.physicsBody = null;
                    piece.physicsCollider = null;
                }
                this.pieces.splice(i, 1);
                removedAny = true;
            }
        }

        if (removedAny) {
            this.instancedMesh.count = this.pieces.length;
            if (this.pieces.length === 0) {
                this.instancedMesh.visible = false;
            }
        }
    }

    /**
     * Clean up all debris pieces
     */
    cleanup() {
        for (const piece of this.pieces) {
            if (piece && piece.physicsBody) {
                removePhysicsBody(this.physics, piece.physicsBody, true);
                piece.physicsBody = null;
                piece.physicsCollider = null;
            }
        }
        this.pieces = [];
        this.instancedMesh.count = 0;
        this.instancedMesh.visible = false;
    }

    /**
     * Get current piece count
     */
    getPieceCount() {
        return this.pieces.length;
    }

    /**
     * Dispose of geometry, material, and instanced mesh
     */
    dispose() {
        this.cleanup();
        if (this.instancedMesh) {
            this.scene.remove(this.instancedMesh);
            this.geometry.dispose();
            this.material.dispose();
            this.instancedMesh.dispose();
        }
    }
}
