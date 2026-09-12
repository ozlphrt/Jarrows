import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
    createSolvableBlocks,
    createHeadOnCollisionBlocks,
    directions,
    setGeneratorContext
} from '../src/puzzle/LevelGenerator.js';

describe('LevelGenerator live generation', () => {
    it('should generate solvable blocks without ReferenceError across diverse levels', () => {
        const scene = new THREE.Scene();
        setGeneratorContext({
            gridSize: 7,
            cubeSize: 1,
            scene: scene,
            physics: null,
            currentArrowStyle: 2,
            blocks: []
        });

        const testLevels = [0, 1, 4, 11, 25];
        for (const lvl of testLevels) {
            expect(() => {
                const count = lvl === 0 ? 3 : Math.min(30, lvl * 10);
                const blocks = createSolvableBlocks(0, null, count, lvl, false, null, 0);
                expect(Array.isArray(blocks)).toBe(true);
                expect(blocks.length).toBeGreaterThan(0);
            }).not.toThrow();
        }
    });

    it('should create head on collision blocks without error', () => {
        const scene = new THREE.Scene();
        setGeneratorContext({
            gridSize: 7,
            cubeSize: 1,
            scene: scene,
            physics: null,
            currentArrowStyle: 2,
            blocks: []
        });

        expect(() => {
            const headOn = createHeadOnCollisionBlocks(10, 1);
            expect(Array.isArray(headOn)).toBe(true);
            expect(headOn.length).toBeGreaterThan(0);
        }).not.toThrow();
    });

    it('should export directions array with 4 cardinal vectors', () => {
        expect(directions).toBeDefined();
        expect(directions).toHaveLength(4);
        expect(directions[0]).toEqual({ x: 1, z: 0 });
    });
});
