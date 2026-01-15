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
        const spawnCount = Math.min(count, maxParticles - particles.length);
        
        for (let i = 0; i < spawnCount; i++) {
            const index = nextParticleIndex;
            nextParticleIndex = (nextParticleIndex + 1) % maxParticles;
            
            // If slot is already occupied, reuse it
            if (particles[index]) {
                // Reuse existing particle
            } else {
                particles[index] = {
                    active: true,
                    index: index
                };
            }
            
            const particle = particles[index];
            particle.active = true;
            particle.lifetime = PARTICLE_LIFETIME;
            particle.age = 0;
            
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
            
            // Size variation
            sizes[index] = 0.05 + Math.random() * 0.1;
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
        const BASE_PLATE_Y = -0.1; // Base plate is at y = -0.1
        const EXTENDED_BASE_SIZE = 10.5; // Half of 21 units (extended base plate)
        const TOWER_GROUP_X = 3.5; // towerGroup X position in world space
        const TOWER_GROUP_Z = 3.5; // towerGroup Z position in world space
        const BASE_MIN_X = TOWER_GROUP_X - EXTENDED_BASE_SIZE; // -7
        const BASE_MAX_X = TOWER_GROUP_X + EXTENDED_BASE_SIZE; // +14
        const BASE_MIN_Z = TOWER_GROUP_Z - EXTENDED_BASE_SIZE; // -7
        const BASE_MAX_Z = TOWER_GROUP_Z + EXTENDED_BASE_SIZE; // +14
        
        for (let i = 0; i < maxParticles; i++) {
            if (!particles[i] || !particles[i].active) continue;
            
            const particle = particles[i];
            particle.age += deltaTime;
            
            // Calculate new position
            const newX = positions[i * 3] + particle.velocity.x * deltaTime;
            const newY = positions[i * 3 + 1] + particle.velocity.y * deltaTime;
            const newZ = positions[i * 3 + 2] + particle.velocity.z * deltaTime;
            
            // Stop particles at base plate level (don't let them fall below)
            if (newY < BASE_PLATE_Y) {
                // Particle hit base plate - stop vertical movement
                positions[i * 3 + 1] = BASE_PLATE_Y;
                particle.velocity.y = 0;
                
                // Apply horizontal friction when on ground
                particle.velocity.x *= 0.95;
                particle.velocity.z *= 0.95;
            } else {
                // Particle is above base plate - normal physics
                positions[i * 3 + 1] = newY;
                
                // Apply gravity
                particle.velocity.y += GRAVITY * deltaTime;
            }
            
            // Keep particles within extended base plate bounds (bounce off walls)
            if (newX < BASE_MIN_X) {
                positions[i * 3] = BASE_MIN_X;
                particle.velocity.x *= -0.5; // Bounce with energy loss
            } else if (newX > BASE_MAX_X) {
                positions[i * 3] = BASE_MAX_X;
                particle.velocity.x *= -0.5; // Bounce with energy loss
            } else {
                positions[i * 3] = newX;
            }
            
            if (newZ < BASE_MIN_Z) {
                positions[i * 3 + 2] = BASE_MIN_Z;
                particle.velocity.z *= -0.5; // Bounce with energy loss
            } else if (newZ > BASE_MAX_Z) {
                positions[i * 3 + 2] = BASE_MAX_Z;
                particle.velocity.z *= -0.5; // Bounce with energy loss
            } else {
                positions[i * 3 + 2] = newZ;
            }
            
            // Update lifetime and fade
            const lifetimeProgress = particle.age / particle.lifetime;
            if (lifetimeProgress >= 1.0) {
                // Particle expired
                particle.active = false;
                sizes[i] = 0;
            } else {
                // Fade out over lifetime
                const fade = 1.0 - lifetimeProgress;
                sizes[i] *= fade; // Shrink over time
                
                // Update color alpha (via material opacity per particle would require custom shader)
                // For now, we'll use size as a proxy for visibility
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
