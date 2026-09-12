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

    it('should place upper layer blocks only with direct support from the layer below', () => {
        const scene = new THREE.Scene();
        setGeneratorContext({
            gridSize: 7,
            cubeSize: 1,
            scene: scene,
            physics: null,
            currentArrowStyle: 2,
            blocks: []
        });

        // Generate Layer 0
        const layer0 = createSolvableBlocks(0, null, 30, 11, true, null, 0);
        expect(layer0.length).toBeGreaterThan(0);

        // Build lowerLayerCells with yRanges
        const layer0Cells = new Set();
        const layer0YRanges = new Map();
        for (const b of layer0) {
            const yTop = b.yOffset + (b.isVertical ? b.length : 1);
            if (b.isVertical) {
                const key = `${b.gridX},${b.gridZ}`;
                layer0Cells.add(key);
                if (!layer0YRanges.has(key)) layer0YRanges.set(key, []);
                layer0YRanges.get(key).push({ yBottom: b.yOffset, yTop });
            } else {
                const isX = Math.abs(b.direction.x) > 0;
                for (let i = 0; i < b.length; i++) {
                    const key = `${b.gridX + (isX ? i : 0)},${b.gridZ + (isX ? 0 : i)}`;
                    layer0Cells.add(key);
                    if (!layer0YRanges.has(key)) layer0YRanges.set(key, []);
                    layer0YRanges.get(key).push({ yBottom: b.yOffset, yTop });
                }
            }
        }

        // Generate Layer 1
        const lowerData = { cells: layer0Cells, yRanges: layer0YRanges };
        const layer1 = createSolvableBlocks(1, lowerData, 20, 11, false, null, 0.25);
        expect(layer1.length).toBeGreaterThan(0);

        // Every block in layer 1 must have at least one cell resting directly on a layer 0 block (yTop == 1)
        for (const b of layer1) {
            let hasDirectUnder = false;
            if (b.isVertical) {
                const key = `${b.gridX},${b.gridZ}`;
                const ranges = layer0YRanges.get(key);
                if (ranges && ranges.some(r => Math.abs(r.yTop - 1) < 0.05)) hasDirectUnder = true;
            } else {
                const isX = Math.abs(b.direction.x) > 0;
                for (let i = 0; i < b.length; i++) {
                    const key = `${b.gridX + (isX ? i : 0)},${b.gridZ + (isX ? 0 : i)}`;
                    const ranges = layer0YRanges.get(key);
                    if (ranges && ranges.some(r => Math.abs(r.yTop - 1) < 0.05)) {
                        hasDirectUnder = true;
                        break;
                    }
                }
            }
            expect(hasDirectUnder).toBe(true);
        }
    });
});
