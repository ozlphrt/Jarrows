/**
 * Particle System for Game Over Animation
 * 
 * Provides particle effects for block explosions with dust/debris particles.
 * Uses Three.js Points-based system for performance.
 */

import * as THREE from 'three';

/**
 * Create a particle system
 * @param {number} maxParticles - Maximum number of particles
 * @param {THREE.Scene} scene - The Three.js scene to add particles to
 * @returns {Object} Particle system object
 */
export function createParticleSystem(maxParticles = 1000, scene) {
    const particles = [];
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const lifetimes = new Float32Array(maxParticles);
    const velocities = [];
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create material
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    let nextParticleIndex = 0;
    const GRAVITY = -20.0; // Medium gravity — heavier arc

    function addExplosion(position, color, count = 50, velocity = 5.0) {
        const clampedVelocity = Math.min(velocity, 9.0);

        for (let i = 0; i < count; i++) {
            const index = nextParticleIndex;
            nextParticleIndex = (nextParticleIndex + 1) % maxParticles;
            
            if (!particles[index]) {
                particles[index] = { index };
            }
            
            const particle = particles[index];
            particle.active = true;
            particle.isGrounded = false;
            particle.bounces = 0;
            particle.maxBounces = 0;
            particle.groundedAge = 0;
            particle.age = 0;
            particle.startSize = 0.08 + Math.random() * 0.12;
            particle.drag = 0.992; // Low drag for wide travel
            
            const theta = Math.random() * Math.PI * 2; // Full 360° horizontal
            const phi = Math.random() * Math.PI * 0.45; // Upper hemisphere only (0° to 81°)
            const speed = clampedVelocity * (1.0 + Math.random() * 1.4); // Wide horizontal range
            
            particle.velocity = new THREE.Vector3(
                Math.cos(theta) * Math.cos(phi) * speed,
                Math.sin(phi) * speed + 2.0, // Upward pop then heavier fall
                Math.sin(theta) * Math.cos(phi) * speed
            );
            
            const isSpark = Math.random() < 0.15;
            const brightness = isSpark ? 1.6 : (0.8 + Math.random() * 0.4);
            
            if (isSpark) {
                colors[index * 3] = Math.min(1.0, color.r * 1.4 + 0.2);
                colors[index * 3 + 1] = Math.min(1.0, color.g * 1.4 + 0.2);
                colors[index * 3 + 2] = Math.min(1.0, color.b * 1.4 + 0.2);
                particle.startSize *= 1.2;
            } else {
                colors[index * 3] = Math.min(1.0, color.r * brightness);
                colors[index * 3 + 1] = Math.min(1.0, color.g * brightness);
                colors[index * 3 + 2] = Math.min(1.0, color.b * brightness);
            }
            
            positions[index * 3] = position.x + (Math.random() - 0.5) * 0.2;
            positions[index * 3 + 1] = position.y + (Math.random() - 0.5) * 0.2;
            positions[index * 3 + 2] = position.z + (Math.random() - 0.5) * 0.2;
            
            // Store original color for fade
            particle.colorR = colors[index * 3];
            particle.colorG = colors[index * 3 + 1];
            particle.colorB = colors[index * 3 + 2];
            
            sizes[index] = particle.startSize;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;

        if (typeof window !== 'undefined' && typeof window.markNeedsRender === 'function') {
            window.markNeedsRender(2000);
        }
    }
    
    /**
     * Update all particles
     * @param {number} deltaTime - Time delta in seconds
     */
    function updateParticles(deltaTime) {
        const KILL_Y = -10.0;
        
        let baseWorldY = 0;
        let baseWorldX = 3.5;
        let baseWorldZ = 3.5;
        let baseHalfSize = 5.5; // Default half-size for 11x11 base plate (7 + 2*margin)

        if (window.gameGrid && window.gameGrid.base) {
            const basePos = new THREE.Vector3();
            window.gameGrid.base.getWorldPosition(basePos);
            baseWorldY = basePos.y + 0.1; 
            baseWorldX = basePos.x;
            baseWorldZ = basePos.z;
            
            // Derive actual size from geometry & scale (21 * base.scale.x / 2 = 11 / 2 = 5.5)
            if (window.gameGrid.base.geometry && window.gameGrid.base.geometry.parameters) {
                const baseWidth = window.gameGrid.base.geometry.parameters.width || 21;
                baseHalfSize = (baseWidth * window.gameGrid.base.scale.x) / 2;
            }
        }

        const BASE_MIN_X = baseWorldX - baseHalfSize;
        const BASE_MAX_X = baseWorldX + baseHalfSize;
        const BASE_MIN_Z = baseWorldZ - baseHalfSize;
        const BASE_MAX_Z = baseWorldZ + baseHalfSize;
        
        for (let i = 0; i < maxParticles; i++) {
            if (!particles[i] || !particles[i].active) continue;
            
            const particle = particles[i];
            
            if (particle.isGrounded) {
                particle.groundedAge += deltaTime;
                if (particle.groundedAge >= 2.0) {
                    // Dead: push off-screen and deactivate
                    particle.active = false;
                    positions[i * 3 + 1] = -9999;
                    colors[i * 3] = 0; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 0;
                    geometry.attributes.color.needsUpdate = true;
                } else {
                    // Fade color to black (invisible with AdditiveBlending)
                    const fade = 1.0 - (particle.groundedAge / 2.0);
                    colors[i * 3]     = (particle.colorR || 0) * fade;
                    colors[i * 3 + 1] = (particle.colorG || 0) * fade;
                    colors[i * 3 + 2] = (particle.colorB || 0) * fade;
                }
                positions[i * 3 + 1] = baseWorldY + 0.01;
                continue;
            }

            particle.age += deltaTime;
            
            particle.velocity.x *= particle.drag;
            particle.velocity.z *= particle.drag;
            particle.velocity.y += GRAVITY * deltaTime;
            
            const nextX = positions[i * 3] + particle.velocity.x * deltaTime;
            const nextY = positions[i * 3 + 1] + particle.velocity.y * deltaTime;
            const nextZ = positions[i * 3 + 2] + particle.velocity.z * deltaTime;

            const isOnBasePlate = nextX >= BASE_MIN_X && nextX <= BASE_MAX_X && 
                                 nextZ >= BASE_MIN_Z && nextZ <= BASE_MAX_Z;
            
            // Kill immediately: off-board or void
            if (nextY < KILL_Y || !isOnBasePlate) {
                particle.active = false;
                positions[i * 3 + 1] = -9999; // Push off-screen
                colors[i * 3] = 0; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 0;
                continue;
            }

            if (nextY <= baseWorldY + 0.05 && isOnBasePlate) {
                // Land on the base plate
                particle.isGrounded = true;
                if (particle.velocity) particle.velocity.set(0, 0, 0);
                positions[i * 3] = nextX;
                positions[i * 3 + 1] = baseWorldY + 0.01;
                positions[i * 3 + 2] = nextZ;
                continue;
            }

            // Still airborne
            positions[i * 3] = nextX;
            positions[i * 3 + 1] = nextY;
            positions[i * 3 + 2] = nextZ;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
    }
    
    /**
     * Clean up all particles
     */
    function cleanupParticles() {
        for (let i = 0; i < maxParticles; i++) {
            if (particles[i]) {
                particles[i].active = false;
                sizes[i] = 0;
            }
        }
        geometry.attributes.size.needsUpdate = true;
    }
    
    /**
     * Dispose of the particle system
     */
    function dispose() {
        scene.remove(points);
        geometry.dispose();
        material.dispose();
    }
    
    return {
        addExplosion,
        updateParticles,
        cleanupParticles,
        dispose,
        points,
        getActiveCount: () => particles.filter(p => p && p.active).length
    };
}
