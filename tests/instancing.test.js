import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BlockInstanceManager } from '../src/BlockInstanceManager.js';

describe('BlockInstanceManager', () => {
    it('should create and cache InstancedMesh for geometry/material pair', () => {
        const scene = new THREE.Scene();
        const manager = new BlockInstanceManager(scene);

        const geom = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const data1 = manager.getInstancedMesh(geom, mat, 100);
        expect(data1.mesh).toBeDefined();
        expect(scene.children).toContain(data1.mesh);

        const data2 = manager.getInstancedMesh(geom, mat, 100);
        expect(data2).toBe(data1); // Reuses existing instance
    });

    it('should register and deregister blocks cleanly', () => {
        const scene = new THREE.Scene();
        const manager = new BlockInstanceManager(scene);

        const geom = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshBasicMaterial();

        const mockBlock = {
            matrix: new THREE.Matrix4(),
            updateMatrix: () => {},
            isDirty: false
        };

        manager.registerBlock(mockBlock, geom, mat);
        expect(mockBlock._instanceIndex).toBe(0);
        expect(mockBlock._instanceData.count).toBe(1);

        manager.deregister(mockBlock);
        expect(mockBlock._instanceIndex).toBe(-1);
        expect(mockBlock._instanceData).toBeNull();
    });

    it('should clear all instances and dispose resources', () => {
        const scene = new THREE.Scene();
        const manager = new BlockInstanceManager(scene);

        const geom = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshBasicMaterial();

        manager.getInstancedMesh(geom, mat, 50);
        expect(scene.children.length).toBe(1);

        manager.clear();
        expect(scene.children.length).toBe(0);
        expect(manager.instances.size).toBe(0);
    });
});
