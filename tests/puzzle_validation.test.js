import { describe, it, expect } from 'vitest';
import {
    getBlockCells,
    snapLayerY,
    canBlockExit,
    validateStructure,
    validateSolvability,
    calculateDifficulty,
    fixOverlappingBlocks
} from '../src/puzzle_validation.js';

describe('puzzle_validation module', () => {
    describe('snapLayerY', () => {
        it('should snap near-integer values to exact integers', () => {
            expect(snapLayerY(1.002)).toBe(1);
            expect(snapLayerY(0.98)).toBe(1);
            expect(snapLayerY(2.1)).toBe(2);
        });

        it('should leave values far from integers unchanged', () => {
            expect(snapLayerY(1.5)).toBe(1.5);
            expect(snapLayerY(2.4)).toBe(2.4);
        });
    });

    describe('getBlockCells', () => {
        it('should return 1 cell for vertical blocks', () => {
            const block = {
                gridX: 2,
                gridZ: 3,
                isVertical: true,
                length: 3,
                direction: { x: 0, z: 1 }
            };
            const cells = getBlockCells(block);
            expect(cells).toEqual([{ x: 2, z: 3 }]);
        });

        it('should return consecutive X cells for X-aligned horizontal blocks', () => {
            const block = {
                gridX: 1,
                gridZ: 2,
                isVertical: false,
                length: 3,
                direction: { x: 1, z: 0 }
            };
            const cells = getBlockCells(block);
            expect(cells).toEqual([
                { x: 1, z: 2 },
                { x: 2, z: 2 },
                { x: 3, z: 2 }
            ]);
        });

        it('should return consecutive Z cells for Z-aligned horizontal blocks', () => {
            const block = {
                gridX: 4,
                gridZ: 1,
                isVertical: false,
                length: 2,
                direction: { x: 0, z: -1 }
            };
            const cells = getBlockCells(block);
            expect(cells).toEqual([
                { x: 4, z: 1 },
                { x: 4, z: 2 }
            ]);
        });
    });

    describe('canBlockExit', () => {
        it('should return canExit: true when exit path has no obstacles', () => {
            const block = {
                gridX: 3,
                gridZ: 3,
                length: 1,
                isVertical: true,
                direction: { x: 1, z: 0 }
            };
            const occupiedCells = new Set(); // empty board
            const result = canBlockExit(block, occupiedCells, 5);
            expect(result.canExit).toBe(true);
            expect(result.stepsToExit).toBe(2); // gridX=3 -> 4 -> 5 (out)
        });

        it('should return canExit: false when path is blocked by another block', () => {
            const block = {
                gridX: 1,
                gridZ: 2,
                length: 1,
                isVertical: true,
                direction: { x: 1, z: 0 }
            };
            // Obstacle at (2, 2)
            const occupiedCells = new Set(['2,2']);
            const result = canBlockExit(block, occupiedCells, 5);
            expect(result.canExit).toBe(false);
        });
    });

    describe('validateStructure & validateSolvability', () => {
        it('should validate non-overlapping structure as valid', () => {
            const blocks = [
                { id: 1, gridX: 0, gridZ: 0, yOffset: 0, length: 1, isVertical: true, direction: { x: 1, z: 0 } },
                { id: 2, gridX: 2, gridZ: 2, yOffset: 0, length: 1, isVertical: true, direction: { x: -1, z: 0 } }
            ];
            const validation = validateStructure(blocks, 5);
            expect(validation.valid).toBe(true);
        });

        it('should detect direct cell overlap', () => {
            const blocks = [
                { id: 1, gridX: 1, gridZ: 1, yOffset: 0, length: 1, isVertical: true, direction: { x: 1, z: 0 } },
                { id: 2, gridX: 1, gridZ: 1, yOffset: 0, length: 1, isVertical: true, direction: { x: 0, z: 1 } }
            ];
            const validation = validateStructure(blocks, 5);
            expect(validation.valid).toBe(false);
            expect(validation.reason).toContain('Overlap');
        });

        it('should correctly determine solvability of sequential blocks', () => {
            // Block 1 pointing outward (exits first), Block 2 blocked by Block 1 but pointing same way
            const blocks = [
                { id: 1, gridX: 2, gridZ: 0, yOffset: 0, length: 1, isVertical: true, direction: { x: 1, z: 0 } },
                { id: 2, gridX: 1, gridZ: 0, yOffset: 0, length: 1, isVertical: true, direction: { x: 1, z: 0 } }
            ];
            const solvability = validateSolvability(blocks, 3);
            expect(solvability.solvable).toBe(true);
            expect(solvability.solution.map(b => b.id)).toEqual([1, 2]);
        });
    });
});
