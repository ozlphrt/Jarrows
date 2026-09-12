import { describe, it, expect } from 'vitest';
import {
    getBlocksForLevel,
    getBlastCellProbabilityForLevel,
    calculateBlockBombScore,
    getBlockFootprintCellCount,
    getSpawnPlacementConfig,
    shuffleArray,
    DEFAULT_BLAST_CELL_PERCENT,
    MAX_BLAST_CELL_PERCENT,
    setBlastCellPercent,
    getBlastCellPercent
} from '../src/puzzle/LevelGenerator.js';

describe('LevelGenerator', () => {
    describe('getBlocksForLevel', () => {
        it('should return 3 blocks for level 0 tutorial', () => {
            expect(getBlocksForLevel(0)).toBe(3);
        });

        it('should return 10 blocks for level 1', () => {
            expect(getBlocksForLevel(1)).toBe(10);
        });

        it('should return 20 blocks for level 2', () => {
            expect(getBlocksForLevel(2)).toBe(20);
        });

        it('should scale appropriately for higher levels and cap at 1000', () => {
            expect(getBlocksForLevel(50)).toBe(500);
            expect(getBlocksForLevel(100)).toBe(600);
            expect(getBlocksForLevel(400)).toBe(1000);
        });
    });

    describe('Blast cell probability and configuration', () => {
        it('should return 0 blast probability for levels < 10', () => {
            expect(getBlastCellProbabilityForLevel(1)).toBe(0);
            expect(getBlastCellProbabilityForLevel(9)).toBe(0);
        });

        it('should return valid probability for levels >= 10 based on percent', () => {
            setBlastCellPercent(10);
            expect(getBlastCellProbabilityForLevel(10)).toBe(0.1);
            setBlastCellPercent(DEFAULT_BLAST_CELL_PERCENT);
            expect(getBlastCellProbabilityForLevel(15)).toBe(0.08);
        });

        it('should clamp blast cell percent within [0, MAX_BLAST_CELL_PERCENT]', () => {
            setBlastCellPercent(50);
            expect(getBlastCellPercent()).toBe(MAX_BLAST_CELL_PERCENT);
            setBlastCellPercent(-5);
            expect(getBlastCellPercent()).toBe(0);
            setBlastCellPercent(DEFAULT_BLAST_CELL_PERCENT);
        });
    });

    describe('calculateBlockBombScore', () => {
        it('should score corner-adjacent blocks higher than center blocks', () => {
            const cornerBlock = {
                gridX: 2,
                gridZ: 2,
                yOffset: 0,
                direction: { x: 1, z: 0 },
                length: 2,
                isVertical: false
            };
            const centerBlock = {
                gridX: 4,
                gridZ: 4,
                yOffset: 0,
                direction: { x: 1, z: 0 },
                length: 2,
                isVertical: false
            };
            const cornerScore = calculateBlockBombScore(cornerBlock, 9);
            const centerScore = calculateBlockBombScore(centerBlock, 9);
            expect(cornerScore).toBeGreaterThan(centerScore);
        });
    });

    describe('getBlockFootprintCellCount', () => {
        it('should return 1 for vertical blocks', () => {
            expect(getBlockFootprintCellCount({ isVertical: true, length: 3 })).toBe(1);
        });

        it('should return length for horizontal blocks', () => {
            expect(getBlockFootprintCellCount({ isVertical: false, length: 2 })).toBe(2);
            expect(getBlockFootprintCellCount({ isVertical: false, length: 4 })).toBe(4);
        });
    });

    describe('getSpawnPlacementConfig', () => {
        it('should return snappy responsive config for low levels', () => {
            const config = getSpawnPlacementConfig(3, 30);
            expect(config.batchSize).toBe(45);
            expect(config.delayBetweenBatches).toBe(2);
            expect(config).not.toHaveProperty('animationDuration');
        });

        it('should return rapid dynamic build for mid levels', () => {
            const config = getSpawnPlacementConfig(20, 200);
            expect(config.batchSize).toBe(75);
            expect(config.delayBetweenBatches).toBe(0);
            expect(config).not.toHaveProperty('animationDuration');
        });
    });

    describe('shuffleArray', () => {
        it('should preserve all elements after shuffle', () => {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const original = [...arr];
            shuffleArray(arr);
            expect(arr.sort()).toEqual(original.sort());
        });
    });
});
