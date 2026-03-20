import * as THREE from 'three';

class BlockInstanceManager {
    constructor(scene) {
        this.scene = scene;
        this.instances = new Map(); // Key: geometryKey_materialKey, Value: { mesh, count, capacity, blocks }
        this.isActive = true;
    }

    /**
     * Get or create an InstancedMesh for a specific geometry and material
     */
    getInstancedMesh(geometry, material, initialCapacity = 500) {
        const key = `${geometry.uuid}_${material.uuid}`;
        
        if (this.instances.has(key)) {
            return this.instances.get(key);
        }

        const instancedMesh = new THREE.InstancedMesh(geometry, material, initialCapacity);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;
        
        this.scene.add(instancedMesh);

        const instanceData = {
            mesh: instancedMesh,
            count: 0,
            capacity: initialCapacity,
            blocks: []
        };
        
        this.instances.set(key, instanceData);
        return instanceData;
    }

    /**
     * Register a block to be rendered via instancing
     */
    registerBlock(block, geometry, material) {
        const instanceData = this.getInstancedMesh(geometry, material);
        
        // Check if we need to resize (expensive, but rare)
        if (instanceData.count >= instanceData.capacity) {
            this.resizeInstancedMesh(instanceData);
        }

        const index = instanceData.count++;
        instanceData.blocks.push(block);
        block._instanceIndex = index;
        block._instanceData = instanceData;

        // Initial matrix set
        block.updateMatrix();
        instanceData.mesh.setMatrixAt(index, block.matrix);
        instanceData.mesh.instanceMatrix.needsUpdate = true;
    }

    /**
     * Deregister a block (on removal)
     */
    deregister(block) {
        if (!block._instanceData) return;

        const instanceData = block._instanceData;
        const index = block._instanceIndex;

        // Swap with the last element for O(1) removal
        const lastIndex = instanceData.count - 1;
        if (index !== lastIndex) {
            const lastBlock = instanceData.blocks[lastIndex];
            
            // Move last block to current index
            instanceData.blocks[index] = lastBlock;
            lastBlock._instanceIndex = index;
            
            // Copy matrix
            lastBlock.updateMatrix();
            instanceData.mesh.setMatrixAt(index, lastBlock.matrix);
        }

        // Pop last element
        instanceData.blocks.pop();
        instanceData.count--;
        
        // Hide the moved/removed instance by setting a zero matrix at the end
        // (Actually, InstancedMesh.count handles this if we update it)
        instanceData.mesh.count = instanceData.count;
        instanceData.mesh.instanceMatrix.needsUpdate = true;
        
        block._instanceData = null;
        block._instanceIndex = -1;
    }

    /**
     * Resize an InstancedMesh when it reaches capacity
     */
    resizeInstancedMesh(instanceData) {
        const oldMesh = instanceData.mesh;
        const newCapacity = instanceData.capacity * 2;
        
        const newMesh = new THREE.InstancedMesh(oldMesh.geometry, oldMesh.material, newCapacity);
        newMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        newMesh.castShadow = oldMesh.castShadow;
        newMesh.receiveShadow = oldMesh.receiveShadow;
        
        // Copy existing matrices
        for (let i = 0; i < instanceData.count; i++) {
            const matrix = new THREE.Matrix4();
            oldMesh.getMatrixAt(i, matrix);
            newMesh.setMatrixAt(i, matrix);
        }
        
        this.scene.remove(oldMesh);
        oldMesh.dispose();
        
        this.scene.add(newMesh);
        instanceData.mesh = newMesh;
        instanceData.capacity = newCapacity;
    }

    /**
     * Update all instance matrices based on current block states
     */
    update() {
        if (!this.isActive) return;

        for (const instanceData of this.instances.values()) {
            let needsUpdate = false;
            
            for (let i = 0; i < instanceData.count; i++) {
                const block = instanceData.blocks[i];
                if (block.isDirty) { // Only update if block moved/rotated
                    block.updateMatrix();
                    instanceData.mesh.setMatrixAt(i, block.matrix);
                    block.isDirty = false;
                    needsUpdate = true;
                }
            }
            
            if (needsUpdate) {
                instanceData.mesh.instanceMatrix.needsUpdate = true;
            }
        }
    }

    /**
     * Clear all instances (e.g. on level reload)
     */
    clear() {
        for (const instanceData of this.instances.values()) {
            this.scene.remove(instanceData.mesh);
            instanceData.mesh.dispose();
        }
        this.instances.clear();
    }
}

export { BlockInstanceManager };
