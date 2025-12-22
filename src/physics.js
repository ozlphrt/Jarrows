import * as RAPIER from '@dimforge/rapier3d';

export async function initPhysics() {
    // Rapier 0.12.0 doesn't require explicit init() - WASM initializes automatically
    // Just create the physics world directly
    
    const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
    const world = new RAPIER.World(gravity);
    const eventQueue = new RAPIER.EventQueue(true);
    
    // Create ground plane (static)
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(3.5, 0.1, 3.5)
        .setTranslation(3.5, -0.1, 3.5);
    world.createCollider(groundColliderDesc);
    
    return { world, eventQueue, RAPIER };
}

export function createPhysicsBlock(physics, position, size, isDynamic = true) {
    const { world, RAPIER: rapier } = physics;
    
    const bodyDesc = isDynamic 
        ? rapier.RigidBodyDesc.dynamic()
        : rapier.RigidBodyDesc.fixed();
    
    bodyDesc.setTranslation(position.x, position.y, position.z);
    
    const body = world.createRigidBody(bodyDesc);
    
    const colliderDesc = rapier.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
        .setDensity(1.0)
        .setFriction(0.7)
        .setRestitution(0.1);
    
    const collider = world.createCollider(colliderDesc, body);
    
    return { body, collider };
}

export function updatePhysics(physics, deltaTime) {
    if (!physics || !physics.world) return;
    
    // Step physics simulation
    physics.world.step(physics.eventQueue);
}

export function removePhysicsBody(physics, body) {
    if (!physics || !physics.world || !body) return;
    physics.world.removeRigidBody(body);
}

