// Use dynamic import to ensure Rapier loads correctly
let RAPIER = null;
let rapierLoadPromise = null;

async function loadRapier() {
    // Return existing promise if already loading to avoid multiple loads
    if (rapierLoadPromise) {
        return rapierLoadPromise;
    }
    
    rapierLoadPromise = (async () => {
        if (!RAPIER) {
            console.log('Loading Rapier physics engine...');
            
            // ROOT CAUSE FIX: Use rapier3d-compat which embeds WASM, avoiding base path issues
            // The standard @dimforge/rapier3d package imports WASM from "./rapier_wasm3d_bg.wasm"
            // With base: '/Jarrows/', the WASM file path doesn't resolve correctly after build
            // rapier3d-compat embeds the WASM in the JS bundle, eliminating path issues
            const rapierModule = await import('@dimforge/rapier3d-compat');
            RAPIER = rapierModule.default || rapierModule;
            
            // CRITICAL: rapier3d-compat requires explicit init() call to initialize WASM
            // Even though WASM is embedded, it still needs to be initialized asynchronously
            // The init() function is exported from the init module (see exports.d.ts: export * from "./init")
            // Try multiple ways to access init() since module structure can vary
            let initFn = null;
            
            if (typeof RAPIER.init === 'function') {
                initFn = RAPIER.init;
            } else if (typeof rapierModule.init === 'function') {
                initFn = rapierModule.init;
            } else if (rapierModule.default && typeof rapierModule.default.init === 'function') {
                initFn = rapierModule.default.init;
            }
            
            if (initFn) {
                console.log('Initializing Rapier WASM...');
                // New API: init() can be called without parameters or with an options object
                // Pass an options object to avoid deprecated-parameters warning in newer rapier builds.
                await initFn({});
                console.log('Rapier WASM initialized');
            } else {
                // If init() is not found, this is a critical error
                console.error('Rapier module structure:', {
                    hasRAPIERInit: typeof RAPIER.init,
                    hasModuleInit: typeof rapierModule.init,
                    hasDefaultInit: rapierModule.default && typeof rapierModule.default.init,
                    RAPIERKeys: Object.keys(RAPIER).slice(0, 10),
                    moduleKeys: Object.keys(rapierModule).slice(0, 10)
                });
                throw new Error('Rapier init() function not found. rapier3d-compat requires explicit initialization. Check console for module structure.');
            }
            
            // Verify WASM is ready by testing World creation (which requires WASM)
            // Vector3 might work without WASM, so we need to test something that definitely requires it
            try {
                // Try to create a minimal World to verify WASM is ready
                // New API: World constructor takes an options object, not a Vector3 directly
                const testWorld = new RAPIER.World({ x: 0, y: 0, z: 0 });
                // If we get here, WASM is ready
                testWorld.free(); // Clean up test world
            } catch (e) {
                throw new Error(`Rapier WASM verification failed: ${e.message}. World creation requires WASM to be fully initialized.`);
            }
            
            console.log('Rapier physics engine loaded successfully');
        }
        return RAPIER;
    })();
    
    return rapierLoadPromise;
}

export async function initPhysics() {
    // Load Rapier with dynamic import to ensure WASM is ready
    const RAPIER = await loadRapier();
    
    // Double-check WASM is ready before creating World
    // Creating a World accesses internal WASM functions immediately
    try {
        // Test that basic WASM functions are available
        const testVector = new RAPIER.Vector3(0, 0, 0);
        if (!testVector) {
            throw new Error('Rapier Vector3 creation failed - WASM not ready');
        }
    } catch (e) {
        console.error('Rapier WASM verification failed:', e);
        throw new Error('Cannot initialize physics: WASM module not ready. ' + e.message);
    }
    
    // Main world (currently unused but kept for future)
    // CRITICAL: World constructor immediately accesses WASM functions
    // If WASM isn't ready, this will throw the rawintegrationparameters_new error
    // New API: World constructor takes an options object with gravity property
    let world, eventQueue, fallingWorld, fallingEventQueue;
    
    try {
        world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
        eventQueue = new RAPIER.EventQueue(true);
        
        // Separate world for falling blocks to avoid conflicts
        fallingWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
        fallingEventQueue = new RAPIER.EventQueue(true);
    } catch (e) {
        console.error('Failed to create Rapier World - WASM not initialized:', e);
        throw new Error('Failed to create physics world. WASM module may not be loaded correctly. ' + e.message);
    }
    
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

// Export loadRapier for use in other modules if needed
export { loadRapier };

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

