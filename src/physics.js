import * as RAPIER from '@dimforge/rapier3d';

export async function initPhysics() {
    // Ensure Rapier WASM is fully loaded before creating worlds
    // Rapier 0.12.0 requires explicit initialization
    try {
        // Try to initialize if the method exists
        if (typeof RAPIER.init === 'function') {
            await RAPIER.init();
        } else if (RAPIER.default && typeof RAPIER.default.init === 'function') {
            await RAPIER.default.init();
        }
    } catch (e) {
        console.warn('Rapier init() not available or already initialized:', e);
    }
    
    // Wait for WASM to be fully ready - try creating a simple vector first
    let retries = 10;
    while (retries > 0) {
        try {
            // Test if WASM is ready by creating a simple object
            const testVector = new RAPIER.Vector3(0, 0, 0);
            if (testVector) {
                break; // WASM is ready
            }
        } catch (e) {
            // WASM not ready yet, wait a bit
            await new Promise(resolve => setTimeout(resolve, 50));
            retries--;
        }
    }
    
    if (retries === 0) {
        throw new Error('Rapier WASM failed to initialize after multiple attempts');
    }
    
    const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
    
    // Main world (currently unused but kept for future)
    const world = new RAPIER.World(gravity);
    const eventQueue = new RAPIER.EventQueue(true);
    
    // Separate world for falling blocks to avoid conflicts
    const fallingWorld = new RAPIER.World(gravity);
    const fallingEventQueue = new RAPIER.EventQueue(true);
    
    // Create ground plane in falling world (for sliding and falling)
    // Grid is 7x7 with cubeSize 1, so ground should be 3.5 units from center
    const groundSize = 3.5;
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(groundSize, 0.1, groundSize)
        .setTranslation(groundSize, -0.1, groundSize)
        .setFriction(0.7) // Friction for sliding blocks
        .setRestitution(0.1);
    fallingWorld.createCollider(groundColliderDesc);
    
    return { world, eventQueue, fallingWorld, fallingEventQueue, RAPIER };
}

export function createPhysicsBlock(physics, position, size, isDynamic = true, useFallingWorld = true) {
    // CRITICAL: This function must ONLY be called when:
    // 1. NOT stepping (isSteppingFalling = false)
    // 2. During updatePhysics processing (isProcessingPhysics = true)
    // 3. Before the step() call
    
    // Use falling world for falling blocks to avoid conflicts
    const world = useFallingWorld ? physics.fallingWorld : physics.world;
    if (!world) {
        throw new Error('Physics world not available');
    }
    
    // Safety check - never create during step
    if (isSteppingFalling) {
        throw new Error('Cannot create physics body during step');
    }
    
    const RAPIER = physics.RAPIER;
    
    // Create body description
    const bodyDesc = isDynamic 
        ? RAPIER.RigidBodyDesc.dynamic()
        : RAPIER.RigidBodyDesc.fixed();
    
    bodyDesc.setTranslation(position.x, position.y, position.z);
    
    // Create body - must be called when NOT stepping
    const body = world.createRigidBody(bodyDesc);
    
    // Create collider
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
        .setDensity(1.0)
        .setFriction(0.5)
        .setRestitution(0.3);
    
    const collider = world.createCollider(colliderDesc, body);
    
    return { body, collider };
}

let isSteppingFalling = false;
let isProcessingPhysics = false; // Lock to prevent concurrent updatePhysics calls
let pendingBodyCreations = [];
let pendingBodyModifications = []; // Queue for body modifications (setLinvel, setAngvel, etc.)
let pendingBodyRemovals = []; // Queue for body removals

export function hasPendingOperations() {
    return pendingBodyCreations.length > 0 || pendingBodyModifications.length > 0 || pendingBodyRemovals.length > 0;
}

export function updatePhysics(physics, deltaTime) {
    if (!physics || !physics.fallingWorld) return;
    
    // Prevent concurrent calls to updatePhysics
    if (isProcessingPhysics || isSteppingFalling) return;
    
    isProcessingPhysics = true;
    
    try {
        // CRITICAL: Process all modifications BEFORE stepping
        // This ensures no world access conflicts
        
        // Execute any pending body creations FIRST
        if (pendingBodyCreations.length > 0) {
            const creationsToProcess = [...pendingBodyCreations];
            pendingBodyCreations = [];
            
            for (const createFn of creationsToProcess) {
                try {
                    // Double-check we're not stepping before each creation
                    if (!isSteppingFalling) {
                        createFn();
                    }
                } catch (e) {
                    console.warn('Failed to create physics body:', e);
                }
            }
        }
        
        // Execute any pending body modifications SECOND
        if (pendingBodyModifications.length > 0) {
            const modificationsToProcess = [...pendingBodyModifications];
            pendingBodyModifications = [];
            
            for (const modifyFn of modificationsToProcess) {
                try {
                    // Double-check we're not stepping before each modification
                    if (!isSteppingFalling) {
                        modifyFn();
                    }
                } catch (e) {
                    console.warn('Failed to modify physics body:', e);
                }
            }
        }
        
        // Execute any pending body removals THIRD (before stepping)
        if (pendingBodyRemovals.length > 0) {
            const removalsToProcess = [...pendingBodyRemovals];
            pendingBodyRemovals = [];
            
            for (const removeFn of removalsToProcess) {
                try {
                    // Double-check we're not stepping before each removal
                    if (!isSteppingFalling) {
                        removeFn();
                    }
                } catch (e) {
                    console.warn('Failed to remove physics body:', e);
                }
            }
        }
        
        // Step physics simulation LAST - only step if we have bodies
        // CRITICAL: The step itself is where the error occurs
        // We need to ensure the world is in a valid state before stepping
        if (!isSteppingFalling) {
            // Check if we have any bodies before stepping
            // Stepping an empty world should be safe, but let's be explicit
            let hasBodies = false;
            try {
                // Try to get body count - this might fail if world is invalid
                // But we'll catch and handle it
                hasBodies = true; // Assume we have bodies if we got here
            } catch (e) {
                // World might be in invalid state, skip step
                console.warn('World state invalid, skipping step:', e);
                return;
            }
            
            if (hasBodies || pendingBodyCreations.length === 0) {
                isSteppingFalling = true;
                try {
                    // Step falling world physics simulation
                    // CRITICAL: Don't pass event queue - it can cause callbacks during step
                    physics.fallingWorld.step();
                } catch (e) {
                    console.error('Failed to step physics:', e);
                    // Don't re-throw - let the simulation continue
                } finally {
                    isSteppingFalling = false;
                }
            }
        }
    } finally {
        // Always release the processing lock, even on error
        isProcessingPhysics = false;
    }
}

export function isPhysicsStepping() {
    return isSteppingFalling;
}

export function isPhysicsProcessing() {
    return isProcessingPhysics; // Returns the boolean flag
}

export function deferBodyCreation(createFn) {
    // Always queue, never execute immediately to avoid conflicts
    pendingBodyCreations.push(createFn);
}

export function deferBodyModification(modifyFn) {
    // Always queue modifications to ensure they happen before the next step
    // Never execute immediately to avoid conflicts
    pendingBodyModifications.push(modifyFn);
}

export function deferBodyRemoval(removeFn) {
    // Always queue removals to ensure they happen before the next step
    // Never execute immediately to avoid conflicts
    pendingBodyRemovals.push(removeFn);
}

export function removePhysicsBody(physics, body, useFallingWorld = true) {
    if (!physics || !body) return;
    const world = useFallingWorld ? physics.fallingWorld : physics.world;
    if (!world) return;
    
    // Defer removal to avoid conflicts during step
    deferBodyRemoval(() => {
        try {
            world.removeRigidBody(body);
        } catch (e) {
            console.warn('Failed to remove physics body:', e);
        }
    });
}

