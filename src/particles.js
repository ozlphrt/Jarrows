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
    const GRAVITY = -9.8; // Gravity constant
    const PARTICLE_LIFETIME = 2.0; // 2 seconds
    
    /**
     * Add an explosion effect
     * @param {THREE.Vector3} position - Center position of explosion
     * @param {THREE.Color} color - Base color for particles
     * @param {number} count - Number of particles to spawn
     * @param {number} velocity - Base velocity magnitude
     */
    function addExplosion(position, color, count = 30, velocity = 3.0) {
        // Task 11.1: Reuse oldest slots indefinitely
        for (let i = 0; i < count; i++) {
            const index = nextParticleIndex;
            nextParticleIndex = (nextParticleIndex + 1) % maxParticles;
            
            // If slot is empty, initialize it
            if (!particles[index]) {
                particles[index] = {
                    index: index
                };
            }
            
            const particle = particles[index];
            particle.active = true;
            particle.isGrounded = false;
            particle.groundedAge = 0;
            particle.lifetime = PARTICLE_LIFETIME;
            particle.age = 0;
            particle.startSize = 0.08 + Math.random() * 0.15; // Track start size for linear shrink
            
            // Set position
            positions[index * 3] = position.x;
            positions[index * 3 + 1] = position.y;
            positions[index * 3 + 2] = position.z;
            
            // Random velocity direction (outward cone)
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI * 0.5; // -45 to +45 degrees
            const speed = velocity * (0.5 + Math.random() * 0.5); // 0.5x to 1.0x base velocity
            
            particle.velocity = new THREE.Vector3(
                Math.cos(angle) * Math.cos(elevation) * speed,
                Math.sin(elevation) * speed + Math.abs(elevation) * 0.5, // Slight upward bias
                Math.sin(angle) * Math.cos(elevation) * speed
            );
            
            // Color variation (slightly lighter/darker)
            const colorVariation = 0.7 + Math.random() * 0.3;
            colors[index * 3] = color.r * colorVariation;
            colors[index * 3 + 1] = color.g * colorVariation;
            colors[index * 3 + 2] = color.b * colorVariation;
            
            // Size variation - slightly bigger particles for better visibility
            sizes[index] = particle.startSize;
        }
        
        // Update geometry attributes
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
    }
    
    /**
     * Update all particles
     * @param {number} deltaTime - Time delta in seconds
     */
    function updateParticles(deltaTime) {
        const KILL_Y = -10.0; // Deep cleanup for particles falling into void
        const BASE_HALF_SIZE = 10.5; // Half of 21x21 plate
        
        // Get dynamic base plate world position
        let baseWorldY = 0;
        let baseWorldX = 0;
        let baseWorldZ = 0;
        if (window.gameGrid && window.gameGrid.base) {
            const basePos = new THREE.Vector3();
            window.gameGrid.base.getWorldPosition(basePos);
            // The BoxGeometry is 0.2 units thick. If its center is at basePos.y, the top surface is basePos.y + 0.1.
            baseWorldY = basePos.y + 0.1; 
            baseWorldX = basePos.x;
            baseWorldZ = basePos.z;
        }

        const BASE_MIN_X = baseWorldX - BASE_HALF_SIZE;
        const BASE_MAX_X = baseWorldX + BASE_HALF_SIZE;
        const BASE_MIN_Z = baseWorldZ - BASE_HALF_SIZE;
        const BASE_MAX_Z = baseWorldZ + BASE_HALF_SIZE;
        
        for (let i = 0; i < maxParticles; i++) {
            if (!particles[i] || !particles[i].active) continue;
            
            const particle = particles[i];
            
            if (particle.isGrounded) {
                // Grounded particle settling logic
                particle.groundedAge += deltaTime;
                if (particle.groundedAge >= 3.0) {
                    particle.active = false;
                    sizes[i] = 0;
                } else {
                    // Start fading out in the last 0.5s of the 3s lifetime
                    const timeRemaining = 3.0 - particle.groundedAge;
                    if (timeRemaining < 0.5) {
                        sizes[i] = particle.startSize * (timeRemaining / 0.5);
                    } else {
                        sizes[i] = particle.startSize; // Restore size when grounded
                    }
                }
                
                // Stick to the ground even if the tower wobbles
                positions[i * 3 + 1] = baseWorldY + 0.01;
                continue;
            }

            particle.age += deltaTime;
            
            // Apply gravity
            particle.velocity.y += GRAVITY * deltaTime;
            
            // Calculate next position
            const nextX = positions[i * 3] + particle.velocity.x * deltaTime;
            const nextY = positions[i * 3 + 1] + particle.velocity.y * deltaTime;
            const nextZ = positions[i * 3 + 2] + particle.velocity.z * deltaTime;

            // Ground collision check
            // Hit ground/base plate with epsilon threshold (+0.05)
            const isOnBasePlate = nextX >= BASE_MIN_X && nextX <= BASE_MAX_X && 
                                 nextZ >= BASE_MIN_Z && nextZ <= BASE_MAX_Z;
            
            if (nextY <= baseWorldY + 0.05 && isOnBasePlate) {
                // Particle "landed" on the plate - stay put for 3 seconds
                particle.isGrounded = true;
                if (particle.velocity) particle.velocity.set(0, 0, 0); // Stop moving
                
                // Snap to ground level
                positions[i * 3] = nextX;
                positions[i * 3 + 1] = baseWorldY + 0.01; // Slightly above ground to avoid z-fighting
                positions[i * 3 + 2] = nextZ;
                continue; // Skip the rest of the update
            }

            // Update position
            positions[i * 3] = nextX;
            positions[i * 3 + 1] = nextY;
            positions[i * 3 + 2] = nextZ;
            
            // Update lifetime and fade
            const lifetimeProgress = particle.age / particle.lifetime;
            if (lifetimeProgress >= 1.0 || positions[i * 3 + 1] < KILL_Y) {
                // Particle dissipated in air or fell deep into void
                particle.active = false;
                sizes[i] = 0;
            } else {
                // Fade out slightly over lifetime in air, but keep visible enough to see them land
                const fade = Math.max(0.3, 1.0 - lifetimeProgress);
                sizes[i] = particle.startSize * fade; 
            }
        }
        
        // Update geometry
        geometry.attributes.position.needsUpdate = true;
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
